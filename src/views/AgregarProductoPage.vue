<!-- AgregarProductoPage.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Crear Productos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="crear-producto-container">
        <form @submit.prevent="crearProducto">
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input 
              v-model="producto.nombre" 
              type="text" 
              required
              placeholder="Ingrese el nombre del producto"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Categoría</ion-label>
            <ion-select 
              v-model="producto.categoria" 
              placeholder="Seleccione una categoría"
              interface="action-sheet"
              required
            >
              <ion-select-option value="Autos y Motos">Autos y Motos</ion-select-option>
              <ion-select-option value="Ropa">Ropa</ion-select-option>
              <ion-select-option value="Industrial y Maquinaria">Industrial y Maquinaria</ion-select-option>
              <ion-select-option value="Inmuebles">Inmuebles</ion-select-option>
              <ion-select-option value="Hogar y Decoracion">Hogar y Decoracion</ion-select-option>
              <ion-select-option value="Tecnología">Tecnología</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Campo condicional para nueva categoría -->
          <ion-item v-if="producto.categoria === 'otra'">
            <ion-label position="stacked">Nueva Categoría</ion-label>
            <ion-input 
              v-model="producto.nuevaCategoria" 
              type="text" 
              placeholder="Ingrese la nueva categoría"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Descripción del Producto</ion-label>
            <ion-textarea 
              v-model="producto.descripcion" 
              placeholder="Describa su producto"
              required
            ></ion-textarea>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Fotos</ion-label>
            <ion-input 
              type="file" 
              multiple="true"
              accept="image/*"
              @change="cargarImagenes"
            ></ion-input>
            <div class="imagenes-preview">
              <div v-for="(preview, index) in imagenesPreview" :key="index" class="imagen-preview-container">
                <img :src="preview" class="imagen-preview"/>
                <ion-icon name="close-circle" class="eliminar-imagen" @click="eliminarImagenPreview(index)"></ion-icon>
              </div>
            </div>
          </ion-item>

          <div class="ion-margin-vertical">
            <ion-text color="medium">
              <h3>Fechas</h3>
            </ion-text>
            <ion-item>
              <ion-label position="stacked">Apertura</ion-label>
              <ion-input 
                :value="mostrarFecha(producto.fechaApertura)"
                placeholder="Seleccione fecha"
                @click="mostrarCalendarioApertura = true"
                readonly
              ></ion-input>
              <ion-datetime 
                v-if="mostrarCalendarioApertura"
                v-model="producto.fechaApertura"
                presentation="date"
                @ionChange="onDateChangeApertura"
                @ionCancel="mostrarCalendarioApertura = false"
              ></ion-datetime>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Hora de Apertura</ion-label>
              <ion-select 
                v-model="producto.horaApertura" 
                placeholder="Seleccione hora"
                interface="action-sheet"
                required
              >
                <ion-select-option 
                  v-for="hora in horasDisponibles" 
                  :key="hora" 
                  :value="hora"
                >
                  {{ hora }}:00
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Cierre</ion-label>
              <ion-input 
                :value="mostrarFecha(producto.fechaCierre)"
                placeholder="Seleccione fecha"
                @click="mostrarCalendarioCierre = true"
                readonly
              ></ion-input>
              <ion-datetime 
                v-if="mostrarCalendarioCierre"
                v-model="producto.fechaCierre"
                presentation="date"
                @ionChange="onDateChangeCierre"
                @ionCancel="mostrarCalendarioCierre = false"
              ></ion-datetime>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Hora de Cierre</ion-label>
              <ion-select 
                v-model="producto.horaCierre" 
                placeholder="Seleccione hora"
                interface="action-sheet"
                required
              >
                <ion-select-option 
                  v-for="hora in horasDisponibles" 
                  :key="hora" 
                  :value="hora"
                >
                  {{ hora }}:00
                </ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div class="ion-margin-vertical">
            <ion-text color="medium">
              <h3>Precios</h3>
            </ion-text>
            <ion-item>
              <ion-label position="stacked">Precio Base</ion-label>
              <ion-input 
                v-model="producto.precioBase" 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="Ingrese precio base"
              ></ion-input>
              <ion-text slot="end" color="medium">COP</ion-text>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Precio Venta Inmediata</ion-label>
              <ion-input 
                v-model="producto.precioVentaInmediata" 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="Ingrese precio de venta inmediata"
              ></ion-input>
              <ion-text slot="end" color="medium">COP</ion-text>
            </ion-item>
          </div>

          <div class="botones-container ion-padding">
            <ion-button 
              expand="block" 
              fill="outline" 
              color="dark" 
              @click="cancelar"
            >
              Cancelar
            </ion-button>
            <ion-button 
              expand="block"
              color="primary"
              type="submit"
              :disabled="cargandoImagenes || !formularioValido"
            >
              {{ cargandoImagenes ? 'Subiendo...' : 'Agregar Producto' }}
            </ion-button>
          </div>

          <!-- Indicador de progreso para subida de imágenes -->
          <div v-if="cargandoImagenes" class="progreso-container">
            <ion-progress-bar :value="progresoSubida"></ion-progress-bar>
            <ion-text color="medium">Subiendo imágenes: {{ Math.round(progresoSubida * 100) }}%</ion-text>
          </div>
        </form>
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
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime,
  IonText,
  IonButton,
  IonIcon,
  IonProgressBar
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth, storage } from '../firebase/FirebaseConfig';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Necesitarás instalar este paquete: npm install uuid

