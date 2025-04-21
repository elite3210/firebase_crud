import { Datatable } from './dataTable.js'
import{translateDate} from './plugins/translateDate.js'

const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');
const tabs = document.querySelectorAll('.tabs li')
const panels = document.querySelectorAll('.panels div')
const indicador = document.querySelector('.indicador')
const nombreMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']

console.log('se muestra del año y mes:',translateDate().slice(0,4),translateDate().slice(5,7));

const departamentosClientes = {
    'OSORIO SIGUAS SILVIO VITALIANO': 'LIMA',
    'OSORIO SIGUAS AMERICO REMIGIO': 'LIMA',
    'HENRY MESA GARAY RUDY': 'LIMA',
    'ROBERTO HENRY TORIBIO NEYRA': 'LIMA',
    'CLIENTES VARIOS': 'LIMA',
    'KENY CUMBRE CARABAYLLO': 'LIMA',
    'HERNAN AVENDAÑO': 'LIMA',
    'EULOGIO HUANCCO TICONA': 'CUSCO',
    'LINGAN SEJURO OSCAR ANTONIO': 'LIMA',
    'TINTAYA TOQUE ABDON': 'LIMA',
    'ALVARADO ROMAN ISOLINA SILVIA': 'LIMA',
    'QUENAYA TORRES IOVANNA MARILU': 'LIMA',
    'ORE GUERRA NELCI': 'LIMA',
    'ALAYO CRUZ WILSON DAVID': 'LIMA',
    'ARRUE HERNANDEZ MICHAEL ALEJANDRO': 'LAMBAYEQUE',
    'LUNG ISIDRO BETSY NATALY': 'ICA',
    'WILFREDO MAYTA': 'JUNIN',
    'CUSQUISIBAN CASTAÑEDA FREDDY WILSON': 'CAJAMARCA',
    'INVERSIONES PLASTIHUAMPA E.I.R.L.': 'UCAYALI',
    'INVERSIONES ANDRIO E.I.R.L.': 'UCAYALI',
    'MULTIPRODUCTOS MARY E.I.R.L.': 'AREQUIPA',
    'PALAVA E.I.R.L.': 'LIMA',
    'UNIVERSAL PLASTICOS & DESCARTABLES SCRL': 'TUMBES',
    'DISTRIBUIDORA MURDOCK S.R.L.': 'LIMA',
    'FREDY PONCE & MARANATHA S.A.C.': 'LIMA',
    'CEMPLASTIC S.A.C.': 'LIMA',
    'COINA PLAST E.I.R.L.': 'LIMA',
    'INVERSIONES J Y R PERU S.A.C.': 'TACNA',
    'AZUMY E.I.R.L.': 'ICA',
    'IMPORT & EXPORT MAYLIN S.A.C.': 'LIMA',
    'CARAMELOS DEL NORTE S.A.C.': 'LIMA',
    'COORPORACION YOLPLAST E.I.R.L.': 'LIMA',
    'JAL PERU INVERSIONES EIRL': 'LIMA',
    'FAROBEN DEL PERU E.I.R.L.': 'ANCASH',
    'PEK PLAST E.I.R.L.': 'AREQUIPA',
    'INVERSIONES MEGAPLAS S.A.C.': 'LIMA',
    'RHENACER & CARMEN S.A.C.': 'AYACUCHO',
    'BIOSELVA PACK S.A.C.': 'SAN MARTIN',
    'CREADORES DE LEGADOS DE VALOR EIRL': 'HUANUCO',
    'SANTOS ELEUTERIO CORDOVA REYES': 'LIMA',
    'CHUCTAYA GUTIERREZ ALEJANDRINA': 'AREQUIPA',
    'CHAIÑA MAMANI HERMENEGILDO': 'CUSCO',
    'RODRIGO TINTAYA ANTONIO': 'CUSCO',
    'ITO CHIPANA JEAN CARLOS': 'TACNA',
    'PARI CATUNTA, RAQUEL PAMELA': 'TACNA',
    'DIEGO FRANCO GALARZA OSORIO': 'LIMA',
    'MANUEL HUANUCO ALBINO': 'LIMA',
    'DEINER CAMPOS': 'LIMA',
    'PAOLA LIZBETH GARCIA VILCHEZ': 'LIMA',
    'CHAIÑA CAPQUEQUI ORLANDO': 'PUNO',
    'MAMANI CONDORI LISBETH SONIA': 'PUNO',
    'CANAZA COSÍ SAIDA': 'PUNO',
    'ALMACENES ARRUE S.A.C.': 'LAMBAYEQUE',
    'FABIOLA MELGAREJO': 'LIMA',
    'DAYANA S. VILLANUEVA O.': 'LIMA'
}

