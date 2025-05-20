<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title>Mis Calificaciones</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="loading">
        <ion-item>
          <ion-label>Cargando tus calificaciones...</ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else-if="calificaciones.length === 0">
        <ion-item>
          <ion-label>No has recibido calificaciones todavía.</ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-card v-for="(calificacion, index) in calificaciones" :key="index">
          <ion-card-header>
            <ion-card-title>{{ calificacion.comentario }}</ion-card-title>
            <ion-card-subtitle>Calificación: {{ calificacion.puntaje }} / 5</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Comprador:</strong> {{ calificacion.compradorId }}</p>
            <p><strong>Fecha:</strong> {{ calificacion.fecha }}</p>
          </ion-card-content>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/FirebaseConfig'; // Asegúrate que esta ruta es correcta

const calificaciones = ref([]);
const loading = ref(true);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const vendedorId = user.uid;
      try {
        const calificacionesRef = collection(db, 'usuarios', vendedorId, 'calificaciones');
        const snapshot = await getDocs(calificacionesRef);
        calificaciones.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      } catch (error) {
        console.error('Error al obtener calificaciones:', error);
      } finally {
        loading.value = false;
      }
    } else {
      console.warn('Usuario no autenticado.');
      loading.value = false;
    }
  });
});
</script>
