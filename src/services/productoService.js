import { db } from '../firebase/FirebaseConfig'; // Importa tu configuración de Firebase
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export const actualizarProducto = async (productoId, nuevoPrecio) => {
  try {
    const nuevoPrecioNumerico = parseFloat(nuevoPrecio);

    if (isNaN(nuevoPrecioNumerico)) {
      console.error('El precio proporcionado no es válido', nuevoPrecio);
      return;
    }

    const productoRef = doc(db, "products", productoId);
    await updateDoc(productoRef, {
      precioBase: nuevoPrecioNumerico,
    });

    console.log('Producto actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el producto: ', error);
  }
};

export async function obtenerProductosPorCategoria(categoriaNombre) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Asegurarse de que el usuario esté autenticado
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const q = query(
      collection(db, 'products'),
      where('categoria', '==', categoriaNombre)
    );
    const querySnapshot = await getDocs(q);
    const productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return productos;
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error;
  }
}

export const actualizarCamposProducto = async (productoId, campos) => {
  try {
    const productoRef = doc(db, "products", productoId);
    await updateDoc(productoRef, campos);
    console.log('Campos del producto actualizados con éxito');
  } catch (error) {
    console.error('Error al actualizar los campos del producto: ', error);
  }
};