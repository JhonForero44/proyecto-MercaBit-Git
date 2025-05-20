<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Mis Compras</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Si el usuario no tiene compras -->
        <ion-item v-if="compras.length === 0" lines="none" class="empty-state">
          <ion-label color="medium">No has realizado compras aún.</ion-label>
        </ion-item>

        <!-- Lista de compras -->
        <ion-card v-for="compra in compras" :key="compra.id" class="compra-card">
          <ion-card-content>
            <ion-label class="compra-header">
              <!-- Mostrar el nombre del producto en lugar del productoId -->
              <h2>{{ compra.nombreProducto }}</h2>
              <p>Precio Total: ${{ compra.precioTotal }} COP</p>
              <p>Fecha: {{ new Date(compra.fechaCompra.seconds * 1000).toLocaleString() }}</p>
            </ion-label>
          </ion-card-content>
        </ion-card>

      </ion-list>
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
  IonLabel,
  IonList,
  IonCard,
  IonCardContent,
  IonItem
} from '@ionic/vue';

import { onMounted, ref } from 'vue';
import { db } from '../firebase/FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Asegúrate de importar Firebase Auth
import { getDoc, doc } from "firebase/firestore";  // Asegúrate de importar estas funciones

// Función para obtener el nombre del producto desde Firestore
const obtenerNombreProducto = async (productoId) => {
  if (!productoId) return 'Producto no definido';

  try {
    const docRef = doc(db, 'products', productoId);  // Referencia al documento en 'products' con productoId
    const docSnap = await getDoc(docRef);  // Obtener el documento

    if (docSnap.exists()) {
      return docSnap.data().nombre || 'Sin nombre';  // Retorna el nombre del producto si existe
    } else {
      return 'Producto no encontrado';  // Si el producto no se encuentra
    }
  } catch (error) {
    console.error('Error al obtener el nombre del producto:', error);
    return 'Error al cargar nombre';
  }
};

// para almacenar las compras
const compras = ref([]);

// para almacenar el userId
const userId = ref(null);

// Obtener el UID del usuario autenticado (en onMounted)
onMounted(() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    userId.value = user.uid;
    console.log("Usuario autenticado:", userId.value);

    // Obtener las compras asociadas a este usuario
    const comprasRef = collection(db, 'compras');
    const q = query(comprasRef, where('userId', '==', userId.value));

    // Suscripción a las compras
    onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        console.log("No hay compras para este usuario.");
      } else {
        // Actualizamos la lista de compras y agregamos el nombre del producto
        const updatedCompras = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const compra = doc.data();
            const nombreProducto = await obtenerNombreProducto(compra.productoId);
            return {
              id: doc.id,
              ...compra,
              nombreProducto // Agregar nombre del producto a cada compra
            };
          })
        );
        compras.value = updatedCompras;
      }
    });
  } else {
    console.log("Usuario no autenticado.");
  }
});


// Función para formatear la fecha
const formatoFecha = (isoString) => {
  const fecha = new Date(isoString);
  return fecha.toLocaleString(); // Personalizable para el formato de fecha
};
</script>
<style scoped>
.compra-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.compra-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.3rem;
}

.empty-state {
  text-align: center;
  font-style: italic;
}
</style>