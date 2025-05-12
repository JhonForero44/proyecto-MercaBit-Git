<template>
  <div>
    <h1>Califica al Vendedor</h1>

    <!-- Si la compra está completada, muestra el formulario de calificación -->
    <div v-if="estadoCompra === 'completado'">
      <label for="puntaje">Puntaje (1 a 5):</label>
      <input type="number" id="puntaje" v-model="puntaje" min="1" max="5" />

      <label for="comentario">Comentario:</label>
      <textarea id="comentario" v-model="comentario"></textarea>

      <button @click="enviarCalificacion">Enviar Calificación</button>
    </div>
    <div v-else>
      <p>Solo puedes calificar cuando la compra esté completada.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { agregarCalificacion } from '../services/firebaseService';  // Importa la función de calificación
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default {
  setup() {
    const puntaje = ref(5);  // Valor predeterminado de calificación
    const comentario = ref("");  // Comentario de la calificación
    const estadoCompra = ref("");  // Estado de la compra (completado o pendiente)
    const compraId = 'id-de-la-compra';  // Esto debe ser dinámico según el usuario

    // Obtener el estado de la compra
    onMounted(async () => {
      const compraRef = doc(db, 'compras', compraId);  // Obtenemos el documento de la compra
      const compraSnapshot = await getDoc(compraRef);

      if (compraSnapshot.exists()) {
        estadoCompra.value = compraSnapshot.data().estado;  // Actualizamos el estado de la compra
      }
    });

    // Función para enviar la calificación
    const enviarCalificacion = async () => {
      const vendedorId = 'vendedor123';  // Este valor debe ser dinámico
      const compradorId = 'comprador456';  // Este valor debe ser dinámico (ID del comprador)
      
      await agregarCalificacion(vendedorId, compradorId, puntaje.value, comentario.value);
    };

    return {
      puntaje,
      comentario,
      estadoCompra,
      enviarCalificacion
    };
  }
}
</script>
