<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot-v="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Inicio</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h1>Bienvenido a la App</h1>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/vue';
</script>
