<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- Menú lateral -->
    <MenuDiagonal />
    <ion-router-outlet id="main-content"></ion-router-outlet>
    <!-- Contenedor principal -->
    <ion-page id="main-content">
      <ion-router-outlet />
      <Footer  v-if="!route.meta.hideLayout" />
    </ion-page>
  </ion-app>
</template>

<script setup>
import { IonApp, IonMenu, IonPage, IonRouterOutlet } from '@ionic/vue';
import MenuDiagonal from '@/components/MenuDiagonal.vue'
import { useRoute } from 'vue-router';
import Footer from '@/components/Footer.vue'
import { computed } from 'vue'

const route = useRoute();

// Mapeo de rutas a títulos
const pageTitle = computed(() => {
  const titles = {
    '/login': 'Inicio de Sesion',
    '/registro': 'Registro',
    '/recuperar-contrasena': 'Recuperar Contraseña',
    '/accerca-de-la-app': 'Acerca de MercaBit',
    '/terminos-condiciones': 'Términos y Condiciones',
    '/notification': 'Notificaciones',
    '/mis-publicaciones': 'Mis Publicaciones',
    '/agregar-producto': 'Agregar Producto',
    '/categorias': 'Categorías',
    '/informacion-personal': 'Informacion Personal',
    '/mis-compras': 'Mis Compras',
  }
  return titles[route.path] || ''
})

</script>