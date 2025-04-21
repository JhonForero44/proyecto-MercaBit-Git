<template>
  <ion-card @click="irADetalles" class="tarjeta-producto">
    <ion-slides :options="slideOpts" v-if="producto.imagenes && producto.imagenes.length">
      <ion-slide v-for="(imagen, index) in producto.imagenes" :key="index">
        <img :src="imagen.url" alt="Imagen del producto" />
      </ion-slide>
    </ion-slides>

    <!--Imagen de respaldo-->    
    <img v-else src="/img/imagen-prueba.jpg" alt="Imagen del producto" />

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
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})

//Carrusel de imagenes 
const slideOpts = {
  initialSlide: 0,
  speed: 400,
  autoplay: {
    delay: 3000,
  },
  loop: true
}

function irADetalles() {
  //router.push('/terminos-condiciones');
  router.push(`/producto/${props.producto.id}`) 
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

.tarjeta-producto {
  cursor: pointer;
  /* <- ESTO activa el cursor tipo "mano" */
  transition: transform 0.2s ease-in-out;
}

.tarjeta-producto:hover {
  transform: scale(1.02);
  /* opcional: agranda un poquito al pasar el mouse */
}

</style>
