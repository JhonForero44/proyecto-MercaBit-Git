importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCdrZlOXRsj0IajaZgZsf7hNW7L3ioie9M",
  authDomain: "proyecto-mercabit.firebaseapp.com",
  projectId: "proyecto-mercabit",
  storageBucket: "proyecto-mercabit.firebasestorage.app",
  messagingSenderId: "1016781457863",
  appId: "1:1016781457863:web:36306018f34aa0aa8471e2",
  measurementId: "G-2M31ZZZCLC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Escuchadores estándar recomendados
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push recibido');
});

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('[Service Worker] Suscripción cambiada');
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notificación clickeada');
  event.notification.close();
});
