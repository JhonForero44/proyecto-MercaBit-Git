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
          <ion-col
            v-for="product in products"
            :key="product.id"
            size="12" size-md="6" size-lg="4"
          >
            <TarjetaProducto :producto="product" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol
} from '@ionic/vue'
import { onMounted, ref } from 'vue'
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
</script>
