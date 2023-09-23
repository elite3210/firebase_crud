import {queryDiario} from './firebase.js'
import {Datatable} from './dataTable.js'

let items=[];
let items2=[];

async function datosFirestore(){
    console.log('queryDiario trajo:',queryDiario)

    queryDiario.forEach(doc => {
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

procesardatos(items)
console.log('items2_:',items2)

const titulo   = {' ':'',FECHA:'fecha',GLOSA:'glosa',CUENTA:'cuenta',DEBE:'debe',HABER:'haber'}

const dt = new Datatable('#dataTable',
[
    {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
    {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
]
);

dt.setData(items2,titulo);
dt.makeTable();

