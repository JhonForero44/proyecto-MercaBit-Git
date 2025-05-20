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
            v-for="product in productsOrdenados"
            :key="product.id"
            size="12"
            size-md="6"
            size-lg="4"
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
  IonList,
  IonItem,
  IonToggle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonText,
  loadingController,
  toastController
} from '@ionic/vue'

import { onMounted, ref, computed, reactive } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { notificationService } from '@/services/notification.service';
import TarjetaProducto from '@/components/TarjetaProducto.vue'

// Función para cargar el estado guardado de las notificaciones
const loadSavedNotificationState = () => {
  try {
    const savedNuevasSubastas = localStorage.getItem('notif_nuevas_subastas')
    const savedSubastasFinalizadas = localStorage.getItem('notif_subastas_finalizadas')
    
    if (savedNuevasSubastas !== null) {
      notificationsEnabled.nuevasSubastas = savedNuevasSubastas === 'true'
    }
    
    if (savedSubastasFinalizadas !== null) {
      notificationsEnabled.subastasFinalizadas = savedSubastasFinalizadas === 'true'
    }
    
    console.log('Estado de notificaciones cargado:', notificationsEnabled)
  } catch (error) {
    console.error('Error al cargar estado guardado de notificaciones:', error)
  }
}

// Función para guardar el estado de las notificaciones
const saveNotificationState = (topic, enabled) => {
  try {
    if (topic === 'nuevas-subastas' || topic === 'all') {
      localStorage.setItem('notif_nuevas_subastas', notificationsEnabled.nuevasSubastas.toString())
    }
    
    if (topic === 'subastas-finalizadas' || topic === 'all') {
      localStorage.setItem('notif_subastas_finalizadas', notificationsEnabled.subastasFinalizadas.toString())
    }
    
    console.log('Estado de notificaciones guardado:', notificationsEnabled)
  } catch (error) {
    console.error('Error al guardar estado de notificaciones:', error)
  }
}

const products = ref([])
const notificationsEnabled = reactive({
  nuevasSubastas: false,
  subastasFinalizadas: false
})
// Reemplazamos notificationStatus por toasts

