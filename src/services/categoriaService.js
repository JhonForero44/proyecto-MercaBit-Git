import { db } from '../firebase/FirebaseConfig'; // Importa tu configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'

export async function obtenerCategorias() {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'))
    return categoriasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }