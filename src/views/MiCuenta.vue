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
      <div class="profile-section">
        <div class="profile-image-container" @click="seleccionarImagen">
          <img class="profile-image" :src="foto" alt="Foto de perfil" />
          <div class="camera-icon-container">
            <ion-icon :icon="camera" class="camera-icon" />
          </div>
          <!-- Input oculto para seleccionar archivos -->
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="procesarImagen"
          />
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

          <ion-item class="form-item" lines="none">
            <ion-label class="label-text" position="stacked">Saldo:</ion-label>
            <ion-input v-model="saldo" placeholder="Tu Saldo" readonly></ion-input>
          </ion-item>
        </div>
      </div>

      <!-- Toast para mostrar mensajes -->
      <ion-toast
        :is-open="mostrarToast"
        :message="mensajeToast"
        :duration="3000"
        :color="colorToast"
        @didDismiss="mostrarToast = false"
      ></ion-toast>

      <!-- Loading mientras se carga la imagen -->
      <ion-loading
        :is-open="cargando"
        message="Subiendo imagen..."
        :duration="0"
      ></ion-loading>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonToast,
  IonLoading
} from '@ionic/vue';
import { camera } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase/FirebaseConfig'; // ajusta si tienes otro path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Referencias reactivas
const nombre = ref('');
const cc = ref('');
const correo = ref('');
const foto = ref('');
const saldo = ref('');
const fileInput = ref(null);
const cargando = ref(false);
const mostrarToast = ref(false);
const mensajeToast = ref('');
const colorToast = ref('success');
const userId = ref('');
const fotoActualURL = ref(''); // Para guardar la URL actual y luego eliminarla

// Cargar info del usuario desde Firestore
onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    userId.value = user.uid;
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      nombre.value = data.name || '';
      cc.value = data.cedula || '';
      correo.value = data.email || '';
      foto.value = data.photoURL || 'https://via.placeholder.com/100';
      fotoActualURL.value = data.photoURL || ''; // Guardamos la URL actual
      saldo.value = data.saldo;
    } else {
      console.log('No existe el documento del usuario');
      mostrarMensaje('No se encontró información del usuario', 'danger');
    }
  } else {
    console.log('No hay usuario autenticado');
    mostrarMensaje('No hay sesión iniciada', 'danger');
  }
});

// Función para abrir el selector de imágenes
const seleccionarImagen = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Función para procesar la imagen seleccionada
const procesarImagen = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar que sea una imagen
  if (!file.type.match('image.*')) {
    mostrarMensaje('Por favor selecciona una imagen válida', 'danger');
    return;
  }

  // Validar tamaño (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    mostrarMensaje('La imagen no debe superar los 2MB', 'danger');
    return;
  }

  try {
    cargando.value = true;
    await subirImagen(file);
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    mostrarMensaje('Error al procesar la imagen', 'danger');
  } finally {
    cargando.value = false;
  }
};

// Función para eliminar la foto anterior
const eliminarFotoAnterior = async (url) => {
  if (!url || url === 'https://via.placeholder.com/100' || !url.includes('firebasestorage')) {
    return; // No eliminar si es la imagen por defecto o no es de Firebase Storage
  }

  try {
    const storage = getStorage();
    
    // Extraer la ruta del archivo desde la URL
    // La URL tiene un formato como: https://firebasestorage.googleapis.com/v0/b/[proyecto]/o/fotoPerfil%2F[userId]%2F[nombre]?alt=media&token=[token]
    const urlObj = new URL(url);
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
    
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
    console.log('Foto anterior eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la foto anterior:', error);
    // No mostramos mensaje de error al usuario para no confundirlo si falla la eliminación
  }
};

// Función para subir la imagen a Firebase Storage
const subirImagen = async (file) => {
  if (!userId.value) {
    mostrarMensaje('No se puede identificar al usuario', 'danger');
    return;
  }

  const storage = getStorage();
  const extension = file.name.split('.').pop();
  const nombreArchivo = `perfil_${Date.now()}.${extension}`;
  // Usamos la misma estructura que para productos: /{carpeta}/{userId}/{fileName}
  const imageRef = storageRef(storage, `fotoPerfil/${userId.value}/${nombreArchivo}`);

  try {
    // Guardar la URL actual para eliminarla después
    const urlAnterior = fotoActualURL.value;
    
    // Subir imagen a Firebase Storage
    const snapshot = await uploadBytes(imageRef, file);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Actualizar URL en Firestore
    await actualizarPerfilUsuario(downloadURL);
    
    // Actualizar imagen en la vista
    foto.value = downloadURL;
    fotoActualURL.value = downloadURL;
    
    // Eliminar la foto anterior si existe y es de Firebase
    if (urlAnterior) {
      await eliminarFotoAnterior(urlAnterior);
    }
    
    mostrarMensaje('Imagen actualizada correctamente', 'success');
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    mostrarMensaje('Error al subir la imagen', 'danger');
    throw error;
  }
};

// Función para actualizar el perfil del usuario en Firestore
const actualizarPerfilUsuario = async (photoURL) => {
  try {
    const userDocRef = doc(db, 'users', userId.value);
    await updateDoc(userDocRef, {
      photoURL: photoURL
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    mostrarMensaje('Error al actualizar el perfil', 'danger');
    throw error;
  }
};

// Función para mostrar mensajes Toast
const mostrarMensaje = (mensaje, color = 'success') => {
  mensajeToast.value = mensaje;
  colorToast.value = color;
  mostrarToast.value = true;
};
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
  cursor: pointer;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.camera-icon-container {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.camera-icon {
  font-size: 18px;
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