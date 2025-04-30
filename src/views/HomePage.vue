<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>MercaBit - Productos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col v-for="product in productsOrdenados" :key="product.id" size="12" size-md="6" size-lg="4">
            <TarjetaProducto :producto="product" />
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonGrid,
  IonRow,
  IonCol,
  IonMenuButton,
  IonButtons,
} from '@ionic/vue'

import { onMounted, ref, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import TarjetaProducto from '@/components/TarjetaProducto.vue'

const products = ref([])

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'products'))
  products.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})

// Aquí agregamos el ordenamiento por fecha
const productsOrdenados = computed(() => {
  return [...products.value].sort((a, b) => {
    const fechaA = new Date(a.fechaCierre)
    const fechaB = new Date(b.fechaCierre)
    return fechaA - fechaB // Menor primero: los que cierran más pronto
  })
})
</script>
