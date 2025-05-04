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

const productsOrdenados = computed(() => {
  const ahora = new Date()

  return products.value
    .filter(product => {
      const fechaCierre = new Date(product.fechaCierre)
      return product.estado === 'Disponible' && fechaCierre > ahora
    })
    .sort((a, b) => new Date(a.fechaCierre) - new Date(b.fechaCierre))
})

</script>
