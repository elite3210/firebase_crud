import {onGetVentas,updatePedido,updateClientes,traerUnSocio} from './firebase.js'
import {Datatable} from './dataTable.js'

//traer los socios comerciales clientes de firebase


const registroVentas = onGetVentas((ventasSnapShot) =>{
  let items = [];
  //let ventasTotal=0
  //console.log('ventasSnapShot:',ventasSnapShot);
  if(ventasSnapShot){
    ventasSnapShot.forEach(doc =>{
        //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
        let obj ={};
        obj.id=doc.id;
        obj.values=doc.data();
        obj.values.importeTotal=Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
        //obj.values.importeTotal=Intl.NumberFormat('es-419',{ style: 'currency', currency: 'PEN' }).format(obj.values.importeTotal);
        //codigo para sumar linea por linea del detalle y calcular el importeTotal bruto sin descuento.
        //let detalle=JSON.parse(obj['values'].detalleCotizacion)
        //let importeTotal = detalle.reduce((total,obj)=>{return total+obj.importe},0)
        //ventasTotal +=importeTotal
        //obj['values'].importe=Math.round(obj['values'].importeTotal)
        //obj['values'].id=obj.values.numero
        items.push(obj);
    });
  }

    console.log('items:',items)
  items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    
    const titulo   = {' ':'',DOC:'numero',FECHA:'fecha',CLIENTE:'cliente',RUC:'ruc',IMPORTE:'importeTotal',ESTADO:'estado'}
    
    const dt = new Datatable('#dataTable',
    [
        {id:'btnEdit',text:'editar',icon:'contract',
        action:function(){
            const item=dt.getSelected();
            console.log('mostrando documento formato PC...',item); 
            pintarDocumento(item)
        }},
        {id:'btnPay',text:'pay',icon:'request_quote',
        action:function(){
            const item=dt.getSelected(); 
            registrarPago(item);
        }},
        {id:'btnSend',text:'send',icon:'local_shipping',
        action:function(){
            const item=dt.getSelected(); 
            registrarEnvio(item);
        }},
        {id:'btnDelete',text:'eliminar',icon:'delete',action:function(){const item=dt.getSelected(); console.log('eliminar datos...',elementos);  }}
    ]
    );
    
    dt.setData(items,titulo);
    dt.makeTable();  
});


function pintarDocumento(arrayObjeto){//crea una ventana modal con los datos de la venta el detalle
  console.log(' consulta venta arrayObjeto :',arrayObjeto)
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
        <h1  class="celda-cotizacion" id="cotizacion"></h1>
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
          <h1  class='celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
          <h1 class='celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
          <h1  class='celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
           
        </div>
      </div>
      <div class="cajita4">

      
        <div class="fecha"><label for="fecha">Fecha:</label><h1 id="fecha"></h1></div>
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
          <tr><th>Sub_Total (S/)</th></th><th><h1 id="celdaSubTotal"  class="total"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="total"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="total"></h1></th></tr>
        </tfoot>
    </table>
    <label for="gastoEnvio">Gasto Envio::</label><h1  class="celda-cotizacion" id="gastoEnvio"></h1>
    <label for="importePago">Importe Pagado:</label><h1  class="celda-cotizacion" id="importePago"></h1>
    <br>
    <br>
</section>`

    cotizacion.textContent    =arrayObjeto[0]['values'].numero
    vendedor.textContent      =arrayObjeto[0]['values'].vendedor
    ruc.textContent           =arrayObjeto[0]['values'].ruc
    cliente.textContent       =arrayObjeto[0]['values'].cliente
    fecha.textContent         =new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.value            =arrayObjeto[0]['values'].tipoPago
    metodoCobro.value         =arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.textContent =arrayObjeto[0]['values'].subTotal               
    descuento.textContent     =arrayObjeto[0]['values'].descuento  
    celda_total.textContent   =arrayObjeto[0]['values'].importeTotal
    gastoEnvio.textContent   =arrayObjeto[0]['values'].gastoEnvio
    importePago.textContent   =arrayObjeto[0]['values'].importePago

    let objetos         =JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
    let contador        =1;
    objetos.forEach(producto=>{
        let fila = document.createElement('tr')    
        
        fila.innerHTML = `
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.importe.toFixed(2)}</td>                       
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

