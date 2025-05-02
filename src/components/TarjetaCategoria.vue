<template>
  <IonCard class="tarjeta-producto" @click="irADetalles">
    <IonCardContent class="contenido">
      <p class="nombre-categoria">{{ categoria.nombre_categoria }}</p>
    </IonCardContent>
    <IonImg :src="categoria.foto_categoria || '/img/imagen-prueba.jpg'" alt="Imagen de categoría" />
  </IonCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { IonCard, IonImg, IonCardContent } from '@ionic/vue'

const props = defineProps({
  categoria: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function irADetalles() {
  router.push(`/categoria/${props.categoria.id}`)
}
</script>

<style scoped>
.tarjeta-producto {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.tarjeta-producto:hover {
  transform: scale(1.02);
}

.contenido {
  text-align: center;
  background-color: #2a2a2a;
  /* Fondo oscuro para contraste */
  padding: 1rem;
}

.nombre-categoria {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin: 0;
}
</style>