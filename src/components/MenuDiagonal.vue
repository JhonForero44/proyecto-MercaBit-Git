<template>
  <ion-menu content-id="main-content" side="start" :disabled="false">
    <ion-content class="menu-content">
      <div class="menu-header">
        <img src="/img/Logo.png" alt="Logo" class="company-logo" />
        <h2 class="logo">Merca<span class="highlight">Bit</span></h2>
      </div>
      <ion-list>
        <ion-menu-toggle auto-hide="false">
          <ion-item router-link="/" router-direction="root">
            <ion-icon :icon="homeOutline" slot-v="start" />
            <ion-label>Inicio</ion-label>
          </ion-item>
          <ion-item router-link="/buscar" router-direction="root">
            <ion-icon :icon="searchOutline" slot-v="start" />
            <ion-label>Buscar</ion-label>
          </ion-item>
          <ion-item router-link="/notificaciones" router-direction="root">
            <ion-icon :icon="notificationsOutline" slot-v="start" />
            <ion-label>Notificaciones</ion-label>
          </ion-item>
          <ion-item router-link="/mis-compras" router-direction="root">
            <ion-icon :icon="cartOutline" slot-v="start" />
            <ion-label>Mis Compras</ion-label>
          </ion-item>
          <ion-item router-link="/ofertas-realizadas" router-direction="root">
            <ion-icon :icon="checkmarkCircleOutline" slot-v="start" />
            <ion-label>Ofertas realizadas</ion-label>
          </ion-item>
          <ion-item router-link="/categorias" router-direction="root">
            <ion-icon :icon="folderOutline" slot-v="start" />
            <ion-label>Categorías</ion-label>
          </ion-item>
          <ion-item router-link="/mi-cuenta" router-direction="root">
            <ion-icon :icon="personOutline" slot-v="start" />
            <ion-label>Mi Cuenta</ion-label>
          </ion-item>
          <ion-item router-link="/accerca-de-la-app" router-direction="root">
            <ion-icon :icon="informationCircleOutline" slot-v="start" />
            <ion-label>Acerca de la App</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>

      <!-- Sección de usuario -->
      <div class="user-section">
        <img src="/img/User.jpg" alt="Usuario" class="user-avatar" />
        <p class="user-name">Samuel</p>
      </div>
      <ion-button class="logout-button" fill="outline">
        <ion-icon :icon="logOutOutline" slot-v="start"></ion-icon>
        Cerrar sesión
      </ion-button>


    </ion-content>
  </ion-menu>
</template>

<script setup>
import { IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/vue';
import { homeOutline, searchOutline, notificationsOutline, cartOutline, checkmarkCircleOutline, folderOutline, personOutline, informationCircleOutline, logOutOutline } from 'ionicons/icons';
</script>

<style scoped>
.menu-content {
  --background: #000;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Contenedor flex para el logo y el texto */
.menu-header {
  display: flex;
  align-items: center;
  /* Alinea los elementos verticalmente */
  justify-content: center;
  /* Centra horizontalmente */
  flex-wrap: nowrap;
  /* Evita que el texto salte a otra línea */
  padding: 20px 10px;
}

/* Imagen del logo con altura fija */
.company-logo {
  width: 40px;
  /* Ajusta según necesites */
  height: auto;
  max-height: 40px;
  /* Para evitar que crezca demasiado */
  display: block;
  margin-right: 10px;
  /* Espacio entre el logo y el texto */
  background: none;
  mix-blend-mode: normal;
  /* Evita que el logo se mezcle con el fondo */
}

/* Estilos para el texto "MercaBit" */
.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
  /* Evita que se divida en dos líneas */
}

.highlight {
  color: #a64aff;
  /* Color morado para "Bit" */
}

/* Estilos generales del menú */
ion-item {
  --background: transparent;
  color: white;
  --color: white;
}

ion-icon {
  color: white;
}
.user-section {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra horizontalmente */
  justify-content: center; /* Centra verticalmente si es necesario */
  width: 100%;
}

.user-avatar {
  width: 50px;
  /* Ajusta el tamaño de la imagen si es necesario */
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
  margin-right: 10px;
  /* Espacio entre la imagen y el texto */
}

.user-name {
  font-size: 1.2rem;
  color: white;
}


.user-name {
  font-size: 1.2rem;
  color: white;
}

.logout-button {
  margin-top: 10px;
  --background: transparent;
  --color: white;
  --border-color: white;
  border-radius: 8px;
  max-width: 170px;
  height: 35px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto; /* Centra el botón horizontalmente */
}

.logout-button ion-icon {
  font-size: 1.2rem;
  margin-right: 8px;
}

</style>