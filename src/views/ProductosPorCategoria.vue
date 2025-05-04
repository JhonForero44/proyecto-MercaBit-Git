<template>
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos de Categoría</IonTitle>
        </IonToolbar>
      </IonHeader>
  
      <IonContent>
        <!-- Loading Spinner -->
        <IonLoading :isOpen="isLoading" message="Cargando productos..." spinner="crescent" />
  
        <div v-if="!isLoading && productos.length === 0">
          No hay productos para esta categoría.
        </div>
  
        <div v-else class="productos-container">
          <TarjetaProducto v-for="producto in productosDisponibles" :key="producto.id" :producto="producto" />
        </div>
      </IonContent>
    </IonPage>
  </template>
  
  <script setup>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLoading } from '@ionic/vue'
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import TarjetaProducto from '@/components/TarjetaProducto.vue'
  import { obtenerProductosPorCategoria } from '@/services/productoService'
  import { obtenerCategoriaPorId } from '@/services/categoriaService'
  
  const categoria = ref(null)
  const productos = ref([])
  const isLoading = ref(true)
  const route = useRoute()
  
  const productosDisponibles = computed(() =>
  productos.value.filter(producto => {
    const ahora = new Date()
    const fechaCierre = new Date(producto.fechaCierre)
    return producto.estado === 'Disponible' && fechaCierre > ahora
    })
  )

  onMounted(async () => {
    const categoriaId = route.params.categoriaId
    try {
      categoria.value = await obtenerCategoriaPorId(categoriaId)
      productos.value = await obtenerProductosPorCategoria(categoria.value.nombre_categoria)
    } catch (error) {
      console.error('Error al obtener los productos de esta categoría:', error)
    } finally {
      isLoading.value = false
    }
  })
  </script>
  
  <style scoped>
  .productos-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  </style>
  