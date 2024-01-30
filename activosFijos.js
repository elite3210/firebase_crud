import {db} from './firebase.js'
import {collection,onSnapshot} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {Datatable} from './dataTable.js'


const onGetCompras  = (callback)=> onSnapshot(collection(db,'ActivosFijos'),callback)

//traer todos los socios comerciales clientes de firebase

const registroCompras = onGetCompras((comprasSnapShot) =>{
    let items =[]
    let comprasTotal=0
    console.log('comprasSnapShot:',comprasSnapShot);
    
    if(comprasSnapShot){
        comprasSnapShot.forEach(doc =>{
            let obj ={};
            obj.id=doc.id
            obj.values=doc.data()

            items.push(obj)
        })
    }
    
    console.log(' consulta venta :',items)

    items.sort((a, b) => b.values.nuevoNumero - a.values.nuevoNumero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    
    
    const titulo   = {' ':'',NOMBRE:'nombre',IMPORTE:'valorActual',ORIGEN:'origen',AÑO:'ano',MARCA:'marca'}
    
    const dt = new Datatable('#dataTable',
    [
        {id:'btnEdit',text:'editar',icon:'edit',
        action:function(){
            const elementos=dt.getSelected(); 
            console.log('editar datos...',elementos);
        }},
        {id:'btnDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
    ]
    );
    
    dt.setData(items,titulo);
    dt.makeTable();
    
});