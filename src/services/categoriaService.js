import { db } from '../firebase/FirebaseConfig'; // Importa tu configuración de Firebase
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

export async function obtenerCategorias() {
  const categoriasSnapshot = await getDocs(collection(db, 'categorias'))
  return categoriasSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function obtenerCategoriaPorId(categoriaId) {
  console.log('Categoria ID:', categoriaId);  // Verifica el valor de categoriaId
  const categoriaRef = doc(db, 'categorias', categoriaId);
  const categoriaSnapshot = await getDoc(categoriaRef);
  
  if (categoriaSnapshot.exists()) {
    return categoriaSnapshot.data();
  } else {
    throw new Error('Categoría no encontrada');
  }
}
