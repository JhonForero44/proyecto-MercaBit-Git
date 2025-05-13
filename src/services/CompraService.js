// CompraService.js

import { db } from '../firebase/FirebaseConfig';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc
} from 'firebase/firestore';

// ✅ FUNCIÓN PARA CREAR COMPRA DESDE UNA SUBASTA VENCIDA
export async function crearCompraDesdeSubasta(subastaId) {
  const subastaRef = doc(db, 'subastas', subastaId);
  const subastaSnap = await getDoc(subastaRef);

  if (!subastaSnap.exists()) {
    throw new Error('La subasta no existe');
  }

  const subasta = subastaSnap.data();
  const ofertasRef = collection(db, 'ofertas');
  const mejoresOfertasQuery = query(
    ofertasRef,
    where('subastaId', '==', subastaId),
    orderBy('cantidad', 'desc'),
    limit(1)
  );

  const ofertasSnap = await getDocs(mejoresOfertasQuery);

  if (ofertasSnap.empty) {
    console.warn('No hay ofertas para esta subasta');
    return;
  }

  const mejorOferta = ofertasSnap.docs[0].data();
  const compradorId = mejorOferta.usuario_id;

  const nuevaCompra = {
    producto: subasta.producto,
    precio: mejorOferta.cantidad,
    compradorId,
    vendedorId: subasta.vendedorId,
    fecha: new Date().toISOString(),
    estado: 'completado',
    subastaId: subastaId
  };

  await addDoc(collection(db, 'compras'), nuevaCompra);
  await updateDoc(subastaRef, { estado: 'finalizada' });

  console.log(`✅ Compra creada desde la subasta ${subastaId}`);
}
