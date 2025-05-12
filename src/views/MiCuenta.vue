<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding content-bg">
      <!-- Sección del perfil del usuario -->
      <div class="profile-section">
        <div class="profile-image-container">
          <img class="profile-image" :src="foto" alt="Foto de perfil" />
          <ion-icon name="camera" class="camera-icon" />
        </div>
        
        <div class="form-card">
          <ion-item class="form-item" lines="none">
            <ion-label class="label-text" position="stacked">Nombre:</ion-label>
            <ion-input v-model="nombre" placeholder="Tu nombre" readonly></ion-input>
          </ion-item>
          
          <ion-item class="form-item" lines="none">
            <ion-label class="label-text" position="stacked">CC:</ion-label>
            <ion-input v-model="cc" placeholder="Tu cédula" readonly></ion-input>
          </ion-item>
          
          <ion-item class="form-item" lines="none">
            <ion-label class="label-text" position="stacked">Correo:</ion-label>
            <ion-input v-model="correo" placeholder="Tu correo electrónico" readonly></ion-input>
          </ion-item>
        </div>
      </div>

      <!-- Sección de calificaciones del vendedor -->
      <div>
        <h1>Perfil del Vendedor</h1>
        <h2>Promedio de Calificación: {{ promedio }}</h2>

        <div v-for="(calificacion, index) in calificaciones" :key="index">
          <vue-star-rating :rating="calificacion.puntaje" :star-size="20" :read-only="true"></vue-star-rating>
          <p>{{ calificacion.comentario }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonMenuButton, IonItem, IonLabel, IonInput, IonIcon } from '@ionic/vue';
import { camera } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase/FirebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import VueStarRating from 'vue-star-rating';

// Referencias reactivas para la información del usuario
const nombre = ref('');
const cc = ref('')
const correo = ref('');
const foto = ref('');

// Referencias reactivas para las calificaciones
const calificaciones = ref([]);
const promedio = ref(0);

// Cargar información del usuario desde Firestore
onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      nombre.value = data.name || '';
      cc.value = data.cedula || '';
      correo.value = data.email || '';
      foto.value = data.photoURL || 'https://via.placeholder.com/100';
    } else {
      console.log('No existe el documento del usuario');
    }
    
    // Obtener las calificaciones del vendedor
    const calificacionesRef = collection(db, 'usuarios', user.uid, 'calificaciones');
    const querySnapshot = await getDocs(calificacionesRef);
    
    calificaciones.value = querySnapshot.docs.map(doc => doc.data());
    
    // Calcular el promedio de las calificaciones
    const total = calificaciones.value.reduce((sum, calificacion) => sum + calificacion.puntaje, 0);
    promedio.value = total / calificaciones.value.length;
  } else {
    console.log('No hay usuario autenticado');
  }
});
</script>

<style scoped>
.content-bg {
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.profile-image-container {
  position: relative;
  width: 110px;
  height: 110px;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  padding: 4px;
  font-size: 20px;
  color: #333;
}

.form-card {
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 20px;
  padding: 1.2rem;
  margin-top: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-item {
  border: 2px solid #a64aff;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  margin: 10px auto;
  display: block;
}

.label-text {
  font-size: 25px;
}
</style>