function pintarDocumentoEnvio(arrayObjeto){//crea una ventana modal con los datos de la venta el detalle
  let id=arrayObjeto[0].id
  console.log(' id consulta venta arrayObjeto :',id)
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
        <h1  class="celda-cotizacion" id="cotizacion"></h1>
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
          <h1  class='celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
          <h1 class='celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
          <h1  class='celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
           
        </div>
      </div>
      <div class="cajita4">

      
        <div class="fecha"><label for="fecha">Fecha:</label><h1 id="fecha"></h1></div>
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
          <tr><th>Sub_Total (S/)</th></th><th><h1 id="celdaSubTotal"  class="total"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="total"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="total"></h1></th></tr>
        </tfoot>
    </table>
    <div class="cajaEnvio">
        <div class="fecha"><label for="fechaEnvio">Fecha Envio:</label><input type="date" id="fechaEnvio"></div>
        <div><label for="gastoEnvio">Pago:</label><input type="number" id="gastoEnvio"></div>
        <div><label for="empresaEnvio">Empresa Transporte:</label><input type="text" id="empresaEnvio"></div>
        <div><label for="personaEnvio">Enviado por:</label><input type="text" id="personaEnvio"></div>
        <div><button type="button" id ="registrarEnvio">Registrar Envio</button></div>
      </div>
    <br>
    <br>
</section>`

    const fechaEnvio = document.getElementById('fechaEnvio');
    const gastoEnvio = document.getElementById('gastoEnvio');
    

    cotizacion.textContent    =arrayObjeto[0]['values'].numero
    vendedor.textContent      =arrayObjeto[0]['values'].vendedor
    ruc.textContent           =arrayObjeto[0]['values'].ruc
    cliente.textContent       =arrayObjeto[0]['values'].cliente
    fecha.textContent         =new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.value            =arrayObjeto[0]['values'].tipoPago
    metodoCobro.value         =arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.textContent =arrayObjeto[0]['values'].subTotal               
    descuento.textContent     =arrayObjeto[0]['values'].descuento  
    celda_total.textContent   =arrayObjeto[0]['values'].importeTotal

    let objetos         =JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
    let contador        =1;
    objetos.forEach(producto=>{
        let fila = document.createElement('tr')    
        
        fila.innerHTML = `
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.importe.toFixed(2)}</td>                       
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
    });
    const registrarEnvio = document.getElementById('registrarEnvio');
    registrarEnvio.addEventListener('click',()=>{
      console.log('fechEnvio y GastoEnvio:',fechaEnvio.value,gastoEnvio.value)
      updatePedido(id,{fechaEnvio:fechaEnvio.value,gastoEnvio:gastoEnvio.value,empresaEnvio:empresaEnvio.value,personaEnvio:personaEnvio.value,estado:'enviado'})
      console.log('se paso el reguistro fechEnvio y GastoEnvio:')
      //await updateProduct(id,{stock:nuevoStockProducto});//actualiza el stock del producto
    });
}

async function pintarDocumentoPago(arrayObjeto){//crea una ventana modal con los datos de la venta el detalle
  let idPedido=arrayObjeto[0].id
  let idCliente =arrayObjeto[0]['values'].ruc
  console.log(' id consulta venta arrayObjeto :',idPedido)
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
        <h1  class="celda-cotizacion" id="cotizacion"></h1>
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
          <h1  class='celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
          <h1 class='celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
          <h1  class='celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
           
        </div>
      </div>
      <div class="cajita4">

      
        <div class="fecha"><label for="fecha">Fecha:</label><h1 id="fecha"></h1></div>
        <div><label for="tipoPago">Tipo:</label><input type="text" id="tipoPago"></div>
      </div>
    </form>

    <table id='table' class="tabla">  
        <thead>
            <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
        </thead>

        <tbody id="container"></tbody>
        
        <tfoot class="button-content">
          <tr><th>Sub_Total (S/)</th></th><th><h1 id="celdaSubTotal"  class="total"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="total"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="total"></h1></th></tr>
        </tfoot>
    </table>
    <div class="cajaEnvio">
        <div class="fecha"><label for="fechaPago">Fecha Pago:</label><input type="date" id="fechaPago"></div>
        
        <div><label for="metodoCobro">Metodo:</label><input type="text"id="metodoCobro"></div>
        <div><label for="bancoPago">Banco:</label><input type="text"id="bancoPago"></div>
        <div><label for="importePago">Importe (S/):</label><input type="number" id="importePago"></div>
        <div><button type="button" id ="registrarPago">Registrar Pago</button></div>
      </div>
    <br>
    <br>
</section>`

    
    

    cotizacion.textContent    =arrayObjeto[0]['values'].numero
    vendedor.textContent      =arrayObjeto[0]['values'].vendedor
    ruc.textContent           =arrayObjeto[0]['values'].ruc
    cliente.textContent       =arrayObjeto[0]['values'].cliente
    fecha.textContent         =new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.value            =arrayObjeto[0]['values'].tipoPago
    metodoCobro.value         =arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.textContent =arrayObjeto[0]['values'].subTotal               
    descuento.textContent     =arrayObjeto[0]['values'].descuento  
    celda_total.textContent   =arrayObjeto[0]['values'].importeTotal
    //importePago.value         =arrayObjeto[0]['values'].importeTotal
    

    let objetos         =JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
    let contador        =1;
    objetos.forEach(producto=>{
        let fila = document.createElement('tr')    
        
        fila.innerHTML = `
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.importe.toFixed(2)}</td>                       
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
    });

    const registrarPago = document.getElementById('registrarPago');
    let clienteTraido = await traerUnSocio(idCliente); //trae un cliente por ruc de la DB
    let saldoCliente    = clienteTraido.data()['saldo'] //calcula la cantidad que quedaria despues del registro
    console.log('el saldo anterior del cliente es:',Number(saldoCliente));
    
    registrarPago.addEventListener('click',()=>{
      const fechaPago   = document.getElementById('fechaPago');
      const bancoPago   = document.getElementById('bancoPago');
      let nuevoSaldo    =Number(saldoCliente)-Number(importePago.value);

      updatePedido(idPedido,{fechaPago:fechaPago.value,importePago:importePago.value,metodoCobro:metodoCobro.value,bancoPago:bancoPago.value,estado:'pagado'})
      //console.log('se registro exitosamente el importePago:',Number(importePago.value))
      updateClientes(idCliente,{saldo:nuevoSaldo})
      console.log('se actualizo el saldo del cliente nuevo saldo:',idCliente,nuevoSaldo)
      //await updateProduct(id,{stock:nuevoStockProducto});//actualiza el stock del producto
    });
}

function registrarPago(item){
  console.log('se registrara el pago de este pedido...',item);
  pintarDocumentoPago(item);
};

function registrarEnvio(item){
  
  console.log('se registrara el envio de este pedido...',item);
  pintarDocumentoEnvio(item);
};


