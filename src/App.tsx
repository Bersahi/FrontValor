import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Search, Package, Truck, CheckCircle, Clock, MessageCircle, Settings,
  MapPin, User, FileText, DollarSign, History, Menu, Send, UserPlus,
  ArrowLeft, Calendar, CreditCard, Bot, Phone, Mail, Globe, Shield,
  Bell, Eye, Banknote, TrendingUp, BarChart3, Edit, LogOut, Lock,
  X, Zap, Brain, Timer, Navigation as RouteIcon, Calculator, PackageCheck, Plane,
  Building, ChevronDown, ChevronUp, Play, RefreshCw, Target, Activity,
  Cpu, Database, Lightbulb, Navigation, Table, Code
} from 'lucide-react';

// Import UI components
import Button from './components/ui/Button';
import Card from './components/ui/Card';
//import CardContent from './components/ui/CardContent';
import CardHeader from './components/ui/CardHeader';
import CardTitle from './components/ui/CardTitle';
import Dialog from './components/ui/Dialog';
import DialogContent from './components/ui/DialogContent';
import DialogDescription from './components/ui/DialogDescription';
import DialogHeader from './components/ui/DialogHeader';
import DialogTitle from './components/ui/DialogTitle';
import Input from './components/ui/Input';
import Label from './components/ui/Label';
import Progress from './components/ui/Progress';
import Select from './components/ui/Select';
import SelectContent from './components/ui/SelectContent';
import SelectItem from './components/ui/SelectItem';
import SelectTrigger from './components/ui/SelectTrigger';
import SelectValue from './components/ui/SelectValue';
import Separator from './components/ui/Separator';
import Textarea from './components/ui/Textarea';

// Componentes de páginas
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shipping from './pages/Shipping';
import Tracking from './pages/Tracking';

