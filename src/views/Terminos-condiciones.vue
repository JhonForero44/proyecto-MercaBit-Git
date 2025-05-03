<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/acerca-de"></ion-back-button>
        </ion-buttons>
        <ion-title>Términos y Condiciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <ion-card class="login-card">
          <div class="logo">
            <img src="/img/Logo.png" alt="Logo">
          </div>
          <ion-text class="version-text">Resumen de términos y condiciones</ion-text>
          <div class="contenedor">
            <p>
              Al utilizar esta aplicación, aceptas los presentes Términos y Condiciones. MercaBit está destinada a usuarios mayores de 13 años y requiere que toda la información proporcionada sea veraz y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y cualquier actividad bajo la misma. Todo el contenido de la app es propiedad de MercaBit y está protegido por derechos de autor. Se prohíbe el uso de la aplicación para fines ilegales, fraudulentos o no autorizados. Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuo de la app después de dichos cambios constituye tu aceptación. MercaBIt no se hace responsable de daños directos o indirectos derivados del uso de la aplicación. Estos términos se rigen por las leyes del país donde opera MercaBIt. Para más información, puedes contactarnos a través de admin@mercabit.com.
            </p>
          </div>
        </ion-card>
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
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonText
} from '@ionic/vue';
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px 0;
}

.login-card {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  margin: auto;
}

.version-text {
  display: block;
  margin-bottom: 20px;
  color: #444;
  font-size: 0.95rem;
  font-weight: bold;
}

.contenedor {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  text-align: justify;
  font-family: sans-serif;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #333;
  margin-bottom: 15px;
}

.logo img {
  width: 120px;
  height: auto;
  margin-bottom: 10px;
}
</style>