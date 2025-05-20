import { db } from '../firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

// Función para agregar la calificación
export async function agregarCalificacion(vendedorId, compradorId, puntaje, comentario, compraId) {
  try {
    const calificacionesRef = collection(db, 'usuarios', vendedorId, 'calificaciones');
    await addDoc(calificacionesRef, {
      puntaje,
      comentario,
      compradorId,
      compraId,
      fecha: new Date().toISOString()
    });

    console.log("Calificación añadida correctamente.");
  } catch (error) {
    console.error("Error al agregar la calificación: ", error);
  }
}
