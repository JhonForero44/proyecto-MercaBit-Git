<template>
  <div>
    <h1>Generar Compra</h1>
    <p>Detalles de la compra: {{ producto.nombre }} - Precio: {{ producto.precio }}</p>
    
    <!-- Botón para finalizar la compra y redirigir a la vista de calificación -->
    <button @click="finalizarCompra">Finalizar Compra</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const router = useRouter();
const producto = ref({
  nombre: 'Producto Ejemplo',
  precio: 100,
  vendedorId: 'vendedor123', // Esto debería venir dinámico más adelante
});

const compradorId = 'comprador456'; // También debería venir del usuario autenticado

const finalizarCompra = async () => {
  try {
    const compraRef = collection(db, 'compras');
    const nuevaCompra = {
      producto: producto.value,
      compradorId,
      vendedorId: producto.value.vendedorId,
      estado: 'completado', // puedes cambiar esto luego a 'pendiente'
      fecha: new Date().toISOString()
    };

    const docRef = await addDoc(compraRef, nuevaCompra);
    console.log("Compra creada con ID:", docRef.id);

    // Redirigir a la vista de calificación
    router.push({ name: 'calificacion', params: { compraId: docRef.id } });
  } catch (error) {
    console.error("Error al crear la compra:", error);
  }
};
</script>
