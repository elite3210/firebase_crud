import {onGetVentas} from './firebase.js'
import {Datatable} from './dataTable.js'

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
const registroVentas = onGetVentas((ventasSnapShot) =>{
    let items =[]
    let ventasTotal=0
    //console.log('ventasSnapShot:',ventasSnapShot);
    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            let obj ={};
            obj.id=doc.id
            obj.values=doc.data()
            obj.values.mes=nombreMes[new Date(obj.values.tiempo).getMonth()];
            //console.log('obj.values:',obj.values);
            
            let detalle=JSON.parse(obj['values'].detalleCotizacion)
            let importeTotal = detalle.reduce((total,obj)=>{return total+obj.importe},0)
            ventasTotal +=importeTotal

            obj['values'].importe=Math.round(importeTotal)
            //obj['values'].id=obj.values.numero
            items.push(obj)
        })
    }
    
    let cldImporte = document.getElementById('cldImporte')
    cldImporte.textContent=ventasTotal.toFixed(2)

    
    console.log(' consulta venta :',items)

    items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    
    
    const titulo   = {' ':'',DOCUMENTO:'numero',CLIENTE:'cliente',RUC:'ruc',FECHA:'fecha',PAGO:'tipoPago',ESTADO:'estado',IMPORTE:'importe'}
    
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