const mostrarCalendarioApertura = ref(false);
const mostrarCalendarioCierre = ref(false);
const router = useRouter();
const cargandoImagenes = ref(false);
const progresoSubida = ref(0);
const imagenesPreview = ref([]);
const imagenesSubidas = ref([]);

// Añadir este método de formateo de fecha
const mostrarFecha = (fechaStr) => {
  if (!fechaStr) return '';
  
  // Convertir de formato ISO a DD/MM/YYYY
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  
  return `${dia}/${mes}/${anio}`;
};

const onDateChangeApertura = (event) => {
  producto.value.fechaApertura = event.detail.value;
  mostrarCalendarioApertura.value = false;
};

const onDateChangeCierre = (event) => {
  producto.value.fechaCierre = event.detail.value;
  mostrarCalendarioCierre.value = false;
};

// Generar horas disponibles de 0 a 23
const horasDisponibles = Array.from({length: 24}, (_, i) => 
  i.toString().padStart(2, '0')
);

const producto = ref({
  nombre: '',
  categoria: '',
  nuevaCategoria: '',
  descripcion: '',
  fotos: [],
  fechaApertura: null,
  horaApertura: '',
  fechaCierre: null,
  horaCierre: '',
  precioBase: null,
  precioVentaInmediata: null
});

const formularioValido = computed(() => {
  const categoriaValida = producto.value.categoria !== 'otra' || 
    (producto.value.categoria === 'otra' && producto.value.nuevaCategoria.trim() !== '');

  return producto.value.nombre && 
         producto.value.categoria && 
         categoriaValida &&
         producto.value.descripcion && 
         producto.value.fechaApertura && 
         producto.value.horaApertura &&
         producto.value.fechaCierre && 
         producto.value.horaCierre &&
         producto.value.precioBase !== null &&
         producto.value.precioVentaInmediata !== null &&
         producto.value.fotos.length > 0; // Ahora requerimos al menos una foto
});

const eliminarImagenPreview = (index) => {
  imagenesPreview.value.splice(index, 1);
  producto.value.fotos.splice(index, 1);
};

