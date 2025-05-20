/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// every 24 hours -- * * * * *

import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from "firebase-admin/messaging";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import logger from "firebase-functions/logger";

// Inicializar Firebase Admin solo si no está inicializado
if (!getApps().length) initializeApp();

const db = getFirestore();

/**
 * Función programada (cron) que se ejecuta cada hora en minuto 0
 * Finaliza las subastas que ya deben cerrarse
 */
// Función que se ejecutará cada minuto para actualizar el estado de los productos a 'Finalizada'
export const actualizarEstadoProductos = onSchedule('0 * * * *', async (event) => {
  // Obtener la fecha actual
  const fechaActual = new Date(); // Fecha actual como objeto Date

  // Referencia a la colección de productos
  const productosRef = db.collection('products');

  // Obtener todos los productos
  const snapshot = await productosRef.get();

  // Iterar sobre los productos
  snapshot.forEach(async (docSnapshot) => {
    const productoId = docSnapshot.id;
    const productoData = docSnapshot.data();

    // Convertir fechaCierre a un objeto Date (asumiendo que fechaCierre es una cadena de texto)
    const fechaCierre = new Date(productoData.fechaCierre);

    // Imprimir fecha de cierre para depuración
    console.log(`Fecha de Cierre para Producto ${productoId}: ${fechaCierre}`);

    // Comparar solo la fecha (sin hora/minuto) - Cambiar el estado si la fecha de cierre ha pasado
    if (fechaCierre <= fechaActual && productoData.estado === 'Disponible') {
      // Cambiar el estado del producto a "Finalizada"
      await docSnapshot.ref.update({ estado: 'Finalizada' });
      console.log(`Producto ${productoId} actualizado a 'Finalizada'`);
    }
  });
});

async function actualizarEsMasAlta(productoId) {
  if (!productoId) {
    logger.warn("Producto ID no definido para actualizar es_mas_alta");
    return;
  }

  const ofertasSnapshot = await db.collection("ofertas")
    .where("producto_id", "==", productoId)
    .where("estado", "==", "activa")
    .get();

  if (ofertasSnapshot.empty) {
    logger.info(`No hay ofertas activas para producto ${productoId}`);
    return;
  }

  let maxCantidad = -Infinity;
  let ofertaMasAltaDoc = null;

  ofertasSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.cantidad > maxCantidad) {
      maxCantidad = data.cantidad;
      ofertaMasAltaDoc = doc;
    }
  });

  if (!ofertaMasAltaDoc) {
    logger.info(`No se encontró oferta más alta para producto ${productoId}`);
    return;
  }

  const batch = db.batch();

  ofertasSnapshot.docs.forEach(doc => {
    const esMasAlta = doc.id === ofertaMasAltaDoc.id;
    batch.update(doc.ref, { es_mas_alta: esMasAlta });
  });

  await batch.commit();
  logger.info(`Oferta más alta actualizada para producto ${productoId}: ${ofertaMasAltaDoc.id} con cantidad ${maxCantidad}`);
}

export const ofertaCreada = onDocumentCreated("ofertas/{ofertaId}", async (event) => {
  const oferta = event.data?.data();
  logger.info("Oferta creada evento data:", oferta);

  // Verificar si el producto_id existe
  if (!oferta || !oferta.producto_id) {
    logger.warn("Falta producto_id en la oferta creada");
    return;
  }

  // Si llega correctamente el producto_id, procesamos
  await actualizarEsMasAlta(oferta.producto_id);
});

export const ofertaActualizada = onDocumentUpdated("ofertas/{ofertaId}", async (event) => {
  const oferta = event.data?.after.data;
  logger.info("Trigger ofertaActualizada activado con datos:", oferta);
  if (!oferta || !oferta.producto_id) {
    logger.warn("Datos incompletos o falta producto_id");
    return;
  }
  await actualizarEsMasAlta(oferta.producto_id);
});

