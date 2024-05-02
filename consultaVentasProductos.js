import {onGetVentas,onGetProduct} from './firebase.js'
import {Datatable} from './dataTable.js'

const ctx       =document.getElementById('myChart');
const ctx2      =document.getElementById('myChart2');
const ctx3      =document.getElementById('myChart3');
const tabs      =document.querySelectorAll('.tabs li')
const panels    =document.querySelectorAll('.panels div')
const indicador =document.querySelector('.indicador')
const nombreMes =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']
/*
const productos=[];
const registroProductos = onGetProduct((querySnapshot) =>{

    querySnapshot.forEach(doc =>{
    let producto ={};
    producto.id         = doc.id
    producto.value      = doc.data()
    producto.value.id=doc.id
    let producto4={codigo:producto.value.id,categoria:producto.value.categoria}
    productos.push(producto4);
    })
})
*/
const claves={
EB0010:'Embalaje',EB0011:'Embalaje',EB0020:'Embalaje',EB0021:'Embalaje',EB0022:'Embalaje',EB0030:'Embalaje',EB0050:'Embalaje',
EB0051:'Embalaje',EB0052:'Embalaje',EB0053:'Embalaje',EB0060:'Embalaje',MB0010:'Aditivos',MB0011:'Aditivos',MB0012:'Aditivos',
MB0013:'Aditivos',MB0014:'Aditivos',MB0015:'Aditivos',PB0070:'Piñateria',PC0050:'Especial',PD0070:'Paliglobos',PD0071:'Paliglobos',
PD0072:'Paliglobos',PD0073:'Paliglobos',PD0074:'Paliglobos',PD0075:'Paliglobos',PD0076:'Paliglobos',PG0070:'Paliglobos',PG0071:'Paliglobos',
PG0072:'Paliglobos',PG0073:'Paliglobos',PG0074:'Paliglobos',PG0075:'Paliglobos',PG0076:'Paliglobos',PI0010:'Aditivos',
PI0011:'Aditivos',PI0012:'Aditivos',PI0013:'Aditivos',PP0010:'Material',PP0011:'Material',PV0010:'Material',
SB0050:'Sorbetes',SB0051:'Sorbetes',SB0052:'Sorbetes',SB0070:'Sorbetes',SD0070:'Forrados',SF0010:'Flexibles',
SF0011:'Flexibles',SF0012:'Flexibles',SF0013:'Flexibles',ST0070:'Sorbeton',ST0071:'Sorbeton',ST6000:'Sorbeton',ST7001:'Sorbeton',
ST7003:'Sorbeton',SD7000:'Sorbeton',SD7001:'Sorbeton',SD7003:'Sorbeton',CU1000:'Cubiertos',PR1000:'Cubiertos'
}
//console.log('productos:',claves)

//event click a 
    //todos los .li quitar la clase activo
    //todos.panels quitar clase activo
    // .li con la posicion le añadimos la calse activo
    //.panels con la posicion le añadimos la clase activo

tabs.forEach((cadatabs,i)=>{
    tabs[i].addEventListener('click',()=>{

        tabs.forEach((cadatabs,j)=>{//Recorrer todos los .tabs
            tabs[j].classList.remove('activo')//Quitando la clase activo a cada li
            panels[j].classList.remove('activo')//Quitando la clase activo a cada panels
        })

        tabs[i].classList.add('activo')
        panels[i].classList.add('activo')
        indicador.style.left=`calc(calc(100%/5)*${i})`
    })
})

let items           =[] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
let totalImporte    =0;
let totalGeneral    =0;
let totalAgosto     =0;
let totalSetiembre  =0;
let totalOctubre    =0;
let totalNoviembre  =0;
let totalDiciembre  =0;
let totalEnero      =0;
let totalFebrero    =0;
let totalMarzo      =0;
let totalAbril      =0;

