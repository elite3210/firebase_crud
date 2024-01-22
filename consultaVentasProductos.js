import {onGetVentas,onGetProduct} from './firebase.js'
import {Datatable} from './dataTable.js'

const ctx=document.getElementById('myChart');
const ctx2=document.getElementById('myChart2');
const ctx3=document.getElementById('myChart3');
const li        = document.querySelectorAll('.li')
const bloque    = document.querySelectorAll('.bloque')
const indicador    = document.querySelector('.indicador')
const nombreMes=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']
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
ST7003:'Sorbeton',SD7000:'Sorbeton'
}
//console.log('productos:',claves)

//event click a 
    //todos los .li quitar la clase activo
    //todos.bloque quitar clase activo
    // .li con la posicion le añadimos la calse activo
    //.bloque con la posicion le añadimos la clase activo

li.forEach((cadaLi,i)=>{
    li[i].addEventListener('click',()=>{

        li.forEach((cadaLi,j)=>{//Recorrer todos los .li
            li[j].classList.remove('activo')//Quitando la clase activo a cada li
            bloque[j].classList.remove('activo')//Quitando la clase activo a cada bloque
        })

        li[i].classList.add('activo')
        bloque[i].classList.add('activo')
        indicador.style.left=`calc(calc(100%/5)*${i})`
    })
})

let items =[] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
let xyz='mes'
let totalImporte=0;
let totalGeneral=0;
let totalAgosto=0;
let totalSetiembre=0;
let totalOctubre=0;
let totalNoviembre=0;
let totalDiciembre=0;
let totalEnero=0;