/**
 * Función que se ejecuta cuando el producto cambia a 'Finalizado' en la colección 'products'
 */export const finalizarProductoYActualizarSaldo = onDocumentUpdated("products/{productoId}", async (event) => {
  logger.info("El trigger finalizarProductoYActualizarSaldo se ha ejecutado.");

  // Datos del producto después de la actualización
  const producto = event.data?.after.data(); 
  const productoId = event.params.productoId;

  // Log para revisar el contenido del producto
  logger.info("Producto datos:", producto);

  // Verificar si el estado del producto es "Finalizada"
  if (producto?.estado !== "Finalizada") {
    logger.info(`El producto ${productoId} no está finalizado, no se realizará el procesamiento.`);
    return null;
  }

  // Log para verificar que producto.producto_id no es undefined
  logger.info("Producto ID:", productoId);

  // Obtener la oferta más alta relacionada con el producto
  const ofertaSnapshot = await db.collection('ofertas')
    .where('producto_id', '==', productoId) // Asegúrate de que producto.producto_id esté definido
    .where('es_mas_alta', '==', true)
    .where('estado', '==', 'activa')
    .get();

  if (ofertaSnapshot.empty) {
    logger.info(`No se encontró oferta activa más alta para el producto ${productoId}`);
    return null;
  }

  const oferta = ofertaSnapshot.docs[0].data();
  const compradorId = oferta.usuario_id;
  const cantidad = oferta.cantidad;

  // Verificar si compradorId y cantidad están definidos
  logger.info("Comprador ID:", compradorId);
  logger.info("Cantidad de la oferta:", cantidad);

  // Obtener los datos del comprador y vendedor
  const compradorSnapshot = await db.collection('users').doc(compradorId).get();
  const vendedorSnapshot = await db.collection('users').doc(producto.userId).get();

  // Verificar que el comprador y vendedor existen
  if (!compradorSnapshot.exists || !vendedorSnapshot.exists) {
    logger.warn('No se encontraron datos del comprador o vendedor');
    return null;
  }

  const comprador = compradorSnapshot.data();
  const vendedor = vendedorSnapshot.data();

  // Verificar que comprador.saldo y vendedor.saldo están definidos
  logger.info("Saldo del comprador:", comprador.saldo);
  logger.info("Saldo del vendedor:", vendedor.saldo);

  // Verificar que el comprador tenga suficiente saldo
  if (comprador.saldo < cantidad) {
    logger.warn('Saldo insuficiente en la cuenta del comprador');
    return null;
  }

  // Calcular nuevos saldos
  const nuevoSaldoComprador = comprador.saldo - cantidad;
  const nuevoSaldoVendedor = vendedor.saldo + cantidad;

  // Log para los nuevos saldos
  logger.info("Nuevo saldo comprador:", nuevoSaldoComprador);
  logger.info("Nuevo saldo vendedor:", nuevoSaldoVendedor);

  // Crear un batch para actualizar los saldos de los usuarios
  const batch = db.batch();

  // Descontar del saldo del comprador
  batch.update(db.collection('users').doc(compradorId), { saldo: nuevoSaldoComprador });

  // Aumentar el saldo del vendedor
  batch.update(db.collection('users').doc(producto.userId), { saldo: nuevoSaldoVendedor });

  // Cambiar el estado de la oferta a "finalizada"
  batch.update(ofertaSnapshot.docs[0].ref, { estado: 'finalizada' });

  try {
    // Ejecutar el batch
    await batch.commit();
    logger.info(`Saldo actualizado para comprador ${compradorId} y vendedor ${producto.userId}`);
  } catch (error) {
    logger.error("Error al ejecutar el batch:", error);
    return null;
  }

  return null;
});

// --- Funciones v2 ---
/* Función HTTP simple para probar que funciona */
export const helloWorldV2 = onRequest((req, res) => {
  res.send("¡Hola desde Firebase Functions v2 modular!");
});

/**
 * Trigger cuando se crea una nueva subasta
 */
export const nuevaSubastaV2 = onDocumentCreated("subastas/{subastaId}", async (event) => {
  if (!event.data || !event.data.exists) {
    logger.info("No se encontraron datos en el evento nuevaSubastaV2");
    return null;
  }
  const nuevaSubasta = event.data.data();
  const subastaId = event.params.subastaId;

  logger.info(`Nueva subasta creada: ${subastaId}`, nuevaSubasta);

  try {
    const mensaje = {
      notification: {
        title: '¡Nueva subasta disponible!',
        body: `${nuevaSubasta.titulo} ha sido publicada. Precio inicial: ${nuevaSubasta.precioInicial}`
      },
      topic: 'nuevas-subastas'
    };

    await getMessaging().send(mensaje);
    logger.info('Notificación enviada para la nueva subasta');
    return { success: true };
  } catch (error) {
    logger.error('Error al enviar notificación nuevaSubastaV2:', error);
    return { error: error.message };
  }
});

/**
 * Trigger cuando se actualiza una subasta
 */
export const actualizacionSubastaV2 = onDocumentUpdated("subastas/{subastaId}", async (event) => {
  if (!event.data) {
    logger.info("No se encontraron datos en el evento actualizacionSubastaV2");
    return null;
  }
  const antes = event.data.before.data();
  const despues = event.data.after.data();
  const subastaId = event.params.subastaId;

  logger.info(`Subasta actualizada: ${subastaId}`, { antes, despues });

  const mensaje = {
    notification: {
      title: '¡Una subasta ha sido actualizada!',
      body: `${despues.titulo} ahora tiene un nuevo precio.`
    },
    topic: 'nuevas-subastas'
  };

  try {
    await getMessaging().send(mensaje);
    logger.info('Notificación enviada para actualización de subasta');
    return { success: true, message: 'Actualización procesada' };
  } catch (error) {
    logger.error('Error al enviar notificación actualizacionSubastaV2:', error);
    return { error: error.message };
  }
});