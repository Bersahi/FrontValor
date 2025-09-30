import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Search, Package, Truck, CheckCircle, Clock, MessageCircle, Settings,
  MapPin, User, FileText, DollarSign, History, Menu, Send, UserPlus,
  ArrowLeft, Calendar, CreditCard, Bot, Phone, Mail, Globe, Shield,
  Bell, Eye, Banknote, TrendingUp, BarChart3, Edit, LogOut, Lock,
  X, Zap, Brain, Timer, Navigation as RouteIcon, Calculator, PackageCheck, Plane,
  Building, ChevronDown, ChevronUp, Play, RefreshCw, Target, Activity,
  Cpu, Database, Lightbulb,
  Home
} from 'lucide-react';
import Navbar from './components/Navbar';
import Shipping from './pages/Shipping';
import Tracking from './pages/Tracking';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Agregar interfaces necesarias
interface Envio {
  id: string;
  descripcion: string;
  estado: string;
  fecha: string;
  destino: string;
  tipoServicio?: string;
  tipoVehiculo?: string;
  costo?: string;
  fechaCreacion?: string;
  estimacionActual?: {
    fechaEstimadaEntrega: string;
    tiempoEstimadoHoras: number;
    confianza: number;
  };
}

interface MensajeChat {
  id: number;
  remitente: 'packito' | 'usuario';
  mensaje: string;
  timestamp: string;
  tipo?: 'bienvenida' | 'error';
}

interface EstadisticasIA {
  rutasGeneradas: number;
  tiempoAhorrado: number;
  eficienciaPromedio: number;
  vehiculosOptimizados: number;
}

interface UltimaOptimizacion {
  fecha: string;
  rutasCreadas: number;
  tipo: 'manual' | 'automatica';
}

// Datos iniciales para los pedidos (se reemplazarán con datos reales)
const ordenesMockInicial = [
  {
    id: "PKG001",
    descripcion: "Orden #001",
    estado: "enviado",
    fecha: "18 Jul 2025",
    destino: "Barcelona, España"
  },
  {
    id: "PKG002",
    descripcion: "Orden #002",
    estado: "entregado",
    fecha: "15 Jul 2025",
    destino: "Ciudad de Guatemala, Guatemala"
  },
  {
    id: "PKG003",
    descripcion: "Orden #003",
    estado: "pendiente",
    fecha: "20 Jul 2025",
    destino: "Managua, Nicaragua"
  }
];

// Opciones del sidebar según rol
const opcionesSidebarCliente = [
  { id: 'perfil', label: 'Perfil', icon: User, requiereAuth: true },
  { id: 'realizar-envio', label: 'Realizar Envío', icon: Send, requiereAuth: false },
  { id: 'tarifas', label: 'Tarifas', icon: DollarSign, requiereAuth: false },
  { id: 'historial', label: 'Mis Envíos', icon: History, requiereAuth: true },
  { id: 'soporte', label: 'Soporte', icon: MessageCircle, requiereAuth: false },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin, requiereAuth: false },
  { id: 'configuracion', label: 'Configuración', icon: Settings, requiereAuth: true },
];

const opcionesSidebarAdmin = [
  { id: 'perfil', label: 'Perfil', icon: User, requiereAuth: true },
  { id: 'resumen', label: 'Resumen de Envíos', icon: FileText, requiereAuth: true },
  { id: 'ia-logistics', label: 'IA Logistics', icon: Brain, requiereAuth: true },
  { id: 'realizar-envio', label: 'Crear Envío', icon: Send, requiereAuth: false },
  { id: 'tarifas', label: 'Tarifas', icon: DollarSign, requiereAuth: false },
  { id: 'historial', label: 'Todos los Envíos', icon: History, requiereAuth: true },
  { id: 'soporte', label: 'Soporte', icon: MessageCircle, requiereAuth: false },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin, requiereAuth: false },
  { id: 'configuracion', label: 'Configuración', icon: Settings, requiereAuth: true },
];

const ubicacionesMock = [
  {
    id: 1,
    nombre: "Oficinas Centrales VALOR EXPress",
    direccion: "Chiquimulilla, Santa Rosa, Guatemala",
    coordenadas: "14.0833, -90.3833",
    telefono: "+502 2234 5678",
    horario: "Lun-Vie: 7:00-19:00, Sáb: 8:00-16:00",
    tipo: "sede_principal",
    descripcion: "Sede principal y centro de operaciones"
  },
  {
    id: 2,
    nombre: "Centro de Distribución Guatemala",
    direccion: "Zona 4, Ciudad de Guatemala",
    coordenadas: "14.6349, -90.5069",
    telefono: "+502 2234 5679",
    horario: "Lun-Vie: 8:00-18:00, Sáb: 9:00-14:00",
    tipo: "centro_distribucion",
    descripcion: "Principal centro de distribución metropolitano"
  },
  {
    id: 3,
    nombre: "Oficina Fronteriza Huehuetenango",
    direccion: "Huehuetenango, Guatemala (Frontera México)",
    coordenadas: "15.3197, -91.4678",
    telefono: "+502 2234 5680",
    horario: "Lun-Vie: 8:00-17:00, Sáb: 9:00-13:00",
    tipo: "oficina_fronteriza",
    descripcion: "Oficina especializada en envíos hacia México"
  },
  {
    id: 4,
    nombre: "Centro Logístico Ciudad de México",
    direccion: "Polanco, Ciudad de México",
    coordenadas: "19.4326, -99.1332",
    telefono: "+52 55 3456 7890",
    horario: "Lun-Dom: 24 horas",
    tipo: "centro_internacional",
    descripcion: "Hub internacional para México y Norteamérica"
  },
  {
    id: 5,
    nombre: "Punto de Recogida Managua",
    direccion: "Centro Comercial Managua, Nicaragua",
    coordenadas: "12.1364, -86.2514",
    telefono: "+505 2345 6789",
    horario: "Lun-Vie: 9:00-19:00, Sáb: 10:00-15:00",
    tipo: "punto_recogida",
    descripcion: "Punto de recogida y envío para Nicaragua"
  },
  {
    id: 6,
    nombre: "Oficina San José",
    direccion: "Avenida Central, San José, Costa Rica",
    coordenadas: "9.9281, -84.0907",
    telefono: "+506 2456 7890",
    horario: "Lun-Vie: 8:30-17:30",
    tipo: "oficina_regional",
    descripcion: "Oficina regional para Costa Rica"
  }
];

// Monedas de Centroamérica y México como predeterminadas
const monedasDisponibles = [
  { value: 'GTQ', label: 'GTQ (Q)', symbol: 'Q' },
  { value: 'MXN', label: 'MXN ($)', symbol: '$' },
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'PAB', label: 'PAB (B/.)', symbol: 'B/.' },
  { value: 'NIO', label: 'NIO (C$)', symbol: 'C$' },
  { value: 'HNL', label: 'HNL (L)', symbol: 'L' },
  { value: 'CRC', label: 'CRC (₡)', symbol: '₡' },
  { value: 'BZD', label: 'BZD (BZ$)', symbol: 'BZ$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
  { value: 'CHF', label: 'CHF (₣)', symbol: '₣' },
  { value: 'CNY', label: 'CNY (¥)', symbol: '¥' }
];

