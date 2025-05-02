<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Categorías</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <div class="categorias-container">
        <TarjetaCategoria v-for="categoria in categorias" :key="categoria.id" :categoria="categoria" />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import TarjetaCategoria from '@/components/TarjetaCategoria.vue'
import { obtenerCategorias } from '@/services/categoriaService'

const categorias = ref([])

onMounted(async () => {
  try {
    categorias.value = await obtenerCategorias()
  } catch (err) {
    console.error('Error al obtener las categorías:', err)
  }
})
</script>

<style scoped>
.categorias-container {
  display: grid;
  grid-template-columns: 1fr;
  /* Solo una columna */
  gap: 1rem;
  padding: 1rem;
}
</style>