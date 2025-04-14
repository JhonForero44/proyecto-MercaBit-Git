<template>
  <ion-page>
    <ion-content class="ion-padding container">
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
  IonCard,
  IonText
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToTermCond = () => {
  router.push('/terminos-condiciones'); // ajusta la ruta según la que tengas definida
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  height: 100vh; 
  padding-bottom: 100px;
}

.contenedor {
  padding: 10px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #999;
  text-align: justify;
  font-family: sans-serif;
  flex-grow: 1;
}

.login-card {
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
}

.version-text {
  display: block;
  margin-top: 15px;
  color: #444;
  font-size: 0.95rem;
}

.logo img {
  width: 120px;
  height: auto;
}
</style>