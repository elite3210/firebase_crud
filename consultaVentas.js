import {onGetVentas} from './firebase.js'
import {Datatable} from './dataTable.js'


//traer los socios comerciales clientes de firebase


const registroVentas = onGetVentas((ventasSnapShot) =>{
    let items =[]
    let ventasTotal=0
    console.log('ventasSnapShot:',ventasSnapShot);
    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            let obj ={};
            obj.values=doc.data()
            console.log('obj.values:',obj.values);
            obj.id=doc.id
            
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

    
    console.log('datos para dataTable:',items)
    
    
    const titulo   = {' ':'',DOCUMENTO:'numero',CLIENTE:'cliente',RUC:'ruc',FECHA:'fecha',PAGO:'tipoPago',ESTADO:'estado',IMPORTE:'importe'}
    
    const dt = new Datatable('#dataTable',
    [
        {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
        {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
    ]
    );
    
    dt.setData(items,titulo);
    dt.makeTable();
});