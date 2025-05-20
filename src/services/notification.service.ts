import { Capacitor } from '@capacitor/core'; 
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
// @ts-ignore
import { messaging } from '../firebase/FirebaseConfig';
// @ts-ignore
import { db } from '../firebase/FirebaseConfig'; // asegúrate de que la ruta sea correcta

class NotificationService {
  private vapidKey = 'BHYPMBeNadDFf05IRAfcdIASTjjgtHFpU3EzW8OI6A1r23m4OCUpst64QdNsZYOZK-MGY5LLk6pF5wOoZejsD64';
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    if (Capacitor.isNativePlatform()) {
      await this.initializeNative();
    } else {
      await this.initializeWeb();
    }
  }

  private async initializeNative() {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.log('Permiso denegado para notificaciones nativas');
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', (token) => {
        console.log('Token nativo:', token.value);
        this.saveTokenToDatabase(token.value);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación nativa recibida:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Acción de notificación:', notification.actionId, notification.inputValue);
      });

    } catch (error) {
      console.error('Error en inicialización nativa:', error);
    }
  }

  private async initializeWeb() {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permiso para notificaciones web denegado');
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      if (token) {
        console.log('Token web:', token);
        this.saveTokenToDatabase(token);

        onMessage(messaging, (payload) => {
          console.log('Mensaje recibido en primer plano:', payload);
          this.showNotification(payload);
        });
      }

    } catch (error) {
      console.error('Error en inicialización web:', error);
    }
  }

  private async saveTokenToDatabase(token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No hay usuario autenticado.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { fcmToken: token }, { merge: true });

    console.log("Token guardado para el usuario:", user.uid);
  }

  private showNotification(payload: any) {
    const title = payload.notification?.title || 'Notificación';
    const options = {
      body: payload.notification?.body || '',
      icon: '/favicon.ico',
      data: payload.data,
    };

    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  }

  async subscribeTopic(topic: string): Promise<boolean> {
    try {
      if (!topic) throw new Error('Tema inválido');

      if (Capacitor.isNativePlatform()) {
        await FirebaseMessaging.subscribeToTopic({ topic });
        console.log(`Suscrito a ${topic} (nativo)`);
        return true;
      } else {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          [`topics.${topic}`]: true
        }, { merge: true });

        console.log(`Suscrito a ${topic} (web)`);
        return true;
      }
    } catch (error) {
      console.error('Error suscribiéndose a tema:', error);
      return false;
    }
  }

  async unsubscribeTopic(topic: string): Promise<boolean> {
    try {
      if (!topic) throw new Error('Tema inválido');

      if (Capacitor.isNativePlatform()) {
        await FirebaseMessaging.unsubscribeFromTopic({ topic });
        console.log(`Desuscrito de ${topic} (nativo)`);
        return true;
      } else {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          [`topics.${topic}`]: false
        }, { merge: true });

        console.log(`Desuscrito de ${topic} (web)`);
        return true;
      }
    } catch (error) {
      console.error('Error desuscribiéndose de tema:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
