<template>
  <ion-app>
    <!-- Menú lateral -->
    <MenuDiagonal />
    <ion-router-outlet id="main-content"></ion-router-outlet>
    <!-- Contenedor principal -->
    <ion-page id="main-content">
      <ion-router-outlet />
      <Footer />
    </ion-page>
  </ion-app>
</template>

<script setup>
import { IonApp, IonMenu, IonPage, IonRouterOutlet } from '@ionic/vue';
import MenuDiagonal from '@/components/MenuDiagonal.vue'
import Footer from '@/components/Footer.vue'
</script>