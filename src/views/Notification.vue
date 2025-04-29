<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Notificaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list class="notificaciones-lista">
        <!-- Mensaje vacío cuando no hay notificaciones -->
        <ion-item v-if="notificaciones.length === 0" lines="none" class="empty-state">
          <ion-label color="medium">No hay notificaciones por ahora</ion-label>
        </ion-item>

        <!-- Lista de notificaciones -->
        <ion-card 
          v-for="notificacion in notificaciones" 
          :key="notificacion.id"
          class="notificacion-card"
          @click="mostrarOpciones(notificacion)"
        >
          <ion-card-content>
            <div class="notificacion-header">
              <ion-label class="mensaje">
                {{ notificacion.mensaje }}
              </ion-label>
              <ion-chip class="fecha">
                <ion-label>{{ formatoFecha(notificacion.timestamp) }}</ion-label>
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>
    </ion-content>

    <!-- Alerta para elegir entre las opciones -->
    <ion-alert
      v-if="mostrarAlerta"
      :is-open="mostrarAlerta"
      header="Opciones de Notificación"
      message="¿Qué te gustaría hacer?"
      :buttons="[
        {
          text: 'Ir a la Publicación',
          handler: () => irAlaPublicacion(seleccionadaNotificacion)
        },
        {
          text: 'Eliminar Notificación',
          handler: () => eliminarNotificacion(seleccionadaNotificacion.id)
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => cancelarOpciones()
        }
      ]"
      @did-dismiss="resetAlerta"
    ></ion-alert>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonLabel,
  IonList,
  IonCard,
  IonCardContent,
  IonChip,
  IonItem,
  IonAlert,
} from '@ionic/vue';

import { onMounted, ref } from 'vue';
import { db } from '../firebase/FirebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { useRouter } from 'vue-router';

const notificaciones = ref([]);
const userId = ref(null);
const mostrarAlerta = ref(false); // Controlar la visibilidad del alerta
const seleccionadaNotificacion = ref(null); // Guardar la notificación seleccionada
const router = useRouter();

// Paso 1: Obtener el UID del usuario autenticado (en onMounted)
onMounted(() => {
  const auth = getAuth();  
  const user = auth.currentUser;  

  if (user) {
    userId.value = user.uid;
    console.log("Usuario autenticado:", userId.value);

    const notificacionesRef = collection(db, 'notificaciones');
    const q = query(notificacionesRef, where('userId', '==', userId.value));

    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log("No hay notificaciones para este usuario.");
      }
      notificaciones.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  } else {
    console.log("Usuario no autenticado.");
  }
});

// Función para mostrar las opciones al hacer clic en una notificación
const mostrarOpciones = (notificacion) => {
  seleccionadaNotificacion.value = notificacion;
  mostrarAlerta.value = true;  // Muestra el alert
};

// Eliminar notificación
const eliminarNotificacion = async (id) => {
  try {
    const notificacionRef = doc(db, 'notificaciones', id);
    await deleteDoc(notificacionRef);
    notificaciones.value = notificaciones.value.filter(n => n.id !== id);
    console.log('Notificación eliminada:', id);
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
  }
};

// Función para formatear la fecha
const formatoFecha = (isoString) => {
  const fecha = new Date(isoString);
  return fecha.toLocaleString(); // Personalizable para el formato de fecha
};

// Acción al hacer clic en "Ir a la Publicación"
const irAlaPublicacion = (notificacion) => {
  console.log('Ir a la publicación con ID:', notificacion.productoId);
  // Aquí puedes redirigir al usuario a la página de la publicación correspondiente
  // Por ejemplo, usando vue-router para navegar a la publicación
  router.push(`/publicacion/${notificacion.productoId}`);
};

// Resetear la visibilidad del alerta cuando se cierra
const resetAlerta = () => {
  mostrarAlerta.value = false; // Alerta cerrada, reiniciar el estado
};

// Función para cancelar la acción
const cancelarOpciones = () => {
  mostrarAlerta.value = false; // Simplemente cerramos el alerta
};

</script>


<style scoped>
.notificaciones-lista {
  margin-top: 1rem;
  padding: 0;
}

.notificacion-card {
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  padding: 0.5rem; 
  margin-bottom: 0.5rem; 
  background-color: #2196f3;
  color: azure;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.notificacion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem; 
}

.mensaje {
  font-size: 1rem;
  font-weight: 500;
  flex-grow: 1;
}

.fecha {
  font-size: 0.7rem;
  color: var(--ion-color-medium);
  background: var(--ion-color-light);
  padding: 0.2rem 0.4rem; 
  border-radius: 8px;
  cursor: pointer;
}

.fecha:hover {
  background: #2c65ff;
  color: white;
}

.empty-state {
  text-align: center;
  font-style: italic;
}
</style>