const cargarImagenes = (event) => {
  // Forzar conversión de FileList a array
  const archivos = Array.from(event.target.files);
  
  console.log('Archivos seleccionados:', archivos);
  console.log('Número de archivos:', archivos.length);

  // Verificar si se seleccionaron archivos
  if (archivos.length > 0) {
    // Vaciar las fotos existentes si las hay
    producto.value.fotos = [];
    imagenesPreview.value = [];
    
    // Guardar los archivos
    producto.value.fotos = archivos;

    // Crear previsualizaciones para las imágenes
    archivos.forEach(archivo => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagenesPreview.value.push(e.target.result);
      };
      reader.readAsDataURL(archivo);
    });

    // Detalles de cada archivo
    archivos.forEach((archivo, index) => {
      console.log(`Archivo ${index + 1}:`, {
        nombre: archivo.name,
        tamaño: archivo.size,
        tipo: archivo.type
      });
    });
  }
};

const subirImagenes = async (userId, productoId) => {
  const fotos = producto.value.fotos;
  const totalFotos = fotos.length;
  let fotosSubidas = 0;
  const urlsImagenes = [];

  return new Promise((resolve, reject) => {
    if (fotos.length === 0) {
      resolve([]);
      return;
    }

    fotos.forEach((foto, index) => {
      // Crear nombre único para cada imagen
      const extension = foto.name.split('.').pop();
      const nombreArchivo = `${uuidv4()}.${extension}`;
      
      // Crear referencia para guardar en Firebase Storage
      const imagenRef = storageRef(storage, `productos/${userId}/${productoId}/${nombreArchivo}`);
      
      // Iniciar la subida
      const tareaSubida = uploadBytesResumable(imagenRef, foto);
      
      // Monitorear el progreso de la subida
      tareaSubida.on('state_changed', 
        (snapshot) => {
          // Calcular progreso total de todas las imágenes
          const progresoActual = snapshot.bytesTransferred / snapshot.totalBytes;
          const progresoPorImagen = progresoActual / totalFotos;
          const progresoAnterior = (fotosSubidas / totalFotos);
          
          progresoSubida.value = progresoAnterior + progresoPorImagen;
        }, 
        (error) => {
          console.error("Error al subir imagen:", error);
          reject(error);
        }, 
        async () => {
          // Obtener URL de la imagen subida
          try {
            const downloadURL = await getDownloadURL(tareaSubida.snapshot.ref);
            urlsImagenes.push({
              url: downloadURL,
              nombre: foto.name,
              path: `productos/${userId}/${productoId}/${nombreArchivo}`
            });
            
            fotosSubidas++;
            console.log(`Imagen ${index + 1} subida correctamente. URL:`, downloadURL);
            
            // Si todas las imágenes se han subido, resolver la promesa
            if (fotosSubidas === totalFotos) {
              resolve(urlsImagenes);
            }
          } catch (error) {
            console.error("Error al obtener URL de imagen:", error);
            reject(error);
          }
        }
      );
    });
  });
};

const cancelar = () => {
  // Resetear el formulario
  producto.value = {
    nombre: '',
    categoria: '',
    nuevaCategoria: '',
    descripcion: '',
    fotos: [],
    fechaApertura: null,
    horaApertura: '',
    fechaCierre: null,
    horaCierre: '',
    precioBase: null,
    precioVentaInmediata: null
  };

  // Limpiar previsualizaciones
  imagenesPreview.value = [];

  // Resetear input de archivos
  const fileInput = document.querySelector('ion-input[type="file"]');
  if (fileInput) {
    // Método más robusto para limpiar el input
    fileInput.value = null;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  }

  router.push('/home');
};

