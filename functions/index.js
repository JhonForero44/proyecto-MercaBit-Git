const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

// Inicializar la aplicación de Firebase Admin
initializeApp();

// Función simple para verificar que todo funciona
exports.helloWorldV2 = onRequest((request, response) => {
  response.send("¡Hola desde Firebase Cloud Functions!");
});

// Función que se dispara cuando se crea una nueva subasta (producto, por ejemplo)
exports.nuevaSubastaV2 = onDocumentCreated("subastas/{subastaId}", async (event) => {
  // Verificar si existe el documento y los datos
  if (!event.data || !event.data.exists) {
    console.log("No se encontraron datos en el evento");
    return null;
  }

  const nuevaSubasta = event.data.data();
  const subastaId = event.params.subastaId;
  
  console.log(`Nueva subasta creada: ${subastaId}`, nuevaSubasta);
  
  try {
    // Aquí estamos enviando una notificación a todos los usuarios suscritos al tema 'nuevas-subastas'
    const mensaje = {
      notification: {
        title: '¡Nueva subasta disponible!',
        body: `${nuevaSubasta.titulo} ha sido publicada. Precio inicial: ${nuevaSubasta.precioInicial}`
      },
      topic: 'nuevas-subastas'  // O si usas tokens, aquí va un array de tokens
    };

    // Enviar la notificación a todos los usuarios suscritos
    await getMessaging().send(mensaje);
    
    console.log('Notificación enviada para la nueva subasta');
    return { success: true };
  } catch (error) {
    console.error('Error al procesar nueva subasta:', error);
    return { error: error.message };
  }
});

// Función que se dispara cuando se actualiza una subasta
exports.actualizacionSubastaV2 = onDocumentUpdated("subastas/{subastaId}", async (event) => {
  // Verificar si existen los datos
  if (!event.data) {
    console.log("No se encontraron datos en el evento");
    return null;
  }

  const subastaAntes = event.data.before.data();
  const subastaDespues = event.data.after.data();
  const subastaId = event.params.subastaId;
  
  console.log(`Subasta actualizada: ${subastaId}`, { antes: subastaAntes, despues: subastaDespues });

  // Aquí podrías enviar una notificación también si es necesario
  const mensaje = {
    notification: {
      title: '¡Una subasta ha sido actualizada!',
      body: `${subastaDespues.titulo} ahora tiene un nuevo precio.`
    },
    topic: 'nuevas-subastas' // Si es necesario
  };

  try {
    await getMessaging().send(mensaje);
    return { success: true, message: 'Actualización de subasta procesada' };
  } catch (error) {
    console.error('Error al enviar notificación de actualización:', error);
    return { error: error.message };
  }
});
