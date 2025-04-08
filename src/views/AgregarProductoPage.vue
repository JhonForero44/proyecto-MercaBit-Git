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
              <ion-select-option value="carros">Carros</ion-select-option>
              <ion-select-option value="motos">Motos</ion-select-option>
              <ion-select-option value="inmobiliaria">Inmobiliaria</ion-select-option>
              <ion-select-option value="construccion">Construcción</ion-select-option>
              <ion-select-option value="botes">Botes</ion-select-option>
              <ion-select-option value="otra">Otra categoría</ion-select-option>
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
              multiple= "true"
              accept="image/*"
              @change="cargarImagenes"
            ></ion-input>
            <div class="nombres-archivos"></div>
          </ion-item>

          <div class="ion-margin-vertical">
            <ion-text color="medium">
              <h3>Fechas</h3>
            </ion-text>
            <ion-item>
              <ion-label position="stacked">Apertura</ion-label>
              <ion-datetime 
                v-model="producto.fechaApertura" 
                presentation="date"
                placeholder="Seleccione fecha"
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
              <ion-datetime 
                v-model="producto.fechaCierre" 
                presentation="date"
                placeholder="Seleccione fecha"
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
              :disabled="!formularioValido"
            >
              Agregar Producto
            </ion-button>
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
  IonButton
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
         producto.value.precioVentaInmediata !== null;
});

const cargarImagenes = (event) => {
  // Forzar conversión de FileList a array
  const archivos = Array.from(event.target.files);
  
  console.log('Archivos seleccionados:', archivos);
  console.log('Número de archivos:', archivos.length);

  // Verificar si se seleccionaron archivos
  if (archivos.length > 0) {
    // Guardar los archivos
    producto.value.fotos = archivos;

    // Detalles de cada archivo
    archivos.forEach((archivo, index) => {
      console.log(`Archivo ${index + 1}:`, {
        nombre: archivo.name,
        tamaño: archivo.size,
        tipo: archivo.type
      });
    });

    // Nombres de archivos
    const nombresArchivos = archivos.map(archivo => archivo.name).join(', ');
    console.log('Nombres de archivos:', nombresArchivos);
  }
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
const crearProducto = async () => {
  try {
    const categoriaFinal = producto.value.categoria === 'otra' 
      ? producto.value.nuevaCategoria 
      : producto.value.categoria;

    // Combinar fecha y hora para crear un datetime completo
    const fechaAperturaCompleta = new Date(producto.value.fechaApertura);
    fechaAperturaCompleta.setHours(parseInt(producto.value.horaApertura), 0, 0);

    const fechaCierreCompleta = new Date(producto.value.fechaCierre);
    fechaCierreCompleta.setHours(parseInt(producto.value.horaCierre), 0, 0);

    const productoDatos = {
      ...producto.value,
      categoria: categoriaFinal,
      fechaAperturaCompleta: fechaAperturaCompleta.toISOString(),
      fechaCierreCompleta: fechaCierreCompleta.toISOString()
    };

    console.log('Producto a crear:', productoDatos);
    // Aquí iría la lógica de guardar el producto
    // await ProductoService.crear(productoDatos);
    
    router.push('/home');
  } catch (error) {
    console.error('Error al crear producto:', error);
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
</style>