//console.log('productos:',claves)

//event click a 
//todos los .li quitar la clase activo
//todos.panels quitar clase activo
// .li con la posicion le añadimos la calse activo
//.panels con la posicion le añadimos la clase activo

tabs.forEach((cadatabs, i) => {
    tabs[i].addEventListener('click', () => {

        tabs.forEach((cadatabs, j) => {//Recorrer todos los .tabs
            tabs[j].classList.remove('activo')//Quitando la clase activo a cada li
            panels[j].classList.remove('activo')//Quitando la clase activo a cada panels
        })

        tabs[i].classList.add('activo')
        panels[i].classList.add('activo')
        indicador.style.left = `calc(calc(100%/5)*${i})`
    })
})
//los totales mensuales aqui declarados son utilizados en el titulo de pie de tabla titlefoot

let totalImporte = 0;
let totalGeneral = 0;
let totalAgosto = 0;
let totalSetiembre = 0;
let totalOctubre = 0;
let totalNoviembre = 0;
let totalDiciembre = 0;
let totalEnero = 0;
let totalFebrero = 0;
let totalMarzo = 0;
let totalAbril = 0;
let totalMayo = 0;
let totalJunio = 0;
let totalJulio = 0;

let items = [] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
let itemsLocalStorage = JSON.parse(localStorage.getItem('todasLasVentas')) // itmes sin detallede cotizacion o pedido, formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato   

itemsLocalStorage.forEach(doc => {
    let detalle = JSON.parse(doc['values'].detalleCotizacion)

    if (doc['values'].estado != 'nuevo' && doc['values'].estado != 'Anulado' && doc['values'].fechaEnvio > `${translateDate().slice(0,4)-1}-${translateDate().slice(5,7)+1}-01`) {//Regla para considerar una venta, cuando se entrega el pedido se considera una venta, falta implementar cuando se recibe el pago tambien se debe considwerar una venta
        for (const fila of detalle) {//cada fila de detalle se extrae y tralada a values
            let producto = {}
            producto.id = doc.id
            producto['values'] = fila
            producto['values'].fecha = doc['values'].fecha
            producto['values'].cliente = doc['values'].cliente
            producto['values'].mes = nombreMes[new Date(`${doc['values'].fechaEnvio}T12:00:00Z`).getMonth()];
            producto['values'].mesNumero = String(new Date(`${doc['values'].fechaEnvio}T12:00:00Z`).getMonth());
            producto['values'].costoFila = producto['values'].costo * producto['values'].cantidad;
            producto['values'].margenFila = producto['values'].importe - producto['values'].costo * producto['values'].cantidad;
            producto['values'].departamento = departamentosClientes[producto['values'].cliente];
            items.push(producto)
            totalImporte += Math.round(producto['values'].importe);
        }
    }
})





//console.log('llamanda funcion groupBy:',groupByMes(items))
console.log('items:', items)
//console.log('totalImporte:',totalImporte)



//items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b

let ventaCategoria = groupBy(items, 'categoria');

ventaCategoria.forEach(categoria => {
    categoria['values'].margenCategoria = Math.round(categoria['values'].margenFila / categoria['values'].importe * 100);
    categoria['values'].roiCategoria = (categoria['values'].margenFila / categoria['values'].costoFila).toFixed(2);
    categoria['values'].costoFila = Intl.NumberFormat('es-419').format(Math.round(categoria['values'].costoFila));
    categoria['values'].margenFila = Intl.NumberFormat('es-419').format(Math.round(categoria['values'].margenFila));
    categoria['values'].importeFila = Intl.NumberFormat('es-419').format(Math.round(categoria['values'].importe));
});
//venta total por cliente
let ventaCliente = groupBy(items, 'cliente');//venta total por cliente o agregado total de ventas por cliente, no incluye vneta mensual
//console.log('ventaCliente:',ventaCliente);

//venta por departamento:
let ventaDepatamento = groupBy(items, 'departamento');

//ventas por mes grafico y tabla
let ventaMesNumero = groupBy(items, 'mesNumero');
//venta mes a mes por cliente:
let ventaMesClientes = groupBy3(items, 'cliente', 'mes');
//venta mes a mes por producto:
let ventaMesProducto = groupBy3(items, 'categoria', 'mes');

