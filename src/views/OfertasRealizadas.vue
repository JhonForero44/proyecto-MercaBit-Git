<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Ofertas Realizadas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list v-if="ofertas.length > 0">
        <ion-item v-for="(oferta, index) in ofertas" :key="index">
          <ion-label>
            <h3>{{ oferta.producto_nombre }}</h3>
            <p>Cantidad: {{ oferta.cantidad }}</p>
            <p v-if="oferta.es_mas_alta">¡Es la oferta más alta!</p>
            <p>Estado: {{ oferta.estado }}</p>
            <p>Fecha: {{ new Date(oferta.fecha_hora.seconds * 1000).toLocaleString() }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="ion-padding">
        <p>No tienes ofertas realizadas.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ofertas = ref([]);
const loading = ref(true);

const formatoFecha = (timestamp) => {
  return timestamp?.toDate().toLocaleString() || 'Fecha no disponible';
};

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const usuarioId = user.uid;
    const ofertasQuery = query(
      collection(db, 'ofertas'),
      where('usuario_id', '==', usuarioId)
    );

    try {
      const querySnapshot = await getDocs(ofertasQuery);
      ofertas.value = querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
    } finally {
      loading.value = false;
    }
  } else {
    console.warn("Usuario no autenticado.");
    loading.value = false;
  }
});
</script>

<style scoped>
h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

ion-item {
  margin-bottom: 10px;
}

.spinner-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
