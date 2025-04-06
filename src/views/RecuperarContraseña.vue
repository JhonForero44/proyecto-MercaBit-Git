<template>
  <ion-page>
    <ion-content class="ion-padding register-container">
      <div class="header">
        <h1>Recuperacion de Contraseña</h1>
      </div>
      <div class="logo">
        <img src="/img/Logo.png" alt="Logo" />
      </div>
      <ion-card class="register-card">
        <p>Ingresa tu correo para restablecer tu contraseña</p>
        <label class="input-label" for="email">Email:</label>
        <ion-input class="custom-input" id="email" placeholder="Correo electrónico" type="email" fill="outline"
          v-model="email">
        </ion-input>

        <ion-button class="DesignButton-Recuperar" @click="handleReset" :disabled="loading">
          <span v-if="!loading">Enviar</span>
          <ion-spinner v-else name="crescent"></ion-spinner>
        </ion-button>

        <p v-if="mensaje" class="mensaje-simple">{{ mensaje }}</p>

        <p class="login-text">
          Ya tienes una cuenta? <br>
          <span style="color: #0066cc;">Inicie sesión </span>
          <a href="#" @click.prevent="goToLogin">
            <b style="text-decoration: underline;">Aquí</b>
          </a>
        </p>
      </ion-card>
    </ion-content>
    
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard, IonInput, IonButton, IonText } from '@ionic/vue';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { resetPassword } from "@/services/authService";

export default {
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonInput,
    IonButton,
    IonText
  },
  setup() {
    const router = useRouter();
    const email = ref("");
    const loading = ref(false);
    const mensaje = ref("");

    const handleReset = async () => {
      mensaje.value = "";
      loading.value = true;

      const res = await resetPassword(email.value);
      loading.value = false;
      mensaje.value = res.message;
    };

    const goToLogin = () => {
      router.push("/login");
    };

    return { email, mensaje, handleReset, goToLogin, loading };
  }
};
</script>

<style scoped>
/* Tus estilos existentes... */

.error-message {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>

<style scoped>
p {
  color: #000000;
  /* Color negro para mejor contraste */
  margin-bottom: 20px;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #E5E5E5;
}

.header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.logo img {
  width: 120px;
  height: auto;
}

.register-card {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.custom-input {
  --background: #CACACA;
  --border-radius: 25px;
  --padding-start: 15px;
  --padding-end: 15px;
  --placeholder-color: #999;
  --color: black;
  --border-color: #ccc;
  height: 50px;
  font-size: 16px;
  margin-bottom: 15px;
}

.input-label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  text-align: left;
  color: #000;
}

ion-button {
  --color: white;
  /* Color del texto */
  --border-radius: 20px;
  /* Bordes redondeados */
  height: 50px;
  /* Altura del botón */
  font-size: 16px;
  /* Tamaño del texto */
  text-transform: none;
  /* Evitar que el texto se convierta en mayúsculas */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  /* Centra el botón */
}

.DesignButton-Recuperar {
  --ion-color-primary: #258D60;
  width: 100%;
}

.login-text {
  margin-top: 10px;
  color: #000;
  font-size: 14px;
}

.mensaje-simple {
  margin-top: 12px;
  font-size: 14px;
  color: #000;
  text-align: center;
}

</style>