//Ordenando las ventas por numero de mes
ventaMesNumero.sort((a, b) => a['values'].mesNumero - b['values'].mesNumero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
//console.log('ventaMesAntes:',ventaMesNumero);
//Etiquetando a cada mes con su nombre en español ya ordenado y reemplazando en mismo lugar de memoria
ventaMesNumero.forEach(mes => {
    const nombreMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
    mes['values'].mes = nombreMes[Number(mes['values'].mesNumero)];
    mes['values'].margenMensual = Math.round(mes['values'].margenFila / mes['values'].importe * 100);
    mes['values'].roiMensual = (mes['values'].margenFila / mes['values'].costoFila).toFixed(2);
    mes['values'].costoFila = Intl.NumberFormat('es-419').format(Math.round(mes['values'].costoFila));
    mes['values'].margenFila2 = Math.round(Number(mes['values'].margenFila));
    mes['values'].margenFila = Intl.NumberFormat('es-419').format(Math.round(mes['values'].margenFila));
    mes['values'].importeFila = Intl.NumberFormat('es-419').format(Math.round(mes['values'].importe));

});
//console.log('ventaMesNumero ForEach:',ventaMesNumero);


//console.log('ventaMesClientes para tabla:',ventaMesClientes);
//console.log('ventaMesDepatamento para tabla:',ventaMesDepatamento);

//venta por cliente
//const titulo   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',CODIGO:'codigo',NOMBRE:'nombre',CANTIDAD:'cantidad',IMPORTE:'importe',COSTO:'costo'}


const titulo = { CLIENTE: 'cliente', ENERO: 'importe-Enero', FEBRERO: 'importe-Febrero', MARZO: 'importe-Marzo', ABRIL: 'importe-Abril', MAYO: 'importe-Mayo', JUNIO: 'importe-Junio', JULIO: 'importe-Julio', AGOSTO: 'importe-Agosto', SETIEMBRE: 'importe-Setiembre', OCTUBRE: 'importe-Octubre', NOVIEMBRE: 'importe-Noviembre', IMPORTE: 'importe' }
const tituloFoot = {
    CLIENTE: 'TOTAL',
    ENERO: Intl.NumberFormat('es-419').format(Math.round(totalEnero)),
    FEBRERO: Intl.NumberFormat('es-419').format(Math.round(totalFebrero)),
    MARZO: Intl.NumberFormat('es-419').format(Math.round(totalMarzo)),
    ABRIL: Intl.NumberFormat('es-419').format(Math.round(totalAbril)),
    MAYO: Intl.NumberFormat('es-419').format(Math.round(totalMayo)),
    JUNIO: Intl.NumberFormat('es-419').format(Math.round(totalJunio)),
    JULIO: Intl.NumberFormat('es-419').format(Math.round(totalJulio)),
    AGOSTO: Intl.NumberFormat('es-419').format(Math.round(totalAgosto)),
    SETIEMBRE: Intl.NumberFormat('es-419').format(Math.round(totalSetiembre)),
    OCTUBRE: Intl.NumberFormat('es-419').format(Math.round(totalOctubre)),
    NOVIEMBRE: Intl.NumberFormat('es-419').format(Math.round(totalNoviembre)),
    DICIEMBRE: Intl.NumberFormat('es-419').format(Math.round(totalDiciembre)),
    TOTAL: Intl.NumberFormat('es-419').format(Math.round(totalGeneral))
}
const dt = new Datatable('#dataTable', []);
dt.setDatos(ventaMesClientes.Datos, titulo, tituloFoot);
dt.renderTable();

//venta por categoria
const tituloTotalCategoria = { CATEGORIA: 'categoria', COSTO: 'costoFila', "MARGEN BRUTO": 'margenFila', IMPORTE: 'importeFila', MARGEN: 'margenCategoria', ROI: 'roiCategoria' }
//const tituloTotalCategoria   = {' ':'',CODIGO:'codigo',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
const dt2 = new Datatable('#dataTable2', []);

dt2.setData(ventaCategoria, tituloTotalCategoria);
dt2.renderTable();

//venta mes a mes por producto:
//let ventaMesProducto = groupByMesClave(items,'categoria')
//console.log('ventaMesProducto:',ventaMesProducto)
const titulo3 = { PRODUCTO: 'categoria', ENERO: 'importe-Enero', FEBRERO: 'importe-Febrero', MARZO: 'importe-Marzo', ABRIL: 'importe-Abril', MAYO: 'importe-Mayo', JUNIO: 'importe-Junio', JULIO: 'importe-Julio', AGOSTO: 'importe-Agosto', SETIEMBRE: 'importe-Setiembre', OCTUBRE: 'importe-Octubre', NOVIEMBRE: 'importe-Noviembre', IMPORTE: 'importe' }
const tituloFootProductoMes = {
    PRODUCTO: 'TOTAL',
    ENERO: Math.round(totalEnero),
    FEBRERO: Math.round(totalFebrero),
    MARZO: Math.round(totalMarzo),
    ABRIL: Math.round(totalAbril),
    MAYO: Math.round(totalMayo),
    JUNIO: Math.round(totalJunio),
    JULIO: Math.round(totalJulio),
    AGOSTO: Math.round(totalAgosto),
    SETIEMBRE: Math.round(totalSetiembre),
    OCTUBRE: Math.round(totalOctubre),
    NOVIEMBRE: Math.round(totalNoviembre),
    TOTAL: Intl.NumberFormat('es-419').format(Math.round(totalGeneral))
}
//const titulo   = {' ':'',CLIENTE:'cliente',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
const dt3 = new Datatable('#dataTable3', []);
dt3.setDatos(ventaMesProducto.Datos, titulo3, tituloFootProductoMes);
dt3.renderTable();

const titulo5 = { DEPARTAMENTO: 'departamento', IMPORTE: 'importe' }
const tituloFootDepartamento = { PRODUCTO: 'TOTAL', TOTAL: Intl.NumberFormat('es-419').format(Math.round(totalGeneral)) };
const dt5 = new Datatable('#dataTable5', []);
dt5.setDatos(ventaDepatamento, titulo5, tituloFootDepartamento);
dt5.renderTable();




//console.log('ventaCliente:',ventaCliente);
const colorFondo = ['rgba(255,99,132,0.2)', 'rgba(54,162,235,0.2)', 'rgba(255,206,86,0.2)', 'rgba(75,192,192,0.2)', 'rgba(153,102,255,0.2)', 'rgba(255,159,64,0.2)']
const colorBorde = ['rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)', 'rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)']

//grafico barras de venta total por cliente:
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ventaCliente.map(row => row['values'].cliente),
        datasets: [{
            label: 'S/',
            data: ventaCliente.map(row => row['values'].importe),
            backgroundColor: colorFondo,
            borderColor: colorBorde,
            borderWidth: 2
        }]
    },
    plugins: {
        legend: { display: false },
        datalabels: {
            // Position of the labels 
            // (start, end, center, etc.)
            anchor: 'end',
            // Alignment of the labels 
            // (start, end, center, etc.)
            align: 'end',
            // Color of the labels
            color: 'blue',
            font: {
                weight: 'bold',
            }
        }
    },

}
)