onMounted(async () => {
  try {
    // Cargar el estado guardado de las notificaciones primero
    loadSavedNotificationState()
    
    // Mostrar indicador de carga para otras operaciones
    const loading = await loadingController.create({
      message: 'Cargando productos...',
      duration: 10000 // 10 segundos máximo
    })
    await loading.present()

    // Cargar productos
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (dbError) {
      console.error('Error al cargar productos:', dbError)
      const toast = await toastController.create({
        message: 'Error al cargar productos. Por favor, verifica tu conexión.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      })
      toast.present()
    }

    // Inicializar servicio de notificaciones (sin bloquear si falla)
    try {
      await notificationService.initialize()
      console.log('Servicio de notificaciones inicializado correctamente')
      
      // Si es posible, verificar estado actual de las suscripciones con el servidor
      if (typeof notificationService.getSubscriptions === 'function') {
        try {
          const subscriptions = await notificationService.getSubscriptions()
          
          // Solo actualizar si el servidor tiene información
          if (subscriptions && Array.isArray(subscriptions)) {
            const serverNuevasSubastas = subscriptions.includes('nuevas-subastas')
            const serverSubastasFinalizadas = subscriptions.includes('subastas-finalizadas')
            
            // Si hay discrepancia entre lo local y el servidor, confiar en el servidor
            if (notificationsEnabled.nuevasSubastas !== serverNuevasSubastas) {
              notificationsEnabled.nuevasSubastas = serverNuevasSubastas
              saveNotificationState('nuevas-subastas', serverNuevasSubastas)
            }
            
            if (notificationsEnabled.subastasFinalizadas !== serverSubastasFinalizadas) {
              notificationsEnabled.subastasFinalizadas = serverSubastasFinalizadas
              saveNotificationState('subastas-finalizadas', serverSubastasFinalizadas)
            }
          }
        } catch (subscriptionError) {
          console.log('No se pudo obtener el estado de las suscripciones del servidor', subscriptionError)
          // No mostrar error al usuario, usar valores locales en su lugar
        }
      } else {
        console.log('El método getSubscriptions no está disponible')
      }
    } catch (notifError) {
      console.error('Error al inicializar notificaciones:', notifError)
      // No mostrar error al usuario para no interrumpir la experiencia
    }

    await loading.dismiss()
  } catch (error) {
    console.error('Error general al inicializar:', error)
  }
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

// Función para activar/desactivar una notificación específica
const toggleSpecificNotification = async (topic, enabled) => {
  try {
    const loading = await loadingController.create({
      message: enabled ? 'Activando notificaciones...' : 'Desactivando notificaciones...',
      duration: 5000
    })
    await loading.present()

    let success = false
    if (enabled) {
      if (typeof notificationService.subscribeTopic === 'function') {
        success = await notificationService.subscribeTopic(topic)
      } else if (typeof notificationService.subscribe === 'function') {
        success = await notificationService.subscribe(topic)
      } else {
        throw new Error('Método de suscripción no encontrado')
      }
    } else {
      if (typeof notificationService.unsubscribeTopic === 'function') {
        success = await notificationService.unsubscribeTopic(topic)
      } else if (typeof notificationService.unsubscribe === 'function') {
        success = await notificationService.unsubscribe(topic)
      } else {
        throw new Error('Método de cancelación no encontrado')
      }
    }

    await loading.dismiss()

    if (success) {
      if (topic === 'nuevas-subastas') notificationsEnabled.nuevasSubastas = enabled
      else if (topic === 'subastas-finalizadas') notificationsEnabled.subastasFinalizadas = enabled

      saveNotificationState(topic, enabled)

      const toast = await toastController.create({
        message: enabled
          ? `Te has suscrito a notificaciones de ${topic}`
          : `Has cancelado tu suscripción a ${topic}`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      })
      toast.present()
    } else {
      throw new Error('No se pudo completar la operación')
    }
  } catch (error) {
    console.error(`Error al ${enabled ? 'activar' : 'desactivar'} notificaciones:`, error)

    const toast = await toastController.create({
      message: `Error al ${enabled ? 'activar' : 'desactivar'} notificaciones. Inténtalo de nuevo.`,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    })
    toast.present()

    if (topic === 'nuevas-subastas') notificationsEnabled.nuevasSubastas = !enabled
    else if (topic === 'subastas-finalizadas') notificationsEnabled.subastasFinalizadas = !enabled
  }
}

// Función para activar/desactivar todas las notificaciones
const toggleNotifications = async (event) => {
  const enabled = event.detail.checked

  try {
    const loading = await loadingController.create({
      message: enabled ? 'Activando notificaciones...' : 'Desactivando notificaciones...',
      duration: 5000
    })
    await loading.present()

    let success = true

    if (enabled) {
      if (typeof notificationService.subscribeTopic === 'function') {
        const s1 = await notificationService.subscribeTopic('nuevas-subastas')
        const s2 = await notificationService.subscribeTopic('subastas-finalizadas')
        success = s1 && s2
      } else if (typeof notificationService.subscribe === 'function') {
        const s1 = await notificationService.subscribe('nuevas-subastas')
        const s2 = await notificationService.subscribe('subastas-finalizadas')
        success = s1 && s2
      } else throw new Error('Método de suscripción no encontrado')
    } else {
      if (typeof notificationService.unsubscribeTopic === 'function') {
        const s1 = await notificationService.unsubscribeTopic('nuevas-subastas')
        const s2 = await notificationService.unsubscribeTopic('subastas-finalizadas')
        success = s1 && s2
      } else if (typeof notificationService.unsubscribe === 'function') {
        const s1 = await notificationService.unsubscribe('nuevas-subastas')
        const s2 = await notificationService.unsubscribe('subastas-finalizadas')
        success = s1 && s2
      } else throw new Error('Método de cancelación no encontrado')
    }

    await loading.dismiss()

    if (success) {
      notificationsEnabled.nuevasSubastas = enabled
      notificationsEnabled.subastasFinalizadas = enabled
      saveNotificationState('all', enabled)

      const toast = await toastController.create({
        message: enabled
          ? 'Te has suscrito a todas las notificaciones'
          : 'Has cancelado todas tus suscripciones',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      })
      toast.present()
    } else {
      throw new Error('No se pudo completar la operación')
    }
  } catch (error) {
    console.error(`Error al ${enabled ? 'activar' : 'desactivar'} notificaciones:`, error)

    const toast = await toastController.create({
      message: `Error al ${enabled ? 'activar' : 'desactivar'} notificaciones. Inténtalo de nuevo.`,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    })
    toast.present()
  }
}
</script>