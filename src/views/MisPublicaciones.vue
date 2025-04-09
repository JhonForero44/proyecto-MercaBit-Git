<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button />
          </ion-buttons>
          <ion-title>Mis Publicaciones</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
  <ion-list v-if="productos.length > 0">
    <ion-item v-for="producto in productos" :key="producto.id">
      <ion-label>
        <h2>{{ producto.nombre }}</h2>
        <p>Categoría: {{ producto.categoria }}</p>
        <p>Precio base: {{ producto.precioBase }} COP</p>
        <p>Venta inmediata: {{ producto.precioVentaInmediata }} COP</p>
        <p>Desde: {{ (producto.fechaApertura) }}</p>
        <p>Hasta: {{ (producto.fechaCierre) }}</p>
        <p>Publicado: {{(producto.creadoEn) }}</p>
      </ion-label>
      <ion-buttons slot="end">
        <ion-button color="success" @click="marcarComoVendido(producto.id)">
          Vendido
        </ion-button>
        <ion-button color="danger" @click="eliminarProducto(producto.id)">
          Borrar
        </ion-button>
      </ion-buttons>
    </ion-item>
  </ion-list>

  <ion-text v-else>
    No tienes productos publicados aún.
  </ion-text>
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
    IonText
  } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  import { db, auth } from '../firebase/FirebaseConfig';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { doc, deleteDoc } from "firebase/firestore";
  
  const productos = ref([]);
  
  const cargarMisProductos = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const q = query(
        collection(db, 'products'),
        where('userId', '==', user.uid)
      );
  
      const querySnapshot = await getDocs(q);
      productos.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Eliminar producto de Firestore y del arreglo local
const eliminarProducto = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    productos.value = productos.value.filter(p => p.id !== id);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
};

// Marcar como vendido (puedes borrar o hacer otra lógica)
const marcarComoVendido = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    productos.value = productos.value.filter(p => p.id !== id);
  } catch (error) {
    console.error("Error al marcar como vendido:", error);
  }
};
  
  onMounted(() => {
    cargarMisProductos();
  });
  </script>
  