const myChart2 = new Chart(ctx2, { type: 'pie', data: { labels: ventaCategoria.map(row => row.values.categoria), datasets: [{ label: 'S/', data: ventaCategoria.map(row => row.values.importe), backgroundColor: colorFondo, borderColor: colorBorde, borderWidth: 2 }] } })

//ventas por mes grafico y tabla
//let ventaMes=groupByMes(items,'mes','importe','margen');
//console.log('llamanda funcion groupBy mes:',ventaMes)    

const myChart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
        labels: ventaMesNumero.map(row => row['values'].mes),
        datasets: [
            {
                label: 'VENTAS MENSUALES (S/)',
                data: ventaMesNumero.map(row => row['values'].importe),
                backgroundColor: colorFondo,
                borderColor: colorBorde,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 1,
                categoryPercentage: 1
            },
            {
                label: 'MARGEN MENSUALES (S/)',
                data: ventaMesNumero.map(row => row['values'].margenFila2),
                backgroundColor: colorBorde,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 0.5,
                categoryPercentage: -1
            }
        ]
    }
}
)

const titulo4 = { MES: 'mes', COSTO: 'costoFila', "MARGEN BRUTO": 'margenFila', MARGEN: 'margenMensual', ROI: 'roiMensual', IMPORTE: 'importeFila', }
const dt4 = new Datatable('#dataTable4', []);
dt4.setData(ventaMesNumero, titulo4);
dt4.renderTable();