// Utilidades y configuración
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
    const mensajeBienvenida: MensajeChat = {
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

    const mensajeUsuario: MensajeChat = {
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
        const mensajePackito: MensajeChat = {
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
      
      const mensajeError: MensajeChat = {
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
  if (paginaActual === 'realizar-envio') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header principal */}
        <div className="bg-red-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={volverAtras}
                className="text-white hover:bg-red-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                onClick={volverAInicio}
              >
                <Package className="h-8 w-8" />
                <div>
                  <h1>VALOR EXPress</h1>
                  <p className="text-sm opacity-90">Sistema de Envíos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Línea negra */}
        <div className="h-1 bg-black"></div>

        {/* Contenido del formulario */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Realizar Nuevo Envío</h2>
            <p className="text-gray-600">Complete la información del remitente, destinatario y paquete</p>
          </div>

          <form onSubmit={crearEnvio} className="space-y-6">
            {/* Información del Remitente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Remitente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remitente-nombre">Nombre completo</Label>
                    <Input
                      id="remitente-nombre"
                      value={formularioEnvio.remitente.nombre}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, nombre: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="remitente-telefono">Teléfono</Label>
                    <Input
                      id="remitente-telefono"
                      value={formularioEnvio.remitente.telefono}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, telefono: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="remitente-direccion">Dirección</Label>
                    <Input
                      id="remitente-direccion"
                      value={formularioEnvio.remitente.direccion}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, direccion: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="remitente-municipio">Municipio</Label>
                    <Input
                      id="remitente-municipio"
                      value={formularioEnvio.remitente.municipio}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, municipio: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="remitente-departamento">Departamento</Label>
                    <Select 
                      value={formularioEnvio.remitente.departamento}
                      onValueChange={(value) => handleDepartamentoChange(value, 'remitente')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentosGuatemala.map((departamento) => (
                          <SelectItem key={departamento.value} value={departamento.value}>
                            {departamento.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="remitente-pais">País</Label>
                    <Select 
                      value={formularioEnvio.remitente.pais}
                      onValueChange={(value) => handlePaisChange(value, 'remitente')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paisesDisponibles.map((pais) => (
                          <SelectItem key={pais.value} value={pais.value}>
                            {pais.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="remitente-region">Región (Automática)</Label>
                    <Input
                      id="remitente-region"
                      value={formularioEnvio.remitente.region}
                      disabled
                      className="bg-gray-100 text-gray-600"
                      placeholder="Se asigna automáticamente según departamento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="remitente-ciudad">Ciudad</Label>
                    <Input
                      id="remitente-ciudad"
                      value={formularioEnvio.remitente.ciudad}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, ciudad: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="remitente-codigo">Código postal</Label>
                    <Input
                      id="remitente-codigo"
                      value={formularioEnvio.remitente.codigoPostal}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        remitente: { ...prev.remitente, codigoPostal: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Destinatario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información del Destinatario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="destinatario-nombre">Nombre completo</Label>
                    <Input
                      id="destinatario-nombre"
                      value={formularioEnvio.destinatario.nombre}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, nombre: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinatario-telefono">Teléfono</Label>
                    <Input
                      id="destinatario-telefono"
                      value={formularioEnvio.destinatario.telefono}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, telefono: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="destinatario-direccion">Dirección</Label>
                    <Input
                      id="destinatario-direccion"
                      value={formularioEnvio.destinatario.direccion}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, direccion: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinatario-municipio">Municipio</Label>
                    <Input
                      id="destinatario-municipio"
                      value={formularioEnvio.destinatario.municipio}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, municipio: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinatario-departamento">Departamento</Label>
                    <Select 
                      value={formularioEnvio.destinatario.departamento}
                      onValueChange={(value) => handleDepartamentoChange(value, 'destinatario')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentosGuatemala.map((departamento) => (
                          <SelectItem key={departamento.value} value={departamento.value}>
                            {departamento.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destinatario-pais">País</Label>
                    <Select 
                      value={formularioEnvio.destinatario.pais}
                      onValueChange={(value) => handlePaisChange(value, 'destinatario')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paisesDisponibles.map((pais) => (
                          <SelectItem key={pais.value} value={pais.value}>
                            {pais.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destinatario-region">Región (Automática)</Label>
                    <Input
                      id="destinatario-region"
                      value={formularioEnvio.destinatario.region}
                      disabled
                      className="bg-gray-100 text-gray-600"
                      placeholder="Se asigna automáticamente según departamento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinatario-ciudad">Ciudad</Label>
                    <Input
                      id="destinatario-ciudad"
                      value={formularioEnvio.destinatario.ciudad}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, ciudad: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinatario-codigo">Código postal</Label>
                    <Input
                      id="destinatario-codigo"
                      value={formularioEnvio.destinatario.codigoPostal}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        destinatario: { ...prev.destinatario, codigoPostal: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Paquete */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información del Paquete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={formularioEnvio.paquete.peso}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        paquete: { ...prev.paquete, peso: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensiones">Dimensiones (LxAxH cm)</Label>
                    <Input
                      id="dimensiones"
                      placeholder="20x15x10"
                      value={formularioEnvio.paquete.dimensiones}
                      onChange={(e) => setFormularioEnvio(prev => ({
                        ...prev,
                        paquete: { ...prev.paquete, dimensiones: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor declarado</Label>
                    <div className="flex gap-2">
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formularioEnvio.paquete.valor}
                        onChange={(e) => setFormularioEnvio(prev => ({
                          ...prev,
                          paquete: { ...prev.paquete, valor: e.target.value }
                        }))}
                        required
                      />
                      <Select 
                        value={formularioEnvio.paquete.moneda}
                        onValueChange={(value) => setFormularioEnvio(prev => ({
                          ...prev,
                          paquete: { ...prev.paquete, moneda: value }
                        }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {monedasDisponibles.map((moneda) => (
                            <SelectItem key={moneda.value} value={moneda.value}>
                              {moneda.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tipo-servicio">Tipo de servicio</Label>
                    <Select 
                      value={formularioEnvio.paquete.tipoServicio}
                      onValueChange={(value) => setFormularioEnvio(prev => ({
                        ...prev,
                        paquete: { ...prev.paquete, tipoServicio: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {tarifasMock.map((tarifa) => (
                          <SelectItem key={tarifa.id} value={tarifa.servicio}>
                            {tarifa.servicio} - {tarifa.precio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción del contenido</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe brevemente el contenido del paquete (requerido por regulaciones aduaneras)"
                    value={formularioEnvio.paquete.descripcion}
                    onChange={(e) => setFormularioEnvio(prev => ({
                      ...prev,
                      paquete: { ...prev.paquete, descripcion: e.target.value }
                    }))}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={volverAtras}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={cargandoIA}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {cargandoIA ? 'Creando y Optimizando...' : 'Crear Envío'}
              </Button>
            </div>

            {/* Información adicional sobre optimización automática */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">Sistema Automático de IA Logistics</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Al crear tu envío, nuestro sistema de IA automáticamente:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Genera estimación preliminar</strong> basada en distancia, servicio y condiciones</li>
                      <li>• <strong>Determina vehículo óptimo</strong> (moto, van o camión) según características</li>
                      <li>• <strong>Agrupa envíos por región</strong> según departamentos de Guatemala para mayor eficiencia</li>
                      <li>• <strong>Optimiza rutas regionales</strong> para reducir tiempo y costos operativos</li>
                      <li>• <strong>Actualiza estimación</strong> con tiempo más preciso tras optimización</li>
                      <li>• <strong>Notifica automáticamente</strong> cualquier cambio en los tiempos estimados</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    );
  }

  // Resto del componente continúa igual...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header principal */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
              onClick={volverAInicio}
            >
              <Package className="h-8 w-8" />
              <div>
                <h1>VALOR EXPress</h1>
                <p className="text-sm opacity-90">Sistema de Envíos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {estaLogueado ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{usuarioActual.nombre}</p>
                      <p className="text-xs opacity-80 capitalize">{usuarioActual.rol}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-white hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                  </Button>
                </div>
          ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setMostrarLogin(true)}
                    className="text-white hover:bg-red-700 border border-white border-opacity-30"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Acceder
                  </Button>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                className="text-white hover:bg-red-700 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Línea negra */}
      <div className="h-1 bg-black"></div>

      <div className="flex">
        {/* Sidebar con altura completa */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 md:h-screen`}>
          <div className="p-4 h-full overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <span>Menú</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarAbierto(false)}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-2 flex-1">
              {/* Siempre mostrar opciones básicas */}
              {(estaLogueado ? 
                (rolUsuario === 'administrativo' ? opcionesSidebarAdmin : opcionesSidebarCliente)
                : opcionesSidebarCliente.filter(opt => !opt.requiereAuth)
              ).map((opcion) => (
                <Button
                  key={opcion.id}
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-gray-800 ${opcionSeleccionada === opcion.id ? 'bg-gray-800' : ''}`}
                  onClick={() => seleccionarOpcion(opcion.id)}
                >
                  <opcion.icon className="h-4 w-4 mr-3" />
                  {opcion.label}
                </Button>
              ))}

            </nav>
          </div>
        </div>

        {/* Overlay para mobile */}
        {sidebarAbierto && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarAbierto(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 md:ml-0 min-h-screen">
          <div className="p-6">
            {/* ============= PÁGINA DE RASTREO NUEVA ============= */}
            {paginaActual === 'rastreo' && (
              <div className="space-y-6">
                {/* Header con botón volver */}
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={volverAtras}
                    className="hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl">Rastreo de Envío</h2>
                    <p className="text-gray-600">Número de rastreo: {numeroRastreoActual}</p>
                  </div>
                </div>

                {cargandoRastreo ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Consultando información del envío...</p>
                    </div>
                  </div>
                ) : envioRastreado ? (
                  <>
                    {/* Información general del envío */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Información del Envío
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Número de Rastreo</Label>
                            <p className="text-lg font-semibold">{envioRastreado.numeroRastreo}</p>
                          </div>
                          <div>
                            <Label>Estado Actual</Label>
                            <Badge className={obtenerColorEstadoRastreo(envioRastreado.estado) + ' text-sm px-3 py-1'}>
                              {obtenerNombreEstado(envioRastreado.estado)}
                            </Badge>
                          </div>
                          <div>
                            <Label>Destino</Label>
                            <p>{envioRastreado.destino}</p>
                          </div>
                          <div>
                            <Label>Tipo de Servicio</Label>
                            <p>{envioRastreado.tipoServicio}</p>
                          </div>
                          {envioRastreado.estimacionActual && (
                            <>
                              <div>
                                <Label>Fecha Estimada de Entrega</Label>
                                <p>{new Date(envioRastreado.estimacionActual.fechaEstimadaEntrega).toLocaleString('es-ES')}</p>
                              </div>
                              <div>
                                <Label>Tiempo Restante</Label>
                                <p>{envioRastreado.estimacionActual.tiempoEstimadoHoras} horas</p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Diagrama de estados */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Route className="h-5 w-5" />
                          Seguimiento del Envío
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Estados principales */}
                          <div className="flex items-center justify-between">
                            {['creado', 'recolectado', 'en_transito', 'en_reparto', 'entregado'].map((estado, index) => (
                              <div key={estado} className="flex flex-col items-center">
                                <div 
                                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    estaEstadoActivo(estado, envioRastreado.estado) 
                                      ? obtenerColorEstadoRastreo(estado) 
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {obtenerIconoEstadoRastreo(estado)}
                                </div>
                                <p className={`text-sm mt-2 text-center ${
                                  estaEstadoActivo(estado, envioRastreado.estado) 
                                    ? 'font-medium' 
                                    : 'text-gray-400'
                                }`}>
                                  {obtenerNombreEstado(estado)}
                                </p>
                                {index < 4 && (
                                  <div 
                                    className={`h-1 w-16 mt-2 ${
                                      estaEstadoActivo(['creado', 'recolectado', 'en_transito', 'en_reparto'][index + 1], envioRastreado.estado)
                                        ? 'bg-blue-400' 
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Barra de progreso */}
                          <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progreso del envío</span>
                              <span>
                                {envioRastreado.estimacionActual?.confianza || 85}% de confianza
                              </span>
                            </div>
                            <Progress 
                              value={
                                envioRastreado.estado === 'entregado' ? 100 :
                                envioRastreado.estado === 'en_reparto' ? 80 :
                                envioRastreado.estado === 'en_transito' || envioRastreado.estado === 'enviado' ? 60 :
                                envioRastreado.estado === 'recolectado' ? 40 :
                                envioRastreado.estado === 'creado' ? 20 : 10
                              }
                              className="h-3"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Historial detallado */}
                    {historialEstados.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Historial Detallado
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {historialEstados.map((evento, index) => (
                              <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${obtenerColorEstadoRastreo(evento.estado)}`}>
                                  {obtenerIconoEstadoRastreo(evento.estado)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{obtenerNombreEstado(evento.estado)}</h4>
                                    <span className="text-sm text-gray-500">
                                      {new Date(evento.timestamp).toLocaleString('es-ES')}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 mt-1">{evento.mensaje}</p>
                                  {evento.ubicacion && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      <MapPin className="h-3 w-3 inline mr-1" />
                                      {evento.ubicacion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Envío no encontrado</h3>
                      <p className="text-gray-600 mb-4">
                        No pudimos encontrar información para el número de rastreo: <strong>{numeroRastreoActual}</strong>
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Verifica que el número esté correcto y que sea un envío de VALOR EXPress.
                      </p>
                      <Button 
                        onClick={volverAtras}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Intentar de nuevo
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Página de inicio */}
            {paginaActual === 'inicio' && (
              <>
                {/* Barra de búsqueda - DISPONIBLE PARA TODOS */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar por número de rastreo, descripción o destino..."
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="text-lg h-12"
                      />
                    </div>
                    <Button 
                      onClick={manejarRastreo}
                      className="bg-red-600 hover:bg-red-700 h-12 px-8"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Rastrear
                    </Button>
                  </div>
                </div>

                {/* Search Pad Desplegable */}
                {mostrarSearchPad && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-blue-900">Rastreador de Paquetes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarSearchPad(false)}
                        className="text-blue-600 hover:bg-blue-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <Input
                        placeholder="Ingresa tu número de rastreo (ej: PKG001)"
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="text-lg h-12 bg-white"
                      />
                      <Button 
                        onClick={manejarRastreo}
                        className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Rastrear Ahora
                      </Button>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      💡 También puedes usar la barra de búsqueda principal arriba
                    </p>
                  </div>
                )}

                {/* Accesos rápidos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-red-50 hover:border-red-200"
                    onClick={() => seleccionarOpcion('realizar-envio')}
                  >
                    <Send className="h-6 w-6 text-red-600" />
                    <span className="text-sm">Realizar Envío</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 ${mostrarSearchPad ? 'bg-blue-50 border-blue-200' : ''}`}
                    onClick={manejarRastreoRapido}
                  >
                    <div className="flex items-center gap-1">
                      <Search className="h-6 w-6 text-blue-600" />
                      {mostrarSearchPad ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />}
                    </div>
                    <span className="text-sm">Rastreo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-200"
                    onClick={() => seleccionarOpcion('soporte')}
                  >
                    <MessageCircle className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Soporte</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200"
                    onClick={() => seleccionarOpcion('ubicaciones')}
                  >
                    <MapPin className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Ubicaciones</span>
                  </Button>
                </div>

                {/* Lista de envíos */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-xl">Envíos Recientes</h2>
                    <p className="text-gray-600">Historial de envíos del sistema</p>
                  </div>
                  <div className="divide-y">
                    {ordenesFiltradas.length > 0 ? (
                      ordenesFiltradas.map((orden) => (
                        <div 
                          key={orden.id} 
                          className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => verDetalleEnvio(orden)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {obtenerIconoEstado(orden.estado)}
                              </div>
                              <div>
                                <p className="font-medium">{orden.id}</p>
                                <p className="text-sm text-gray-600">{orden.descripcion}</p>
                                <p className="text-sm text-gray-500">{orden.destino}</p>
                                {orden.tipoServicio && (
                                  <p className="text-xs text-blue-600">{orden.tipoServicio}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={obtenerColorEstado(orden.estado)}>
                                {orden.estado}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">{orden.fecha}</p>
                              {orden.costo && (
                                <p className="text-sm font-medium text-green-600">{orden.costo}</p>
                              )}
                              <div className="flex items-center mt-1">
                                <Eye className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-400">Ver detalles</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="mb-2">No hay envíos registrados aún</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => seleccionarOpcion('realizar-envio')}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Crear primer envío
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ============= PÁGINA DE DETALLE DE ENVÍO ============= */}
            {paginaActual === 'detalle-envio' && envioDetalle && (
              <div className="space-y-6">
                {/* Header con botón volver */}
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={volverAInicio}
                    className="hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl">Detalle del Envío</h2>
                    <p className="text-gray-600">Número de rastreo: {envioDetalle.id}</p>
                  </div>
                </div>

                {/* Información completa del envío */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Información principal */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Información General
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Número de Rastreo</Label>
                            <p className="text-lg font-semibold">{envioDetalle.id}</p>
                          </div>
                          <div>
                            <Label>Estado Actual</Label>
                            <Badge className={obtenerColorEstado(envioDetalle.estado) + ' text-sm px-3 py-1'}>
                              {envioDetalle.estado}
                            </Badge>
                          </div>
                          <div>
                            <Label>Fecha de Creación</Label>
                            <p>{envioDetalle.fecha}</p>
                          </div>
                          <div>
                            <Label>Destino</Label>
                            <p>{envioDetalle.destino}</p>
                          </div>
                          {envioDetalle.tipoServicio && (
                            <div>
                              <Label>Tipo de Servicio</Label>
                              <p>{envioDetalle.tipoServicio}</p>
                            </div>
                          )}
                          {envioDetalle.costo && (
                            <div>
                              <Label>Costo</Label>
                              <p className="font-semibold text-green-600">{envioDetalle.costo}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Botón para rastreo detallado */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-2">¿Necesitas más información?</h3>
                          <p className="text-gray-600 mb-4">
                            Usa nuestro sistema de rastreo detallado para ver el estado en tiempo real
                          </p>
                          <Button
                            onClick={() => {
                              setBusqueda(envioDetalle.id);
                              manejarRastreo();
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Ver Rastreo Detallado
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Panel lateral */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5" />
                          Soporte
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={iniciarChat}
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Chatear con Packito
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => seleccionarOpcion('soporte')}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contactar Soporte
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Acciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => seleccionarOpcion('realizar-envio')}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Crear Nuevo Envío
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => seleccionarOpcion('historial')}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Ver Todos los Envíos
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* ============= PÁGINA DE IA LOGISTICS INTERACTIVA (SOLO ADMIN) ============= */}
            {paginaActual === 'ia-logistics' && estaLogueado && rolUsuario === 'administrativo' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={volverAInicio}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl">Centro de Control IA Logistics</h2>
                    <p className="text-gray-600">Panel interactivo de optimización automática inteligente</p>
                  </div>
                </div>

                {/* Alertas de Estado del Sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <p className="font-medium text-green-800">Sistema IA Activo</p>
                          <p className="text-sm text-green-600">Agrupación automática con mínimo 5 envíos por ruta</p>
                        </div>
                        <Cpu className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">Conductores Disponibles</p>
                          <p className="text-sm text-blue-600 mb-3">8 conductores listos para asignación automática</p>
                        </div>
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Accesos Rápidos Interactivos de IA */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <Button
                    variant="outline"
                    className={`h-24 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 ${optimizacionEnProceso ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={optimizarRutasManualmente}
                    disabled={optimizacionEnProceso}
                  >
                    {optimizacionEnProceso ? (
                      <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                    ) : (
                      <Route className="h-8 w-8 text-blue-600" />
                    )}
                    <div className="text-center">
                      <span className="text-sm font-medium">
                        {optimizacionEnProceso ? 'Optimizando...' : 'Optimizar Rutas'}
                      </span>
                      <p className="text-xs text-gray-500">
                        {optimizacionEnProceso ? 'Procesando IA' : 'Forzar optimización'}
                      </p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:bg-green-50 hover:border-green-200"
                    onClick={() => calcularEstimacionPersonalizada('Guatemala', 'Managua', 'express', '5')}
                  >
                    <Timer className="h-8 w-8 text-green-600" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Calcular Tiempo</span>
                      <p className="text-xs text-gray-500">Estimación IA</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200"
                    onClick={generarReporteRendimiento}
                  >
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Reporte IA</span>
                      <p className="text-xs text-gray-500">Análisis completo</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:bg-orange-50 hover:border-orange-200"
                    onClick={obtenerEstadisticasIA}
                  >
                    <Activity className="h-8 w-8 text-orange-600" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Tiempo Real</span>
                      <p className="text-xs text-gray-500">Análisis live</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={`h-24 flex-col space-y-2 hover:bg-emerald-50 hover:border-emerald-200 ${cargandoIA ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={simularProcesoCompleto}
                    disabled={cargandoIA}
                  >
                    {cargandoIA ? (
                      <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
                    ) : (
                      <Play className="h-8 w-8 text-emerald-600" />
                    )}
                    <div className="text-center">
                      <span className="text-sm font-medium">
                        {cargandoIA ? 'Simulando...' : 'Probar Sistema'}
                      </span>
                      <p className="text-xs text-gray-500">
                        {cargandoIA ? 'Ejecutando IA' : 'Demo completa'}
                      </p>
                    </div>
                  </Button>
                </div>

                {/* Métricas Principales Interactivas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">{estadisticasIA.rutasGeneradas}</p>
                          <p className="text-sm text-gray-600">Rutas IA Generadas</p>
                          <div className="mt-2">
                            <div className="h-2 bg-blue-100 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{width: `${Math.min(100, estadisticasIA.rutasGeneradas * 10)}%`}}></div>
                            </div>
                          </div>
                        </div>
                        <Route className="h-10 w-10 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-green-600">{estadisticasIA.tiempoAhorrado}%</p>
                          <p className="text-sm text-gray-600">Tiempo Ahorrado</p>
                          <div className="mt-2">
                            <div className="h-2 bg-green-100 rounded-full">
                              <div className="h-2 bg-green-600 rounded-full" style={{width: `${estadisticasIA.tiempoAhorrado}%`}}></div>
                            </div>
                          </div>
                        </div>
                        <Timer className="h-10 w-10 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-purple-600">{estadisticasIA.eficienciaPromedio}%</p>
                          <p className="text-sm text-gray-600">Eficiencia IA</p>
                          <div className="mt-2">
                            <div className="h-2 bg-purple-100 rounded-full">
                              <div className="h-2 bg-purple-600 rounded-full" style={{width: `${estadisticasIA.eficienciaPromedio}%`}}></div>
                            </div>
                          </div>
                        </div>
                        <Target className="h-10 w-10 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-orange-600">{estadisticasIA.vehiculosOptimizados}</p>
                          <p className="text-sm text-gray-600">Vehículos Activos</p>
                          <div className="mt-2">
                            <div className="h-2 bg-orange-100 rounded-full">
                              <div className="h-2 bg-orange-600 rounded-full" style={{width: `${Math.min(100, estadisticasIA.vehiculosOptimizados * 20)}%`}}></div>
                            </div>
                          </div>
                        </div>
                        <Truck className="h-10 w-10 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Panel de Control Interactivo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Control de Optimización Automática */}
                  <Card className="border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-600" />
                        Sistema de Agrupación Inteligente
                      </CardTitle>
                      <p className="text-sm text-blue-600">Optimización automática cuando se alcanzan 5+ envíos</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">5+</p>
                          <p className="text-xs text-green-700">Mín. envíos</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">12</p>
                          <p className="text-xs text-blue-700">Máx. por ruta</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">30</p>
                          <p className="text-xs text-purple-700">Min. espera</p>
                        </div>
                      </div>
                      
                      {ultimaOptimizacion && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <p className="font-medium text-green-800">Última Optimización IA Completada</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-green-600">Fecha:</p>
                              <p className="font-medium text-green-800">
                                {new Date(ultimaOptimizacion.fecha).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <div>
                              <p className="text-green-600">Rutas:</p>
                              <p className="font-medium text-green-800">{ultimaOptimizacion.rutasCreadas}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <Button
                          onClick={optimizarRutasManualmente}
                          disabled={optimizacionEnProceso}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          {optimizacionEnProceso ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Optimizando con IA...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Forzar Optimización Inmediata
                            </>
                          )}
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => obtenerRutasOptimizadas()}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Actualizar
                          </Button>
                          <Button variant="outline" size="sm" onClick={obtenerEstadisticasIA}>
                            <Database className="h-4 w-4 mr-1" />
                            Estadísticas
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Panel de Conductores y Asignación */}
                  <Card className="border-green-200">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600" />
                        Asignación Automática de Conductores
                      </CardTitle>
                      <p className="text-sm text-green-600">Sistema inteligente de asignación por experiencia y rating</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">8</p>
                          <p className="text-xs text-green-700">Conductores</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">4.7</p>
                          <p className="text-xs text-blue-700">Rating prom.</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">5.2</p>
                          <p className="text-xs text-purple-700">Años exp.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-blue-800">Motocicletas</p>
                              <p className="text-sm text-blue-600 mb-3">3 conductores disponibles</p>
                            </div>
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">3</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-800">Vans</p>
                              <p className="text-sm text-green-600 mb-3">3 conductores disponibles</p>
                            </div>
                            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">3</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-orange-800">Camiones</p>
                              <p className="text-sm text-orange-600 mb-3">2 conductores disponibles</p>
                            </div>
                            <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Timer className="h-5 w-5 text-yellow-600" />
                          <p className="font-medium text-yellow-800">Ventanas de Operación</p>
                        </div>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>• Urgente: 06:00-22:00 (todos los días)</p>
                          <p>• Express: 07:00-19:00 (todos los días)</p>
                          <p>• Estándar: 08:00-18:00 (L-V)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Datos en Tiempo Real */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Rutas Activas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        Rutas Optimizadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {rutasOptimizadasActuales ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                              <p className="font-medium text-green-800">Última Optimización</p>
                              <p className="text-sm text-green-600">
                                {new Date(rutasOptimizadasActuales.fechaCreacion).toLocaleString('es-ES')}
                              </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xl font-bold text-blue-600">{rutasOptimizadasActuales.rutas?.length || 0}</p>
                              <p className="text-xs text-blue-700">Rutas creadas</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-xl font-bold text-purple-600">{rutasOptimizadasActuales.totalEnvios || 0}</p>
                              <p className="text-xs text-purple-700">Envíos procesados</p>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles de Rutas
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Route className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 mb-3">No hay optimizaciones activas</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={optimizarRutasManualmente}
                            className="bg-blue-50 hover:bg-blue-100"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar Primera Optimización
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notificaciones en Tiempo Real */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificaciones IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {notificacionesEstimaciones.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notificacionesEstimaciones.slice(0, 6).map((notif, index) => (
                            <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-blue-800 text-sm">{notif.numeroRastreo}</p>
                                  <p className="text-xs text-blue-600 mt-1">{notif.mensaje}</p>
                                </div>
                                <div className="ml-2">
                                  <span className="text-xs text-blue-500">
                                    {new Date(notif.timestamp).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 mb-3">Sin notificaciones recientes</p>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">Las notificaciones aparecerán cuando se optimicen rutas</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Estado del Sistema IA */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Estado del Sistema IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium text-green-800">Motor IA Activo</p>
                              <p className="text-xs text-green-600">Algoritmo genético v2.1</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium text-blue-800">Análisis Tiempo Real</p>
                              <p className="text-xs text-blue-600">Tráfico + clima + prioridades</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-purple-800">Notificaciones Auto</p>
                              <p className="text-xs text-purple-600">Cliente + conductor sync</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-orange-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium text-orange-800">Aprendizaje ML</p>
                              <p className="text-xs text-orange-600">Mejora continua automática</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={generarReporteRendimiento}
                          variant="outline"
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generar Reporte Completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Información Adicional */}
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-2">Sistema IA Logistics Interactivo</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Este panel actualiza automáticamente cuando se crean envíos. El sistema agrupa inteligentemente los envíos 
                          cuando alcanzan el mínimo de 5 paquetes por ruta, asigna conductores automáticamente según experiencia y 
                          rating, respeta ventanas de operación, y notifica a todos los involucrados con estimaciones optimizadas por IA.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div className="text-center">
                            <p className="font-medium text-blue-600">✓ Agrupación Automática</p>
                            <p className="text-blue-600">5+ envíos → ruta</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">✓ Asignación Conductores</p>
                            <p className="text-green-600">Por experiencia/rating</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-purple-600">✓ Ventanas Operación</p>
                            <p className="text-purple-600">Horarios por servicio</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-orange-600">✓ Notificaciones IA</p>
                            <p className="text-orange-600">Cliente + conductor</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ============= PÁGINA DE BASE DE DATOS (SOLO ADMIN) ============= */}
            {paginaActual === 'base-datos' && estaLogueado && rolUsuario === 'administrativo' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={volverAInicio}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl">Arquitectura de Base de Datos</h2>
                    <p className="text-gray-600">Diagrama ER y lógica de datos del sistema VALOR EXPress</p>
                  </div>
                </div>

                {/* Información General de la Arquitectura */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      Arquitectura Actual del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <h3 className="font-medium text-blue-800 mb-2">Supabase PostgreSQL</h3>
                        <p className="text-sm text-blue-600 mb-2">Base de datos principal con tabla KV</p>
                        <div className="mt-2 text-xs text-blue-500">
                          <p>• Tabla: kv_store_758edb6a</p>
                          <p>• Tipo: Key-Value Store</p>
                          <p>• Datos: JSONB</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <h3 className="font-medium text-green-800 mb-2">Edge Functions</h3>
                        <p className="text-sm text-green-600 mb-2">Servidor Hono con lógica de negocio</p>
                        <div className="mt-2 text-xs text-green-500">
                          <p>• Optimización IA</p>
                          <p>• Gestión de rutas</p>
                          <p>• Notificaciones</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <h3 className="font-medium text-purple-800 mb-2">Frontend React</h3>
                        <p className="text-sm text-purple-600 mb-2">Interfaz completa en español</p>
                        <div className="mt-2 text-xs text-purple-500">
                          <p>• Rastreo en tiempo real</p>
                          <p>• Chat IA (Packito)</p>
                          <p>• Panel administrativo</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Esquema de la Tabla Principal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Table className="h-5 w-5" />
                      Estructura de la Tabla Principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                      <div className="text-yellow-400 mb-2">-- Tabla Principal del Sistema</div>
                      <div className="text-white">CREATE TABLE</div> <span className="text-blue-400">kv_store_758edb6a</span> (
                      <br />
                      &nbsp;&nbsp;<span className="text-orange-400">key</span> <span className="text-purple-400">TEXT</span> <span className="text-red-400">NOT NULL PRIMARY KEY</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-orange-400">value</span> <span className="text-purple-400">JSONB</span> <span className="text-red-400">NOT NULL</span>
                      <br />
                      );
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-2"><strong>Explicación:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>key:</strong> Identificador único que define el tipo y contexto del dato</li>
                        <li><strong>value:</strong> Datos almacenados en formato JSON flexible</li>
                        <li><strong>Ventajas:</strong> Escalabilidad, flexibilidad de esquema, rendimiento</li>
                        <li><strong>Ideal para:</strong> Prototipado rápido y datos semi-estructurados</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagrama de Entidades Lógicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Entidades Lógicas del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Entidades Principales */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-center text-gray-800 mb-4">Entidades Principales</h3>
                        
                        {/* Envíos */}
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium text-blue-800">ENVÍOS</h4>
                          </div>
                          <div className="text-xs text-blue-600 space-y-1">
                            <p><strong>Key:</strong> envio_{'{id}'}</p>
                            <p><strong>Campos:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-0.5">
                              <li>id, remitente, destinatario</li>
                              <li>paquete (peso, dimensiones, valor)</li>
                              <li>tipoVehiculo, estado, fechaCreacion</li>
                              <li>estimacionPreliminar, estimacionActual</li>
                              <li>rutaAsignada, conductorAsignado</li>
                            </ul>
                          </div>
                        </div>

                        {/* Rutas Optimizadas */}
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Route className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium text-green-800">RUTAS OPTIMIZADAS</h4>
                          </div>
                          <div className="text-xs text-green-600 space-y-1">
                            <p><strong>Key:</strong> rutas_optimizadas_{'{timestamp}'}</p>
                            <p><strong>Campos:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-0.5">
                              <li>rutas (array de rutas)</li>
                              <li>totalEnvios, conductoresAsignados</li>
                              <li>estadisticas (tiempo, distancia)</li>
                              <li>algoritmoIA utilizado</li>
                            </ul>
                          </div>
                        </div>

                        {/* Estimaciones */}
                        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <h4 className="font-medium text-purple-800">ESTIMACIONES</h4>
                          </div>
                          <div className="text-xs text-purple-600 space-y-1">
                            <p><strong>Keys:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-0.5">
                              <li>estimacion_preliminar_{'{id}'}</li>
                              <li>estimacion_optimizada_{'{id}'}</li>
                              <li>estimacion_ia_{'{id}'}</li>
                            </ul>
                            <p><strong>Campos:</strong> tiempo, fecha, confianza, factores</p>
                          </div>
                        </div>
                      </div>

                      {/* Entidades de Soporte */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-center text-gray-800 mb-4">Entidades de Soporte</h3>
                        
                        {/* Notificaciones */}
                        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="h-4 w-4 text-orange-600" />
                            <h4 className="font-medium text-orange-800">NOTIFICACIONES</h4>
                          </div>
                          <div className="text-xs text-orange-600 space-y-1">
                            <p><strong>Keys:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-0.5">
                              <li>notif_config_{'{numeroRastreo}'}</li>
                              <li>notificacion_{'{id}'}_{'{timestamp}'}</li>
                              <li>notificacion_ia_{'{id}'}_{'{timestamp}'}</li>
                            </ul>
                          </div>
                        </div>

                        {/* Historial */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <History className="h-4 w-4 text-gray-600" />
                            <h4 className="font-medium text-gray-800">HISTORIAL</h4>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Key:</strong> historial_{'{numeroRastreo}'}</p>
                            <p><strong>Campos:</strong> Array de estados cronológicos</p>
                          </div>
                        </div>

                        {/* Conductores */}
                        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-medium text-yellow-800">CONDUCTORES</h4>
                          </div>
                          <div className="text-xs text-yellow-600 space-y-1">
                            <p><strong>Almacenamiento:</strong> Hardcoded en servidor</p>
                            <p><strong>Campos:</strong> id, nombre, telefono, vehiculo, experiencia, rating, estado</p>
                            <p><strong>Total:</strong> 8 conductores disponibles</p>
                          </div>
                        </div>

                        {/* Cola de Envíos */}
                        <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Send className="h-4 w-4 text-indigo-600" />
                            <h4 className="font-medium text-indigo-800">COLA DE ENVÍOS</h4>
                          </div>
                          <div className="text-xs text-indigo-600 space-y-1">
                            <p><strong>Key:</strong> envios_pendientes</p>
                            <p><strong>Uso:</strong> Array para agrupación inteligente</p>
                            <p><strong>Procesamiento:</strong> Automático cuando ≥5 envíos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagrama de Relaciones ER */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Diagrama de Relaciones Entre Entidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Columna 1: Creación y Procesamiento */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-center text-gray-800 mb-4">📝 Fase: Creación</h3>
                          
                          {/* ENVÍO */}
                          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-blue-800">ENVÍO</div>
                            <div className="text-xs text-blue-600 mt-1">
                              envio_{'{id}'}
                            </div>
                            <div className="text-xs text-blue-500 mt-2">
                              • Remitente<br/>
                              • Destinatario<br/>
                              • Paquete<br/>
                              • Estado inicial
                            </div>
                          </div>
                          
                          {/* Flecha hacia abajo */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-blue-200 rounded-full">
                              <ArrowLeft className="h-4 w-4 text-blue-600 rotate-90" />
                            </div>
                            <div className="text-xs text-blue-600 mt-1">Genera</div>
                          </div>
                          
                          {/* ESTIMACIÓN PRELIMINAR */}
                          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-purple-800">ESTIMACIÓN IA</div>
                            <div className="text-xs text-purple-600 mt-1">
                              estimacion_preliminar_*
                            </div>
                            <div className="text-xs text-purple-500 mt-2">
                              • Tiempo estimado<br/>
                              • Fecha entrega<br/>
                              • Confianza<br/>
                              • Factores IA
                            </div>
                          </div>
                          
                          {/* Flecha hacia abajo */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-purple-200 rounded-full">
                              <ArrowLeft className="h-4 w-4 text-purple-600 rotate-90" />
                            </div>
                            <div className="text-xs text-purple-600 mt-1">Se agrega a</div>
                          </div>
                          
                          {/* COLA PENDIENTES */}
                          <div className="bg-indigo-100 border-2 border-indigo-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-indigo-800">COLA PENDIENTES</div>
                            <div className="text-xs text-indigo-600 mt-1">
                              envios_pendientes
                            </div>
                            <div className="text-xs text-indigo-500 mt-2">
                              • Array de envíos<br/>
                              • Esperando agrupación<br/>
                              • Trigger: ≥5 envíos
                            </div>
                          </div>
                        </div>

                        {/* Columna 2: Optimización */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-center text-gray-800 mb-4">🤖 Fase: Optimización IA</h3>
                          
                          {/* CONDUCTORES */}
                          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-yellow-800">CONDUCTORES</div>
                            <div className="text-xs text-yellow-600 mt-1">
                              CONDUCTORES_DISPONIBLES
                            </div>
                            <div className="text-xs text-yellow-500 mt-2">
                              • Rating & experiencia<br/>
                              • Tipo vehículo<br/>
                              • Estado disponibilidad
                            </div>
                          </div>
                          
                          {/* Doble flecha */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-green-200 rounded-full">
                              <Target className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="text-xs text-green-600 mt-1">Algoritmo IA</div>
                            <div className="text-xs text-green-500">Asignación automática</div>
                          </div>
                          
                          {/* RUTAS OPTIMIZADAS */}
                          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-green-800">RUTAS OPTIMIZADAS</div>
                            <div className="text-xs text-green-600 mt-1">
                              rutas_optimizadas_{'{timestamp}'}
                            </div>
                            <div className="text-xs text-green-500 mt-2">
                              • Grupos por zona<br/>
                              • Conductor asignado<br/>
                              • Orden optimizado<br/>
                              • Estadísticas IA
                            </div>
                          </div>
                          
                          {/* Flecha hacia abajo */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-green-200 rounded-full">
                              <ArrowLeft className="h-4 w-4 text-green-600 rotate-90" />
                            </div>
                            <div className="text-xs text-green-600 mt-1">Actualiza</div>
                          </div>
                          
                          {/* ESTIMACIONES OPTIMIZADAS */}
                          <div className="bg-teal-100 border-2 border-teal-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-teal-800">ESTIMACIONES IA</div>
                            <div className="text-xs text-teal-600 mt-1">
                              estimacion_ia_*
                            </div>
                            <div className="text-xs text-teal-500 mt-2">
                              • Tiempo más preciso<br/>
                              • Mayor confianza<br/>
                              • Info del conductor
                            </div>
                          </div>
                        </div>

                        {/* Columna 3: Notificaciones y Seguimiento */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-center text-gray-800 mb-4">📡 Fase: Comunicación</h3>
                          
                          {/* CONFIGURACIÓN NOTIFICACIONES */}
                          <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-orange-800">CONFIG NOTIF</div>
                            <div className="text-xs text-orange-600 mt-1">
                              notif_config_{'{numeroRastreo}'}
                            </div>
                            <div className="text-xs text-orange-500 mt-2">
                              • Contactos cliente<br/>
                              • Tipos notificación<br/>
                              • Estado activo
                            </div>
                          </div>
                          
                          {/* Flecha hacia abajo */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-orange-200 rounded-full">
                              <ArrowLeft className="h-4 w-4 text-orange-600 rotate-90" />
                            </div>
                            <div className="text-xs text-orange-600 mt-1">Genera</div>
                          </div>
                          
                          {/* NOTIFICACIONES */}
                          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-red-800">NOTIFICACIONES</div>
                            <div className="text-xs text-red-600 mt-1">
                              notificacion_*_{'{timestamp}'}
                            </div>
                            <div className="text-xs text-red-500 mt-2">
                              • Estimaciones IA<br/>
                              • Cambios estado<br/>
                              • Info conductor<br/>
                              • Tiempo real
                            </div>
                          </div>
                          
                          {/* Flecha hacia abajo */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-gray-300 rounded-full">
                              <ArrowLeft className="h-4 w-4 text-gray-600 rotate-90" />
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Se almacena en</div>
                          </div>
                          
                          {/* HISTORIAL */}
                          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-center">
                            <div className="font-bold text-gray-800">HISTORIAL</div>
                            <div className="text-xs text-gray-600 mt-1">
                              historial_{'{numeroRastreo}'}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              • Cronología completa<br/>
                              • Estados & cambios<br/>
                              • Rastreabilidad total
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Relaciones Transversales */}
                      <div className="mt-8 pt-6 border-t border-gray-300">
                        <h4 className="font-medium text-gray-800 mb-4 text-center">🔗 Relaciones Clave del Sistema</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                            <div className="font-medium text-blue-800 mb-2">1:N - Envío → Estimaciones</div>
                            <div className="text-blue-600 text-xs">
                              Un envío puede tener múltiples estimaciones: preliminar, optimizada, actualizada por IA
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                            <div className="font-medium text-green-800 mb-2">N:1 - Envíos → Ruta Optimizada</div>
                            <div className="text-green-600 text-xs">
                              Múltiples envíos (5-12) se agrupan en una sola ruta optimizada por zona
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="font-medium text-yellow-800 mb-2">1:1 - Ruta → Conductor</div>
                            <div className="text-yellow-600 text-xs">
                              Cada ruta optimizada se asigna a exactamente un conductor disponible
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400">
                            <div className="font-medium text-orange-800 mb-2">1:N - Envío → Notificaciones</div>
                            <div className="text-orange-600 text-xs">
                              Cada envío genera múltiples notificaciones automáticas durante su ciclo de vida
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flujo de Datos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Flujo de Datos del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                        <h3 className="font-medium text-gray-800 mb-3">Proceso de Creación de Envío</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center">
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-blue-600 font-medium text-sm">1. Crear Envío</div>
                            <div className="text-xs text-gray-500 mt-1">envio_{'{id}'}</div>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-green-600 font-medium text-sm">2. Estimación IA</div>
                            <div className="text-xs text-gray-500 mt-1">estimacion_preliminar_*</div>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-purple-600 font-medium text-sm">3. Cola Pendientes</div>
                            <div className="text-xs text-gray-500 mt-1">envios_pendientes</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border">
                        <h3 className="font-medium text-gray-800 mb-3">Proceso de Optimización Automática</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-orange-600 font-medium text-sm">4. Agrupación IA</div>
                            <div className="text-xs text-gray-500 mt-1">≥5 envíos por zona</div>
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-red-600 font-medium text-sm">5. Asignar Conductor</div>
                            <div className="text-xs text-gray-500 mt-1">Por experiencia/rating</div>
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-indigo-600 font-medium text-sm">6. Crear Rutas</div>
                            <div className="text-xs text-gray-500 mt-1">rutas_optimizadas_*</div>
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <div className="text-teal-600 font-medium text-sm">7. Notificar</div>
                            <div className="text-xs text-gray-500 mt-1">Cliente + Conductor</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas de la Base de Datos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{ordenesReales.length}</div>
                      <div className="text-sm text-gray-600">Envíos Totales</div>
                      <div className="text-xs text-gray-400 mt-1">Registros: envio_*</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{estadisticasDashboard.rutasOptimizadas}</div>
                      <div className="text-sm text-gray-600">Rutas Optimizadas</div>
                      <div className="text-xs text-gray-400 mt-1">Registros: rutas_optimizadas_*</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{notificacionesEstimaciones.length}</div>
                      <div className="text-sm text-gray-600">Notificaciones</div>
                      <div className="text-xs text-gray-400 mt-1">Registros: notificacion_*</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-sm text-gray-600">Conductores</div>
                      <div className="text-xs text-gray-400 mt-1">Hardcoded en servidor</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Configuración del Sistema */}
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configuración del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-3">Configuración de Agrupación IA</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mínimo envíos por ruta:</span>
                            <span className="font-medium">5 envíos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Máximo envíos por ruta:</span>
                            <span className="font-medium">12 envíos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tiempo espera agrupación:</span>
                            <span className="font-medium">30 minutos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Optimización automática:</span>
                            <span className="font-medium text-green-600">Activa</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800 mb-3">Capacidades de Vehículos</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Motocicleta:</span>
                            <span className="font-medium">15kg / 0.02m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Van:</span>
                            <span className="font-medium">500kg / 3m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Camión:</span>
                            <span className="font-medium">3000kg / 20m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Algoritmo IA:</span>
                            <span className="font-medium text-blue-600">TSP Genetic v2.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Desarrollo */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-amber-600 rounded-full flex items-center justify-center">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-amber-800 mb-2">Información Técnica del Prototipo</h3>
                        <p className="text-sm text-amber-700 mb-3">
                          Este sistema utiliza un enfoque Key-Value Store sobre PostgreSQL para máxima flexibilidad durante el prototipado. 
                          La arquitectura permite escalabilidad futura hacia un esquema relacional normalizado si es necesario.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div className="text-center">
                            <p className="font-medium text-amber-600">🏗️ Arquitectura</p>
                            <p className="text-amber-600">Tres capas</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-amber-600">🔧 Flexibilidad</p>
                            <p className="text-amber-600">Esquema dinámico</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-amber-600">⚡ Rendimiento</p>
                            <p className="text-amber-600">JSONB indexado</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-amber-600">🚀 Escalabilidad</p>
                            <p className="text-amber-600">Cloud-ready</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ============= PÁGINA DE CHAT CON PACKITO ============= */}
            {paginaActual === 'iniciar-chat' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header del chat */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={volverAtras}
                        className="text-white hover:bg-purple-800"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                      </Button>
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                        <Bot className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="font-medium">Packito - Asistente IA</h2>
                        <p className="text-sm opacity-90">En línea • Respuesta inmediata</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-90">Conectado</span>
                    </div>
                  </div>
                </div>

                {/* Área de mensajes */}
                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {mensajesChat.map((mensaje) => (
                      <div
                        key={mensaje.id}
                        className={`flex ${mensaje.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}
                      >
                        {mensaje.remitente === 'packito' && (
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            mensaje.remitente === 'usuario'
                              ? 'bg-red-600 text-white ml-auto'
                              : 'bg-white text-gray-800 shadow-sm border'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {mensaje.mensaje.split('**').map((part, index) => (
                              index % 2 === 1 ? (
                                <strong key={index}>{part}</strong>
                              ) : (
                                <span key={index}>{part}</span>
                              )
                            ))}
                          </div>
                          <div className={`text-xs mt-1 ${
                            mensaje.remitente === 'usuario' 
                              ? 'text-red-100' 
                              : 'text-gray-500'
                          }`}>
                            {new Date(mensaje.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {mensaje.remitente === 'usuario' && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Indicador de carga cuando Packito está escribiendo */}
                    {cargandoChat && (
                      <div className="flex justify-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="bg-white text-gray-800 shadow-sm border rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Área de entrada de mensaje */}
                <div className="border-t bg-white p-4">
                  <form onSubmit={enviarMensajeChat} className="flex space-x-3">
                    <Input
                      value={mensajeActual}
                      onChange={(e) => setMensajeActual(e.target.value)}
                      placeholder="Escribe tu mensaje... (ej: Rastrear PKG001, ¿Cuánto cuesta enviar a Costa Rica?)"
                      disabled={cargandoChat}
                      className="flex-1"
                      maxLength={500}
                    />
                    <Button 
                      type="submit" 
                      disabled={cargandoChat || !mensajeActual.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  
                  {/* Sugerencias rápidas */}
                  {mensajesChat.length <= 1 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Sugerencias rápidas:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Rastrear PKG001",
                          "¿Cuánto cuesta enviar?",
                          "Mis envíos recientes",
                          "Tengo un problema",
                          "Ubicaciones"
                        ].map((sugerencia, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setMensajeActual(sugerencia);
                              setTimeout(() => procesarMensajeUsuario(sugerencia), 100);
                            }}
                            disabled={cargandoChat}
                            className="text-xs h-8 px-3"
                          >
                            {sugerencia}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    🤖 Packito puede ayudarte con rastreo, tarifas, estados y disputas usando datos reales del sistema
                  </div>
                </div>
              </div>
            )}

            {paginaActual === 'soporte' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl mb-4">Centro de Soporte</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setMostrarPopupTelefono(true)}>
                    <CardContent className="p-6 text-center">
                      <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Teléfono</h3>
                      <p className="text-sm text-gray-600">+502 2234 5678</p>
                      <p className="text-xs text-gray-500 mt-1">Click para ver horarios</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setMostrarPopupEmail(true)}>
                    <CardContent className="p-6 text-center">
                      <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Email</h3>
                      <p className="text-sm text-gray-600">soporte@valorexpress.com</p>
                      <p className="text-xs text-gray-500 mt-1">Click para más información</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Bot className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Chat con Packito</h3>
                      <p className="text-sm text-gray-600">Asistente virtual IA</p>
                      <Button 
                        size="sm" 
                        className="mt-2 bg-purple-600 hover:bg-purple-700"
                        onClick={iniciarChat}
                      >
                        Iniciar Chat
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Sección adicional de ayuda */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg mb-4">Preguntas Frecuentes</h3>
                  <p className="text-sm text-gray-600 mb-4">Haz click en cualquier pregunta para chatear con Packito sobre ese tema específico</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-purple-50 transition-all border-l-4 border-l-purple-600"
                      onClick={() => iniciarChatConPregunta("¿Cómo rastreo mi paquete? Necesito ayuda para encontrar mi envío.")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-purple-900">¿Cómo rastreo mi paquete?</h4>
                            <p className="text-sm text-gray-600">Usa el número de rastreo en nuestra página principal o pregunta a Packito en el chat.</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-purple-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all border-l-4 border-l-blue-600"
                      onClick={() => iniciarChatConPregunta("¿Cuánto tarda un envío? Necesito información sobre tiempos de entrega.")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-blue-900">¿Cuánto tarda un envío?</h4>
                            <p className="text-sm text-gray-600">Depende del servicio: Urgente (mismo día), Express (24-48h), Estándar (3-5 días).</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-orange-50 transition-all border-l-4 border-l-orange-600"
                      onClick={() => iniciarChatConPregunta("¿Qué pasa si mi paquete se retrasa? Tengo un problema con mi envío.")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-orange-900">¿Qué pasa si mi paquete se retrasa?</h4>
                            <p className="text-sm text-gray-600">Contacta soporte inmediatamente. Tenemos garantías de tiempo para todos nuestros servicios.</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-orange-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-green-50 transition-all border-l-4 border-l-green-600"
                      onClick={() => iniciarChatConPregunta("¿Puedo cambiar la dirección de entrega? Necesito modificar mi envío.")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-green-900">¿Puedo cambiar la dirección de entrega?</h4>
                            <p className="text-sm text-gray-600">Sí, hasta antes de que el paquete salga de nuestro centro de distribución.</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-red-50 transition-all border-l-4 border-l-red-600"
                      onClick={() => iniciarChatConPregunta("¿Cuánto cuesta enviar un paquete? Necesito información sobre tarifas.")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-red-900">¿Cuánto cuesta enviar un paquete?</h4>
                            <p className="text-sm text-gray-600">Las tarifas varían según destino, peso y tipo de servicio. Consulta nuestras tarifas actualizadas.</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-red-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:bg-indigo-50 transition-all border-l-4 border-l-indigo-600"
                      onClick={() => iniciarChatConPregunta("Tengo un problema con mi envío. ¿Cómo reporto una disputa o reclamo?")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-indigo-900">¿Cómo reporto un problema con mi envío?</h4>
                            <p className="text-sm text-gray-600">Paquetes perdidos, dañados o retrasados. Te ayudamos a resolver cualquier disputa.</p>
                          </div>
                          <MessageCircle className="h-5 w-5 text-indigo-600 ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Botón adicional para chat general */}
                  <div className="mt-6 text-center">
                    <Button
                      onClick={iniciarChat}
                      onClick={iniciarChat}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      ¿Tienes otra pregunta? Chatea con Packito
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {paginaActual === 'ubicaciones' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={volverAtras}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl">Nuestras Ubicaciones</h2>
                </div>

                {/* Oficina Central Destacada */}
                <div className="mb-8">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-red-600" />
                    Oficina Principal
                  </h3>
                  {ubicacionesMock.filter(u => u.tipo === 'sede_principal').map((ubicacion) => (
                    <Card key={ubicacion.id} className="border-red-200 bg-red-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-red-900">{ubicacion.nombre}</h3>
                              <Badge className="bg-red-600 text-white">Principal</Badge>
                            </div>
                            <p className="text-sm text-red-700 mb-3">{ubicacion.descripcion}</p>
                            <div className="space-y-2 text-sm text-red-800">
                              <p><MapPin className="h-4 w-4 inline mr-2" />{ubicacion.direccion}</p>
                              <p><Phone className="h-4 w-4 inline mr-2" />{ubicacion.telefono}</p>
                              <p><Clock className="h-4 w-4 inline mr-2" />{ubicacion.horario}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs text-red-600 font-medium">Sede Central</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Otras Ubicaciones */}
                <div>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Red de Distribución
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ubicacionesMock.filter(u => u.tipo !== 'sede_principal').map((ubicacion) => (
                      <Card key={ubicacion.id} className={`hover:shadow-md transition-shadow ${
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Otras Ubicaciones */}
                <div>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Red de Distribución
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ubicacionesMock.filter(u => u.tipo !== 'sede_principal').map((ubicacion) => (
                      <Card key={ubicacion.id} className={`hover:shadow-md transition-shadow ${
                        ubicacion.tipo === 'oficina_fronteriza' ? 'border-orange-200 bg-orange-50' :
                        ubicacion.tipo === 'centro_internacional' ? 'border-purple-200 bg-purple-50' :
                        ubicacion.tipo === 'centro_distribucion' ? 'border-blue-200 bg-blue-50' :
                        'hover:bg-gray-50'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${
                                  ubicacion.tipo === 'oficina_fronteriza' ? 'text-orange-900' :
                                  ubicacion.tipo === 'centro_internacional' ? 'text-purple-900' :
                                  ubicacion.tipo === 'centro_distribucion' ? 'text-blue-900' :
                                  'text-gray-900'
                                }`}>{ubicacion.nombre}</h3>
                                {ubicacion.tipo === 'oficina_fronteriza' && (
                                  <Badge className="bg-orange-600 text-white text-xs">Frontera</Badge>
                                )}
                                {ubicacion.tipo === 'centro_internacional' && (
                                  <Badge className="bg-purple-600 text-white text-xs">Internacional</Badge>
                                )}
                                {ubicacion.tipo === 'centro_distribucion' && (
                                  <Badge className="bg-blue-600 text-white text-xs">Principal</Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-3 ${
                                ubicacion.tipo === 'oficina_fronteriza' ? 'text-orange-700' :
                                ubicacion.tipo === 'centro_internacional' ? 'text-purple-700' :
                                ubicacion.tipo === 'centro_distribucion' ? 'text-blue-700' :
                                'text-gray-600'
                              }`}>{ubicacion.descripcion}</p>
                            </div>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              ubicacion.tipo === 'oficina_fronteriza' ? 'bg-orange-600' :
                              ubicacion.tipo === 'centro_internacional' ? 'bg-purple-600' :
                              ubicacion.tipo === 'centro_distribucion' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }`}>
                              {ubicacion.tipo === 'oficina_fronteriza' ? (
                                <Navigation className="h-5 w-5 text-white" />
                              ) : ubicacion.tipo === 'centro_internacional' ? (
                                <Plane className="h-5 w-5 text-white" />
                              ) : ubicacion.tipo === 'centro_distribucion' ? (
                                <Truck className="h-5 w-5 text-white" />
                              ) : (
                                <MapPin className="h-5 w-5 text-white" />
                              )}
                            </div>
                          </div>
                          <div className={`space-y-2 text-sm ${
                            ubicacion.tipo === 'oficina_fronteriza' ? 'text-orange-800' :
                            ubicacion.tipo === 'centro_internacional' ? 'text-purple-800' :
                            ubicacion.tipo === 'centro_distribucion' ? 'text-blue-800' :
                            'text-gray-600'
                          }`}>
                            <p><MapPin className="h-4 w-4 inline mr-2" />{ubicacion.direccion}</p>
                            <p><Phone className="h-4 w-4 inline mr-2" />{ubicacion.telefono}</p>
                            <p><Clock className="h-4 w-4 inline mr-2" />{ubicacion.horario}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    Cobertura de Servicios
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">🇬🇹 Guatemala</p>
                      <p>Cobertura nacional completa</p>
                      <p>Envíos urgentes, express y estándar</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">🌎 Centroamérica</p>
                      <p>Nicaragua, Costa Rica, Honduras, El Salvador</p>
                      <p>Servicios internacionales especializados</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">🇲🇽 México</p>
                      <p>Conexión directa desde Huehuetenango</p>
                      <p>Hub logístico en Ciudad de México</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paginaActual === 'tarifas' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={volverAtras}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl">Tarifas de Envío</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tarifasMock.map((tarifa) => (
                    <Card key={tarifa.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <tarifa.icono className="h-6 w-6 text-red-600" />
                          <h3 className="font-medium">{tarifa.servicio}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tarifa.descripcion}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg text-red-600">{tarifa.precio}</span>
                          <span className="text-sm text-gray-500">{tarifa.peso}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ============= PÁGINA DE RESUMEN (SOLO ADMIN) ============= */}
            {estaLogueado && rolUsuario === 'administrativo' && paginaActual === 'resumen' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={volverAInicio}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl">Resumen de Envíos</h2>
                    <p className="text-gray-600">Panel administrativo de gestión</p>
                  </div>
                </div>

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-blue-600">{estadisticasDashboard.enviosEsteMes}</p>
                          <p className="text-sm text-gray-600">Envíos Este Mes</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-green-600">{estadisticasDashboard.rutasOptimizadas}</p>
                          <p className="text-sm text-gray-600">Rutas Optimizadas</p>
                        </div>
                        <Route className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-orange-600">{estadisticasDashboard.ahorroTiempo}%</p>
                          <p className="text-sm text-gray-600">Ahorro de Tiempo</p>
                        </div>
                        <Timer className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-purple-600">{estadisticasDashboard.paisesServidos}</p>
                          <p className="text-sm text-gray-600">Países Servidos</p>
                        </div>
                        <Globe className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Panel de control */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Control de IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => seleccionarOpcion('ia-logistics')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Acceder a IA Logistics
                      </Button>
                      
                      <div className="text-sm text-gray-600">
                        <p>• Optimización automática de rutas activa</p>
                        <p>• Estimaciones de tiempo en tiempo real</p>
                        <p>• Notificaciones inteligentes habilitadas</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Acciones Rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => seleccionarOpcion('realizar-envio')}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Crear Nuevo Envío
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => seleccionarOpcion('historial')}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Ver Todos los Envíos
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => obtenerEnvios()}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Actualizar Datos
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista reciente de envíos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Envíos Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ordenesReales.slice(0, 5).map((envio) => (
                        <div key={envio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {obtenerIconoEstado(envio.estado)}
                            <div>
                              <p className="font-medium">{envio.id}</p>
                              <p className="text-sm text-gray-600">{envio.destino}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={obtenerColorEstado(envio.estado)}>
                              {envio.estado}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{envio.fecha}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Páginas que requieren autenticación */}
            {(paginaActual === 'perfil' || paginaActual === 'resumen' || paginaActual === 'historial' || paginaActual === 'configuracion') && !estaLogueado && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Acceso Restringido</h3>
                <p className="text-gray-600 mb-4">
                  Esta sección requiere que inicies sesión para acceder.
                </p>
                <Button 
                  onClick={() => setMostrarLogin(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Iniciar Sesión
                </Button>
              </div>
            )}

            {/* Resto de páginas autenticadas... (perfil, resumen, historial, configuracion) */}
            {estaLogueado && paginaActual === 'perfil' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={volverAtras}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl">Mi Perfil</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="perfil-nombre">Nombre completo</Label>
                      <Input
                        id="perfil-nombre"
                        value={perfilUsuario.nombre}
                        onChange={(e) => setPerfilUsuario(prev => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perfil-email">Correo electrónico</Label>
                      <Input
                        id="perfil-email"
                        type="email"
                        value={perfilUsuario.email}
                        onChange={(e) => setPerfilUsuario(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perfil-telefono">Teléfono</Label>
                      <Input
                        id="perfil-telefono"
                        value={perfilUsuario.telefono}
                        onChange={(e) => setPerfilUsuario(prev => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perfil-empresa">Empresa</Label>
                      <Input
                        id="perfil-empresa"
                        value={perfilUsuario.empresa}
                        onChange={(e) => setPerfilUsuario(prev => ({ ...prev, empresa: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="perfil-direccion">Dirección</Label>
                      <Input
                        id="perfil-direccion"
                        value={perfilUsuario.direccion}
                        onChange={(e) => setPerfilUsuario(prev => ({ ...prev, direccion: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Cancelar</Button>
                    <Button className="bg-red-600 hover:bg-red-700">Guardar Cambios</Button>
                  </div>
                </div>
              </div>
            )}

            {estaLogueado && paginaActual === 'historial' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={volverAInicio}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-xl">
                      {rolUsuario === 'administrativo' ? 'Todos los Envíos' : 'Mis Envíos'}
                    </h2>
                    <p className="text-gray-600">
                      {rolUsuario === 'administrativo' 
                        ? 'Historial completo del sistema' 
                        : 'Tu historial personal de envíos'
                      }
                    </p>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Número de Rastreo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Destino
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Costo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(ordenesReales.length > 0 ? ordenesReales : historialMock).map((envio) => (
                            <tr key={envio.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {envio.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {envio.destino}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={obtenerColorEstado(envio.estado)}>
                                  {envio.estado}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {envio.fecha}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {envio.costo || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => verDetalleEnvio(envio)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setBusqueda(envio.id);
                                      manejarRastreo();
                                    }}
                                  >
                                    <Search className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas para administradores */}
                {rolUsuario === 'administrativo' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-blue-600">{ordenesReales.length}</p>
                        <p className="text-sm text-gray-600">Total Envíos</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-green-600">
                          {ordenesReales.filter(o => o.estado === 'entregado').length}
                        </p>
                        <p className="text-sm text-gray-600">Entregados</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-orange-600">
                          {ordenesReales.filter(o => o.estado === 'enviado').length}
                        </p>
                        <p className="text-sm text-gray-600">En Tránsito</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-gray-600">
                          {ordenesReales.filter(o => o.estado === 'pendiente').length}
                        </p>
                        <p className="text-sm text-gray-600">Pendientes</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notificación de Login en esquina superior derecha */}
      {mostrarNotificacionLogin && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-orange-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-2">
                <Lock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Acceso Restringido</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Esta función requiere que inicies sesión para acceder.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setMostrarNotificacionLogin(false);
                    setMostrarLogin(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 mt-2"
                >
                  Iniciar Sesión
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarNotificacionLogin(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Popup de información de teléfono */}
      <Dialog open={mostrarPopupTelefono} onOpenChange={setMostrarPopupTelefono}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              Soporte Telefónico
            </DialogTitle>
            <DialogDescription>
              Información sobre nuestros horarios de atención telefónica
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600 mb-2">
                +502 2234 5678
              </div>
              <p className="text-sm text-gray-600">Línea principal de soporte</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-green-800 mb-1">📞 Horarios de Atención (GMT-6)</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Lunes a Viernes:</strong> 7:00 AM - 8:00 PM</p>
                  <p><strong>Sábados:</strong> 8:00 AM - 5:00 PM</p>
                  <p><strong>Domingos:</strong> 9:00 AM - 3:00 PM</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">*Horario de Guatemala (Centroamérica)</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Fines de semana:</strong> Atención limitada a urgencias y consultas de rastreo únicamente.
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <Bot className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">¿Necesitas ayuda inmediata?</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Packito está disponible 24/7 para resolver tus consultas de rastreo, tarifas y soporte general.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setMostrarPopupTelefono(false);
                  iniciarChat();
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Bot className="h-4 w-4 mr-2" />
                Chatear con Packito
              </Button>
              <Button
                variant="outline"
                onClick={() => setMostrarPopupTelefono(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de información de email */}
      <Dialog open={mostrarPopupEmail} onOpenChange={setMostrarPopupEmail}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Soporte por Email
            </DialogTitle>
            <DialogDescription>
              Información sobre nuestro servicio de soporte por correo electrónico
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600 mb-2">
                soporte@valorexpress.com
              </div>
              <p className="text-sm text-gray-600">Correo oficial de soporte</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">📧 Tiempos de Respuesta</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>Consultas urgentes:</strong> 30 minutos - 2 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Consultas generales:</strong> 2 - 6 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>Disputas/Reclamos:</strong> 4 - 12 horas</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-1">📋 Para obtener respuesta más rápida</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Incluye tu número de rastreo</li>
                  <li>Describe el problema claramente</li>
                  <li>Adjunta fotos si hay daños</li>
                  <li>Indica tu número de teléfono</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Los emails enviados fuera del horario laboral se responden el siguiente día hábil.
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <Bot className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">¿Prefieres respuesta inmediata?</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Packito puede resolver muchas consultas al instante, disponible 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => window.open('mailto:soporte@valorexpress.com?subject=Consulta VALOR EXPress&body=Hola, necesito ayuda con:%0D%0A%0D%0ANúmero de rastreo (si aplica):%0D%0ADescripción del problema:%0D%0A%0D%0AGracias')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
              <Button
                onClick={() => {
                  setMostrarPopupEmail(false);
                  iniciarChat();
                }}
                variant="outline"
                className="flex-1"
              >
                <Bot className="h-4 w-4 mr-2" />
                Chat Packito
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Login */}
      <Dialog open={mostrarLogin} onOpenChange={setMostrarLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Sesión en VALOR EXPress</DialogTitle>
            <DialogDescription>
              Accede a tu cuenta para gestionar tus envíos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formularioLogin.email}
                onChange={(e) => setFormularioLogin(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formularioLogin.password}
                onChange={(e) => setFormularioLogin(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="rol">Tipo de usuario</Label>
              <Select 
                value={formularioLogin.rol}
                onValueChange={(value: 'cliente' | 'administrativo') => 
                  setFormularioLogin(prev => ({ ...prev, rol: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setMostrarLogin(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
}