<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Mis Publicaciones</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-list v-if="productos.length > 0">
        <ion-card v-for="producto in productos" :key="producto.id" class="producto-card">
          <!-- Mostrar imagen parte superior-->
          <div class="imagen-container">
            <ion-img :src="producto.imagenes && producto.imagenes[0]?.url" class="producto-imagen" />
          </div>

          <!-- Detalles del producto -->
          <ion-card-content>
            <ion-card-title>
              {{ producto.nombre }}
            </ion-card-title>
            <ion-text>
              <p>Categoría: {{ producto.categoria }}</p>
              <p>Precio base: ${{ formatearPrecio(producto.precioBase) }} COP</p>
              <p>Venta inmediata: ${{ formatearPrecio(producto.precioVentaInmediata) }} COP</p>
              <p>Desde: {{ formatearFechaHora(producto.fechaApertura) }}</p>
              <p>Hasta: {{ formatearFechaHora(producto.fechaCierre) }}</p>
              <p>Publicado: {{ formatearFechaPublicacion(producto.creadoEn) }}</p>
  
              <!-- Mostrar el estado del producto -->
              <p v-if="producto.estado === 'Vendido'" class="estado-vendido">Estado: Vendido</p>
              <p v-else class="estado-disponible">Estado: Disponible</p>
            </ion-text>
            <!--Botones en la parte inferior-->
            <!-- Solo mostrar el botón "Vendido" si el producto no está vendido -->
            <div class="botones-container">
              <ion-button v-if="producto.estado !== 'Vendido'" color="success" @click="marcarComoVendido(producto.id)">
                Vendido
              </ion-button>
              <ion-button color="danger" @click="eliminarProducto(producto.id)">
                Borrar
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <ion-text v-else>
        No tienes productos publicados aún.
      </ion-text>
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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { db, auth } from '../firebase/FirebaseConfig';
import { collection, query, where, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';
import { deleteDoc } from "firebase/firestore";
import { storage } from '../firebase/FirebaseConfig'; // Importa Firebase Storage
import { ref as storageRef, deleteObject } from 'firebase/storage'; // Importa las funciones necesarias para manejar Storage

const productos = ref([]);

// Función para formatear precios
const formatearPrecio = (precio) => {
  if (!precio && precio !== 0) return 'N/A';
  return new Intl.NumberFormat('es-CO').format(precio);
};

// Función para formatear fechas y horas
const formatearFechaHora = (fechaStr) => {
  if (!fechaStr) return 'N/A';
  
  try {
    // Crear una fecha a partir del string
    const fecha = new Date(fechaStr);
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    
    // Formatear la fecha: DD/MM/YYYY, HH:MM a.m./p.m.
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    // Formatear la hora en formato 12h con a.m./p.m.
    let horas = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const periodo = horas >= 12 ? 'p.m.' : 'a.m.';
    
    // Convertir a formato 12h
    horas = horas % 12;
    horas = horas ? horas : 12; // Si es 0, mostrar como 12
    
    return `${dia}/${mes}/${anio}, ${horas}:${minutos} ${periodo}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return 'Error de formato';
  }
};

// Función para formatear la fecha de publicación (menos detallada)
const formatearFechaPublicacion = (fechaStr) => {
  if (!fechaStr) return 'N/A';
  
  try {
    const fecha = new Date(fechaStr);
    
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
  } catch (error) {
    console.error("Error al formatear fecha de publicación:", error);
    return 'Error de formato';
  }
};

const cargarMisProductos = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const q = query(
      collection(db, 'products'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    productos.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

// Eliminar producto de Firestore y del arreglo local
const eliminarProducto = async (id) => {
  try {
    // Obtener el producto desde la base de datos
    const productoRef = doc(db, "products", id);
    const docSnap = await getDoc(productoRef);

    if (docSnap.exists()) {
      const productoData = docSnap.data();
      
      // Si el producto tiene imágenes, eliminar cada una de ellas de Firebase Storage
      if (productoData.imagenes && productoData.imagenes.length > 0) {
        for (const imagen of productoData.imagenes) {
          const imagenRef = storageRef(storage, imagen.path); // Referencia de la imagen en Storage
          
          // Eliminar la imagen de Firebase Storage
          await deleteObject(imagenRef);
          console.log(`Imagen eliminada: ${imagen.path}`);
        }
      }
      
      // Eliminar el producto de Firestore
      await deleteDoc(productoRef);
      
      // Actualizar el arreglo local de productos
      productos.value = productos.value.filter(p => p.id !== id);
      console.log('Producto eliminado correctamente');
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
};

// Marcar como vendido (actualizar estado y UI)
const marcarComoVendido = async (id) => {
  try {
    const productoRef = doc(db, "products", id);
    
    // Actualizamos el estado a "Vendido"
    await updateDoc(productoRef, {
      estado: "Vendido"
    });

    // Actualizar el producto en el arreglo local
    productos.value = productos.value.map(p => 
      p.id === id ? { ...p, estado: "Vendido" } : p
    );
  } catch (error) {
    console.error("Error al marcar como vendido:", error);
  }
};

onMounted(() => {
  cargarMisProductos();
});
</script>

<style scoped>
.producto-card
{
  margin-bottom: 20px;
  width: 100%;
}

.imagen-container {
  width: auto;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.producto-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.estado-vendido {
  color: green;
  font-weight: bold;
}

.estado-disponible {
  color: orange;
}

.botones-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.boton-accion {
  flex: 1;
}

/* Estilos para dispositivos móviles */
@media (max-width: 576px) {
  .botones-container {
    flex-direction: column;
  }
}
</style>