// Departamentos de Guatemala por región
const departamentosGuatemala = [
  // Región I - Metropolitana
  { value: 'Guatemala', label: 'Guatemala', region: 'Región I - Metropolitana' },
  { value: 'Escuintla', label: 'Escuintla', region: 'Región I - Metropolitana' },
  { value: 'Sacatepéquez', label: 'Sacatepéquez', region: 'Región I - Metropolitana' },
  { value: 'Chimaltenango', label: 'Chimaltenango', region: 'Región I - Metropolitana' },
  
  // Región II - Norte
  { value: 'Alta Verapaz', label: 'Alta Verapaz', region: 'Región II - Norte' },
  { value: 'Baja Verapaz', label: 'Baja Verapaz', region: 'Región II - Norte' },
  
  // Región III - Nororiente
  { value: 'Izabal', label: 'Izabal', region: 'Región III - Nororiente' },
  { value: 'Zacapa', label: 'Zacapa', region: 'Región III - Nororiente' },
  { value: 'Chiquimula', label: 'Chiquimula', region: 'Región III - Nororiente' },
  { value: 'Jalapa', label: 'Jalapa', region: 'Región III - Nororiente' },
  
  // Región IV - Suroriente
  { value: 'Santa Rosa', label: 'Santa Rosa', region: 'Región IV - Suroriente' },
  { value: 'El Progreso', label: 'El Progreso', region: 'Región IV - Suroriente' },
  
  // Región V - Central
  { value: 'Quetzaltenango', label: 'Quetzaltenango', region: 'Región V - Central' },
  { value: 'Totonicapán', label: 'Totonicapán', region: 'Región V - Central' },
  
  // Región VI - Suroccidente
  { value: 'Suchitepéquez', label: 'Suchitepéquez', region: 'Región VI - Suroccidente' },
  { value: 'Retalhuleu', label: 'Retalhuleu', region: 'Región VI - Suroccidente' },
  
  // Región VII - Noroccidente
  { value: 'Quiché', label: 'Quiché', region: 'Región VII - Noroccidente' },
  { value: 'Huehuetenango', label: 'Huehuetenango', region: 'Región VII - Noroccidente' },
  
  // Región VIII - Petén
  { value: 'Petén', label: 'Petén', region: 'Región VIII - Petén' },
  
  // San Marcos aparece en múltiples regiones según el contexto
  { value: 'San Marcos', label: 'San Marcos', region: 'Región V - Central' }
];

