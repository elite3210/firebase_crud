import {query41110} from './firebase.js'
import {Datatable} from './dataTable.js'

let items=[];
let items2=[];

function sumar(a,b){return a+b}

function dividir(a,b){return a/b}

function restar(a,b){return a-b}

function multiplicar(a,b){return a*b}


function operaciones(a,b,operacion){
    return operacion(a,b)
}

console.log('callback ejemplo:',operaciones(10,2,dividir))
console.log('callback ejemplo:',operaciones(10,2,sumar))
console.log('callback ejemplo:',operaciones(10,2,restar))
console.log('callback ejemplo:',operaciones(10,2,multiplicar))

async function datosFirestore(){
    console.log('queryDiario trajo:',query41110)

    query41110.forEach(doc => {
        const obj       ={}
        obj.id          =doc.id
        obj.values      =doc.data()
        items.push(obj)
    });
}

datosFirestore()
console.log('Datos Firestore:',items)

function procesardatos(arrayObj){

    arrayObj.forEach(asiento=>{
        
        const {id,values}=asiento;
        let valuesMovimiento     = JSON.parse(values['movimiento']);//array de dos obj
        console.log('valuesMovimiento:',valuesMovimiento)
        
        valuesMovimiento.forEach(mov=>{
            let obj ={}
            obj.id=id
            //const values2=[]
            delete values['movimiento']
            let objValue={...values,...mov}
            obj.values=objValue
            
            items2.push(obj)
        });  
    })
}

//renderizando la tabla
//procesardatos(items)
//console.log('items2_:',items2)

const titulo   = {' ':'',FECHA:'fecha',OPERACION:'numero',GLOSA:'glosa',CARGO:'debe',ABONO:'haber'}

const dt = new Datatable('#dataTable',
[
    {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
    {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
]
);

dt.setData(items,titulo);
dt.renderTable();


