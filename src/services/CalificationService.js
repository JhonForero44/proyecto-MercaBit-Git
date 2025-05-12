import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

// Función para agregar la calificación
export async function agregarCalificacion(vendedorId, compradorId, puntaje, comentario) {
  try {
    const calificacionesRef = collection(db, 'usuarios', vendedorId, 'calificaciones');
    await addDoc(calificacionesRef, {
      puntaje: puntaje,
      comentario: comentario,
      compradorId: compradorId,
      fecha: new Date().toISOString()
    });

    console.log("Calificación añadida correctamente.");
  } catch (error) {
    console.error("Error al agregar la calificación: ", error);
  }
}