// Función principal para crear un producto
const crearProducto = async () => {
  if (!auth.currentUser) {
    console.error("Usuario no autenticado");
    return;
  }

  try {
    cargandoImagenes.value = true;
    progresoSubida.value = 0;

    const categoriaFinal = producto.value.categoria === 'otra' 
      ? producto.value.nuevaCategoria 
      : producto.value.categoria;

    // Formatear las fechas sin convertir a UTC (evitar toISOString)
    // Crear objetos Date para manipulación
    const fechaAperturaObj = new Date(producto.value.fechaApertura);
    fechaAperturaObj.setHours(parseInt(producto.value.horaApertura), 0, 0);
    
    const fechaCierreObj = new Date(producto.value.fechaCierre);
    fechaCierreObj.setHours(parseInt(producto.value.horaCierre), 0, 0);
    
    // Formatear fechas para almacenamiento manteniendo la zona horaria local
    // Formato: "YYYY-MM-DDTHH:MM:SS.sss" (sin la Z del final que indica UTC)
    const formatearFechaHora = (fecha) => {
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const hora = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      const segundos = String(fecha.getSeconds()).padStart(2, '0');
      
      // Formato para almacenamiento en Firebase (mantiene compatibilidad con el resto del sistema)
      return `${año}-${mes}-${dia}T${hora}:${minutos}:${segundos}.000`;
    };
    
    // Formato simple para visualización
    const formatearFechaHoraSimple = (fecha) => {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      
      return `${dia}/${mes}/${año} ${hora}:${minutos}`;
    };

    // Generar los formatos de fecha requeridos
    const fechaAperturaFormateada = formatearFechaHora(fechaAperturaObj);
    const fechaCierreFormateada = formatearFechaHora(fechaCierreObj);
    
    // Primero crear el documento en Firestore para obtener el ID
    const docRef = await addDoc(collection(db, 'products'), {
      userId: auth.currentUser.uid,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      categoria: categoriaFinal,
      precioBase: producto.value.precioBase,
      precioVentaInmediata: producto.value.precioVentaInmediata,
      fechaApertura: fechaAperturaFormateada,
      fechaCierre: fechaCierreFormateada,
      creadoEn: new Date().toISOString(),
      estado: "Disponible",
      imagenes: [] // Inicialmente vacío, se actualizará después
    });

    // Ahora subir las imágenes a Storage
    const imagenes = await subirImagenes(auth.currentUser.uid, docRef.id);

    // Actualizar el documento con las URLs de las imágenes
    const updateData = {
      imagenes: imagenes
    };

    // Actualizar el documento en Firestore con las referencias de imágenes
    await updateDoc(docRef, updateData);

    // Crear una notificación global en Firestore
    await addDoc(collection(db, 'notificaciones'), {
      mensaje: `Nuevo producto publicado: ${producto.value.nombre}`,
      timestamp: new Date().toISOString(),
      productoId: docRef.id,
      userId: auth.currentUser?.uid
    });

    console.log("Producto creado exitosamente con imágenes:", imagenes);

    // Limpiar el formulario
    producto.value = {
      nombre: '',
      categoria: '',
      nuevaCategoria: '',
      descripcion: '',
      fotos: [],
      fechaApertura: null,
      horaApertura: '',
      fechaCierre: null,
      horaCierre: '',
      precioBase: null,
      precioVentaInmediata: null
    };

    // Limpiar previsualizaciones
    imagenesPreview.value = [];

    // Limpiar input de archivos manualmente
    const fileInput = document.querySelector('ion-input[type="file"]');
    if (fileInput) {
      fileInput.value = null;
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    }

    // Redirigir a la página de mis publicaciones
    router.push('/mis-publicaciones');
  } catch (error) {
    console.error("Error al guardar producto:", error);
  } finally {
    cargandoImagenes.value = false;
  }
};
</script>

<style scoped>
.crear-producto-container {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.botones-container {
  display: flex;
  gap: 10px;
}

.botones-container ion-button {
  flex: 1;
}

.imagen-preview {
  max-width: 150px; /* Limita el ancho máximo de la imagen */
  max-height: 150px; /* Limita la altura máxima de la imagen */
  object-fit: cover; /* Mantiene la relación de aspecto y recorta la imagen si es necesario */
  margin: 5px; /* Añade un pequeño espacio entre las imágenes */
}
</style>