<template>
  <ion-page>
    <ion-content class="ion-padding register-container">
      <div class="header">
        <h1>Registro</h1>
      </div>
      <div class="logo">
        <img src="/img/Logo.png" alt="Logo" />
      </div>
      <ion-card class="register-card">
        <p>Registro. Crea tu cuenta MercaBit</p>
        
        <ion-input class="custom-input" v-model="name" placeholder="Nombre" fill="outline"></ion-input>
        <ion-input class="custom-input" v-model="cedula" placeholder="Cédula" fill="outline"></ion-input>
        <ion-input class="custom-input" v-model="email" placeholder="Correo electrónico" type="email" fill="outline"></ion-input>
        <ion-input class="custom-input" v-model="password" placeholder="Ingresa una contraseña segura" type="password" fill="outline"></ion-input>
        
        <ion-button class="DesignButton-Register" @click="register" :disabled="loading">
          <span v-if="!loading">Crear cuenta</span>
          <ion-spinner v-else name="crescent"></ion-spinner>
        </ion-button>

        <p class="login-text">
          Ya tienes una cuenta? <br>
          <span style="color: #0066cc;">Inicie sesión </span>
          <a href="#" @click.prevent="goToLogin">
            <b style="text-decoration: underline;">Aquí</b>
          </a>
        </p>

        <!-- Mensaje de error -->
        <ion-text color="danger" v-if="errorMessage">
          <p class="error-message">{{ errorMessage }}</p>
        </ion-text>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard, IonInput, IonButton, IonText, IonSpinner } from '@ionic/vue';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "@/services/authService";

export default {
  components: {
    IonPage, IonContent, IonCard, IonInput, IonButton, IonText, IonSpinner
  },
  setup() {
    const name = ref("");
    const cedula = ref("");  // Cambié de `cc` a `cedula` para coincidir con Firestore
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const router = useRouter();

    const register = async () => {
      if (!name.value || !cedula.value || !email.value || !password.value) {
        errorMessage.value = "Por favor complete todos los campos";
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email.value)) {
        errorMessage.value = "Por favor ingresa un correo electrónico válido";
        return;
      }

      if (password.value.length < 6) {
        errorMessage.value = "La contraseña debe tener al menos 6 caracteres";
        return;
      }

      if (cedula.value.length < 5) {
        errorMessage.value = "Por favor ingresa una cédula válida";
        return;
      }

      loading.value = true;
      errorMessage.value = "";

      try {
        const result = await registerUser(
          name.value,
          cedula.value,  // Enviar "cedula" en lugar de "cc"
          email.value,
          password.value
        );

        if (result.success) {
          alert(result.message); // "Registro exitoso. Revisa tu correo..."
          router.push("/login");
        } else {
          errorMessage.value = result.message;
        }

      } catch (error) {
        errorMessage.value = "Error al registrar: " + error.message;
      } finally {
        loading.value = false;
      }
    };

    const goToLogin = () => {
      router.push("/login");
    };

    return { name, cedula, email, password, loading, errorMessage, register, goToLogin };
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

.DesignButton-Register {
  --ion-color-primary: #258D60;
  width: 100%;
}

.login-text {
  margin-top: 10px;
  color: #000;
  font-size: 14px;
}

.footer-text {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}
</style>
