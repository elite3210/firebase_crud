import {queryProduccion} from './firebase.js'
import {Datatable} from './dataTable.js'


//traer los registros de produccion de firebase
console.log('queryProduccion trajo:',queryProduccion)


let pesoTotal=0
let cantidadTotal=0
const items =[]

queryProduccion.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    
    const obj       ={}
    let value       =doc.data()
    obj.id          =doc.id
    let detalle     = JSON.parse(value.detalleProduccion)[0]//solo muestra la primera fila del obj, usar method reduce para importe

    delete value['almacen']
    delete value['detalleProduccion']
    delete value['estado']
    delete value['fechaRegistro']
    delete value['usuario']
    /*
    delete detalle['activo']
    delete detalle['almacen']
    delete detalle['atributos']
    delete detalle['categoria']
    delete detalle['costo']
    delete detalle['descripcion']
    delete detalle['fecha']
    delete detalle['imagen']
    delete detalle['peso']
    delete detalle['precio']
    delete detalle['precio_anterior']
    delete detalle['stock']
    delete detalle['web_site']
    */
    detalle['importe']=Math.round(detalle['importe'])

    obj.values= {...value,...detalle}    

    items.push(obj)
    pesoTotal   +=detalle.importe
    cantidadTotal   +=detalle.cantidad
});

/*
activo
: 
"1"
almacen
: 
"Chimpu"
atributos
: 
(2) ['Surtido', '22cm']
cantidad
: 
92
categoria
: 
"Descartables"
costo
: 
0.68
descripcion
: 
"Sorbetes clásico rayado S/M "
detalleProduccion
: 
"[{\"activo\":\"1\",\"web_site\":true,\"categoria\":\"Descartables\",\"descripcion\":\"Sorbetes clásico rayado S/M \",\"costo\":0.68,\"precio\":\"10.7\",\"precio_anterior\":\"14\",\"unidad\":\"Planchas\",\"atributos\":[\"Surtido\",\"22cm\"],\"almacen\":\"Chimpu\",\"peso\":\"0.68\",\"imagen\":\"img/sorbetes_rayados_clasicos.jpg\",\"nombre\":\"Sorbetes Rayados Surtido S/M \",\"stock\":450,\"id\":\"SB0070\",\"cantidad\":92,\"importe\":62.56}]"
estado
: 
"pendiente"
fecha
: 
"2023-08-25"
fechaRegistro
: 
"25/8/2023"
id
: 
"SB0070"
imagen
: 
"img/sorbetes_rayados_clasicos.jpg"
importe
: 
62.56
nombre
: 
"Sorbetes Rayados Surtido S/M "
peso
: 
"0.68"
precio
: 
"10.7"
precio_anterior
: 
"14"
stock
: 
450
unidad
: 
"Planchas"
usuario
: 
"Angela "
*/

console.log('items',items)

document.getElementById('cantidadTotal').textContent=cantidadTotal;
document.getElementById('pesoTotal').textContent=pesoTotal;
console.log('peso y Cantidad:',pesoTotal,cantidadTotal)

const titulo   = {' ':'',FECHA:'fecha',CODIGO:'id',PRODUCTO:'nombre',CANTIDAD:'cantidad',UNIDAD:'unidad',PESO:'importe'}

const dt = new Datatable('#dataTable',
[
    {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
    {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
]);

dt.setData(items,titulo);
dt.makeTable();