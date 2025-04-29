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
        <div v-if="ofertas.length > 0">
          <h2>Mis Ofertas</h2>
          <ion-list>
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
        </div>
        <div v-else>
          <p>No tienes ofertas realizadas.</p>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase/FirebaseConfig'; // 
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  const ofertas = ref([]);
  const usuarioId = "SF36J3vIvEOUkzMGbPw5r9XyRyk1"; // Obtén el ID del usuario autenticado de tu servicio de autenticación.
  
  onMounted(async () => {
    // Consulta las ofertas del usuario autenticado
    const ofertasQuery = query(
      collection(db, 'ofertas'),
      where('usuario_id', '==', usuarioId)
    );
  
    const querySnapshot = await getDocs(ofertasQuery);
    querySnapshot.forEach((doc) => {
      // Cada oferta se encuentra en doc.data()
      ofertas.value.push(doc.data());
    });
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
  </style>
  