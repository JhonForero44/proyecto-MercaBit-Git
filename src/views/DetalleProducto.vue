<template>
  <ion-page>
    <ion-content class="detalle-producto">
      <div v-if="producto" class="contenedor">
        <h2 class="titulo">{{ producto.nombre }}</h2>

        <ion-slides pager="true" class="slider" v-if="producto.imagenes && producto.imagenes.length">
          <ion-slide v-for="(img, index) in producto.imagenes" :key="index">
            <img :src="img.url" class="imagen-slide" />
          </ion-slide>
        </ion-slides>

        <!-- Imagen de respaldo si no hay imágenes -->
        <img v-else :src="producto.imgUrl || '/img/imagen-prueba.jpg'" class="imagen-slide" />

        <p>Descripcion detallada:</p>
        <div class="descripcion">
          <p>{{ producto.descripcion }}</p>
        </div>

        <div class="cuenta-regresiva">
          <p><strong>CIERRA:</strong></p>
          <p class="contador">{{ tiempoRestante }}</p>
        </div>

        <div class="fechas">
          <p><strong>FECHA DE CIERRE:</strong><br>{{ formatoFechaSeguro(producto.fechaCierre) }}</p>
          <p><strong>DÍA APERTURA:</strong><br>{{ formatoFechaSeguro(producto.fechaApertura) }}</p>
        </div>

        <div class="estadisticas">
          <p>TIEMPO RESTANTE: <br> {{ tiempoRestante }} </p>
          <p>OFERTAS: {{ numeroOfertas }}</p>
        </div>

        <div class="precios">
          <p class="precio-actual">Oferta Actual: <strong> {{ formatoMoneda(producto.precioBase) }} </strong> (COP)
          </p>
          <p class="venta-inmediata">Cierre inmediato: <strong> {{ formatoMoneda(producto.precioVentaInmediata) }}
            </strong> (COP)</p>
        </div>

        <div class="nueva-oferta">
          <p class="titulo-oferta">Oferta sugerida:</p>
          <div class="oferta-input">
            <ion-input type="text" :value="formatoMonedaInput(ofertaSugerida)" readonly class="custom-oferta-input" />
            <ion-button size="small" @click="incrementarOferta"
              style="--background: #D9D9D9; --color: #9f0dbc; --border-radius: 50%; --padding-start: 0; --padding-end: 0; width: 32px; height: 32px;">
              +
            </ion-button>
          </div>
          <p class="incremento">Incremento: {{ formatoMoneda(incremento) }}</p>
        </div>

        <ion-button class="boton-oferta" expand="block" @click="CrearOferta">
          Habilitar Oferta
        </ion-button>
      </div>

      <div v-else class="loading">Cargando producto...</div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { actualizarProducto } from '@/services/productoService';

const route = useRoute()
const producto = ref(null)
const ofertaSugerida = ref(0)
const incremento = ref(100000)
const tiempoRestante = ref('')
const numeroOfertas = ref(0)

onMounted(async () => {
  const id = route.params.id
  const docRef = doc(db, 'products', id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    producto.value = docSnap.data()
    ofertaSugerida.value = Number(producto.value.precioBase || 0) + Number(incremento.value);
    actualizarTiempoRestante()
    setInterval(actualizarTiempoRestante, 60000)
    numeroOfertas.value = await obtenerNumeroDeOfertas(id)
  } else {
    console.error('No existe el producto con ID:', id)
  }
})

function incrementarOferta() {
  ofertaSugerida.value = Number(ofertaSugerida.value) + Number(incremento.value);
}

function obtenerFecha(fecha) {
  if (fecha?.toDate) return fecha.toDate()
  return new Date(fecha)
}

function formatoFechaSeguro(fecha) {
  if (!fecha) return 'No disponible'
  return formatoFecha(obtenerFecha(fecha))
}

function formatoFecha(fecha) {
  return fecha.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatoMoneda(valor) {
  if (!valor && valor !== 0) return 'No disponible'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

function formatoMonedaInput(valor) {
  if (!valor && valor !== 0) return '$0 COP';

  const num = Number(valor);

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

function actualizarTiempoRestante() {
  if (!producto.value?.fechaCierre) return

  const fin = obtenerFecha(producto.value.fechaCierre)
  const ahora = new Date()
  const diff = fin - ahora

  if (diff <= 0) {
    tiempoRestante.value = 'Finalizada'
    return
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutos = Math.floor((diff / (1000 * 60)) % 60)

  tiempoRestante.value = `${dias} días | ${horas} horas | ${minutos} minutos`
}

async function CrearOferta() {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    alert('Debes estar autenticado para hacer una oferta.')
    return
  }

  if (!producto.value) {
    alert('No se encontró el producto.')
    return
  }

  console.log("Usuario autenticado:", user.uid)

  try {
    const nuevaOferta = {
      producto_id: route.params.id,
      usuario_id: user.uid,
      cantidad: ofertaSugerida.value,
      fecha_hora: Timestamp.now(),
      estado: 'activa',
      es_mas_alta: false
    }

    await addDoc(collection(db, 'ofertas'), nuevaOferta)
    await actualizarProducto(route.params.id, ofertaSugerida.value);

    // Incrementar el número de ofertas del producto
    const docRef = doc(db, 'products', route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const numeroActual = data.precio_actual?.numero_ofertas || 0;

      await actualizarProducto(route.params.id, {
        'precio_actual.numero_ofertas': numeroActual + 1
      });
    }

    alert('¡Oferta registrada con éxito!')
  } catch (error) {
    console.error('Error al registrar la oferta:', error.code, error.message)
    alert('Ocurrió un error al guardar la oferta.')
  }
}

async function obtenerNumeroDeOfertas(productoId) {
  const productoRef = doc(db, "products", productoId);
  const productoSnap = await getDoc(productoRef);

  if (productoSnap.exists()) {
    const data = productoSnap.data();
    return data.precio_actual?.numero_ofertas || 0;
  } else {
    console.log("Producto no encontrado.");
    return 0;
  }
}


</script>

<style scoped>
ion-button {
  --border-radius: 20px;
  height: 50px;
  font-size: 16px;
  text-transform: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
}

.detalle-producto .contenedor {
  padding: 50px;
  background: #D9D9D9;
  color: black;
}

.titulo {
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.slider {
  margin-bottom: 16px;
}

.imagen-slide {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.descripcion {
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #000000;
}

.cuenta-regresiva {
  margin-bottom: 10px;
}

.contador {
  font-weight: bold;
  font-size: 18px;
}

.fechas p,
.estadisticas p {
  margin: 4px 0;
  font-size: 14px;
}

.estadisticas {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  font-weight: bold;
}

.precios {
  margin-top: 12px;
}

.precio-actual,
.venta-inmediata {
  font-size: 16px;
  margin: 4px 0;
}

.nueva-oferta {
  margin-top: 16px;
}

.titulo-oferta {
  margin-bottom: 8px;
  font-weight: bold;
}

.oferta-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-oferta-input {
  --placeholder-color: #999999;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  --padding-end: 12px;
  --padding-start: 12px;
  --highlight-color-focused: #9f0dbc;
  --border-radius: 10px;
  border: 1px solid #000000;
}

ion-input {
  flex: 1;
  --padding-start: 12px;
  border: 1px solid #D9D9D9;
  border-radius: 10px;
  height: 45px;
}

.incremento {
  margin-top: 6px;
  font-size: 13px;
}

.boton-oferta {
  margin-top: 20px;
  --background: #9f0dbc;
  --color: white;
  font-weight: bold;
  font-size: 16px;
  --border-radius: 14px;
}
</style>
