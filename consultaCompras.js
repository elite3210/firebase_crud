import {db} from './firebase.js'
import {collection,onSnapshot} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {Datatable} from './dataTable.js'


const onGetCompras  = (callback)=> onSnapshot(collection(db,'Compras'),callback)

/*
//const date = new Date("2000-01-17T16:45:30");
const date = new Date("2023/9/29");
const [month, day, year] = [
  date.getMonth(),
  date.getDate(),
  date.getFullYear()
]
console.log('Dia-Mes-Año:',day,month+1,year)
console.log('tiempo',date.getTime())

nuevaVariable=new Date (milisegundos)
*/

//traer los socios comerciales clientes de firebase

const nombreMes=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']
const registroCompras = onGetCompras((comprasSnapShot) =>{
    let items =[]
    let comprasTotal=0
    console.log('comprasSnapShot:',comprasSnapShot);
    
    if(comprasSnapShot){
        comprasSnapShot.forEach(doc =>{
            let obj ={};
            obj.id=doc.id
            obj.values=doc.data()
            obj.values.mes=nombreMes[new Date(obj.values.tiempo).getMonth()];
            let date = new Date(obj.values.tiempo);
            obj.values.fechaRegistro=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            
            //console.log('obj.values:',obj.values);
            
            let detalle=JSON.parse(obj['values'].detalleCompra)
            let importeTotal = detalle.reduce((total,obj)=>{return total+obj.importe},0)
            comprasTotal +=importeTotal

            obj['values'].importe=Math.round(importeTotal)
            //obj['values'].id=obj.values.numero
            items.push(obj)
        })
    }
    
    console.log(' consulta venta :',items)

    items.sort((a, b) => b.values.nuevoNumero - a.values.nuevoNumero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    
    
    const titulo   = {' ':'',DOCUMENTO:'nuevoNumero',PROVEEDOR:'proveedor',RUC:'ruc',FECHA:'fecha',REGISTRO:'fechaRegistro',FACTURA:'documento',IMPORTE:'importe'}
    
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