function eliminarDuplicados(arrayObjetos, clave) {//recibe una lista de categoria duplicadas y reduce a unicos
    let grupos = [];//para separar el atributo a reducir meses repetidos
    let elementosUnicos = [];//elementos unicos o meses unicos

    for (const fila of arrayObjetos) {//extraemos los valores de la categoria mes en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'][clave]);
    };

    for (let i = 0; i < grupos.length; i++) {//reducimos los meses a elementos unicos
        let esDuplicado = false;
        for (let j = 0; j < elementosUnicos.length; j++) {//recorre toda la lista de elemntos unicos por cada fila de grupos
            if (grupos[i] == elementosUnicos[j]) {
                esDuplicado = true;
                break;
            };
        }

        if (!esDuplicado) {//solo agrega los que no aparecen en elemento unicos
            elementosUnicos.push(grupos[i]);
        }
    }
    return elementosUnicos;
};

function groupByMesClave(items, clave) {//la clave puede ser por ejemplo cliente

    let elementosUnicosClave = eliminarDuplicados(items, clave);
    let claveAgrupado = []
    let arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']

    //console.log('elementosunicosClave:',elementosUnicosClave)


    totalEnero = 0;
    totalFebrero = 0;
    totalMarzo = 0;
    totalAbril = 0;
    totalMayo = 0;
    totalJunio = 0;
    totalJulio = 0;
    totalAgosto = 0;
    totalSetiembre = 0;
    totalOctubre = 0;
    totalNoviembre = 0;
    totalDiciembre = 0;
    totalImporte = 0;
    totalGeneral = 0;


    let contador = 1;


    for (const nombreClave of elementosUnicosClave) {//para este caso el nombreClave se refiere al nombreCliente. cliente de elementos unicos
        let producto = {}
        let importeEnero = 0;
        let importeFebrero = 0;
        let importeMarzo = 0;
        let importeAbril = 0;
        let importeMayo = 0;
        let importeJunio = 0;
        let importeJulio = 0;
        let importeAgosto = 0;
        let importeSetiembre = 0;
        let importeOctubre = 0;
        let importeNoviembre = 0;
        let importeDiciembre = 0;
        let importe = 0;


        for (const fila of items) {
            if (fila['values'][clave] == nombreClave) {//si coincide acumular por cliente

                importe += fila['values'].importe;

                if (fila['values'].mes == 'Enero') {
                    importeEnero += fila['values'].importe;
                }
                if (fila['values'].mes == 'Febrero') {
                    importeFebrero += fila['values'].importe;
                }
                if (fila['values'].mes == 'Marzo') {
                    importeMarzo += fila['values'].importe;
                }
                if (fila['values'].mes == 'Abril') {
                    importeAbril += fila['values'].importe;
                }
                if (fila['values'].mes == 'Mayo') {
                    importeMayo += fila['values'].importe;
                }
                if (fila['values'].mes == 'Junio') {
                    importeJunio += fila['values'].importe;
                }
                if (fila['values'].mes == 'Julio') {
                    importeJulio += fila['values'].importe;
                }
                if (fila['values'].mes == 'Agosto') {
                    importeAgosto += fila['values'].importe;
                }
                if (fila['values'].mes == 'Setiembre') {
                    importeSetiembre += fila['values'].importe;
                }
                if (fila['values'].mes == 'Octubre') {
                    importeOctubre += fila['values'].importe;
                }
                if (fila['values'].mes == 'Noviembre') {
                    importeNoviembre += fila['values'].importe;
                }
                if (fila['values'].mes == 'Diciembre') {
                    importeDiciembre += fila['values'].importe;
                }

            }
        }
        producto.id = contador;
        producto.values = {};
        producto['values'][clave] = nombreClave;
        producto.values.importe = Math.round(importe);

        producto.values.enero = Math.round(importeEnero);
        producto.values.febrero = Math.round(importeFebrero);
        producto.values.marzo = Math.round(importeMarzo);
        producto.values.abril = Math.round(importeAbril);
        producto.values.mayo = Math.round(importeMayo);
        producto.values.junio = Math.round(importeJunio);
        producto.values.julio = Math.round(importeJulio);
        producto.values.agosto = Math.round(importeAgosto);
        producto.values.setiembre = Math.round(importeSetiembre);
        producto.values.octubre = Math.round(importeOctubre);
        producto.values.noviembre = Math.round(importeNoviembre);
        producto.values.diciembre = Math.round(importeDiciembre);

        claveAgrupado.push(producto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","importe": 30113}}

        totalEnero += importeEnero;
        totalFebrero += importeFebrero;
        totalMarzo += importeMarzo;
        totalAbril += importeAbril;
        totalMayo += importeMayo;
        totalJunio += importeJunio;
        totalJulio += importeJulio;
        totalAgosto += importeAgosto;
        totalSetiembre += importeSetiembre
        totalOctubre += importeOctubre;
        totalNoviembre += importeNoviembre;
        totalDiciembre += importeDiciembre;
        totalGeneral += importe;
    }

    console.log('dentro de la funcion groupBy:claveAgrupado:', claveAgrupado);
    return claveAgrupado;
};

//console.log('gruopBy2(mes):',groupBy(items,'categoria'));
function groupBy(items, clave) {//funcion que recibe un lista de objetos y agrupa segun clave,porejemplo el mes y por variable importe iguala concepto en estecaso
    let itemsAgrupado = [];//agrupa objetos en cada mes = clave  e importes=concepto ejemplo: {"id": 1,"values": {"mes": "Setiembre","concepto": 30113}}
    let elementosUnicos = eliminarDuplicados(items, clave);//type array, de los items elimina los meses duplicados=clave, se puede sar la funcion set() que solo almacena elemntos unicos
    //console.log('elementosUnicos in groupBy2:',elementosUnicos);

    let contador = 1;
    for (const valor of elementosUnicos) {//coge cada valor=mes y compara para extraer el valor
        let objeto = {}
        objeto.id = contador;
        objeto['values'] = {};
        objeto['values'][clave] = valor;
        for (const fila of items) {

            if (fila['values'][clave] == valor) {//verificamos si el objeto correspondiente a la fila contine el mes que se esta recorriendo, ejemplo enero

                for (let propiedad in fila['values']) {//recorriendo cada propiedad(clave) del objeto values{}
                    if (typeof fila['values'][propiedad] === "number") {
                        objeto['values'][propiedad] = (objeto['values'][propiedad] || 0) + fila['values'][propiedad];
                    }
                }

            }
        }

        itemsAgrupado.push(objeto);
        contador++;
        //queda asi ejemplo: {"id": 4,"values": {"mes": "Setiembre","concepto": 30113}}
    }
    return itemsAgrupado;
};

function groupBy3(items, clave, columna) {//funcion que recibe un lista de objetos y agrupa segun clave,porejemplo el mes y por variable importe iguala concepto en estecaso
    let itemsAgrupado = [];//agrupa objetos en cada mes = clave  e importes=concepto ejemplo: {"id": 1,"values": {"mes": "Setiembre","concepto": 30113}}
    let elementosUnicos = eliminarDuplicados(items, clave);//type array, de los items elimina los meses duplicados=clave, se puede sar la funcion set() que solo almacena elemntos unicos
    let categorias = eliminarDuplicados(items, columna);//type array, de los items elimina los meses duplicados=clave, se puede sar la funcion set() que solo almacena elemntos unicos
    let titulos = []
    //console.log('elementosUnicos in groupBy2:',elementosUnicos);
    //let titulo={};
    //titulo[`${clave.toUpperCase()}`]=clave;
    //titulos.push(titulo)
    let contador = 1;
    for (const valor of elementosUnicos) {//coge cada valor=mes y compara para extraer el valor
        //let titulo={};
        let objeto = {}
        objeto.id = contador;
        objeto['values'] = {};
        objeto['values'][clave] = valor;

        for (const fila of items) {

            if (fila['values'][clave] == valor) {//verificamos si el objeto correspondiente a la fila contine el mes que se esta recorriendo, ejemplo enero
                for (let propiedad in fila['values']) {//recorriendo cada propiedad(clave) del objeto values{}
                    if (typeof fila['values'][propiedad] === "number") {
                        objeto['values'][propiedad] = (objeto['values'][propiedad] || 0) + fila['values'][propiedad];

                        for (let categoria of categorias) {
                            if (fila['values'][columna] == categoria) {
                                objeto['values'][`${propiedad}-${categoria}`] = (objeto['values'][`${propiedad}-${categoria}`] || 0) + fila['values'][propiedad];

                            } else {
                                objeto['values'][`${propiedad}-${categoria}`] = objeto['values'][`${propiedad}-${categoria}`] || 0;

                            }

                            //titulo[`${categoria.toUpperCase()}`]=`${propiedad}-${categoria}`
                        }

                    }

                }

            }
        }

        itemsAgrupado.push(objeto);
        contador++;
        //queda asi ejemplo: {"id": 4,"values": {"mes": "Setiembre","concepto": 30113}}
    }
    //titulos.push(titulo)
    return { Datos: itemsAgrupado, Titulo: titulos };
};

console.log('groupBy3(items,cliente,mes):', groupBy3(items, 'cliente', 'mes'));
