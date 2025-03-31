import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'), // Componente padre que contiene la estructura general
    children: [
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue'),
      },
      /*
      {
        path: 'buscar',
        component: () => import('@/views/Buscar.vue'),
      },
      {
        path: 'notificaciones',
        component: () => import('@/views/Notificaciones.vue'),
      },
      {
        path: 'mis-ventas',
        component: () => import('@/views/MisVentasPage.vue'),
      },
      {
        path: 'agregar-producto',
        component: () => import('@/views/AgregarProductoPage.vue'),
      },
      {
        path: 'categorias',
        component: () => import('@/views/Categorias.vue'),
      },
      {
        path: 'acerca-de-la-app',
        component: () => import('@/views/AcercaDeLaApp.vue'),
      },
      {
        path: 'mi-cuenta',
        component: () => import('@/views/MiCuenta.vue'),
      },*/
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
