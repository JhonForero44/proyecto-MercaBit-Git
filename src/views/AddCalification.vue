<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Califica la compra</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="estadoCompra === 'completado'">
        <h2>Compra: {{ compraId }}</h2>

        <ion-item>
          <ion-label position="floating">Puntaje (1 a 5)</ion-label>
          <ion-input type="number" v-model.number="puntaje" min="1" max="5" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Comentario</ion-label>
          <ion-textarea v-model="comentario" />
        </ion-item>

        <ion-button expand="block" @click="enviarCalificacion">
          Enviar Calificación
        </ion-button>
      </div>

      <div v-else>
        <ion-text color="medium">
          <p>Solo puedes calificar cuando la compra esté completada.</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/FirebaseConfig'
import { agregarCalificacion } from '../services/CalificationService'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonText
} from '@ionic/vue'

const route = useRoute()
const compraId = route.params.compraId

const puntaje = ref(5)
const comentario = ref('')
const estadoCompra = ref('')
const vendedorId = ref(null)

onMounted(async () => {
  const compraRef = doc(db, 'compras', compraId)
  const compraSnapshot = await getDoc(compraRef)

  if (compraSnapshot.exists()) {
    const data = compraSnapshot.data()
    estadoCompra.value = data.estado
    vendedorId.value = data.vendedorId
  }
})

const enviarCalificacion = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    alert('Debes estar autenticado para calificar.')
    return
  }

  const compradorId = user.uid

  if (puntaje.value < 1 || puntaje.value > 5) {
    alert('El puntaje debe estar entre 1 y 5.')
    return
  }

  if (!comentario.value.trim()) {
    alert('Por favor, agrega un comentario.')
    return
  }

  try {
    await agregarCalificacion(vendedorId.value, compradorId, puntaje.value, comentario.value)
    alert('Calificación enviada correctamente.')
  } catch (error) {
    console.error('Error al enviar la calificación:', error)
    alert('Hubo un problema al enviar la calificación.')
  }
}
</script>
