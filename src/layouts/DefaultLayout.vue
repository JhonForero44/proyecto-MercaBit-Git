<template>
  <ion-app>
    <MenuDiagonal />
    <ion-header v-if="!route.meta.hideLayout">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-router-outlet id="main-content" />
    <Footer v-if="!route.meta.hideLayout" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonRouterOutlet } from '@ionic/vue'
import MenuDiagonal from '@/components/MenuDiagonal.vue'
import Footer from '@/components/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/login': 'Inicio de Sesión',
    '/home': 'MercaBit - Productos',
    '/registro': 'Registro',
    '/recuperar-contrasena': 'Recuperar Contraseña',
    '/accerca-de-la-app': 'Acerca de MercaBit',
    '/terminos-condiciones': 'Términos y Condiciones',
    '/notification': 'Notificaciones',
    '/mis-publicaciones': 'Mis Publicaciones',
    '/agregar-producto': 'Agregar Producto',
    '/categorias': 'Categorías',
    '/informacion-personal': 'Información Personal',
    '/mis-compras': 'Mis Compras',
  }
  return titles[route.path] || ''
})
</script>
