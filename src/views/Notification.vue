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
          <ion-item v-if="notificaciones.length === 0" lines="none" class="empty-state">
            <ion-label color="medium">No hay notificaciones por ahora</ion-label>
          </ion-item>
  
          <ion-card 
            v-for="notificacion in notificaciones" 
            :key="notificacion.id"
            class="notificacion-card"
          >
            <ion-card-content>
              <div class="notificacion-header">
                <ion-label class="mensaje">
                  {{ notificacion.mensaje }}
                </ion-label>
                <ion-chip class="fecha">
                  {{ formatoFecha(notificacion.timestamp) }}
                </ion-chip>
              </div>
  
              <div class="acciones">
                <ion-button 
                  fill="clear" 
                  color="danger" 
                  size="small"
                  @click="eliminarNotificacion(notificacion.id)"
                >
                  <ion-icon :icon="trash" slot="icon-only" />
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-list>
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
    IonButtons,
    IonMenuButton,
    IonLabel,
    IonList,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    IonItem
  } from '@ionic/vue';
  
  import { onMounted, ref } from 'vue';
  import { db } from '../firebase/FirebaseConfig';
  import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
  import { trash } from 'ionicons/icons';
  
  const notificaciones = ref([]);
  
  onMounted(() => {
    const notificacionesRef = collection(db, 'notificaciones');
    onSnapshot(notificacionesRef, (snapshot) => {
      notificaciones.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  });
  
  const eliminarNotificacion = async (id) => {
    try {
      await deleteDoc(doc(db, 'notificaciones', id));
      notificaciones.value = notificaciones.value.filter(n => n.id !== id);
      console.log('Notificación eliminada:', id);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };
  
  const formatoFecha = (isoString) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleString(); // Personalizable
  };
  </script>
  
  <style scoped>
  .notificaciones-lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .notificacion-card {
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    background-color: #2c65ff;
    color: azure;
  }
  
  .notificacion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .mensaje {
    font-size: 1rem;
    font-weight: 500;
  }
  
  .fecha {
    font-size: 0.7rem;
    color: var(--ion-color-medium);
    background: var(--ion-color-light);
  }
  
  .acciones {
    display: flex;
    justify-content: flex-end;
  }
  
  .empty-state {
    text-align: center;
    font-style: italic;
  }
  </style>
  