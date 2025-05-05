/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();

// Función principal que se ejecuta automáticamente cada minuto
exports.finalizarSubasta = functions.pubsub.schedule('every 24 hours').onRun(async () => {
    return await finalizarSubastas();
});

// Función HTTP para pruebas manuales
exports.testFinalizarSubasta = functions.https.onRequest(async (req, res) => {
    await finalizarSubastas();
    res.send("Subastas finalizadas manualmente desde testFinalizarSubasta");
});

// Función para finalizar subastas
async function finalizarSubastas() {
    try {
        console.log('Iniciando función de finalización de subastas');

        const ahora = new Date().toISOString();
        const subastasRef = admin.firestore().collection('products');

        const docTest = await subastasRef.doc('HQNgmeGcnlAZ1O6tUmus').get();
        console.log("🧪 Documento de prueba:", docTest.exists ? docTest.data() : "No encontrado");

        // Obtener el número total de subastas sin condiciones
        const todasSubastasQuery = await subastasRef.get();
        if (todasSubastasQuery.empty) {
            console.log('⚠️ La colección "products" está vacía o no fue encontrada.');
        } else {
            console.log('✅ Documentos encontrados en "products":');
            todasSubastasQuery.forEach(doc => {
                console.log(`🔎 ID: ${doc.id}`, doc.data());
            });
        }

        console.log(`Número total de subastas encontradas (sin condiciones): ${todasSubastasQuery.size}`);

        todasSubastasQuery.forEach(doc => {
            console.log(`Subasta ID: ${doc.id} - Estado: ${doc.data().estado} - FechaCierre: ${doc.data().fechaCierre}`);
        });

        // Obtener subastas que deben ser finalizadas (con condiciones)
        const subastasFinalizadasQuery = await subastasRef
            .where('fechaCierre', '<=', ahora)
            .where('estado', '==', 'Disponible')
            .get();

        console.log(`Número de subastas encontradas con condiciones: ${subastasFinalizadasQuery.size}`);
        subastasFinalizadasQuery.forEach(doc => {
            console.log(`Subasta encontrada: ${doc.id} - Estado: ${doc.data().estado} - FechaCierre: ${doc.data().fechaCierre}`);
        });

        if (subastasFinalizadasQuery.empty) {
            console.log('No hay subastas para finalizar');
            return null;
        }

        const promesas = subastasFinalizadasQuery.docs.map(doc => procesarSubastaFinalizada(doc));

        await Promise.all(promesas);
        console.log('Proceso de finalización de subastas completado');
        return null;
    } catch (error) {
        console.error('Error en finalizarSubasta:', error);
        return null;
    }
}

// Función para procesar subastas finalizadas
async function procesarSubastaFinalizada(doc) {
    try {
        const subasta = doc.data();
        const subastaId = doc.id;
        const vendedorId = subasta.vendedor_id;
        const productoId = subasta.producto_id;

        console.log(`Procesando subasta finalizada: ${subastaId}`);

        const ofertasRef = admin.firestore().collection('ofertas');
        const ofertasQuery = await ofertasRef
            .where('subasta_id', '==', subastaId)
            .where('estado', '==', 'activa')
            .orderBy('cantidad', 'desc')
            .limit(1)
            .get();

        if (!ofertasQuery.empty) {
            const ofertaGanadora = ofertasQuery.docs[0].data();
            const cantidadGanadora = ofertaGanadora.cantidad;
            const usuarioGanadorId = ofertaGanadora.usuario_id;

            console.log(`Oferta ganadora encontrada: ${usuarioGanadorId} con ${cantidadGanadora}`);

            // Actualizar subasta como finalizada
            await admin.firestore().collection('products').doc(subastaId).update({
                estado: 'finalizada',
                usuario_ganador_id: usuarioGanadorId,
                precio_final: cantidadGanadora,
                fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp()
            });

            // Actualizar estado del producto en 'products'
            if (productoId) {
                await admin.firestore().collection('products').doc(productoId).update({
                    estado: 'vendido',
                    fecha_venta: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            // Transacción para actualizar saldos de los usuarios
            await admin.firestore().runTransaction(async (transaction) => {
                const usuarioGanadorDoc = await transaction.get(admin.firestore().collection('users').doc(usuarioGanadorId));
                const vendedorDoc = await transaction.get(admin.firestore().collection('users').doc(vendedorId));

                if (!usuarioGanadorDoc.exists || !vendedorDoc.exists) {
                    throw new Error('Usuario ganador o vendedor no encontrado');
                }

                const usuarioGanador = usuarioGanadorDoc.data();
                const vendedor = vendedorDoc.data();

                if (usuarioGanador.saldo < cantidadGanadora) {
                    throw new Error(`Saldo insuficiente para el usuario ${usuarioGanadorId}`);
                }

                transaction.update(admin.firestore().collection('users').doc(usuarioGanadorId), {
                    saldo: usuarioGanador.saldo - cantidadGanadora
                });

                transaction.update(admin.firestore().collection('users').doc(vendedorId), {
                    saldo: vendedor.saldo + cantidadGanadora
                });

                return {
                    comprador_id: usuarioGanadorId,
                    vendedor_id: vendedorId,
                    subasta_id: subastaId,
                    monto_total: cantidadGanadora
                };
            }).then(async (datosTransaccion) => {
                await admin.firestore().collection('transacciones').add({
                    ...datosTransaccion,
                    fecha_pago: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`Transacción registrada para la subasta ${subastaId}`);
            });

        } else {
            await admin.firestore().collection('products').doc(subastaId).update({
                estado: 'finalizada',
                fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Subasta ${subastaId} finalizada sin ofertas`);
        }

    } catch (error) {
        console.error(`Error procesando subasta ${doc.id}:`, error);
        await admin.firestore().collection('products').doc(doc.id).update({
            estado: 'error',
            error_mensaje: error.message,
            fecha_error: admin.firestore.FieldValue.serverTimestamp()
        });
    }
}
