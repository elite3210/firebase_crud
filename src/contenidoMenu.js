export const menuItems = [
    {
        title: 'Dashboard',
        submenu: [
            { title: 'Resumen Ejecutivo', url: '../app.html' },
            { title: 'Indicadores Clave (KPIs)', url: '../documento.html' }
        ]
    },
    {
        title: 'Ventas',
        submenu: [
            { title: 'Clientes', url: '../consultaCliente.html' },
            { title: 'Cotizaciones', url: '/ventas/cotizaciones' },
            { title: 'Pedidos', url: '../consultaVentas.html' },
            { title: 'Facturación', url: '/ventas/facturacion' }
        ]
    },
    {
        title: 'Compras',
        submenu: [
            { title: 'Proveedores', url: '../consultaProveedor.html' },
            { title: 'Órdenes de Compra', url: '../consultaCompras.html' },
            { title: 'Recepción de Mercancía', url: '/compras/recepcion' },
            { title: 'Facturas de Proveedores', url: '/compras/facturas' }
        ]
    },
    {
        title: 'Inventario',
        submenu: [
            { title: 'Productos', url: '../productos.html' },
            { title: 'Almacenes', url: '../inventario.html' },
            { title: 'Movimientos', url: '/inventario/movimientos' },
            { title: 'Reportes de Stock', url: '/inventario/reportes' }
        ]
    },
    {
        title: 'Finanzas',
        submenu: [
            { title: 'Cuentas por Cobrar', url: '/finanzas/cuentas-cobrar' },
            { title: 'Cuentas por Pagar', url: '/finanzas/cuentas-pagar' },
            { title: 'Contabilidad', url: '/finanzas/contabilidad' },
            { title: 'Presupuestos', url: '/finanzas/presupuestos' }
        ]
    },
    {
        title: 'Recursos Humanos',
        submenu: [
            { title: 'Empleados', url: '../empleados.html' },
            { title: 'Asistencia', url: '../consultaJornada.html' },
            { title: 'Nómina', url: '../consultaBoletaPago.html' },
            { title: 'Capacitación', url: '/rrhh/capacitacion' }
        ]
    },
    {
        title: 'Fabricacion',
        submenu: [
            { title: 'Órdenes de Producción', url: '../produccion.html' },
            { title: 'Lista de Materiales', url: '../recetaProducto.html' },
            { title: 'Planificación de Producción', url: '/fabricacion/planificacion' },
            { title: 'Control de Calidad', url: '/fabricacion/calidad' },
            { title: 'Mantenimiento', url: '/fabricacion/mantenimiento' },
            { title: 'Estaciones de Trabajo', url: '/fabricacion/estaciones' },
            { title: 'Rutas de Producción', url: '/fabricacion/rutas' },
            { title: 'Desperdicios y Mermas', url: '/fabricacion/desperdicios' },
            { title: 'Costos de Producción', url: '/fabricacion/costos' },
            { title: 'Reportes de Producción', url: '/fabricacion/reportes' },
            { title: 'Maquinarias', url: '../activosFijos.html' }
        ]
    },
    {
        title: 'Reportes',
        submenu: [
            { title: 'Ventas', url: '../consultaVentasProducto.html' },
            { title: 'Ventas Mensual', url: '../reporteVentaMensual.html' },
            { title: 'Compras', url: '/reportes/compras' },
            { title: 'Inventario', url: '../inventario.html' },
            { title: 'Financieros', url: '/reportes/financieros' }
        ]
    },
    {
        title: 'Configuración',
        submenu: [
            { title: 'Perfil de Usuario', url: '/config/perfil' },
            { title: 'Usuarios y Permisos', url: '/config/usuarios' },
            { title: 'Configuración General', url: '/config/general' },
            { title: 'Respaldos', url: '/config/respaldos' }
        ]
    }
];