const registroVentas = onGetVentas((ventasSnapShot) =>{
    let itemsZ =[] // itmes sin detallede cotizacion o pedido, formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
    let ventaTotalCliente=[]//venta total por cliente o agregado total de ventas por cliente
    let ventaTotalProducto=[]

    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            //let documento=doc.data()
            let producto2={}
                producto2.id=doc.id
                producto2.values=doc.data()
                itemsZ.push(producto2)
            let detalle=JSON.parse(producto2['values'].detalleCotizacion)
            
            
            if (producto2['values'].estado!='nuevo') {
                for (const fila of detalle) {//cada fila de detalle se extrae y tralada a values
                    let producto ={}
                    producto.id             = doc.id
                    producto.values         = fila
                    //producto.values.estado         = fila
                    producto.values.fecha   = producto2['values'].fecha
                    producto.values.categoria=claves[producto.values.id];
                    
                    producto.values.numero  = producto2['values'].numero
                    producto.values.cliente = producto2['values'].cliente
                    producto.values.mes     = nombreMes[new Date(`${producto2['values'].fechaEnvio}T12:00:00Z`).getMonth()]; 
                    producto.values.margen  = producto.values.importe-producto['values'].costo*producto['values'].cantidad;
                    totalImporte+=Math.round(producto['values'].importe);
                    items.push(producto)
                }
            }
            
            //console.log('grupos3:',grupos3);  
        })
    }

    //let items=itemsX.filter((obj)=>{return obj['values'].estado!=='nuevo'})
    let items2=itemsZ.filter((obj)=>{return obj['values'].estado!=='nuevo'})
    console.log('contenido items:',items); 
    console.log('contenido items2:',items2); 
    
    
    let clientesUnicos=eliminarDuplicados(items2,'cliente');//del array de objetos items2 se extrae nombres unicos de clientes para titulo o evaluar.
    let codigoProductoUnicos=eliminarDuplicados(items,'id');//del array de objetos items se extrae id unicos de Productos para titulo.
    
    let contador=1;
    for (const nombreCliente of clientesUnicos) {
        let producto    ={}
        let cantidad    =0;
        let costo       =0;
        let importe     =0;
        let margen      =0;

        for (const fila of items) {
            if (fila['values'].cliente==nombreCliente) {
                cantidad    += fila['values'].cantidad;
                importe     += fila['values'].importe;
                costo       += fila['values'].costo*fila['values'].cantidad;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.cliente=nombreCliente;
        producto.values.cantidad = cantidad;
        producto.values.costo = Math.round(costo);
        producto.values.importe = Math.round(importe);
        producto.values.margen = Math.round(margen);
        ventaTotalCliente.push(producto);
        contador++;
    }
    console.log('ventaTotalCliente: es',ventaTotalCliente)
    let contador2=1;
    for (const cod of codigoProductoUnicos) {//despues de agrupar en elementos unicos los titulos, ahora hay que comparar cada fila con el titulo y agregar sus nombreClientees
        let producto={}
        let cantidad=0;
        let costo=0;
        let importe=0;
        let margen=0;

        for (const fila of items) {
            if (fila['values'].id==cod) {
                cantidad    += fila['values'].cantidad;
                costo       += fila['values'].costo*fila['values'].cantidad;
                importe     += fila['values'].importe;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.codigo=cod;
        producto.values.cantidad = cantidad;
        producto.values.costo = costo;
        producto.values.importe = importe;
        producto.values.margen = Math.round(margen);
        ventaTotalProducto.push(producto);
        contador2++;
    }

    //pruebas
    console.log('Dentro de la funcion groupBy:importe',groupBy(items,'cliente','importe'));
    console.log('Dentro de la funcion groupBy:margen',groupBy(items,'mes','margen'));


    //console.log('llamanda funcion groupBy:',groupByMes(items))
    
    let valores2=groupByCategoria(items,'categoria');
    console.log('llamanda items:',items)
    console.log('totalImporte:',totalImporte)
    items2.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b

    
    let ventaMesClientes = groupByMesClave(items,'cliente')
    
    console.log('ventaMesClientes para tabla:',ventaMesClientes)

    //venta por cliente
    //const titulo   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',CODIGO:'codigo',NOMBRE:'nombre',CANTIDAD:'cantidad',IMPORTE:'importe',COSTO:'costo'}
    const titulo   = {CLIENTE:'cliente',AGOSTO:'agosto',SETIEMBRE:'setiembre', OCTUBRE:'octubre', NOVIEMBRE:'noviembre',DICIEMBRE:'diciembre',ENERO:'enero',FEBRERO:'febrero',MARZO:'marzo',ABRIL:'abril',IMPORTE:'importe'}
    const tituloFoot   = {
        CLIENTE:'TOTAL',
        AGOSTO:     Intl.NumberFormat('es-419').format(Math.round(totalAgosto)),
        SETIEMBRE:  Intl.NumberFormat('es-419').format(Math.round(totalSetiembre)),
        OCTUBRE:    Intl.NumberFormat('es-419').format(Math.round(totalOctubre)),
        NOVIEMBRE:  Intl.NumberFormat('es-419').format(Math.round(totalNoviembre)),
        DICIEMBRE:  Intl.NumberFormat('es-419').format(Math.round(totalDiciembre)),
        ENERO:      Intl.NumberFormat('es-419').format(Math.round(totalEnero)),
        FEBRERO:    Intl.NumberFormat('es-419').format(Math.round(totalFebrero)),
        MARZO:    Intl.NumberFormat('es-419').format(Math.round(totalMarzo)),
        ABRIL:    Intl.NumberFormat('es-419').format(Math.round(totalAbril)),
        TOTAL:      Intl.NumberFormat('es-419').format(Math.round(totalGeneral))
    }
    const dt = new Datatable('#dataTable',[]);
    dt.setDatos(ventaMesClientes,titulo,tituloFoot);
    dt.renderTable();

    //venta por categoria
    const titulo2   = {CATEGORIA:'categoria',IMPORTE:'importe',MARGEN:'margen','%':'porcentaje','%Total':'porcentajeTotal'}
    //const titulo2   = {' ':'',CODIGO:'codigo',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
    const dt2 = new Datatable('#dataTable2',[]);
    
    dt2.setData(valores2,titulo2);
    dt2.renderTable();

    //venta mes a mes por producto:
    let ventaMesProducto = groupByMesClave(items,'categoria')
    console.log('ventaMesProducto:',ventaMesProducto)
        const titulo3   = {PRODUCTO:'categoria',AGOSTO:'agosto',SETIEMBRE:'setiembre', OCTUBRE:'octubre', NOVIEMBRE:'noviembre',DICIEMBRE:'diciembre',ENERO:'enero',FEBRERO:'febrero',MARZO:'marzo',ABRIL:'abril',IMPORTE:'importe'}
        const titulo3Foot   = {PRODUCTO:'TOTAL',AGOSTO:Math.round(totalAgosto),SETIEMBRE:Math.round(totalSetiembre),OCTUBRE:Math.round(totalOctubre),NOVIEMBRE:Math.round(totalNoviembre),DICIEMBRE:Math.round(totalDiciembre),ENERO:Math.round(totalEnero),FEBRERO:Math.round(totalFebrero),MARZO:Math.round(totalMarzo),ABRIL:Math.round(totalAbril),TOTAL:Intl.NumberFormat('es-419').format(Math.round(totalGeneral))}
        //const titulo   = {' ':'',CLIENTE:'cliente',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
        const dt3 = new Datatable('#dataTable3',[]);
        dt3.setDatos(ventaMesProducto,titulo3,titulo3Foot);
        dt3.renderTable();




    //console.log('ventaTotalCliente:',ventaTotalCliente);
    const colorFondo    = ['rgba(255,99,132,0.2)','rgba(54,162,235,0.2)','rgba(255,206,86,0.2)','rgba(75,192,192,0.2)','rgba(153,102,255,0.2)','rgba(255,159,64,0.2)']
    const colorBorde    = ['rgba(255,99,132,1)','rgba(54,162,235,1)','rgba(255,206,86,1)','rgba(75,192,192,1)','rgba(153,102,255,1)','rgba(255,159,64,1)']


    //graico barras de venta total por cliente:
    const myChart = new Chart(ctx,{
                                    type:'bar',
                                    data:{
                                        labels:ventaTotalCliente.map(row => row.values.cliente),
                                        datasets:[{label:'S/',data:ventaTotalCliente.map(row => row.values.importe),
                                        backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]
                                    },
                                    plugins:{legend:{display:false}}
                                }
                            )

    const myChart2 = new Chart(ctx2,{type:'pie',data:{labels:valores2.map(row => row.values.categoria),datasets:[{label:'S/',data:valores2.map(row => row.values.importe),backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]}})
    
    //ventas por mes grafico y tabla
    let valores=groupByMes(items,'mes','importe','margen');
    console.log('llamanda funcion groupBy mes:',valores)
    const myChart3 = new Chart(ctx3,{type:'bar',data:{labels:valores.map(row => row.values.mes),datasets:[{label:'S/',data:valores.map(row => row.values.importe),backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]}})

    const titulo4   = {MES:'mes',IMPORTE:'importe',MARGEN:'margen'}
    const dt4 = new Datatable('#dataTable4',[]);
    dt4.setData(valores,titulo4);
    dt4.renderTable();

});

function filtrarYEliminarDuplicadosPorClave(arrayDeObjetos,clave) {//otro metodo de extraer valores unicos, no se usa solo es ilustrativo
    // Array para almacenar elementos únicos
    const clientesUnicos = [];

    // Objeto auxiliar para realizar un seguimiento de las claves vistos
    const clavesVistas = {};

    // Iteramos sobre el array de objetos
    arrayDeObjetos.forEach(objeto => {
        // Verificamos si el objeto tiene la clave proporcionada
        if (objeto.hasOwnProperty(clave) && objeto[clave] !== undefined) {
            const valor = objeto[clave];

            // Si no hemos visto esta clave antes, la agregamos al array y al objeto de seguimiento
            if (!clavesVistas.hasOwnProperty(valor)) {
                clavesVistas[valor] = true;
                elementosUnicos.push(objeto);
            }
        }
    });

    return elementosUnicos;
}

function eliminarDuplicados(arrayObjetos,clave){//recibe una lista de categoria duplicadas y reduce a unicos
    let grupos = []//para separar el atributo a reducir meses repetidos
    let elementosUnicos=[]//elementos unicos o meses unicos

    for (const fila of arrayObjetos) {//extraemos los valores de la categoria mes en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'][clave])
    }

    for (let i = 0; i < grupos.length; i++) {//reducimos los meses a elementos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos.length; j++) {//recorre toda la lista de elemntos unicos por cada fila de grupos
            if (grupos[i]== elementosUnicos[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){//solo agrega los que no aparecen en elemento unicos
            elementosUnicos.push(grupos[i]);
        }
    }
    return elementosUnicos;
}

//traer los socios comerciales clientes de firebase
function groupByMes(items,clave,concepto,concepto2){
    let itemsAgrupado=[]//mes(clave) e importe(concepto) 
    let elementosUnicos = eliminarDuplicados(items,clave);

    let contador=1;
    for (const valor of elementosUnicos) {
        let objeto={}
        objeto.id=contador;
        objeto.values={};
        objeto.values[clave]=valor;

        objeto['values'][concepto]      = 0;
        objeto['values'][concepto2]     = 0;
        
        for (const fila of items) {
            if (fila['values'][clave]==valor) {
                objeto['values'][concepto]     += Math.round(fila['values'][concepto]);
                objeto['values'][concepto2]    += Math.round(fila['values'][concepto2]);
            }
        }
        
        //objeto.values[concepto] = Math.round(acumulador);
        //objeto.values[concepto2] = Math.round(acumulador2);
        itemsAgrupado.push(objeto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","acumulador": 30113}}
    }
    //console.log('dentro de la funcion groupBy:itemsAgrupado...final');
    return itemsAgrupado;
}

function groupBy(items,clave,concepto){//funcion que recibe un lista de objetos y agrupa segun clave,porejemplo el mesy porvariuable importe iguala concepto en estecaso
    let itemsAgrupado=[]//agrupa en cada mes = clave  e importes=concepto
    let elementosUnicos = eliminarDuplicados(items,clave);//de los items elimina los meses duplicados=clave

    let contador=1;
    for (const valor of elementosUnicos) {//coge cada mes=valor y compara para extraer el valor
        let objeto={}
        let acumulador=0;
        
        for (const fila of items) {
            if (fila['values'][clave]==valor) {
                acumulador     += fila['values'][concepto];
            }
        }
        objeto.id=contador;
        objeto.values={};
        objeto.values[clave]=valor;
        objeto.values[concepto] = Math.round(acumulador);
        itemsAgrupado.push(objeto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","acumulador": 30113}}
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","acumulador2": 30113}}
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","acumulador3": 30113}}
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","acumulador4": 30113}}
    }
    //console.log('dentro de la funcion groupBy:itemsAgrupado...final');
    return itemsAgrupado;
}

function groupByCategoria(items,clave){
    
    let elementosUnicos = eliminarDuplicados(items,clave);
    let itemsAgrupado=[] 

    console.log('elementosunicos:',elementosUnicos)
    let contador=1;
    let importeTotal=188557;
    for (const valor of elementosUnicos) {
        
        let producto={}
        let importe=0;
        let margen=0;
        let costo=0;
        

        for (const fila of items) {
            if (fila['values'].categoria==valor) {
                importe     +=  fila['values'].importe;
                costo       +=  fila['values'].costo*fila['values'].cantidad;
                margen      +=  fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
                //porcentaje      += margen/importe
            }
        }
        
        //importeTotal+=importe;
        producto.id=contador;
        producto.values={};
        producto.values.categoria=valor;
        producto.values.importe = Math.round(importe);
        //producto.values.cantidad = cantidad;
        producto.values.margen = Math.round(margen);
        producto.values.porcentaje = (1/(1+costo/margen)).toFixed(2);
        producto.values.porcentajeTotal = (importe/importeTotal*100).toFixed(2);
        itemsAgrupado.push(producto);
        contador++;
        
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","importe": 30113}}
    }
    console.log('dentro de la funcion groupBy:itemsAgrupado...final',itemsAgrupado);
    return itemsAgrupado;
}

function groupByMesClave(items,clave){//la clave puede ser por ejemplo cliente
    
    let elementosUnicosClave = eliminarDuplicados(items,clave);
    let claveAgrupado=[]
    let arrayMeses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']

    //console.log('elementosunicosClave:',elementosUnicosClave)

    totalImporte    =0;
    totalGeneral    =0;
    totalAgosto     =0;
    totalSetiembre  =0;
    totalOctubre    =0;
    totalNoviembre  =0;
    totalDiciembre  =0;
    totalEnero      =0;
    totalFebrero    =0;
    totalMarzo      =0;
    totalAbril      =0;

    let contador=1;


    for (const nombreClave of elementosUnicosClave) {//para este caso el nombreClave se refiere al nombreCliente. cliente de elementos unicos
        let producto={}
        let importe=0;
        let importeAgosto=0;
        let importeSetiembre=0;
        let importeOctubre=0;
        let importeNoviembre=0;
        let importeDiciembre=0;
        let importeEnero=0;
        let importeFebrero=0;
        let importeMarzo=0;
        let importeAbril=0;
        let margen=0;
        let cantidad=0
        let costo=0;

        for (const fila of items) {
            if (fila['values'][clave]==nombreClave) {//si coincide acumular por cliente
                cantidad            +=fila['values'].cantidad;
                costo               +=fila['values'].costo*fila['values'].cantidad;
                margen              += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
                importe             += fila['values'].importe;

                if (fila['values'].mes=='Agosto') {
                    importeAgosto       += fila['values'].importe;
                }
                if (fila['values'].mes=='Setiembre') {
                    importeSetiembre    += fila['values'].importe;
                }
                if (fila['values'].mes=='Octubre') {
                    importeOctubre      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Noviembre') {
                    importeNoviembre      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Diciembre') {
                    importeDiciembre      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Enero') {
                    importeEnero      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Febrero') {
                    importeFebrero      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Marzo') {
                    importeMarzo      += fila['values'].importe;                    
                }
                if (fila['values'].mes=='Abril') {
                    importeAbril      += fila['values'].importe;                    
                }
            }
        }
        producto.id=contador;
        producto.values={};
        producto['values'][clave]=nombreClave;
        producto.values.importe = Intl.NumberFormat('es-419').format(Math.round(importe));
        producto.values.cantidad = cantidad;
        producto.values.margen = Math.round(margen);
        producto.values.costo = Math.round(costo);
        producto.values.agosto = Math.round(importeAgosto);
        producto.values.setiembre = Math.round(importeSetiembre);
        producto.values.octubre = Math.round(importeOctubre);
        producto.values.noviembre = Math.round(importeNoviembre);
        producto.values.diciembre = Math.round(importeDiciembre);
        producto.values.enero = Math.round(importeEnero);
        producto.values.febrero = Math.round(importeFebrero);
        producto.values.marzo = Math.round(importeMarzo);
        producto.values.abril = Math.round(importeAbril);
        claveAgrupado.push(producto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","importe": 30113}}
        totalGeneral    +=importe;
        totalAgosto     +=importeAgosto;
        totalSetiembre  +=importeSetiembre
        totalOctubre    +=importeOctubre;
        totalNoviembre  +=importeNoviembre;
        totalDiciembre  +=importeDiciembre;
        totalEnero      +=importeEnero;
        totalFebrero    +=importeFebrero;
        totalMarzo      +=importeMarzo;
        totalAbril      +=importeAbril;
    }

    console.log('dentro de la funcion groupBy:claveAgrupado...final',totalGeneral,totalDiciembre);
    return claveAgrupado;
}