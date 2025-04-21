import { db } from '../firebase/FirebaseConfig'; // Importa tu configuración de Firebase
import { doc, updateDoc } from "firebase/firestore";

// Función para actualizar el precio de un producto
export const actualizarProducto = async (productoId, nuevoPrecio) => {
  try {
    const productoRef = doc(db, "products", productoId); // Obtén la referencia del producto
    await updateDoc(productoRef, {
      precio_actual: nuevoPrecio, // Actualiza el campo de precio
    });
    console.log('Producto actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el producto: ', error);
  }
};
