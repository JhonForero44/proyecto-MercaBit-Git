<template>
  <ion-app>
    <ion-router-outlet />
    <Footer />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import Footer from './components/Footer.vue';
</script>
