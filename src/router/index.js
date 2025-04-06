import { createRouter, createWebHistory } from '@ionic/vue-router';
import { auth } from '@/firebase/FirebaseConfig'; // 🔹 Importamos `auth`
import { onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/registro',
    component: () => import('@/views/Registro.vue'),
  },
  {
    path: '/recuperar-contrasena',
    component: () => import('@/views/RecuperarContraseña.vue'),
  },
  {
    path: '/app',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'buscar',
        component: () => import('@/views/Buscar.vue'),
        meta: { requiresAuth: true },
      },/*
      {
        path: 'notificaciones',
        component: () => import('@/views/Notificaciones.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'mis-ventas',
        component: () => import('@/views/MisVentasPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'agregar-producto',
        component: () => import('@/views/AgregarProductoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'categorias',
        component: () => import('@/views/Categorias.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'acerca-de-la-app',
        component: () => import('@/views/AcercaDeLaApp.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'mi-cuenta',
        component: () => import('@/views/MiCuenta.vue'),
        meta: { requiresAuth: true },
      },*/
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// **Navigation Guard para verificar autenticación**
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) { 
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next(); // Si el usuario está autenticado, continuar
      } else {
        next('/login'); // Si no está autenticado, redirigir a login
      }
    });
  } else {
    next(); // Si la ruta no necesita autenticación, continuar
  }
});

export default router;