// Países disponibles
const paisesDisponibles = [
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'México', label: 'México' },
  { value: 'Nicaragua', label: 'Nicaragua' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Honduras', label: 'Honduras' },
  { value: 'El Salvador', label: 'El Salvador' },
  { value: 'Panamá', label: 'Panamá' },
  { value: 'Belice', label: 'Belice' },
  { value: 'España', label: 'España' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
  { value: 'Otro', label: 'Otro' }
];

// Función para determinar la región automáticamente
const determinarRegion = (departamento: string): string => {
  const dept = departamentosGuatemala.find(d => d.value === departamento);
  return dept ? dept.region : '';
};

const tarifasMock = [
  {
    id: 1,
    servicio: 'Estándar Nacional',
    descripcion: 'Entrega en 3-5 días hábiles dentro del país',
    precio: 'Q25.00',
    peso: 'Hasta 5kg',
    icono: Package
  },
  {
    id: 2,
    servicio: 'Express Nacional',
    descripcion: 'Entrega en 24-48 horas dentro del país',
    precio: 'Q45.00',
    peso: 'Hasta 5kg',
    icono: Truck
  },
  {
    id: 3,
    servicio: 'Urgente Nacional',
    descripcion: 'Entrega el mismo día en área metropolitana',
    precio: 'Q85.00',
    peso: 'Hasta 3kg',
    icono: Clock
  },
  {
    id: 4,
    servicio: 'Internacional Centroamérica',
    descripcion: 'Entrega en 5-7 días a países centroamericanos',
    precio: 'Q125.00',
    peso: 'Hasta 5kg',
    icono: Globe
  }
];

const historialMock = [
  {
    id: "PKG001",
    fecha: "18 Jul 2025",
    descripcion: "Orden #001",
    destino: "Barcelona, España",
    estado: "enviado",
    costo: "Q125.00",
    servicio: "Internacional"
  },
  {
    id: "PKG002",
    fecha: "15 Jul 2025",
    descripcion: "Orden #002",
    destino: "Ciudad de Guatemala",
    estado: "entregado",
    costo: "Q45.00",
    servicio: "Express Nacional"
  },
  {
    id: "PKG003",
    fecha: "20 Jul 2025",
    descripcion: "Orden #003",
    destino: "Managua, Nicaragua",
    estado: "pendiente",
    costo: "Q125.00",
    servicio: "Internacional"
  },
  {
    id: "PKG004",
    fecha: "12 Jul 2025",
    descripcion: "Orden #004",
    destino: "San José, Costa Rica",
    estado: "entregado",
    costo: "Q125.00",
    servicio: "Internacional"
  }
];

export default function App() {
  // Estados de autenticación
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<'cliente' | 'administrativo'>('cliente');
  const [usuarioActual, setUsuarioActual] = useState({
    nombre: '',
    email: '',
    rol: 'cliente' as 'cliente' | 'administrativo'
  });

  // Estados del formulario de login
  const [formularioLogin, setFormularioLogin] = useState({
    email: '',
    password: '',
    rol: 'cliente' as 'cliente' | 'administrativo'
  });

  // Estado para controlar el modal de login
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const [busqueda, setBusqueda] = useState('');
  const [ordenesReales, setOrdenesReales] = useState(ordenesMockInicial);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState(ordenesMockInicial);
  const [estadisticasDashboard, setEstadisticasDashboard] = useState({
    enviosEsteMes: 1234,
    rutasOptimizadas: 847,
    ahorroTiempo: 35,
    paisesServidos: 15
  });
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState('inicio');

  // Estados para el formulario de envío
  const [formularioEnvio, setFormularioEnvio] = useState({
    remitente: {
      nombre: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      municipio: '',
      departamento: '',
      pais: 'Guatemala',
      region: '',
      codigoPostal: ''
    },
    destinatario: {
      nombre: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      municipio: '',
      departamento: '',
      pais: 'Guatemala',
      region: '',
      codigoPostal: ''
    },
    paquete: {
      peso: '',
      dimensiones: '',
      valor: '',
      moneda: 'GTQ',
      descripcion: '',
      tipoServicio: ''
    }
  });

  // Estados para el perfil de usuario
  const [perfilUsuario, setPerfilUsuario] = useState({
    nombre: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    telefono: '+502 5555-1234',
    direccion: 'Zona 10, Ciudad de Guatemala',
    empresa: 'Comercial Guatemala S.A.',
    tipoCliente: 'Empresarial'
  });

  // Estados para configuración
  const [configuracion, setConfiguracion] = useState({
    notificacionesEmail: true,
    notificacionesSMS: true,
    notificacionesPush: false,
    idioma: 'es',
    monedaPredeterminada: 'GTQ',
    privacidadPerfil: 'privado'
  });

  // Estados para módulos de IA
  const [cargandoIA, setCargandoIA] = useState(false);
  const [rutasOptimizadasActuales, setRutasOptimizadasActuales] = useState(null);
  const [notificacionesEstimaciones, setNotificacionesEstimaciones] = useState<any[]>([]);
  const [estimacionConsulta, setEstimacionConsulta] = useState(null);
  
  // Estados para IA Logistics avanzado
  const [optimizacionEnProceso, setOptimizacionEnProceso] = useState(false);
  const [ultimaOptimizacion, setUltimaOptimizacion] = useState<UltimaOptimizacion | null>(null);
  const [estadisticasIA, setEstadisticasIA] = useState({
    rutasGeneradas: 0,
    tiempoAhorrado: 0,
    eficienciaPromedio: 0,
    vehiculosOptimizados: 0
  });

  // Estados para el chat con Packito
  const [mensajesChat, setMensajesChat] = useState<MensajeChat[]>([]);
  const [mensajeActual, setMensajeActual] = useState('');
  const [cargandoChat, setCargandoChat] = useState(false);
  const [chatIniciado, setChatIniciado] = useState(false);

  // Estados para la UI mejorada
  const [mostrarSearchPad, setMostrarSearchPad] = useState(false);
  const [mostrarNotificacionLogin, setMostrarNotificacionLogin] = useState(false);
  const [envioDetalle, setEnvioDetalle] = useState<Envio | null>(null);

  // Estados para popups de contacto
  const [mostrarPopupTelefono, setMostrarPopupTelefono] = useState(false);
  const [mostrarPopupEmail, setMostrarPopupEmail] = useState(false);

  // Estados para la página de rastreo
  const [envioRastreado, setEnvioRastreado] = useState<Envio | null>(null);
  const [cargandoRastreo, setCargandoRastreo] = useState(false);
  const [numeroRastreoActual, setNumeroRastreoActual] = useState('');
  interface HistorialEstado {
    estado: string;
    mensaje: string;
    timestamp: string;
    ubicacion: string;
  }
  const [historialEstados, setHistorialEstados] = useState<HistorialEstado[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de autenticación
    if (formularioLogin.email && formularioLogin.password) {
      setUsuarioActual({
        nombre: formularioLogin.rol === 'administrativo' ? 'Admin Usuario' : 'Juan Carlos Pérez',
        email: formularioLogin.email,
        rol: formularioLogin.rol
      });
      setRolUsuario(formularioLogin.rol);
      setEstaLogueado(true);
      setMostrarLogin(false);
      
      // Limpiar formulario
      setFormularioLogin({
        email: '',
        password: '',
        rol: 'cliente'
      });
    } else {
      alert('Por favor, complete todos los campos');
    }
  };

  const handleLogout = () => {
    setEstaLogueado(false);
    setUsuarioActual({ nombre: '', email: '', rol: 'cliente' });
    setRolUsuario('cliente');
    setPaginaActual('inicio');
    setOpcionSeleccionada('');
    setSidebarAbierto(false);
    limpiarBusqueda();
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setOrdenesFiltradas(ordenesReales);
  };

  // Función para manejar la creación de envíos con integración automática al módulo de IA
  const crearEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoIA(true);

    try {
      const envioData = {
        ...formularioEnvio,
        fechaCreacion: new Date().toISOString(),
        numeroRastreo: `PKG${Date.now().toString().slice(-6)}`
      };

      // Crear el envío primero
      console.log('📦 Creando nuevo envío:', envioData);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/crear-envio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(envioData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Envío creado exitosamente!\n\n🔢 Número de rastreo: ${data.envio.numeroRastreo}\n⏱️ Estimación inicial: ${data.envio.estimacionTiempo || 'Calculando...'}\n🚛 Vehículo asignado: ${data.envio.vehiculoOptimo || 'Auto-asignado'}\n🗺️ Región: ${data.envio.region || 'Determinada automáticamente'}`);
        
        // Limpiar formulario
        setFormularioEnvio({
          remitente: {
            nombre: '',
            telefono: '',
            direccion: '',
            ciudad: '',
            municipio: '',
            departamento: '',
            pais: 'Guatemala',
            region: '',
            codigoPostal: ''
          },
          destinatario: {
            nombre: '',
            telefono: '',
            direccion: '',
            ciudad: '',
            municipio: '',
            departamento: '',
            pais: 'Guatemala',
            region: '',
            codigoPostal: ''
          },
          paquete: {
            peso: '',
            dimensiones: '',
            valor: '',
            moneda: 'GTQ',
            descripcion: '',
            tipoServicio: ''
          }
        });

        // Actualizar datos tras crear envío
        await actualizarDatosTrasEnvio();
        
        // Actualizar la lista local inmediatamente con el nuevo envío
        const nuevoEnvio = {
          id: data.envio.numeroRastreo,
          descripcion: `Orden #${data.envio.numeroRastreo.replace('PKG', '')}`,
          estado: 'pendiente',
          fecha: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          destino: `${formularioEnvio.destinatario.ciudad}, ${formularioEnvio.destinatario.pais}`,
          tipoServicio: formularioEnvio.paquete.tipoServicio,
          tipoVehiculo: data.envio.tipoVehiculo,
          costo: data.envio.estimacionPreliminar ? `Q${(parseFloat(formularioEnvio.paquete.valor) * 0.1 + 25).toFixed(2)}` : 'Q25.00',
          fechaCreacion: new Date().toISOString()
        };

        // Agregar a la lista actual
        setOrdenesReales(prev => [nuevoEnvio, ...prev]);
        setOrdenesFiltradas(prev => [nuevoEnvio, ...prev]);

        // Si estamos en la página principal, navegar allí para ver el nuevo envío
        if (paginaActual === 'realizar-envio') {
          setTimeout(() => {
            setPaginaActual('inicio');
            console.log(`✅ Envío ${data.envio.numeroRastreo} creado y visible en historial`);
          }, 1000);
        }
      } else {
        alert('❌ Error al crear envío: ' + data.error);
      }
    } catch (error) {
      console.error('Error creando envío:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setCargandoIA(false);
    }
  };

  // Función para manejar cambios en departamento y actualizar región automáticamente
  const handleDepartamentoChange = (departamento: string, tipo: 'remitente' | 'destinatario') => {
    const region = determinarRegion(departamento);
    
    setFormularioEnvio(prev => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        departamento,
        region
      }
    }));
  };

  // Función para manejar cambios en país
  const handlePaisChange = (pais: string, tipo: 'remitente' | 'destinatario') => {
    setFormularioEnvio(prev => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        pais
      }
    }));
  };

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <CheckCircle className="h-4 w-4" />;
      case 'enviado':
        return <Truck className="h-4 w-4" />;
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'enviado':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Función para cargar datos iniciales
  const cargarDatosIniciales = async () => {
    console.log('🔄 Cargando datos iniciales...');
    
    await Promise.all([
      obtenerEnvios(),
      obtenerRutasOptimizadas(),
      obtenerNotificacionesEstimaciones(),
      obtenerEstadisticasIA()
    ]);
    
    console.log('✅ Carga inicial completada');
  };

  // Función para actualizar todos los datos tras crear un envío
  const actualizarDatosTrasEnvio = async () => {
    console.log('🔄 Actualizando datos del sistema tras crear envío...');
    
    // Actualizar estadísticas del dashboard primero
    const nuevasEstadisticas = {
      ...estadisticasDashboard,
      enviosEsteMes: estadisticasDashboard.enviosEsteMes + 1
    };
    setEstadisticasDashboard(nuevasEstadisticas);
    
    // Luego actualizar datos del servidor
    await Promise.all([
      obtenerEnvios(),
      obtenerRutasOptimizadas(),
      obtenerNotificacionesEstimaciones()
    ]);
  };

  // Función para obtener envíos desde el servidor
  const obtenerEnvios = async () => {
    try {
      console.log('🔄 Obteniendo envíos desde servidor...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/obtener-envios`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.envios) {
        setOrdenesReales(data.envios);
        setOrdenesFiltradas(data.envios);
        console.log(`✅ Cargados ${data.envios.length} envíos desde servidor`);
      } else {
        console.log('⚠️ No se encontraron envíos, usando datos de ejemplo');
        setOrdenesReales(ordenesMockInicial);
        setOrdenesFiltradas(ordenesMockInicial);
      }
    } catch (error) {
      console.error('❌ Error obteniendo envíos:', error);
      setOrdenesReales(ordenesMockInicial);
      setOrdenesFiltradas(ordenesMockInicial);
    }
  };

  const filtrarOrdenes = (termino: string) => {
    if (!termino) {
      setOrdenesFiltradas(ordenesReales);
      return;
    }

    const filtradas = ordenesReales.filter(orden =>
      orden.id.toLowerCase().includes(termino.toLowerCase()) ||
      orden.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
      orden.destino.toLowerCase().includes(termino.toLowerCase())
    );
    setOrdenesFiltradas(filtradas);
  };

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    filtrarOrdenes(valor);
  };

  // ============= NUEVA FUNCIONALIDAD DE RASTREO MEJORADA =============

  const manejarRastreo = async () => {
    if (busqueda.trim()) {
      setNumeroRastreoActual(busqueda.trim());
      setCargandoRastreo(true);
      setPaginaActual('rastreo');
      
      try {
        // Consultar la estimación del envío
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/consultar-estimacion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ numeroRastreo: busqueda.trim() })
        });

        const data = await response.json();
        
        if (data.success && data.estimacion) {
          setEnvioRastreado(data.estimacion);
          await obtenerHistorialEstados(busqueda.trim());
        } else {
          setEnvioRastreado(null);
          setHistorialEstados([]);
        }
      } catch (error) {
        console.error('Error consultando rastreo:', error);
        setEnvioRastreado(null);
        setHistorialEstados([]);
      } finally {
        setCargandoRastreo(false);
      }
    } else {
      alert('Por favor, ingresa un número de rastreo');
    }
  };

  // Función para obtener historial de estados del envío
  const obtenerHistorialEstados = async (numeroRastreo: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/obtener-notificaciones/${numeroRastreo}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();
      
      if (data.success && data.historial) {
        setHistorialEstados(data.historial);
      } else {
        setHistorialEstados(generarHistorialSimulado(numeroRastreo));
      }
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      setHistorialEstados(generarHistorialSimulado(numeroRastreo));
    }
  };

  // Generar historial simulado para demostración
  const generarHistorialSimulado = (numeroRastreo: string) => {
    const ahora = new Date();
    return [
      {
        estado: 'creado',
        mensaje: 'Envío creado y registrado en el sistema',
        timestamp: new Date(ahora.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        ubicacion: 'Centro de Distribución Guatemala'
      },
      {
        estado: 'recolectado',
        mensaje: 'Paquete recolectado del remitente',
        timestamp: new Date(ahora.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        ubicacion: 'Centro de Distribución Guatemala'
      },
      {
        estado: 'en_transito',
        mensaje: 'Paquete en tránsito hacia destino',
        timestamp: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        ubicacion: 'En ruta'
      }
    ];
  };

  // ============= FUNCIONES PARA DIAGRAMA DE ESTADOS =============

  const obtenerIconoEstadoRastreo = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'creado':
      case 'pendiente':
        return <Package className="h-6 w-6" />;
      case 'recolectado':
        return <Building className="h-6 w-6" />;
      case 'en_transito':
      case 'enviado':
        return <Truck className="h-6 w-6" />;
      case 'en_reparto':
        return <MapPin className="h-6 w-6" />;
      case 'entregado':
        return <CheckCircle className="h-6 w-6" />;
      case 'optimizado':
        return <RouteIcon className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  const obtenerColorEstadoRastreo = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'creado':
      case 'pendiente':
        return 'text-gray-600 bg-gray-100';
      case 'recolectado':
        return 'text-blue-600 bg-blue-100';
      case 'en_transito':
      case 'enviado':
      case 'optimizado':
        return 'text-blue-600 bg-blue-100';
      case 'en_reparto':
        return 'text-orange-600 bg-orange-100';
      case 'entregado':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const obtenerNombreEstado = (estado: string) => {
    const nombres = {
      'creado': 'Creado',
      'pendiente': 'Pendiente',
      'recolectado': 'Recolectado',
      'en_transito': 'En Tránsito',
      'enviado': 'Enviado',
      'en_reparto': 'En Reparto',
      'entregado': 'Entregado',
      'optimizado': 'Ruta Optimizada'
    };
    return nombres[estado.toLowerCase() as keyof typeof nombres] || estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const estaEstadoActivo = (estado: string, estadoActual: string) => {
    const ordenEstados = ['creado', 'recolectado', 'en_transito', 'en_reparto', 'entregado'];
    const estadoActualLower = estadoActual.toLowerCase();
    const estadoComparar = estado.toLowerCase();
    
    if (estadoActualLower === 'optimizado') {
      return estadoComparar === 'en_transito' || estadoComparar === 'creado' || estadoComparar === 'recolectado';
    }
    
    if (estadoActualLower === 'enviado') {
      return estadoComparar === 'en_transito' || estadoComparar === 'creado' || estadoComparar === 'recolectado';
    }
    
    const indiceActual = ordenEstados.indexOf(estadoActualLower);
    const indiceComparar = ordenEstados.indexOf(estadoComparar);
    
    return indiceComparar <= indiceActual && indiceActual !== -1;
  };

  const seleccionarOpcion = (opcion: string) => {
    setOpcionSeleccionada(opcion);
    
    // Obtener opciones según rol
    const opcionesActuales = rolUsuario === 'administrativo' ? opcionesSidebarAdmin : opcionesSidebarCliente;
    const opcionActual = opcionesActuales.find(opt => opt.id === opcion);
    
    // Verificar si requiere autenticación
    if (opcionActual?.requiereAuth && !estaLogueado) {
      setMostrarNotificacionLogin(true);
      setTimeout(() => setMostrarNotificacionLogin(false), 5000);
      return;
    }
    
    setPaginaActual(opcion);
    setSidebarAbierto(false);
    
    if (opcion === 'inicio') {
      limpiarBusqueda();
      setEnvioDetalle(null);
    }
  };

  const volverAInicio = () => {
    setPaginaActual('inicio');
    setOpcionSeleccionada('');
    setEnvioRastreado(null);
    setHistorialEstados([]);
    setNumeroRastreoActual('');
    setEnvioDetalle(null);
    limpiarBusqueda();
  };

  const manejarRastreoRapido = () => {
    if (mostrarSearchPad) {
      // Si ya está abierto, ejecutar rastreo
      manejarRastreo();
    } else {
      // Si está cerrado, abrir el search pad
      setMostrarSearchPad(true);
    }
  };

  const verDetalleEnvio = (envio: Envio) => {
    setEnvioDetalle(envio);
    setPaginaActual('detalle-envio');
  };

  const volverAtras = () => {
    if (paginaActual === 'realizar-envio') {
      setPaginaActual('inicio');
    } else {
      volverAInicio();
    }
  };

  // Función para obtener rutas optimizadas automáticas
  const obtenerRutasOptimizadas = async () => {
    try {
      console.log('🔄 Obteniendo rutas optimizadas...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/rutas-optimizadas`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRutasOptimizadasActuales(data.optimizacion);
        console.log('✅ Rutas optimizadas actualizadas');
      } else {
        console.log('⚠️ No se encontraron rutas optimizadas');
        setRutasOptimizadasActuales(null);
      }
    } catch (error) {
      console.error('❌ Error obteniendo rutas optimizadas:', error);
      setRutasOptimizadasActuales(null);
    }
  };

  // Función para obtener notificaciones de estimaciones
  const obtenerNotificacionesEstimaciones = async () => {
    try {
      console.log('🔄 Obteniendo notificaciones de estimaciones...');
      
      // Obtener tanto notificaciones normales como de IA
      const [notificacionesRegulares, notificacionesIA] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/notificaciones-estimaciones`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }).then(r => r.json()).catch(() => ({ success: false, notificaciones: [] })),
        
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/notificaciones-ia`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }).then(r => r.json()).catch(() => ({ success: false, notificaciones: [] }))
      ]);
      
      // Combinar notificaciones
      const notificacionesCombinadas = [
        ...(notificacionesRegulares.success ? notificacionesRegulares.notificaciones || [] : []),
        ...(notificacionesIA.success ? notificacionesIA.notificaciones || [] : [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setNotificacionesEstimaciones(notificacionesCombinadas);
      console.log(`✅ Cargadas ${notificacionesCombinadas.length} notificaciones (${notificacionesRegulares.notificaciones?.length || 0} regulares + ${notificacionesIA.notificaciones?.length || 0} IA)`);
      
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones de estimaciones:', error);
      setNotificacionesEstimaciones([]);
    }
  };

  // ============= FUNCIONES AVANZADAS DE IA LOGISTICS =============

  // Optimizar rutas manualmente (botón de acción rápida)
  const optimizarRutasManualmente = async () => {
    setOptimizacionEnProceso(true);
    try {
      console.log('🚚 Iniciando optimización manual de rutas...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/forzar-optimizacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar datos tras optimización
        await Promise.all([
          obtenerRutasOptimizadas(),
          obtenerNotificacionesEstimaciones(),
          obtenerEnvios()
        ]);
        
        setUltimaOptimizacion({
          fecha: new Date().toISOString(),
          rutasCreadas: data.rutasCreadas || 0,
          tipo: 'manual'
        });
        
        alert(`✅ Optimización completada!\n\n🚛 Rutas creadas: ${data.rutasCreadas || 0}\n⚡ Los tiempos de entrega han sido recalculados\n📱 Se han enviado notificaciones a los clientes`);
      } else {
        alert('❌ Error en la optimización: ' + data.error);
      }
    } catch (error) {
      console.error('Error en optimización manual:', error);
      alert('Error conectando con el servidor de IA');
    } finally {
      setOptimizacionEnProceso(false);
    }
  };

  // Calcular estimación de tiempo para consulta específica
  const calcularEstimacionPersonalizada = async (
    origen: any,
    destino: any,
    tipoEnvio: string,
    peso: string
  ) => {
    setCargandoIA(true);
    try {
      console.log('⏱️ Calculando estimación personalizada...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/calcular-tiempo-entrega`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          origen: { lat: 14.6349, lng: -90.5069 }, // Guatemala por defecto
          destino: { lat: 12.1364, lng: -86.2514 }, // Nicaragua por defecto
          tipoEnvio,
          peso: parseFloat(peso),
          condicionesEspeciales: { clima: 'despejado' }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setEstimacionConsulta(data.prediccion);
        return data.prediccion;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error calculando estimación:', error);
      alert('Error calculando estimación: ' + (error instanceof Error ? error.message : String(error)));
      return null;
    } finally {
      setCargandoIA(false);
    }
  };

  // Obtener estadísticas avanzadas de IA
  const obtenerEstadisticasIA = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/estadisticas-ia`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEstadisticasIA({
          rutasGeneradas: data.estadisticas.rutasOptimizadas || 0,
          tiempoAhorrado: estadisticasDashboard.ahorroTiempo || 35,
          eficienciaPromedio: 92,
          vehiculosOptimizados: data.estadisticas.rutasOptimizadas * 1.5 || 5
        });
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas IA:', error);
    }
  };

  // Generar reporte de rendimiento
  const generarReporteRendimiento = async () => {
    setCargandoIA(true);
    try {
      console.log('📊 Generando reporte completo de rendimiento...');
      
      // Obtener datos reales del sistema
      const [conductoresData, enviosPendientesData, rutasActivasData] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/conductores-disponibles`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }).then(r => r.json()),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/envios-pendientes-agrupacion`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }).then(r => r.json()),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/rutas-activas`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }).then(r => r.json())
      ]);
      
      const reporte = {
        periodo: 'Últimos 30 días',
        timestamp: new Date().toLocaleString('es-ES'),
        metricas: {
          rutasOptimizadas: estadisticasIA.rutasGeneradas,
          tiempoAhorrado: `${estadisticasIA.tiempoAhorrado}%`,
          eficiencia: `${estadisticasIA.eficienciaPromedio}%`,
          conductoresDisponibles: conductoresData.success ? conductoresData.conductores.disponibles : 8,
          enviosPendientes: enviosPendientesData.success ? enviosPendientesData.analisis.totalEnviosPendientes : 0,
          rutasActivas: rutasActivasData.success ? rutasActivasData.total : 0,
          satisfaccionCliente: '94%',
          reduccionCostos: '22%'
        },
        sistemasIA: {
          agrupacionInteligente: 'Activo',
          asignacionConductores: 'Automática',
          optimizacionRutas: 'IA v2.1',
          notificacionesTiempoReal: 'Habilitadas',
          ventanasOperacion: 'Configuradas'
        },
        recomendaciones: [
          'Sistema funcionando óptimamente con agrupación automática de 5+ envíos',
          'Conductores asignados inteligentemente por experiencia y rating',
          'Ventanas de operación respetadas según tipo de servicio',
          'Notificaciones IA enviadas automáticamente a clientes',
          'Estimaciones optimizadas en tiempo real con 90%+ de precisión'
        ]
      };
      
      alert(`🤖 Reporte de Rendimiento IA Logistics\n\n📈 Período: ${reporte.periodo}\n🕐 Generado: ${reporte.timestamp}\n\n📊 MÉTRICAS PRINCIPALES:\n🚛 Rutas optimizadas: ${reporte.metricas.rutasOptimizadas}\n⚡ Tiempo ahorrado: ${reporte.metricas.tiempoAhorrado}\n🎯 Eficiencia: ${reporte.metricas.eficiencia}\n👥 Conductores disponibles: ${reporte.metricas.conductoresDisponibles}\n📦 Envíos pendientes: ${reporte.metricas.enviosPendientes}\n🛣️ Rutas activas: ${reporte.metricas.rutasActivas}\n\n🤖 SISTEMAS IA:\n✅ ${reporte.sistemasIA.agrupacionInteligente} - Agrupación inteligente\n✅ ${reporte.sistemasIA.asignacionConductores} - Asignación conductores\n✅ ${reporte.sistemasIA.optimizacionRutas} - Optimización rutas\n✅ ${reporte.sistemasIA.notificacionesTiempoReal} - Notificaciones tiempo real\n\n💡 ESTADO: Sistema IA funcionando perfectamente`);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar reporte. Verifique la conexión con el servidor.');
    } finally {
      setCargandoIA(false);
    }
  };

  // Simular proceso completo de prueba
  const simularProcesoCompleto = async () => {
    setCargandoIA(true);
    try {
      console.log('🧪 Iniciando simulación completa del proceso...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/simular-proceso-completo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`🎉 Simulación Completa del Proceso IA\n\n✅ SIMULACIÓN EXITOSA\n\n📊 RESULTADOS:\n📦 Envíos procesados: ${data.reporte.resultados.enviosProcesados}\n🛣️ Rutas creadas: ${data.reporte.resultados.rutasCreadas}\n👥 Conductores asignados: ${data.reporte.resultados.conductoresAsignados}\n⏱️ Tiempo: ${data.reporte.resultados.tiempoSimulacion}\n\n🔄 PASOS EJECUTADOS:\n${data.reporte.pasosSeguidos.join('\n')}\n\n🎯 El sistema IA está funcionando perfectamente!`);
        
        // Actualizar datos tras simulación
        await Promise.all([
          obtenerEnvios(),
          obtenerRutasOptimizadas(),
          obtenerNotificacionesEstimaciones(),
          obtenerEstadisticasIA()
        ]);
      } else {
        alert('❌ Error en la simulación: ' + data.error);
      }
    } catch (error) {
      console.error('Error en simulación:', error);
      alert('Error al conectar con el servidor para la simulación');
    } finally {
      setCargandoIA(false);
    }
  };

  // ============= FUNCIONES DEL CHAT CON PACKITO MEJORADO =============

  const iniciarChat = () => {
    const mensajeBienvenida = {
      id: Date.now(),
      remitente: 'packito',
      mensaje: '¡Hola! 👋 Soy Packito, tu asistente virtual de VALOR EXPress. Estoy aquí para ayudarte con cualquier consulta sobre tus envíos.\n\n¿En qué puedo ayudarte hoy? Puedo asistirte con:\n\n📦 Rastreo de paquetes\n📋 Estado de envíos\n💰 Consulta de tarifas\n🚨 Reportar disputas o problemas\n📍 Ubicaciones de nuestras oficinas\n\n¡Solo escribe tu consulta y te ayudo de inmediato!',
      timestamp: new Date().toISOString(),
      tipo: 'bienvenida'
    };

    setMensajesChat([mensajeBienvenida]);
    setChatIniciado(true);
    setPaginaActual('iniciar-chat');
  };

  const procesarMensajeUsuario = async (mensaje: string) => {
    if (!mensaje.trim()) return;

    const mensajeUsuario = {
      id: Date.now(),
      remitente: 'usuario',
      mensaje: mensaje.trim(),
      timestamp: new Date().toISOString()
    };

    setMensajesChat(prev => [...prev, mensajeUsuario]);
    setMensajeActual('');
    setCargandoChat(true);

    try {
      const respuesta = await generarRespuestaPackito(mensaje.trim());
      
      setTimeout(() => {
        const mensajePackito = {
          id: Date.now() + 1,
          remitente: 'packito',
          mensaje: respuesta,
          timestamp: new Date().toISOString()
        };

        setMensajesChat(prev => [...prev, mensajePackito]);
        setCargandoChat(false);
      }, 1500);

    } catch (error) {
      console.error('Error procesando mensaje:', error);
      
      const mensajeError = {
        id: Date.now() + 1,
        remitente: 'packito',
        mensaje: '¡Ups! 😅 Parece que tengo un pequeño problema técnico. Por favor, intenta de nuevo en un momento o contacta a nuestro equipo de soporte humano al +502 2234 5678.',
        timestamp: new Date().toISOString(),
        tipo: 'error'
      };

      setTimeout(() => {
        setMensajesChat(prev => [...prev, mensajeError]);
        setCargandoChat(false);
      }, 1000);
    }
  };

  // Función para iniciar chat con pregunta específica
  const iniciarChatConPregunta = (pregunta: string) => {
    const mensajeBienvenida: MensajeChat = {
      id: Date.now(),
      remitente: 'packito',
      mensaje: '¡Hola! 👋 Veo que vienes desde nuestras preguntas frecuentes. Te voy a ayudar con tu consulta de inmediato.',
      timestamp: new Date().toISOString(),
      tipo: 'bienvenida'
    };

    setMensajesChat([mensajeBienvenida]);
    setChatIniciado(true);
    setPaginaActual('iniciar-chat');
    
    setTimeout(() => {
      procesarMensajeUsuario(pregunta);
    }, 1500);
  };

  // Generar respuesta inteligente de Packito basada en el mensaje del usuario
  const generarRespuestaPackito = async (mensaje: string): Promise<string> => {
    const mensajeLower = mensaje.toLowerCase();

    // 1. RASTREO DE PAQUETES
    if (mensajeLower.includes('rastreo') || mensajeLower.includes('trackear') || 
        mensajeLower.includes('seguimiento') || mensajeLower.includes('pkg') ||
        mensajeLower.includes('donde esta') || mensajeLower.includes('ubicación')) {
      
      const numeroRastreo = extraerNumeroRastreo(mensaje);
      
      if (numeroRastreo) {
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/consultar-estimacion`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ numeroRastreo })
          });

          const data = await response.json();
          
          if (data.success && data.estimacion) {
            const est = data.estimacion;
            const fechaEntrega = new Date(est.estimacionActual.fechaEstimadaEntrega).toLocaleString('es-ES');
            
            return `📦 ¡Encontré tu paquete **${numeroRastreo}**!\n\n**Estado actual:** ${est.estado.charAt(0).toUpperCase() + est.estado.slice(1)}\n**Destino:** ${est.destino}\n**Servicio:** ${est.tipoServicio}\n**Vehículo:** ${est.tipoVehiculo}\n\n⏰ **Estimación de entrega:**\n${fechaEntrega}\n(Tiempo restante: ${est.estimacionActual.tiempoEstimadoHoras} horas)\n\n✅ **Confianza:** ${est.estimacionActual.confianza}% de precisión\n\n¿Necesitas más información sobre este envío o tienes alguna otra consulta?`;
          } else {
            return `🔍 No pude encontrar el paquete **${numeroRastreo}** en nuestro sistema.\n\n📋 **Verifica que:**\n• El número esté correctamente escrito\n• Sea un envío de VALOR EXPress\n• No tenga más de 90 días de antigüedad\n\n¿Podrías verificar el número y volver a intentarlo? También puedes intentar con otro formato como PKG001, PKG002, etc.`;
          }
        } catch (error) {
          return `❌ Tuve un problema consultando nuestro sistema de rastreo.\n\nPor favor, intenta de nuevo en unos momentos o puedes rastrear tu paquete directamente en nuestra página principal.\n\n¿Hay algo más en lo que pueda ayudarte?`;
        }
      } else {
        return `🔍 Para rastrear tu paquete necesito el **número de rastreo**.\n\n📝 **Formatos válidos:**\n• PKG001, PKG002, etc.\n• También números como 123456\n\n**Ejemplo:** "Rastrear PKG001" o "¿Dónde está mi paquete PKG123?"\n\n¡Compárteme el número y te ayudo de inmediato! 📦`;
      }
    }

    // 2. CONSULTA DE TARIFAS
    if (mensajeLower.includes('tarifa') || mensajeLower.includes('precio') || 
        mensajeLower.includes('costo') || mensajeLower.includes('cuánto cuesta') ||
        mensajeLower.includes('cuanto vale') || mensajeLower.includes('cuanto cuesta')) {
      
      let respuestaTarifas = `💰 **Nuestras Tarifas de Envío:**\n\n`;
      
      tarifasMock.forEach(tarifa => {
        respuestaTarifas += `**${tarifa.servicio}** - ${tarifa.precio}\n`;
        respuestaTarifas += `• ${tarifa.descripcion}\n`;
        respuestaTarifas += `• Peso: ${tarifa.peso}\n\n`;
      });

      respuestaTarifas += `📍 **Notas importantes:**\n`;
      respuestaTarifas += `• Precios en Quetzales (GTQ)\n`;
      respuestaTarifas += `• Tarifas pueden variar según destino\n`;
      respuestaTarifas += `• Consulta tarifas exactas al crear tu envío\n\n`;
      respuestaTarifas += `¿Te gustaría crear un envío o necesitas información específica sobre algún servicio?`;

      return respuestaTarifas;
    }

    // 3. ESTADO DE ENVÍOS GENERALES
    if (mensajeLower.includes('estado') || mensajeLower.includes('mis envios') || 
        mensajeLower.includes('historial') || mensajeLower.includes('pedidos')) {
      
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-758edb6a/envios-recientes?limit=5`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });

        const data = await response.json();
        
        if (data.success && data.envios.length > 0) {
          let respuesta = `📦 **Tus envíos más recientes:**\n\n`;
          
          data.envios.forEach((envio, index) => {
            respuesta += `${index + 1}. **${envio.id}**\n`;
            respuesta += `   📍 ${envio.destino}\n`;
            respuesta += `   📊 Estado: ${envio.estado}\n`;
            respuesta += `   📅 ${envio.fecha}\n\n`;
          });

          respuesta += `¿Te gustaría ver detalles específicos de algún envío? Solo menciona el número de rastreo.`;
          return respuesta;
        } else {
          return `📭 No encontré envíos recientes en el sistema.\n\n¿Te gustaría:\n• Crear un nuevo envío\n• Consultar con un número de rastreo específico\n• Contactar a soporte para revisar tu cuenta?`;
        }
      } catch (error) {
        return `❌ No pude acceder a la información de envíos en este momento.\n\nPuedes consultar tus envíos directamente en la página principal o contactar a soporte.\n\n¿Hay algo más en lo que pueda ayudarte?`;
      }
    }

    // 4. DISPUTAS Y PROBLEMAS
    if (mensajeLower.includes('disputa') || mensajeLower.includes('problema') || 
        mensajeLower.includes('reclamo') || mensajeLower.includes('queja') ||
        mensajeLower.includes('perdido') || mensajeLower.includes('dañado') ||
        mensajeLower.includes('retraso') || mensajeLower.includes('tardó')) {
      
      return `🚨 **Centro de Resolución de Disputas**\n\nLamento que hayas tenido un inconveniente. Estoy aquí para ayudarte.\n\n📋 **Tipos de problemas que podemos resolver:**\n• Paquete perdido o extraviado\n• Entrega tardía o retrasada\n• Paquete dañado\n• Dirección incorrecta\n• Problemas de facturación\n\n🔧 **Para procesar tu disputa necesito:**\n• Número de rastreo del envío\n• Descripción detallada del problema\n• Fotos (si hay daños físicos)\n\n**Opciones de contacto inmediato:**\n📞 Soporte urgente: +502 2234 5678\n📧 Email: disputas@valorexpress.com\n\n¿Podrías contarme más detalles sobre el problema que experimentaste?`;
    }

    // 5. CAMBIOS DE DIRECCIÓN Y MODIFICACIONES
    if (mensajeLower.includes('cambiar dirección') || mensajeLower.includes('modificar envío') ||
        mensajeLower.includes('cambiar la dirección') || mensajeLower.includes('modificar') ||
        mensajeLower.includes('cambio de dirección')) {
      
      return `📍 **Cambio de Dirección de Entrega**\n\n✅ **¡Sí es posible cambiar la dirección!**\n\n📋 **Condiciones:**\n• El paquete debe estar aún en nuestro centro de distribución\n• No debe haber salido en ruta de entrega\n• El cambio debe ser en la misma ciudad/zona\n\n🚨 **Para solicitar el cambio:**\n1. Proporciona tu número de rastreo\n2. Indica la nueva dirección completa\n3. Confirma tu identidad con los datos del remitente\n\n⏰ **Importante:**\n• Sin costo adicional si se solicita antes de 2 horas de creado el envío\n• Costo adicional de Q15 después de ese tiempo\n• No es posible una vez que el paquete salió del centro\n\n¿Tienes un envío específico que necesitas modificar? Compárteme el número de rastreo y te ayudo a verificar si es posible el cambio.`;
    }

    // 6. TIEMPOS DE ENTREGA ESPECÍFICO
    if (mensajeLower.includes('cuánto tarda') || mensajeLower.includes('tiempo de entrega') ||
        mensajeLower.includes('cuanto tarda') || mensajeLower.includes('cuando llega') ||
        mensajeLower.includes('tiempos de entrega')) {
      
      return `⏰ **Tiempos de Entrega por Servicio**\n\n🏃 **Urgente Nacional** - Mismo día\n• Área metropolitana de Guatemala\n• Recolección antes de 2:00 PM\n• Entrega antes de 6:00 PM\n• Costo: Q85.00\n\n⚡ **Express Nacional** - 24-48 horas\n• Todo el territorio nacional\n• Entrega garantizada en 2 días máximo\n• Ideal para documentos y paquetes importantes\n• Costo: Q45.00\n\n📦 **Estándar Nacional** - 3-5 días hábiles\n• Todo el territorio nacional\n• Más económico para envíos regulares\n• Perfecto para comercio electrónico\n• Costo: Q25.00\n\n🌎 **Internacional Centroamérica** - 5-7 días\n• Nicaragua, Costa Rica, Honduras, El Salvador, Panamá\n• Incluye gestión aduanera\n• Costo: Q125.00\n\n📋 **Factores que pueden afectar el tiempo:**\n• Condiciones climáticas adversas\n• Congestión de tráfico en ciudades\n• Procesos aduanales (envíos internacionales)\n• Direcciones de difícil acceso\n\n¿Necesitas una estimación específica para tu envío?`;
    }

    // 7. UBICACIONES
    if (mensajeLower.includes('ubicación') || mensajeLower.includes('oficina') || 
        mensajeLower.includes('donde están') || mensajeLower.includes('sucursal') ||
        mensajeLower.includes('dirección')) {
      
      let respuestaUbicaciones = `📍 **Red de Ubicaciones VALOR EXPress:**\n\n`;
      
      // Oficina principal primero
      const oficinaPrincipal = ubicacionesMock.find(u => u.tipo === 'sede_principal');
      if (oficinaPrincipal) {
        respuestaUbicaciones += `🏢 **OFICINA PRINCIPAL**\n`;
        respuestaUbicaciones += `**${oficinaPrincipal.nombre}**\n`;
        respuestaUbicaciones += `📍 ${oficinaPrincipal.direccion}\n`;
        respuestaUbicaciones += `📞 ${oficinaPrincipal.telefono}\n`;
        respuestaUbicaciones += `🕐 ${oficinaPrincipal.horario}\n\n`;
      }
      
      // Otras ubicaciones
      respuestaUbicaciones += `🌐 **RED DE DISTRIBUCIÓN:**\n\n`;
      ubicacionesMock.filter(u => u.tipo !== 'sede_principal').forEach((ubicacion, index) => {
        const icono = ubicacion.tipo === 'oficina_fronteriza' ? '🚪' : 
                     ubicacion.tipo === 'centro_internacional' ? '✈️' : 
                     ubicacion.tipo === 'centro_distribucion' ? '🚛' : '📦';
        
        respuestaUbicaciones += `${icono} **${ubicacion.nombre}**\n`;
        respuestaUbicaciones += `📍 ${ubicacion.direccion}\n`;
        respuestaUbicaciones += `📞 ${ubicacion.telefono}\n`;
        respuestaUbicaciones += `🕐 ${ubicacion.horario}\n`;
        if (ubicacion.descripcion) {
          respuestaUbicaciones += `ℹ️ ${ubicacion.descripcion}\n`;
        }
        respuestaUbicaciones += `\n`;
      });

      respuestaUbicaciones += `📋 **COBERTURA ESPECIAL:**\n`;
      respuestaUbicaciones += `• 🇬🇹 **Guatemala:** Cobertura nacional completa desde Chiquimulilla\n`;
      respuestaUbicaciones += `• 🇲🇽 **México:** Acceso directo desde Huehuetenango (frontera)\n`;
      respuestaUbicaciones += `• 🌎 **Centroamérica:** Red completa Nicaragua, Costa Rica, Honduras, El Salvador\n\n`;
      respuestaUbicaciones += `¿Necesitas información específica sobre alguna ubicación o servicios en tu región?`;
      
      return respuestaUbicaciones;
    }

    // 8. SALUDO O CONSULTA GENERAL
    if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || 
        mensajeLower.includes('ayuda') || mensajeLower.includes('información') ||
        mensajeLower.length < 10) {
      
      return `¡Hola! 😊 ¡Es un gusto poder ayudarte!\n\n🎯 **¿En qué puedo asistirte específicamente?**\n\n📦 **Rastreo:** "Rastrear PKG001" o "¿Dónde está mi paquete?"\n💰 **Tarifas:** "¿Cuánto cuesta enviar a Costa Rica?"\n📊 **Estado:** "Mis envíos recientes" o "Estado de mis pedidos"\n🚨 **Problemas:** "Tengo un problema con mi envío"\n📍 **Ubicaciones:** "¿Dónde están sus oficinas?"\n\n¡Solo escribe tu consulta y te ayudo al instante! 🚀`;
    }

    // 9. RESPUESTA POR DEFECTO
    return `🤔 Entiendo que necesitas ayuda, pero no estoy completamente seguro de lo que necesitas.\n\n**Algunas sugerencias:**\n\n📦 Si quieres **rastrear** un paquete: "Rastrear [número]"\n💰 Para **tarifas**: "¿Cuánto cuesta enviar a [destino]?"\n📊 Para **estado** de envíos: "Mis envíos" o "Estado de pedidos"\n🚨 Para **problemas**: "Tengo un problema con mi envío"\n📍 Para **cambios**: "¿Puedo cambiar la dirección?"\n⏰ Para **tiempos**: "¿Cuánto tarda un envío?"\n\n¿Podrías ser más específico sobre lo que necesitas? ¡Estoy aquí para ayudarte! 😊`;
  };

  // Extraer número de rastreo del mensaje del usuario
  const extraerNumeroRastreo = (mensaje: string): string | null => {
    // Buscar patrones como PKG001, PKG123, etc.
    const patronPKG = /PKG\d+/i;
    const matchPKG = mensaje.match(patronPKG);
    if (matchPKG) return matchPKG[0].toUpperCase();
    
    // Buscar números de 6 dígitos o más
    const patronNumero = /\b\d{6,}\b/;
    const matchNumero = mensaje.match(patronNumero);
    if (matchNumero) return `PKG${matchNumero[0]}`;
    
    // Buscar números de 3-5 dígitos después de PKG o similar
    const patronCorto = /(?:PKG|pkg|paquete|envio|orden|rastreo|tracking)\s*[#:\-]?\s*(\d{3,5})/i;
    const matchCorto = mensaje.match(patronCorto);
    if (matchCorto) return `PKG${matchCorto[1].padStart(6, '0')}`;
    
    return null;
  };

  const enviarMensajeChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensajeActual.trim()) {
      procesarMensajeUsuario(mensajeActual);
    }
  };

  // Hook para cargar datos al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // ============= RENDERIZADO PRINCIPAL =============

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/shipping" element={<Shipping />} />
        </Routes>
      </main>
    </div>
  );
}