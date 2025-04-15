<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
    '/detalles-producto/:id': 'Comprar Producto'
  }
  return titles[route.path] || ''
})
</script>

<style setup>
/* Contenedor flex para el logo y el texto */
.menu-header {
    display: flex;
    align-items: center; 
    justify-content: center;
    flex-wrap: nowrap; 
    padding: 10px 10px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0; 
}

</style>
