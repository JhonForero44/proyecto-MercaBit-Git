<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="dark">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Evaluar Usuario</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding" color="medium">
        <div class="form-container">
          <ion-segment v-model="tipo" color="primary">
            <ion-segment-button value="comprador">
              <ion-label>COMPRADOR</ion-label>
            </ion-segment-button>
            <ion-segment-button value="vendedor">
              <ion-label>VENDEDOR</ion-label>
            </ion-segment-button>
          </ion-segment>
  
          <ion-item lines="none">
            <ion-label position="stacked">Calificación (1 a 5)</ion-label>
            <ion-input
              v-model="calificacion"
              type="number"
              placeholder="Ej: 5"
              min="1"
              max="5"
            ></ion-input>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label position="stacked">Comentario</ion-label>
            <ion-textarea
              v-model="comentario"
              placeholder="Escribe tu comentario..."
              autoGrow
            ></ion-textarea>
          </ion-item>
  
          <ion-button
            expand="block"
            class="submit-button"
            @click="enviarEvaluacion"
          >
            ENVIAR EVALUACIÓN
          </ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonInput,
    IonItem,
    IonTextarea,
    IonButton,
  } from '@ionic/vue'
  import { ref } from 'vue'
  
  const tipo = ref('comprador')
  const calificacion = ref('')
  const comentario = ref('')
  
  const enviarEvaluacion = () => {
    console.log({
      tipo: tipo.value,
      calificacion: calificacion.value,
      comentario: comentario.value,
    })
    // Aquí podrías agregar lógica de envío a un backend, validaciones, etc.
  }
  </script>
  
  <style scoped>
.form-container {
  background-color: #1e1e1e;
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
}

.submit-button {
  margin-top: 20px;
  --background: #4a90ff;
  --color: black;
  font-weight: bold;
  height: 45px; /* <- Altura fija */
  font-size: 1rem;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: white;
  font-size: 0.8rem;
}
</style>
  