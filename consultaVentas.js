import {onGetVentas} from './firebase.js'
import {Datatable} from './dataTable.js'

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

function pintarDocumento(arrayObjeto){
    
    const flotante = document.getElementById('flotante');
    flotante.innerHTML=`
    <a id="cerrar">Cerrar</a>
    <section id="documentoPDF">

    <div class="grupo1">
      <div class="logo">
        <img src="./imagenes/heinz_sport_sac_logo.png" width="250" >
      </div>
      <div class="contacto">
        <h3 class="web">www.heinzsport.com <i class="fa-solid fa-globe"></i></h3>
        <h3 class="web">info@heinzsport.com <i class="fa-regular fa-envelope"></i></h3>
        <h3 class="web">+51 962833765<i class="fa-brands fa-whatsapp"></i></h3>
      </div>
      <div class="cajita2">
        <h1 id="ruc2">RUC: 20605216715</h1>
        <h1>PEDIDO VENTA</h1>
        <input  class='celda-cotizacion' type="number" id="cotizacion" placeholder="Numero">
      </div>
    </div>

    <form  id="formulario">
      <div class="cajita1">
        <div class="cajita1_1">
          <label for="vendedor"><p>VENDEDOR:</p></label>
          <label for="ruc"><h2><p>CODIGO :</p></label>
          <label for="cliente"><p>CLIENTE :</p></label>
        </div>

        <div class="cajita1_3" id="cajaClientes">
          <input  class='celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"> 
          <input class='celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI">
          <input  class='celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre">
           
        </div>
      </div>
      <div class="cajita4">

      
        <div class="fecha"><label for="fecha">Fecha:</label><input type="text" id="fecha"></div>
        <div><label for="tipoPago">Pago:</label><input type="text" id="tipoPago"></div>
        <div><label for="metodoCobro">Cobro:</label><input type="text"id="metodoCobro"></div>
      </div>
    </form>

    <table id='table' class="tabla">  
        <thead>
            <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
        </thead>

        <tbody id="container"></tbody>
        
        <tfoot class="button-content">
          <tr><th>Sub_Total (S/)</th></th><th><input id="celdaSubTotal"  class="total" type="text" value="0"></input></th><th>Descuento (S/)</th><th><input id="descuento"  class="total" type="text" value="0"></input></th><th>Total (S/)</th><th><input id="celda_total"  class="total" type="text" value="0"></input></th></tr>
        </tfoot>
    </table>
    <br>
    <br>
</section>`

    cotizacion.value    =arrayObjeto[0]['values'].numero
    vendedor.value      =arrayObjeto[0]['values'].vendedor
    ruc.value           =arrayObjeto[0]['values'].ruc
    cliente.value       =arrayObjeto[0]['values'].cliente
    fecha.value         =arrayObjeto[0]['values'].fecha
    tipoPago.value      =arrayObjeto[0]['values'].tipoPago
    metodoCobro.value   =arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.value =arrayObjeto[0]['values'].subTotal               
    descuento.value     =arrayObjeto[0]['values'].descuento  
    celda_total.value   =arrayObjeto[0]['values'].importeTotal

    let objetos         =JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
    let contador        =1;
    objetos.forEach(producto=>{
        let fila = document.createElement('tr')    
        
        fila.innerHTML = `
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td><input type='number'  min="0" step="0.1" class='cantidad' id='${producto.id}' value=${producto.cantidad}></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td><input type='number' min="0" step="0.1" class='precio' id='${producto.id}' value=${producto.precio}></td>
                        <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe.toFixed(2)}></td>                       
                        `
        contador++
        const tabla             = document.getElementById('table');
        tabla.appendChild(fila)
    });

    
    let cerrar=document.getElementById('cerrar')
    cerrar.addEventListener('click',()=>{
   
    while(flotante.firstChild){
        flotante.removeChild(flotante.firstChild)
    }
})
    
}
    
    //console.log(' consulta venta :',items)

    items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    
    
    const titulo   = {' ':'',DOC:'numero',FECHA:'fecha',CLIENTE:'cliente',RUC:'ruc',PAGO:'tipoPago',IMPORTE:'importe'}
    
    const dt = new Datatable('#dataTable',
    [
        {id:'btnEdit',text:'editar',icon:'edit',
        action:function(){
            const elementos=dt.getSelected(); 
            pintarDocumento(elementos)
        }},
        {id:'btnDelete',text:'eliminar',icon:'delete',action:function(){const elementos=dt.getSelected(); console.log('eliminar datos...',elementos);  }}
    ]
    );
    
    dt.setData(items,titulo);
    dt.makeTable();
});

