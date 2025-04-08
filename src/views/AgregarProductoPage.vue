<!-- AgregarProductoPage.vue -->
<template>
    <div class="agregar-producto-container">
      <div class="header">
        <h1>Crear Nueva Subasta</h1>
        <p>Complete todos los campos para publicar su producto</p>
      </div>
  
      <div class="form-container">
        <form @submit.prevent="crearSubasta" class="subasta-form">
          <!-- Título del producto -->
          <div class="form-group">
            <label for="titulo">Título del producto*</label>
            <input 
              id="titulo" 
              v-model="subasta.titulo" 
              type="text" 
              required 
              placeholder="Ej: iPhone 12 Pro Max 256GB"
              maxlength="100"
            >
            <small>Nombre descriptivo del artículo (máx. 100 caracteres)</small>
          </div>
          
          <!-- Categoría -->
          <div class="form-group">
            <label for="categoria">Categoría*</label>
            <select id="categoria" v-model="subasta.categoria" required>
              <option value="" disabled selected>Seleccione una categoría</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          
          <!-- Imágenes del producto -->
          <div class="form-group">
            <label>Imágenes del producto*</label>
            <div class="image-upload-container">
              <div 
                v-for="(imagen, index) in vistaPreviaImagenes" 
                :key="index" 
                class="image-preview"
              >
                <img :src="imagen" alt="Vista previa">
                <button type="button" class="remove-btn" @click="eliminarImagen(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="upload-btn-wrapper" v-if="vistaPreviaImagenes.length < 5">
                <button type="button" class="upload-btn">
                  <i class="fas fa-plus"></i>
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="cargarImagen" 
                  multiple
                >
              </div>
            </div>
            <small>Sube hasta 5 imágenes de tu producto (Máx. 5MB por imagen)</small>
          </div>
          
          <!-- Descripción del producto -->
          <div class="form-group">
            <label for="descripcion">Descripción*</label>
            <textarea 
              id="descripcion" 
              v-model="subasta.descripcion" 
              required 
              placeholder="Describe detalladamente tu producto incluyendo características, estado, defectos si los hay, etc."
              rows="5"
            ></textarea>
          </div>
          
          <!-- Precios -->
          <div class="form-row">
            <div class="form-group half">
              <label for="precioInicial">Precio Inicial (€)*</label>
              <input 
                id="precioInicial" 
                v-model.number="subasta.precioInicial" 
                type="number" 
                step="0.01" 
                min="0.01" 
                required
              >
              <small>Monto mínimo para iniciar la puja</small>
            </div>
            <div class="form-group half">
              <label for="precioFinal">Precio de Compra Inmediata (€)*</label>
              <input 
                id="precioFinal" 
                v-model.number="subasta.precioFinal" 
                type="number" 
                step="0.01" 
                min="0" 
                required
              >
              <small>Precio para comprar sin esperar al fin de la subasta (0 = sin opción de compra inmediata)</small>
            </div>
          </div>
          
          <!-- Duración de la subasta -->
          <div class="form-group">
            <label for="duracion">Duración de la subasta*</label>
            <select id="duracion" v-model="subasta.duracion" required>
              <option value="" disabled selected>Seleccione la duración</option>
              <option value="24">24 horas</option>
              <option value="48">2 días</option>
              <option value="72">3 días</option>
              <option value="168">7 días</option>
              <option value="336">14 días</option>
              <option value="personalizada">Personalizada</option>
            </select>
          </div>
          
          <!-- Duración personalizada (condicional) -->
          <div class="form-group" v-if="subasta.duracion === 'personalizada'">
            <div class="form-row">
              <div class="form-group half">
                <label for="fechaInicio">Fecha de inicio*</label>
                <input 
                  id="fechaInicio" 
                  v-model="subasta.fechaInicio" 
                  type="datetime-local" 
                  required
                  :min="fechaInicioMinima"
                >
              </div>
              <div class="form-group half">
                <label for="fechaFin">Fecha de finalización*</label>
                <input 
                  id="fechaFin" 
                  v-model="subasta.fechaFin" 
                  type="datetime-local" 
                  required
                  :min="fechaFinMinima"
                >
              </div>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="cancelar">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="!formularioValido || enviando">
              {{ enviando ? 'Publicando...' : 'Publicar Subasta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  // import AuctionService from '@/services/AuctionService';
  
  export default {
    name: 'AgregarProductoPage',
    data() {
      return {
        subasta: {
          titulo: '',
          categoria: '',
          descripcion: '',
          precioInicial: null,
          precioFinal: null,
          duracion: '',
          fechaInicio: this.formatearFechaParaInput(new Date()),
          fechaFin: '',
          estado: 'Activa'
        },
        categorias: [
          { id: 'electronics', nombre: 'Electrónica' },
          { id: 'fashion', nombre: 'Moda' },
          { id: 'home', nombre: 'Hogar' },
          { id: 'sports', nombre: 'Deportes' },
          { id: 'collectibles', nombre: 'Coleccionables' }
        ],
        archivosImagenes: [],
        vistaPreviaImagenes: [],
        enviando: false
      };
    },
    computed: {
      formularioValido() {
        return (
          this.subasta.titulo &&
          this.subasta.categoria &&
          this.subasta.descripcion &&
          this.subasta.precioInicial > 0 &&
          this.subasta.precioFinal >= 0 &&
          this.subasta.duracion &&
          this.vistaPreviaImagenes.length > 0
        );
      },
      fechaInicioMinima() {
        const ahora = new Date();
        return this.formatearFechaParaInput(ahora);
      },
      fechaFinMinima() {
        if (!this.subasta.fechaInicio) return this.fechaInicioMinima;
        
        const fechaInicio = new Date(this.subasta.fechaInicio);
        // Mínimo 1 hora después de la fecha de inicio
        fechaInicio.setHours(fechaInicio.getHours() + 1);
        return this.formatearFechaParaInput(fechaInicio);
      }
    },
    created() {
      // Inicializar fecha de fin por defecto (24h después)
      const fechaFin = new Date();
      fechaFin.setHours(fechaFin.getHours() + 24);
      this.subasta.fechaFin = this.formatearFechaParaInput(fechaFin);
      
      // Cargar categorías desde el API (simulado aquí)
      this.cargarCategorias();
    },
    methods: {
      formatearFechaParaInput(fecha) {
        const d = new Date(fecha);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      },
      
      async cargarCategorias() {
        try {
          // Aquí se haría una llamada al API para obtener las categorías
          // Por ahora usamos las hardcodeadas en data()
          // const categorias = await AuctionService.getCategorias();
          // this.categorias = categorias;
        } catch (error) {
          console.error('Error al cargar categorías:', error);
        }
      },
      
      cargarImagen(event) {
        const nuevosArchivos = Array.from(event.target.files);
        
        // Validar tamaño de archivos (max 5MB)
        const archivosValidos = nuevosArchivos.filter(archivo => archivo.size <= 5 * 1024 * 1024);
        
        if (archivosValidos.length < nuevosArchivos.length) {
          alert('Algunas imágenes exceden el tamaño máximo de 5MB y no serán añadidas');
        }
        
        // Limitar a máximo 5 imágenes
        const espaciosDisponibles = 5 - this.archivosImagenes.length;
        const archivosParaAgregar = archivosValidos.slice(0, espaciosDisponibles);
        
        if (archivosParaAgregar.length < archivosValidos.length) {
          alert('Solo se pueden añadir un máximo de 5 imágenes');
        }
        
        // Generar vistas previas y añadir archivos
        archivosParaAgregar.forEach(archivo => {
          this.archivosImagenes.push(archivo);
          
          const reader = new FileReader();
          reader.onload = e => {
            this.vistaPreviaImagenes.push(e.target.result);
          };
          reader.readAsDataURL(archivo);
        });
        
        // Resetear input para permitir seleccionar el mismo archivo de nuevo
        event.target.value = '';
      },
      
      eliminarImagen(index) {
        this.archivosImagenes.splice(index, 1);
        this.vistaPreviaImagenes.splice(index, 1);
      },
      
      cancelar() {
        if (confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los datos introducidos.')) {
          this.$router.go(-1);
        }
      },
      
      async crearSubasta() {
        if (!this.formularioValido) return;
        
        try {
          this.enviando = true;
          
          // Preparar datos de la subasta según el requisito RF03
          const datosSubasta = {
            ...this.subasta,
            vendedorId: 'user123', // Reemplazar con ID real del vendedor autenticado
            numeroPujas: 0
          };
          
          // Si no es duración personalizada, calcular fechas
          if (this.subasta.duracion !== 'personalizada') {
            const horasParaAgregar = parseInt(this.subasta.duracion);
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setHours(fechaFin.getHours() + horasParaAgregar);
            
            datosSubasta.fechaInicio = fechaInicio.toISOString();
            datosSubasta.fechaFin = fechaFin.toISOString();
          }
          
          // Primero subir imágenes y obtener URLs (simulado)
          const urlsImagenes = await this.subirImagenes();
          datosSubasta.imagenes = urlsImagenes;
          
          // Aquí se haría la llamada al API para crear la subasta
          // const subastaCreada = await AuctionService.crearSubasta(datosSubasta);
          
          // Simulamos la creación exitosa
          console.log('Datos de la subasta a crear:', datosSubasta);
          setTimeout(() => {
            alert('¡Subasta creada con éxito!');
            this.$router.push('/mis-subastas');
            this.enviando = false;
          }, 1500);
          
        } catch (error) {
          console.error('Error al crear la subasta:', error);
          alert('Error al crear la subasta. Por favor, inténtelo de nuevo.');
          this.enviando = false;
        }
      },
      
      async subirImagenes() {
        // Simulación de subida de imágenes (reemplazar por implementación real)
        return new Promise(resolve => {
          setTimeout(() => {
            // Simular URLs de imágenes subidas
            resolve(this.vistaPreviaImagenes.map((_, index) => 
              `https://api.mercabit.com/images/auction-${Date.now()}-${index}.jpg`
            ));
          }, 1000);
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .agregar-producto-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    margin-bottom: 24px;
  }
  
  .header h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .form-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .half {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="datetime-local"],
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  small {
    display: block;
    margin-top: 4px;
    color: #777;
    font-size: 12px;
  }
  
  .image-upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
  }
  
  .image-preview {
    width: 120px;
    height: 120px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ddd;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 120px;
    height: 120px;
  }
  
  .upload-btn {
    width: 100%;
    height: 100%;
    border: 2px dashed #ddd;
    background: #f9f9f9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #777;
    cursor: pointer;
  }
  
  .upload-btn-wrapper input[type=file] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    font-size: 16px;
  }
  
  .btn-primary {
    background-color: #3880ff;
    color: white;
  }
  
  .btn-primary:disabled {
    background-color: #93b8fd;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background-color: #f4f5f8;
    color: #333;
  }
  
  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }
    
    .form-container {
      padding: 16px;
    }
  }
  </style>