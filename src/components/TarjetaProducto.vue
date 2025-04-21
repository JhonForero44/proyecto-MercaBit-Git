<template>
  <ion-card @click="verProducto">
    <img :src="producto.imagenes && producto.imagenes[0]?.url" />
    <ion-card-header>
      <ion-card-title>{{ producto.nombre }}</ion-card-title>
      <ion-card-subtitle>{{ producto.categoria }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content class="producto-info">
      <p><strong>Precio base:</strong> ${{ producto.precioBase }}</p>
      <p><strong>Venta inmediata:</strong> ${{ producto.precioVentaInmediata }}</p>
      <p><strong>Disponible hasta:</strong> {{ formatoFecha(producto.fechaCierre) }}</p>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter(); 


const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})

// Función para redirigir a la página del producto (subasta)
function verProducto() {
  if (props.producto && props.producto.id) {
    // Redirigir a la página de subasta del producto usando el id
    router.push({ name: 'Producto-subasta', params: { id: props.producto.id } });
  } else {
    console.error("ID del producto no disponible");
  }
}

function formatoFecha(fecha) {
  try {
    const date = typeof fecha.toDate === 'function' ? fecha.toDate() : new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (e) {
    return 'Fecha no disponible'
  }
}
</script>

<style scoped>
.producto-info {
  margin-top: 10px;
}

ion-card-title {
  font-size: 1.3em;
}

ion-card-subtitle {
  color: #666;
  font-size: 1em;
}

ion-card-footer {
  background-color: #f4f4f4;
  font-size: 0.9em;
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

/* Efecto Hover */
ion-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

ion-card:hover {
  transform: translateY(-10px); /* Eleva ligeramente la tarjeta */
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1); /* Sombra para darle un efecto flotante */
}
</style>
