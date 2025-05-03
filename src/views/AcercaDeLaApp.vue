<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Acerca de MercaBit</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <ion-card class="login-card">
          <div class="logo">
            <img src="/img/Logo.png" alt="Logo">
          </div>
          <h2 class="textTitulo">Merca<span class="highlight">Bit</span></h2>
          <ion-text class="version-text">Versión 1.0</ion-text>
          <ion-text class="footer-text">Copyright ® 2025 MercaBit</ion-text>
          <ion-text class="footer-text">Cali, Colombia</ion-text>
          <ion-button class="DesignButton-TermCond" @click="goToTermCond">Términos y Condiciones</ion-button>
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
  IonMenuButton,
  IonCard,
  IonButton,
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
  margin-bottom: 30px; 
  color: #444;
  font-size: 0.95rem;
}

.footer-text {
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.2;
}

ion-button {
  --color: white;
  --border-radius: 20px;
  height: 50px;
  font-size: 16px;
  text-transform: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px auto;
}

.DesignButton-TermCond {
  --ion-color-primary: #252E8D;
}

.textTitulo {
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
}

.highlight {
  color: #a64aff;
}

.logo img {
  width: 120px;
  height: auto;
}
</style>