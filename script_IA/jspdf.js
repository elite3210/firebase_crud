// Importar jsPDF
import { jsPDF } from './jspdf_min.js';
//import 'jspdf-autotable';

function generateFinancialStatement() {
    // Crear documento PDF en formato A4 horizontal
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Configuración de la empresa (datos de ejemplo)
    const companyData = {
        name: "CORPORACIÓN EJEMPLO S.A.A.",
        ruc: "20100070970",
        period: "Al 31 de diciembre de 2024 y 2023",
        currency: "(En miles de soles)"
    };

    // Datos financieros de ejemplo
    const financialData = {
        assets: {
            current: {
                "Efectivo y Equivalentes de Efectivo": [45000, 42000],
                "Cuentas por Cobrar Comerciales": [32000, 30000],
                "Inventarios": [28000, 25000],
                "Otros Activos Corrientes": [15000, 14000]
            },
            noncurrent: {
                "Propiedades, Planta y Equipo": [150000, 145000],
                "Activos Intangibles": [25000, 23000],
                "Inversiones en Subsidiarias": [40000, 38000],
                "Otros Activos no Corrientes": [20000, 18000]
            }
        },
        liabilities: {
            current: {
                "Obligaciones Financieras": [30000, 28000],
                "Cuentas por Pagar Comerciales": [25000, 23000],
                "Otras Cuentas por Pagar": [18000, 16000]
            },
            noncurrent: {
                "Deuda a Largo Plazo": [80000, 75000],
                "Pasivos por Impuestos Diferidos": [15000, 14000],
                "Otras Provisiones": [10000, 9000]
            }
        },
        equity: {
            "Capital Emitido": [100000, 100000],
            "Reserva Legal": [20000, 18000],
            "Resultados Acumulados": [57000, 52000]
        }
    };

    // Configurar fuente y estilo
    doc.setFont("helvetica");

    // Encabezado
    doc.setFontSize(16);
    doc.text(companyData.name, 150, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(companyData.ruc, 150, 28, { align: "center" });

    doc.setFontSize(14);
    doc.text("Estado de Situación Financiera", 150, 36, { align: "center" });
    doc.setFontSize(11);
    doc.text(companyData.period, 150, 44, { align: "center" });
    doc.text(companyData.currency, 150, 50, { align: "center" });

    // Función para calcular totales
    const calculateTotal = (obj) => {
        return Object.values(obj).reduce((acc, curr) => {
            if (Array.isArray(curr)) {
                return [acc[0] + curr[0], acc[1] + curr[1]];
            }
            return acc;
        }, [0, 0]);
    };

    // Calcular totales
    const totalCurrentAssets = calculateTotal(financialData.assets.current);
    const totalNoncurrentAssets = calculateTotal(financialData.assets.noncurrent);
    const totalCurrentLiabilities = calculateTotal(financialData.liabilities.current);
    const totalNoncurrentLiabilities = calculateTotal(financialData.liabilities.noncurrent);
    const totalEquity = calculateTotal(financialData.equity);

    // Crear tabla de activos
    const assetsData = [
        [{ content: 'ACTIVOS', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }],
        [{ content: 'Activos Corrientes', colSpan: 3, styles: { fontStyle: 'bold' } }],
        ...Object.entries(financialData.assets.current).map(([key, value]) =>
            [key, value[0].toLocaleString(), value[1].toLocaleString()]),
        [{ content: 'Total Activos Corrientes', styles: { fontStyle: 'bold' } },
        totalCurrentAssets[0].toLocaleString(),
        totalCurrentAssets[1].toLocaleString()],
        [{ content: 'Activos No Corrientes', colSpan: 3, styles: { fontStyle: 'bold' } }],
        ...Object.entries(financialData.assets.noncurrent).map(([key, value]) =>
            [key, value[0].toLocaleString(), value[1].toLocaleString()]),
        [{ content: 'Total Activos No Corrientes', styles: { fontStyle: 'bold' } },
        totalNoncurrentAssets[0].toLocaleString(),
        totalNoncurrentAssets[1].toLocaleString()],
        [{ content: 'TOTAL ACTIVOS', styles: { fontStyle: 'bold' } },
        (totalCurrentAssets[0] + totalNoncurrentAssets[0]).toLocaleString(),
        (totalCurrentAssets[1] + totalNoncurrentAssets[1]).toLocaleString()]
    ];

    // Crear tabla de pasivos y patrimonio
    const liabilitiesEquityData = [
        [{ content: 'PASIVOS Y PATRIMONIO', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }],
        [{ content: 'Pasivos Corrientes', colSpan: 3, styles: { fontStyle: 'bold' } }],
        ...Object.entries(financialData.liabilities.current).map(([key, value]) =>
            [key, value[0].toLocaleString(), value[1].toLocaleString()]),
        [{ content: 'Total Pasivos Corrientes', styles: { fontStyle: 'bold' } },
        totalCurrentLiabilities[0].toLocaleString(),
        totalCurrentLiabilities[1].toLocaleString()],
        [{ content: 'Pasivos No Corrientes', colSpan: 3, styles: { fontStyle: 'bold' } }],
        ...Object.entries(financialData.liabilities.noncurrent).map(([key, value]) =>
            [key, value[0].toLocaleString(), value[1].toLocaleString()]),
        [{ content: 'Total Pasivos No Corrientes', styles: { fontStyle: 'bold' } },
        totalNoncurrentLiabilities[0].toLocaleString(),
        totalNoncurrentLiabilities[1].toLocaleString()],
        [{ content: 'TOTAL PASIVOS', styles: { fontStyle: 'bold' } },
        (totalCurrentLiabilities[0] + totalNoncurrentLiabilities[0]).toLocaleString(),
        (totalCurrentLiabilities[1] + totalNoncurrentLiabilities[1]).toLocaleString()],
        [{ content: 'Patrimonio', colSpan: 3, styles: { fontStyle: 'bold' } }],
        ...Object.entries(financialData.equity).map(([key, value]) =>
            [key, value[0].toLocaleString(), value[1].toLocaleString()]),
        [{ content: 'Total Patrimonio', styles: { fontStyle: 'bold' } },
        totalEquity[0].toLocaleString(),
        totalEquity[1].toLocaleString()],
        [{ content: 'TOTAL PASIVOS Y PATRIMONIO', styles: { fontStyle: 'bold' } },
        (totalCurrentLiabilities[0] + totalNoncurrentLiabilities[0] + totalEquity[0]).toLocaleString(),
        (totalCurrentLiabilities[1] + totalNoncurrentLiabilities[1] + totalEquity[1]).toLocaleString()]
    ];

    // Configuración común de las tablas
    const tableConfig = {
        startY: 60,
        head: [['', '2024', '2023']],
        headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 40, halign: 'right' },
            2: { cellWidth: 40, halign: 'right' }
        }
    };

    // Generar tablas
    doc.autoTable({
        ...tableConfig,
        body: assetsData,
        margin: { left: 20 }
    });

    doc.autoTable({
        ...tableConfig,
        startY: 60,
        body: liabilitiesEquityData,
        margin: { left: 210 }
    });

    // Agregar pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, 285, 200);
    }

    // Guardar el PDF
    doc.save('estado_situacion_financiera.pdf');
}

// Ejecutar la función
generateFinancialStatement();