function filtrarYEliminarDuplicadosPorClave(arrayDeObjetos,clave) {
    // Array para almacenar elementos únicos
    const elementosUnicos = [];

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
                objeto['values'][concepto]     += fila['values'][concepto];
                objeto['values'][concepto2]    += fila['values'][concepto2];
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

function groupBy(items,clave,concepto){
    let itemsAgrupado=[]//meses e importes 
    let elementosUnicos = eliminarDuplicados(items,clave);

    let contador=1;
    for (const valor of elementosUnicos) {
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
    for (const valor of elementosUnicos) {
        let producto={}
        let importe=0;
        let margen=0;
        let costo=0;

        for (const fila of items) {
            if (fila['values'].categoria==valor) {
                importe     += fila['values'].importe;
                costo +=fila['values'].costo*fila['values'].cantidad;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
                //porcentaje      += margen/importe
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.categoria=valor;
        producto.values.importe = Math.round(importe);
        //producto.values.cantidad = cantidad;
        producto.values.margen = Math.round(margen);
        producto.values.porcentaje = (1/(1+costo/margen)).toFixed(2);
        itemsAgrupado.push(producto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","importe": 30113}}
    }
    console.log('dentro de la funcion groupBy:itemsAgrupado...final',itemsAgrupado);
    return itemsAgrupado;
}

function groupByCliente(items,clave){
    
    let elementosUnicosCliente = eliminarDuplicados(items,clave);
    let clientesAgrupado=[]

    //console.log('elementosunicosCliente:',elementosUnicosCliente)

    let contador=1;


    for (const valor of elementosUnicosCliente) {//por cada cliente de elementos unicos
        let producto={}
        let importe=0;
        let importeAgosto=0;
        let importeSetiembre=0;
        let importeOctubre=0;
        let importeNoviembre=0;
        let importeDiciembre=0;
        let importeEnero=0;
        let margen=0;
        let cantidad=0
        let costo=0;
        /*
        //for (let j = 1; j < Object.values(this.headers).length; j++) {
            let claves=Object.keys(values);
            for (let i = 1; i < claves.length; i++) {
                if (Object.values(this.headers)[j]==claves[i]) {
                    console.log('values[key]:',values[claves[i]])
                    //totals.claves[i]  +=values[claves[i]];
                }
                //const element = array[i];
                
            }
        }
        */
        //elementosUnicosMes


        for (const fila of items) {
            if (fila['values'].cliente==valor) {//si coincide acumular por cliente
                cantidad+=fila['values'].cantidad;
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
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.cliente=valor;
        producto.values.importe = Math.round(importe);
        producto.values.cantidad = cantidad;
        producto.values.margen = Math.round(margen);
        producto.values.costo = Math.round(costo);
        producto.values.agosto = Math.round(importeAgosto);
        producto.values.setiembre = Math.round(importeSetiembre);
        producto.values.octubre = Math.round(importeOctubre);
        producto.values.noviembre = Math.round(importeNoviembre);
        producto.values.diciembre = Math.round(importeDiciembre);
        producto.values.enero = Math.round(importeEnero);
        clientesAgrupado.push(producto);
        contador++;
        //queda asi ejemplo: {"id": 2,"values": {"mes": "Setiembre","importe": 30113}}
        totalGeneral+=importe;
        totalAgosto+=importeAgosto;
        totalSetiembre+=importeSetiembre
        totalOctubre+=importeOctubre;
        totalNoviembre+=importeNoviembre;
        totalDiciembre+=importeDiciembre;
        totalEnero+=importeEnero;

    }
    console.log('dentro de la funcion groupBy:clientesAgrupado...final',totalGeneral,totalDiciembre);
    return clientesAgrupado;
}

const registroVentas = onGetVentas((ventasSnapShot) =>{
    let items2 =[] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
    let itemsAgrupado=[]
    let itemsAgrupado2=[]
    let grupos=[]//de esto filtraremos para titulos clientes
    let grupos2=[]//de esto filtraremos para titulos productos codigo

    //console.log('ventasSnapShot:',ventasSnapShot);

    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            let documento=doc.data()
            let producto2={}
            producto2.id=doc.id
            producto2.values=doc.data()
            items2.push(producto2)
            let detalle=JSON.parse(documento.detalleCotizacion)
            
            

            for (const fila of detalle) {
                let producto ={}
                producto.id             = doc.id
                producto.values         = fila
                producto.values.fecha   = documento.fecha
                producto.values.categoria=claves[producto.values.id];
                
                producto.values.numero  = documento.numero
                producto.values.cliente = documento.cliente
                producto.values.mes     = nombreMes[new Date(documento.tiempo).getMonth()];
                producto.values.margen     = producto.values.importe-producto['values'].costo*producto['values'].cantidad;
                totalImporte+=Math.round(producto['values'].importe);
                items.push(producto)
                grupos.push(documento.cliente)
                grupos2.push(fila.id)
            }
            //console.log('grupos3:',grupos3);  
        })
    }
    //console.log('contenido items:',items); 
    
    let elementosUnicos=[];
    let elementosUnicos2=[];

    
    for (let i = 0; i < grupos.length; i++) {//reducimos a elemtos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos.length; j++) {
            if (grupos[i]== elementosUnicos[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){
            elementosUnicos.push(grupos[i]);
        }
    }

    for (let i = 0; i < grupos2.length; i++) {//reducimos a elemtos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos2.length; j++) {
            if (grupos2[i]== elementosUnicos2[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){
            elementosUnicos2.push(grupos2[i]);
        }
    }

    let contador=1;
    for (const cod of elementosUnicos) {
        let producto={}
        let cantidad=0;
        let costo=0;
        let importe=0;
        let margen=0;

        for (const fila of items) {
            if (fila['values'].cliente==cod) {
                cantidad    += fila['values'].cantidad;
                importe     += fila['values'].importe;
                costo       += fila['values'].costo*fila['values'].cantidad;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.cliente=cod;
        producto.values.cantidad = cantidad;
        producto.values.costo = Math.round(costo);
        producto.values.importe = Math.round(importe);
        producto.values.margen = Math.round(margen);
        itemsAgrupado.push(producto);
        contador++;
    }

    let contador2=1;
    for (const cod of elementosUnicos2) {//despues de agrupar en elementos unicos los titulos, ahora hay que comparar cada fila con el titulo y agregar sus valores
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
        itemsAgrupado2.push(producto);
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

    
    let ventaClientes = groupByCliente(items,'cliente')
    console.log('ventaClientes',ventaClientes)

    //venta por cliente
    //const titulo   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',CODIGO:'codigo',NOMBRE:'nombre',CANTIDAD:'cantidad',IMPORTE:'importe',COSTO:'costo'}
    const titulo   = {CLIENTE:'cliente',AGOSTO:'agosto',SETIEMBRE:'setiembre', OCTUBRE:'octubre', NOVIEMBRE:'noviembre',DICIEMBRE:'diciembre',ENERO:'enero',IMPORTE:'importe'}
    const tituloFoot   = {CLIENTE:'TOTAL',AGOSTO:Math.round(totalAgosto),SETIEMBRE:Math.round(totalSetiembre),OCTUBRE:Math.round(totalOctubre),NOVIEMBRE:Math.round(totalNoviembre),DICIEMBRE:Math.round(totalDiciembre),ENERO:Math.round(totalEnero),IMPORTE:Math.round(totalGeneral)}
    const dt = new Datatable('#dataTable',[]);
    dt.setDatos(ventaClientes,titulo,tituloFoot);
    dt.renderTable();

    //venta por producto
    const titulo2   = {CATEGORIA:'categoria',IMPORTE:'importe',MARGEN:'margen','%':'porcentaje'}
    //const titulo2   = {' ':'',CODIGO:'codigo',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
    const dt2 = new Datatable('#dataTable2',[]);
    
    dt2.setData(valores2,titulo2);
    dt2.renderTable();

    //venta por documento
        const titulo3   = {DOCUMENTO:'numero',FECHA:'fecha',NOMBRE:'cliente',PAGO:'tipoPago',IMPORTE:'importeTotal'}
        const titulo3Foot   = {FECHA:'TOTAL',DOCUMENTO:'',NOMBRE:'',PAGO:'',IMPORTE:totalImporte}
        //const titulo   = {' ':'',CLIENTE:'cliente',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
        const dt3 = new Datatable('#dataTable3',[]);
        dt3.setDatos(items2,titulo3,titulo3Foot);
        dt3.renderTable();




    //console.log('itemsAgrupado:',itemsAgrupado);
    const colorFondo    = ['rgba(255,99,132,0.2)','rgba(54,162,235,0.2)','rgba(255,206,86,0.2)','rgba(75,192,192,0.2)','rgba(153,102,255,0.2)','rgba(255,159,64,0.2)']
    const colorBorde    = ['rgba(255,99,132,1)','rgba(54,162,235,1)','rgba(255,206,86,1)','rgba(75,192,192,1)','rgba(153,102,255,1)','rgba(255,159,64,1)']

    //console.log('map:',itemsAgrupado.map(row => row.values.codigo));
    //console.log('map:',itemsAgrupado.map(row => row.values.importe));
    //console.log('map2:',itemsAgrupado2.map(row => row.values.codigo));
    //console.log('map2:',itemsAgrupado2.map(row => row.values.importe));
    //console.log('map3:',itemsAgrupado3.map(row => row.values.importe));
    const myChart = new Chart(ctx,{
                                    type:'bar',
                                    data:{
                                        labels:itemsAgrupado.map(row => row.values.cliente),
                                        datasets:[{label:'S/',data:itemsAgrupado.map(row => row.values.importe),backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]
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


   /*
   var data = [{
    data: [50, 55, 60, 33],
    backgroundColor: [
      "#4b77a9",
      "#5f255f",
      "#d21243",
      "#B27200"
    ],
    borderColor: "#fff"
  }];
  
  var options = {
    tooltips: {enabled: true},
    plugins: {
        datalabels: {
            formatter: (value, ctx3) => {
                const datapoints = ctx3.chart.data.datasets[0].data
                 const total = datapoints.reduce((total, datapoint) => total + datapoint, 0)
                const percentage = value / total * 100
                return percentage.toFixed(2) + "%";
              },
        color: '#fff',
      }
    }
  };
  
  
  //var ctx = document.getElementById("pie-chart").getContext('2d');
  const myChart3 = new Chart(ctx3, {
    type: 'pie',
    data: {
    labels: ['India', 'China', 'US', 'Canada'],
    datasets: data
    },
    options: options
  });

*/
});
