import type { LucideIcon } from 'lucide-react';
import {
  Cog,
  Landmark,
  HeartHandshake,
  ShoppingCart,
  Truck,
  Users,
  Banknote,
  Boxes,
  Factory,
  Wrench,
  BrainCircuit,
  ClipboardList,
  UserCheck,
  Briefcase,
  AreaChart,
  Network
} from 'lucide-react';

export type Functionality = {
  id: string;
  name: string;
  description: string;
};

export type Module = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  functionalities: Functionality[];
};

export const modules: Module[] = [
  {
    id: 'administracion',
    name: 'Administración',
    icon: Cog,
    description: 'Gestión de la configuración del sistema, autorizaciones y datos maestros.',
    functionalities: [
      { id: 'definiciones', name: 'Definiciones generales', description: 'Configuración de la información de la empresa, períodos contables e inicialización básica del sistema.' },
      { id: 'autorizaciones', name: 'Autorizaciones', description: 'Gestión de permisos y roles de usuario para controlar el acceso a diferentes módulos y funcionalidades.' },
      { id: 'utilidades', name: 'Utilidades', description: 'Herramientas para la gestión de datos, como la importación de datos, copias de seguridad y limpieza de datos.' },
    ],
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    icon: Landmark,
    description: 'Manejo de contabilidad, finanzas, control presupuestario e informes financieros.',
    functionalities: [
      { id: 'plan-cuentas', name: 'Plan de Cuentas', description: 'Estructura jerárquica de todas las cuentas de mayor utilizadas para la presentación de informes financieros.' },
      { id: 'asientos-contables', name: 'Asientos Contables', description: 'Registro manual de transacciones financieras que no se generan automáticamente desde otros módulos.' },
      { id: 'informes', name: 'Informes Financieros', description: 'Generación de balances, cuentas de pérdidas y ganancias, y otros informes financieros clave.' },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: HeartHandshake,
    description: 'Gestión de relaciones con clientes, oportunidades de venta y actividades de servicio.',
    functionalities: [
        { id: 'oportunidades', name: 'Oportunidades de Venta', description: 'Seguimiento de posibles acuerdos de venta a través de múltiples etapas, desde el cliente potencial hasta el cierre.' },
        { id: 'actividades', name: 'Actividades', description: 'Gestión de tareas, reuniones y llamadas telefónicas relacionadas con clientes y clientes potenciales.' },
        { id: 'campanas', name: 'Campañas de Marketing', description: 'Creación y gestión de campañas de marketing para generar nuevos clientes potenciales.' },
    ],
  },
  {
    id: 'ventas',
    name: 'Ventas (Clientes)',
    icon: ShoppingCart,
    description: 'Proceso completo de ventas, desde la cotización hasta la facturación y el cobro.',
    functionalities: [
      { id: 'oferta', name: 'Oferta de Venta', description: 'Creación de cotizaciones para clientes con precios, cantidades y condiciones de venta.' },
      { id: 'pedido', name: 'Pedido de Cliente', description: 'Registro de un compromiso de un cliente para comprar productos o servicios.' },
      { id: 'factura', name: 'Factura de Clientes', description: 'Emisión de la factura final al cliente para solicitar el pago de los bienes o servicios entregados.' },
    ],
  },
  {
    id: 'compras',
    name: 'Compras (Proveedores)',
    icon: Truck,
    description: 'Proceso de aprovisionamiento, desde la solicitud de compra hasta el pago a proveedores.',
    functionalities: [
      { id: 'solicitud', name: 'Solicitud de Compra', description: 'Documento interno para solicitar la compra de bienes o servicios.' },
      { id: 'pedido-proveedor', name: 'Pedido a Proveedor', description: 'Documento legal que se envía a un proveedor para confirmar una compra.' },
      { id: 'factura-proveedor', name: 'Factura de Proveedores', description: 'Registro de la factura recibida de un proveedor para su posterior pago.' },
    ],
  },
  {
    id: 'socios-negocio',
    name: 'Socios de Negocios',
    icon: Users,
    description: 'Gestión centralizada de datos maestros de clientes, proveedores y prospectos.',
    functionalities: [
        { id: 'datos-maestros', name: 'Datos Maestros del Socio', description: 'Creación y mantenimiento de la información de contacto, direcciones y datos fiscales de los socios de negocio.' },
        { id: 'saldos', name: 'Saldos de Cuenta', description: 'Consulta de saldos pendientes y el historial de transacciones de clientes y proveedores.' },
    ],
  },
  {
    id: 'gestion-bancos',
    name: 'Gestión de Bancos',
    icon: Banknote,
    description: 'Manejo de pagos, cobros, depósitos y reconciliaciones bancarias.',
    functionalities: [
      { id: 'pagos-recibidos', name: 'Pagos Recibidos', description: 'Procesamiento de los pagos entrantes de los clientes en diversas formas (efectivo, cheque, transferencia).' },
      { id: 'pagos-efectuados', name: 'Pagos Efectuados', description: 'Gestión de los pagos salientes a proveedores y otros acreedores.' },
      { id: 'reconciliacion', name: 'Reconciliación Bancaria', description: 'Conciliación de los extractos bancarios con las transacciones registradas en el sistema.' },
    ],
  },
  {
    id: 'inventario',
    name: 'Inventario',
    icon: Boxes,
    description: 'Control de stock, gestión de almacenes, transferencias y valoración de inventario.',
    functionalities: [
      { id: 'datos-maestros-articulos', name: 'Datos Maestros de Artículos', description: 'Mantenimiento de la información detallada de cada producto, incluyendo costes, precios y unidades de medida.' },
      { id: 'transacciones-stock', name: 'Transacciones de Stock', description: 'Registro de todas las entradas, salidas y transferencias de inventario.' },
      { id: 'recuento-inventario', name: 'Recuento de Inventario', description: 'Herramientas para realizar recuentos físicos de inventario y ajustar las diferencias.' },
    ],
  },
  {
    id: 'produccion',
    name: 'Producción',
    icon: Factory,
    description: 'Gestión de órdenes de producción, listas de materiales y control de planta.',
    functionalities: [
      { id: 'lista-materiales', name: 'Lista de Materiales (BoM)', description: 'Define los componentes, cantidades y procesos necesarios para fabricar un producto terminado.' },
      { id: 'orden-fabricacion', name: 'Orden de Fabricación', description: 'Autoriza y gestiona la producción de una cantidad específica de un artículo.' },
    ],
  },
  {
    id: 'mrp',
    name: 'MRP',
    icon: BrainCircuit,
    description: 'Planificación de requerimientos de material para optimizar el inventario y la producción.',
    functionalities: [
      { id: 'asistente-mrp', name: 'Asistente de MRP', description: 'Herramienta que calcula los requerimientos de material y genera recomendaciones de compra y producción.' },
      { id: 'previsiones', name: 'Previsiones', description: 'Predicción de la demanda futura para mejorar la planificación de la producción y el aprovisionamiento.' },
    ],
  },
  {
    id: 'servicio',
    name: 'Servicio',
    icon: Wrench,
    description: 'Gestión de contratos de servicio, llamadas de servicio y seguimiento postventa.',
    functionalities: [
      { id: 'contrato-servicio', name: 'Contrato de Servicio', description: 'Gestión de acuerdos de servicio con clientes, incluyendo cobertura y SLAs.' },
      { id: 'llamada-servicio', name: 'Llamada de Servicio', description: 'Registro y seguimiento de las solicitudes de servicio de los clientes, desde el inicio hasta la resolución.' },
    ],
  },
  {
    id: 'recursos-humanos',
    name: 'Recursos Humanos',
    icon: UserCheck,
    description: 'Administración de datos de empleados y gestión de personal.',
    functionalities: [
        { id: 'datos-maestros-empleado', name: 'Datos Maestros del Empleado', description: 'Mantenimiento de la información personal, de contacto y contractual de los empleados.' },
        { id: 'informes-rrhh', name: 'Informes de RRHH', description: 'Generación de informes sobre la plantilla, ausencias y otros datos de personal.' },
    ],
  },
];

export const getModuleById = (id: string | undefined) => {
    if (!id) return undefined;
    return modules.find(module => module.id === id);
}
