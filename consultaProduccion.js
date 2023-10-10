import {produccionRef} from './firebase.js'
import {getDocs,query,where,orderBy,limit} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {Datatable} from './dataTable.js'

console.log('Modulo consultaProduccion.js trabajando... Inicio:')


const queryProduccion  = await getDocs(query(produccionRef,where("estado", "==", "pendiente"),orderBy('numero','desc')));


//traer los registros de produccion de firebase
console.log('queryProduccion trajo:',queryProduccion)


let pesoTotal=0
let cantidadTotal=0
const items =[]

//actualizarTodo()//no llamar a esta funcion...reemplaza fechas


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
    delete value['usuario']

    delete detalle['fecha']
    delete detalle['imagen']
    delete detalle['precio_anterior']
    delete detalle['web_site']
    delete detalle['atributos']
    delete detalle['activo']
    delete detalle['cantidad']


   //value['fechaRegistro2']=`${new Date(value['fechaRegistro']).getDate()+1}/${new Date(value['fechaRegistro']).getMonth()+1}/${new Date(value['fechaRegistro']).getFullYear()}`
    
    /*
    delete value['fechaRegistro']
    delete detalle['almacen']
    delete detalle['categoria']
    delete detalle['costo']
    delete detalle['descripcion']
    delete detalle['peso']
    delete detalle['precio']
    delete detalle['stock']
    */
   
    detalle['importe']=Math.round(detalle['importe'])

    obj.values= {...value,...detalle}    

    items.push(obj)
    pesoTotal   +=detalle.importe
    cantidadTotal   +=value.cantidad
});


console.log('items',items)

document.getElementById('cantidadTotal').textContent=cantidadTotal;
document.getElementById('pesoTotal').textContent=pesoTotal;
console.log(`Peso Total:${pesoTotal} Kg Cantidad:${cantidadTotal} Planchas`)

const titulo   = {' ':'',DOCUMENTO:'numero',FECHA:'fechaRegistro',CODIGO:'idProducto',PRODUCTO:'nombre',CANTIDAD:'cantidad',UNIDAD:'unidad',PESO:'importe'}

const dt = new Datatable('#dataTable',
[
    {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
    {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
]
);

dt.setData(items,titulo);
dt.makeTable();


function actualizarTodo(){//esta funcion debe borrarse , se utiliza para cambiar toda la fecha en base datos

    queryProduccion.forEach((doc) => {

        const obj       ={}
        let value       =doc.data()
        obj.id          =doc.id
        console.log('rechaRegistro:BD',value['fecha'])
    
        updateMovimientoInventario(doc.id,{fechaRegistro:value['fecha']})
    });
}

console.log('Modulo consultaProduccion.js trabajando... Final:')
