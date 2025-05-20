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
            <p>Oferta mas alta: {{ oferta.es_mas_alta }}</p>
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
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const ofertas = ref([]);
const loading = ref(true);

const formatoFecha = (timestamp) => {
  return timestamp?.toDate().toLocaleString() || 'Fecha no disponible';
};

const obtenerNombreProducto = async (productoId) => {
  if (!productoId) return 'Producto no definido';
  const docRef = doc(db, 'products', productoId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().nombre || 'Sin nombre';
  }
  return 'Producto no encontrado';
};

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.warn("Usuario no autenticado.");
    loading.value = false;
    return;
  }

  const usuarioId = user.uid;
  const ofertasQuery = query(
    collection(db, 'ofertas'),
    where('usuario_id', '==', usuarioId)
  );

  try {
    const querySnapshot = await getDocs(ofertasQuery);
    const ahora = Date.now();

    // Mapeo con nombre de producto incluido
    const ofertasConNombre = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const productoNombre = await obtenerNombreProducto(data.producto_id);
        return { id: doc.id, producto_nombre: productoNombre, ...data };
      })
    );

    // Ordenar por cercanía a la fecha actual
    ofertas.value = ofertasConNombre.sort((a, b) => {
      const fechaA = a.fecha_hora?.seconds ? a.fecha_hora.seconds * 1000 : 0;
      const fechaB = b.fecha_hora?.seconds ? b.fecha_hora.seconds * 1000 : 0;

      const diffA = Math.abs(fechaA - ahora);
      const diffB = Math.abs(fechaB - ahora);

      return diffA - diffB;
    });
  } catch (error) {
    console.error("Error al obtener ofertas:", error);
  } finally {
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
