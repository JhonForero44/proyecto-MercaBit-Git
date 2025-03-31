<template>
  <ion-page>
    <div class="header">
      <h1>Inicio de Sesión</h1>
    </div>
    <div class="logo">
      <img src="/img/Logo.png" alt="Logo">
    </div>
    <ion-content class="ion-padding login-container">
      <ion-card class="login-card">
        <ion-input class="custom-input" v-model="email" placeholder="Correo electrónico" type="email"
          fill="outline"></ion-input>
        <ion-input class="custom-input" v-model="password" placeholder="Ingresa tu contraseña" type="password"
          fill="outline"></ion-input>
        <ion-button class="DesignButton-Ingresar" @click="login">Ingresar</ion-button>

        <ion-text color="primary">
          <p style="text-decoration: underline;">Olvidé mi contraseña</p>
        </ion-text>

        <p class="register-text">¿No tienes una cuenta?</p>
        <ion-button class="DesignButton-Register" @click="goToRegister">Crea una Cuenta</ion-button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </ion-card>
    </ion-content>
  </ion-page>

</template>

<script>
import { IonPage, IonContent, IonCard, IonInput, IonButton, IonText } from '@ionic/vue';
import { ref } from "vue";
import { loginUser } from "@/services/authService"; // Importamos la función del servicio
import { useRouter } from "vue-router";

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
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const errorMessage = ref("");

    const login = async () => {
      const response = await loginUser(email.value, password.value);
      
      if (response.success) {
        console.log("Usuario autenticado:", response.user);
        router.push("/home"); // Redirige a la página principal
      } else {
        errorMessage.value = "Error al iniciar sesión. Verifica tus credenciales.";
        console.error("Error de autenticación:", response.message);
      }
    };

    const goToRegister = () => {
      router.push("/register");
    };

    return { email, password, login, errorMessage, goToRegister };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Asegura que ocupe toda la pantalla */
  background-color: #111;
  /* Fondo oscuro */
}

.custom-input {
  --background: #CACACA;
  /* Fondo blanco */
  --border-radius: 25px;
  /* Bordes redondeados */
  --padding-start: 15px;
  /* Espaciado interno a la izquierda */
  --padding-end: 15px;
  /* Espaciado interno a la derecha */
  --placeholder-color: #999;
  /* Color del texto de marcador de posición */
  --color: black;
  /* Color del texto ingresado */
  --border-color: #ccc;
  /* Color del borde */
  height: 50px;
  /* Altura del campo */
  font-size: 16px;
  /* Tamaño del texto */
  margin-bottom: 15px;
  /* Espaciado entre los campos */
}

.header {
  text-align: center;
  margin-bottom: 10px;
  color: white;
  /* Para que el título se vea en fondo oscuro */
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
  margin: 10px auto; /* Centra el botón */
}

.DesignButton-Register {
  --ion-color-primary: #252E8D
}

.DesignButton-Ingresar {
  --ion-color-primary: #258D60
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* Asegura que ocupe el ancho completo */
  margin-bottom: 20px;
}

.logo img {
  width: 120px;
  height: auto;
}

.login-card {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.error-message{
  color: #000000;
}

.register-text {
  margin-top: 10px;
  color: #000000;
  /* Color blanco para el texto */
}
</style>