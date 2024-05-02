import { onGetVentas, updatePedido, updateClientes, updateProduct, traerUnSocio, traeroneProduct } from './firebase.js'
import { guardarCotizacion, traerUnNumeracion, updateNumeracion, traerUnColaborador } from './firebase.js'
import { Datatable } from './dataTable.js'

//traer los socios comerciales clientes de firebase
let objetos = JSON.parse(localStorage.getItem('cotizacion'))

let alternador = true
//let objetos=[]
let start = true
let saldo = 0; //espacio para guardar el saldo anterior del cliente


const registroVentas = onGetVentas((ventasSnapShot) => {
  let items = [];

  //progressBar.style.width = width + '%';  // Actualizamos el ancho de la barra
  //      progressBar.textContent = width + '%';  // Actualizamos el texto de la barra

  if (ventasSnapShot) {
    ventasSnapShot.forEach(doc => {
      //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
      let obj = {};
      let date = new Date(Date.now())
      obj.id = doc.id;
      obj.values = doc.data();
      obj.values.importeTotalVista = Intl.NumberFormat('es-419', { maximumSignificantDigits: 7 }).format(obj.values.importeTotal);
      obj.values.status = `<span class="${obj.values.estado}"></span>`;

      //console.log('obj.values:',obj.values)
      if (obj['values'].estado == 'nuevo') {
        obj['values'].retrasoEnvio = Math.round((date.getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
        obj['values'].retrasoPago = 0;
        if (obj['values'].pagosPedido) {
          obj['values'].pagosAcumulados = JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
          console.log('pagosacumulados', obj['values'].pagosAcumulados);
          obj['values'].progreso = `<div class="progress-adelantado" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (${10 - obj['values'].retrasoEnvio} dias) Saldo S/${obj['values'].importeTotal - obj['values'].pagosAcumulados}" style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div>`;
        } else {
          obj['values'].progreso = `<div class="progress-nuevo" title="${obj['values'].estado} ${Math.round(1 / 10) * 100}% Saldo (${obj['values'].importeTotal - 0}) (${10 - obj['values'].retrasoEnvio} dias)" style="width:${Math.round((obj['values'].retrasoEnvio / 10) * 100)}%;"></div>`;
        }
      } else if (obj['values'].fechaEnvio && obj['values'].estado != 'cancelado') {//se existe fecha envio, entonces estado enviado
        obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fechaEnvio}T12:00:00Z`) - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
        obj['values'].retrasoPago = Math.round((date.getTime() - new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
        if (obj['values'].pagosPedido && obj['values'].retrasoPago <= 10) {
          let arrayPagos = JSON.parse(obj['values'].pagosPedido);
          obj['values'].pagosAcumulados = arrayPagos.reduce((total, obj) => total += Number(obj.importePago), 0)
          obj['values'].progreso = `<div class="progress-${obj['values'].estado}" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div>`;
        } else if (obj['values'].pagosPedido && obj['values'].retrasoPago <= 30) {

          obj['values'].progreso = `<div class="progress-retrazado" title="pendiente 0% pago (S/${obj['values'].importeTotal - 0})" style="width:${Math.round((1) * 100)}%;"></div>`;
        } else if (!(obj['values'].pagosPedido) && obj['values'].retrasoPago <= 60) {

          obj['values'].progreso = `<div class="progress-retrazado" title="pendiente 0% pago (S/${obj['values'].importeTotal - 0})" style="width:${Math.round((1) * 100)}%;"></div>`;
        
        } else {
          obj['values'].progreso = `<div class="progress-problemas" title="${obj['values'].estado} 0% (S/${obj['values'].importeTotal - 0})" style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)};"></div>`;
        }
  
      } else if (obj['values'].estado == 'cancelado') {
        if (obj['values'].fechaEnvio) {
          obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
          obj['values'].retrasoPago = Math.round((new Date(`${obj['values'].fechaPago}T12:00:00Z`).getTime() - new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
          obj['values'].progreso = `<div class="progress-${obj['values'].estado}" title="${obj['values'].estado} 100% (S/0)" style="width:100%"></div>`;
        } else {
          if (!(obj['values'].fechaEnvio)) {
            console.log('entre!!! no enviado pero cancelado...');
            obj['values'].retrasoEnvio = Math.round((date.getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
            obj['values'].pagosAcumulados = JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
            obj['values'].progreso = `<div class="progress-adelantado" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (${10 - obj['values'].retrasoEnvio} dias) Saldo S/${obj['values'].importeTotal - obj['values'].pagosAcumulados}" style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div>`;
            //break;
          }
          obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fecha}T12:00:00Z`).getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
          obj['values'].retrasoPago = 0;
          //obj['values'].progreso = `<div class="progress-${obj['values'].estado}" title="${obj['values'].estado} 100% (S/0)" style="width:100%"></div>`;
          //obj['values'].pagosAcumulados=JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
        }

      } else {
        alert('si ves esta alerta, revisa el estado del pedido para implementar codigo!!!')
      }
      items.push(obj);
    });
  }

  console.log('items:', items)
  items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b

  const titulo = { DOC: 'numero', FECHA: 'fecha', CLIENTE: 'cliente', IMPORTE: 'importeTotalVista', RE: 'retrasoEnvio', RP: 'retrasoPago', STATUS: 'progreso' }

  const dt = new Datatable('#dataTable',
    [
      {
        id: 'btnNew', dataBsToggle: "modal", dataBsTarget: "#flotante2", text: 'nuevo', icon: 'note_add', action: function () {
          const item = dt.getSelected();
          registrarPedido();
        }
      },
      {
        id: 'btnSend', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante2", text: 'send', icon: 'local_shipping',
        action: function () {
          const item = dt.getSelected();
          registrarEnvio(item);
        }
      },
      { id: 'btnInvoice', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante2", text: 'facturar', icon: 'summarize', action: function () { const item = dt.getSelected(); } },

      {
        id: 'btnPay', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante2", text: 'pay', icon: 'request_quote',
        action: function () {
          const item = dt.getSelected();
          registrarPago(item);
        }
      },
      {
        id: 'btnEdit', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante3", text: 'editar', icon: 'contract',
        action: function () {
          const item = dt.getSelected();
          console.log('mostrando documento formato PC...', item);
          pintarDocumento(item)
        }
      },
      {
        id: 'btnEditar', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante2", text: 'editar', icon: 'edit',
        action: function () {
          const item = dt.getSelected();
          console.log('mostrando documento formato PC...', item);
          editarPedido(item);
        }
      },
      { id: 'btnDelete', 'data-bs-toggle': "modal", 'dataBsTarget': "#flotante2", text: 'eliminar', icon: 'delete', action: function () { const item = dt.getSelected(); } }
    ]
  );

  dt.setData(items, titulo);
  dt.makeTable2();
});



async function pintarDocumento(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
  console.log(' consulta venta arrayObjeto :', arrayObjeto)
  const flotante = document.getElementById('flotante');
  flotante.innerHTML = `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante3">Modal</button>
<div class="modal modal-lg" id="flotante3">
<div class="modal-dialog">
<div class="modal-content">

<div class="modal-header">
  <h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>

<div class="modal-body" id="flotante3">

  <section id="documentoPDF">

  <div class="grupo1">
      <div class="logo">
          <img src="./imagenes/heinz_sport_sac_logo.png" width="250" >
          </div>
      <div class="contacto">
          <h1>www.heinzsport.com <i class="fa-solid fa-globe"></i></h1>
          <h1>info@heinzsport.com <i class="fa-regular fa-envelope"></i></h1>
          <h1>+51 962833765 <i class="fa-brands fa-whatsapp"></i></h1>
      </div>
      <div class="cajita2">
          <h3 class="h6" id="ruc2">RUC: 20605216715</h3>
          <h3 class="h6">PEDIDO VENTA</h3>
          <h3 class="h6" id="cotizacion"></h3>
      </div>
  </div>

<form class="form2" id="formulario">
<div class="cajita1b">
  <div class="input-group">    
  <label for="ruc">CODIGO :</label>
  <h1 class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
  </div>

  <div class="input-group"> 
  <label for="cliente">CLIENTE :</label>
  <h1  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
  </div>

  <div class="input-group"> 
  <label for="vendedor">VENDEDOR:</label>
  <h1  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
  </div>       
</div>

  <div class="cajita4">
      <div class="input-group">
          <label for="fecha">FECHA:</label>
          <h3 class="form-control celda" id="fecha"></h3>
      </div>
      <div class="input-group">
          <label for="tipoPago">PAGO:</label>
          <h3 class="form-control celda" type="text" id="tipoPago"></h3>
      </div>
      <div class="input-group">
          <label for="metodoCobro">COBRO:</label>
          <h3 class="form-control celda" type="text" id="metodoCobro"></h3>
      </div>
  </div>
</form>

  <table id='table' class="tabla">  
      <thead class="tituloTabla">
          <tr><th>#</th><th>CODIGO</th><th>CANTIDAD</th><th>UNIDAD</th><th>DESCRIPCION</th><th>PRECIO</th><th>IMPORTE</th></tr>
      </thead>

      <tbody id="container"></tbody>
      
      <tfoot class="tfootTotales" id="tfoot">
      <tr><th></th><th>SubTotal(S/)</th><th><h1 id="celdaSubTotal"  class="h6"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="h6"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="h3"></h1></th></tr>
      </tfoot>
  </table>
  
  <div class="cajaEnvioPagos">
    <div class="cajaEnvio">
      <label class="etiqueta" for="fechaEnvio"><strong>ENVIO:</strong></label>
      <h6 type="date" id="fechaEnvio"></h6>         
    </div>
    <table id='tablaPagos' class="tabla2"></table>
  </div>

    <br>
 
  </section>



  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" id="printJS" onclick=printForm()>PrintJS</button>
    <button id="btn-imprimir" class="btn btn-primary">PDF</button>
    <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
  </div>
</div>
</div>
</div>
`
  const btn_imprimir = document.getElementById('btn-imprimir')

  btn_imprimir.addEventListener('click', generaPDF)

  cotizacion.textContent = arrayObjeto['values'].numero
  vendedor.textContent = arrayObjeto['values'].vendedor
  ruc.textContent = arrayObjeto['values'].ruc
  cliente.textContent = arrayObjeto['values'].cliente
  fecha.textContent = new Date(`${arrayObjeto['values'].fecha}T12:00:00Z`).toLocaleDateString()
  tipoPago.value = arrayObjeto['values'].tipoPago
  metodoCobro.value = arrayObjeto['values'].metodoCobro
  celdaSubTotal.textContent = arrayObjeto['values'].subTotal
  descuento.textContent = arrayObjeto['values'].descuento
  celda_total.textContent = arrayObjeto['values'].importeTotal
  console.log('estado:', arrayObjeto['values'].estado)


  let objetos = JSON.parse(arrayObjeto['values'].detalleCotizacion)
  let pagos = '';


  let contador = 1;
  objetos.forEach(producto => {
    let fila = document.createElement('tr')
    const tabla = document.getElementById('container');
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
    tabla.appendChild(fila)
  });

  let pagoAcumuladoAntiguo = 0;
  let Pagos = [];

  if (arrayObjeto['values'].pagosPedido) {

    pagos = JSON.parse(arrayObjeto['values'].pagosPedido)

    pagos.forEach((pago) => {
      pagoAcumuladoAntiguo += Number(pago.importePago);
      Pagos.push(pago);
    })

    const tabla2 = document.getElementById("tablaPagos");
    const tbody2 = document.createElement("body");
    let fila3 = document.createElement('tr');

    let td5 = document.createElement('td');
    fila3.appendChild(td5)
    let th3 = document.createElement('th');
    th3.textContent = `SALDO DOCUMENTO: S/${arrayObjeto['values'].importeTotal - pagoAcumuladoAntiguo}`;
    fila3.appendChild(th3)

    tbody2.appendChild(fila3)
    tabla2.appendChild(tbody2)
    let contador2 = 1;

    pagos.forEach(pago => {
      let fila2 = document.createElement('tr')

      fila2.innerHTML = `<td>|Pago N°${contador2}</td>
                          <td>| ${pago.fechaPago} </td>
                          <td>| ${pago.metodoPago} </td>
                          <td>| S/${pago.importePago}</td>                                            
                          `
      contador2++
      tabla2.appendChild(fila2)
      //console.log('fila2:',fila2)
    });
  }







  if (arrayObjeto['values'].estado != 'nuevo') {
    let traerDoc = await traerUnSocio(arrayObjeto['values'].transportedBy);
    let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
    fechaEnvio.textContent = `${pintarFecha(arrayObjeto['values'].fechaEnvio)} ${fila.razonSocial} (${fila.telefono})`;
  }
};

function registrarPedido() {

  const flotante = document.getElementById('flotante');
  flotante.innerHTML = `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante2">Modal</button>
<div class="modal modal-lg" id="flotante2">

<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>
<div class="modal-body" id="flotante2">

 
<section id="documentoPDF">


<div>
  <form class="form" id="formulario">
    <div class="grupo1 container">
      <div class="cajita4">
        <datalist id="tipoPago">
          <option value="Contado">
          <option value="Credito">
        </datalist>
        

        <div class="fecha"><label for="fecha">Fecha:</label><input type="date" id="fecha"></div>
        <div><label for="tipoPago">Pago:</label><input type="text" list="tipoPago" id="tipoPago"></div>
        
      </div>

      <div class="cajita2">
        <h1>PEDIDO N°</h1>
        <input class='celda-cotizacion' type="number" id="cotizacion" placeholder="Numero">
      </div>
    </div>

    <div class="cajita1_1">
      <div class="input-group">
        <label for="ruc">CODIGO :</label>
        <input type="text" id="ruc" list="datoClientes" required placeholder="Ingresar RUC o DNI">
      </div>
      <div class="input-group">
        <label for="cliente">CLIENTE :</label>
        <input type="text" id="cliente" placeholder="Razon Social o Nombre">
      </div>
      <div class="input-group">
        <label for="vendedor">VENDEDOR :</label>
        <input type="text" id="vendedor" placeholder="Razon Social o Nombre">
      </div>
    </div>
  </form>
  <div class="table-responsive">
  <table id='table' class="table table-striped table-hover">
    <thead>
      <tr>
        
        <th>N°</th>
        <th>Cod</th>
        <th class='cantidad'>Cant</th>
        <th>Uni</th>
        <th>Descripcion</th>
        <th class='cantidad'>Precio</th>
        <th class='cantidad'>Importe</th>
      </tr>
    </thead>
    <tbody class="container" id="container"></tbody>
  </table>
</div>
  <div class="row">
    <div class="celdaTotales"><label>Total (S/)</label><input id="celdaSubTotal" class="col" type="text" value="0">
    </div>
    <div class="celdaTotales"><label>Descuento (S/)</label><input id="descuento" class="col" type="text" value="0">
    </div>
    <div class="celdaTotales"><label>Total (S/)</label><input id="celda_total" class="col" type="text" value="0">
    </div>
  </div>

</div>

</section>



<div class="cajaBotones" id="entradaDato">
  <div class="entradaDato">
    <label for="codigo" class='codigo'>Codigo:</label>
    <input class='celda ' type="text" id="codigo" list="productos" placeholder="Ingrese código de producto"><span class="validity"></span>
    <button id="boton">Ingresar</button>
    <button class="semaforo" id="semaforo">''</button>
  </div>


</div>

</div>

<div class="modal-footer">
  
  <button id="btn-guardar" class="btn btn-primary">Guardar</button>
  <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
  <button id="btnClose" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
</div>
</div>
</div>
</div>


  `
  let sentinelaGuardar = false;//se cambia a true cuando se presiono el boton guardado por vez primera
  const btn_ingresar = document.getElementById('boton');
  const form = document.getElementById('formulario');
  const tabla = document.getElementById('container');
  console.log('tbody:', tabla)
  const btn_guardar = document.getElementById('btn-guardar');
  const btn_imprimir = document.getElementById('btn-imprimir')

  const celdaSubTotal = document.getElementById('celdaSubTotal')
  const inpDescuento = document.getElementById('descuento')
  const celda_total = document.getElementById('celda_total')
  const inpCodigo = document.getElementById('codigo')
  const inpCodigoCliente = document.getElementById('ruc');
  const inpCliente = document.getElementById('cliente')
  const fecha = document.getElementById('fecha')
  fecha.value = pintarFecha();
  const btn_semaforo = document.querySelector('.semaforo')
  const numeroCotizacion = document.getElementById('cotizacion')
  const cajaClientes = document.getElementById('ruc')
  const btnClose = document.getElementById('btnClose')

  let f = new Hammer(inpCodigoCliente)
  f.on('panright', activarEnter2)

  //datalist para clientes
  let datalist1 = document.createElement('datalist')
  datalist1.setAttribute('id', 'datoClientes')
  datalist1.innerHTML = `
  <option value='08604665'>OSORIO SIGUAS AMERICO REMIGIO</option>
  <option value='09462653'>HENRY MESA GARAY RUDY</option>
  <option value='10013031083'>Eulogio Huancco Ticona</option>
  <option value='10086833315'>LINGAN SEJURO OSCAR ANTONIO</option>
  <option value='10105176363'>ALVARADO ROMAN ISOLINA SILVIA</option>
  <option value='10400035801'>QUENAYA TORRES IOVANNA MARILU</option>
  <option value='10401249716'>ORE GUERRA NELCI</option>
  <option value='10421927788'>ALAYO CRUZ WILSON DAVID</option>
  <option value='10450270461'>LUNG ISIDRO BETSY NATALY</option>
  <option value='10473550151'>Wilfredo Mayta</option>
  <option value='20428756518'>PALAVA E.I.R.L.</option>
  <option value='20518248147'>CEMPLASTIC S.A.C.</option>
  <option value='20508679514'>DISTRIBUIDORA MURDOCK S.R.L.</option>
  <option value='20512048839'>FREDY PONCE & MARANATHA S.A.C.</option>
  <option value='20601632137'>JAL PERU INVERSIONES EIRL</option>
  <option value='20602683461'>RHENACER & CARMEN S.A.C.</option>
  <option value='20608956868'>BIOSELVA PACK S.A.C.</option>
  <option value='48348426'>MANUEL HUANUCO ALBINO</option>
  <option value='73675942'>DEINER CAMPOS</option>
  <option value='77269606'>PAOLA ELIZABETH GARCIA VILCHEZ</option>
  `
  cajaClientes.appendChild(datalist1)

  //datalist para productos
  let datalist = document.createElement('datalist')
  datalist.setAttribute('id', 'productos')
  datalist.innerHTML = `
  <option value='EB0010'>Funda Sorbetes S/M</option>
  <option value='EB0011'>Bolsa Plancha para Sorbetes</option>
  <option value='EB0020'>Funda Palo delgado</option>
  <option value='EB0021'>Funda Copitas paliglobos</option>
  <option value='EB0022'>Bolsa palos chicos millar</option>
  <option value='EB0030'>Funda Sorbeton 50U</option>
  <option value='EB0050'>Funda palo grueso 50U</option>
  <option value='EB0051'>Funda Copa Grande 50U</option>
  <option value='EB0052'>Bolsa Palos Grueso Milla</option>
  <option value='EB0053'>'Bolsa Copa Grande Millar</option>
  <option value='EB0060'>Manga Azul Baja 40x2.5</option>
  <option value='MB0010'>MB Blanco</option>
  <option value='MB0011'>MB Naranja Colortec</option>
  <option value='MB0012'>MB Rojo Escarlata</option>
  <option value='MB0013'>MB Verde Palta</option>
  <option value='MB0014'>MB Amarillo Electrico</option>
  <option value='MB0015'>MB Celeste Andino</option>
  <option value='PB0070'>Paliglobos desarmables base</option>
  <option value='PC0050'>Palito Chupetin Blanco (1.4MillxKg)</option>
  <option value='PD0070'>Paliglobos delgados</option>
  <option value='PD0071'>Paliglobos delgados palos transp.</option>
  <option value='PD0072'>Paliglobos delgados copas transp.</option>
  <option value='PD0073'>Paliglobos delgados palos blanco</option>
  <option value='PD0074'>Paliglobos delgados copas blanco</option>
  <option value='PD0075'>Paliglobos delgados palos rojo</option>
  <option value='PD0076'>Paliglobos delgados copas rojo</option>
  <option value='PG0070'>Paliglobos #40 Transp.</option>
  <option value='PG0071'>Palos #40 transparente</option>
  <option value='PG0072'>Copas #40 transparente</option>
  <option value='PG0073'>Palos #40 blanco</option>
  <option value='PG0074'>Copas #40 blanco</option>
  <option value='PG0075'>Palos #40 rojo</option>
  <option value='PG0076'>Copas #40 rojo</option>
  <option value='PI0010'>Pig. Flourecente Fucsia</option>
  <option value='PI0011'>Pig. Azul Ultramar</option>
  <option value='PI0012'>Pig. Dioxido Titanio </option>
  <option value='PI0013'>Col. Azul a la Grasa</option>
  <option value='PP0010'>PP peletizado cristal extrusion</option>
  <option value='PP0011'>PP peletizado negro rafia</option>
  <option value='PV0010'>Polipropileno Virgen Extrusión</option>
  <option value='SB0050'>Sorbete monocolor clasicos</option>
  <option value='SB0051'>Sorbetes Clásico Negro S/M</option>
  <option value='SB0052'>Sorbetes Clásico Blanco S/M</option>
  <option value='SB0070'>Sorbetes Rayados Surtido S/M </option>
  <option value='SD0070'>Sorbetes Forrados 50UNID. </option>
  <option value='SF0010'>Sorbetes flexibles rayados</option>
  <option value='SF0011'>Sorbetes Flexible Negro S/M</option>
  <option value='SF0012'>Sorbete Flexible Blanco S/M</option>
  <option value='SF0013'>Sorbetes Flexible Colores S/M</option>
  <option value='ST0070'>Sorbeton Forrado</option>
  <option value='ST0071'>Sorbeton Colores </option>
  <option value='ST6000'>Sorbeton Recto Colores S/M</option>
  <option value='ST7001'>Sorbeton Blanco S/M</option>
  <option value='ST7003'>Sorbeton Naranja S/M</option>
  <option value='SP7000'>Sorbete Papel Blanco S/M</option>
  <option value='PR1000'>Picador Color Surtido S/M</option>
  <option value='CU1000'>Cucharitas #4 Colores S/M</option>
  `
  entradaDato.appendChild(datalist)

  //let objetos = JSON.parse(localStorage.getItem('cotizacion'))

  cargarEventListeners()

  function cargarEventListeners() {
    pintarFecha()
    pintarTabla(objetos)

    btn_ingresar.addEventListener('click', ingresarProducto)
    inpCodigo.addEventListener('keypress', activarEnter)
    inpCodigoCliente.addEventListener('keypress', activarEnter2)
    btn_guardar.addEventListener('click', registrarVenta)
    btn_imprimir.addEventListener('click', generaPDF)

    tabla.addEventListener('click', operacionesEnTabla)
    tabla.addEventListener('keypress', actualizaImporte)
    btnClose.addEventListener('click', limpiarDocumento)
  };

  function updateAssignedStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
      console.log('producto traido id stock:', fila.id, fila.assignedStock)
      //fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar                                            //por defecto cantidad igual a 1
      //fila.detallePedido
      //let id = obj.id
      let newAssignedStock = Number(fila.assignedStock) + Number(obj.cantidad)
      updateProduct(obj.id, { assignedStock: newAssignedStock })
      console.log('se actualizo assignedStock:', newAssignedStock)
      counter++
    })
    alert(`Se actualizó: ${counter} productos`)
  };

  function pintarTabla(objetos) {
    console.log('Lo que hay en LS:', objetos)
    if (objetos == null) {
      return;
      //pintarFilasVacias(objetos)
    } else {
      limpiarTabla()
      pintarFilasLlenas(objetos)
      //pintarFilasVacias(objetos)
      actualizaImporteTotal()
    }
  };

  function registrarVenta() {
    console.log('dentro funcion registraVenta:')

    let tiempo = Date.now()
    let cliente = form['cliente'].value
    let ruc = form['ruc'].value
    let vendedor = form['vendedor'].value
    let detalleCotizacion = JSON.stringify(objetos)
    let estado = 'nuevo'
    let tipoPago = form['tipoPago'].value
    let nuevoNumero = Number(numeroCotizacion.value)
    let fecha = form['fecha'].value
    let subTotal = Number(celdaSubTotal.value)
    let descuento = Number(inpDescuento.value)
    let importeTotal = subTotal - descuento
    let transportedBy = 'sin enviar';

    console.log('importeTotal:', importeTotal)
    console.log('descuento:', descuento)
    console.log('tiempo:', tiempo)

    if (nuevoNumero && !sentinelaGuardar) {

      console.log('numero:', nuevoNumero)
      updateAssignedStock(objetos)
      guardarCotizacion(nuevoNumero, fecha, vendedor, cliente, ruc, detalleCotizacion, estado, tipoPago, subTotal, descuento, importeTotal, tiempo, transportedBy)
      updateNumeracion('Cotizacion', { ultimoNumero: nuevoNumero })
      //updateClientes(ruc, { saldo: nuevoSaldo,clienteRank: 2 })

      console.log('Se registro un nuevo pedido sin cambiar el stock y saldo:')
      sentinelaGuardar = true;
    } else {
      alert('Poner numero de Venta o ya se guardado el pedido.')
    }
  };

  function actualizaImporte(e) {

    if (e.key === 'Enter') {
      e.preventDefault()

      for (let i = 0; i < objetos.length; i++) {
        objetos[i].cantidad = parseFloat(tabla.children[i].children[2].children[0].value)
        objetos[i].precio = parseFloat(tabla.children[i].children[5].children[0].value)
        objetos[i].importe = parseFloat(objetos[i].cantidad * objetos[i].precio)
      }
      limpiarTabla(e)
      pintarTabla(objetos)
      actualizaImporteTotal()
      console.log('objeto actualizado:', objetos)
    }
  };

  function limpiarTabla() {
    while (tabla.firstChild) {
      tabla.removeChild(tabla.firstChild)
    }
  };

  function actualizaImporteTotal() {

    let total = objetos.reduce((tot, producto) => tot + producto.importe, 0)

    celdaSubTotal.value = total.toFixed(2)
    let desc = inpDescuento.value
    celda_total.value = Intl.NumberFormat('es-419').format(celdaSubTotal.value - desc)
    //Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
  };

  function operacionesEnTabla(e) {

    if (e.target.classList.contains('btn-delete')) {
      eliminarProducto(e)
    }
    if (e.target.classList.contains('btn-stock')) {
      filaMuestraStock(e)
    }
  };

  function eliminarProducto(e) {
    let id_producto = e.target.getAttribute('data-id')

    objetos = objetos.filter((producto) => producto.id !== id_producto)
    limpiarTabla()
    console.log('diste clik en boton delete... nuevo objeto', objetos)
    pintarTabla(objetos)
  }

  function filaMuestraStock(e) {
    let filasTabla = document.querySelectorAll('tbody tr');
    console.log('filasTabla:', filasTabla);
    let id_producto = e.target.getAttribute('data-id')                            //captura el ID producto de la fila
    let ubicacion = objetos.findIndex((elem) => { return elem.id == id_producto })    //captura el indice o poscion del objeto producto de la fila

    if (alternador) {//para expandir o contraer fila
      let producto_encontado = objetos.find((elem) => { return elem.id == id_producto })  //encuentra el productos en el objeto con el ID anterior
      console.log('clik en (+), el stock es:', producto_encontado.stock)
      let fila = document.createElement('tr')
      let celda = document.createElement('td')
      celda.textContent = producto_encontado.stock
      fila.appendChild(celda)
      console.log('Filas Ubicacion:', ubicacion)
      tabla.insertBefore(fila, tabla.children[ubicacion + 1])
      alternador = false
    } else {
      tabla.removeChild(tabla.children[ubicacion + 1])
      alternador = true
    }
  }

  function pintarFilasLlenas(objetos) {
    let contador = 1
    objetos.forEach(producto => {
      let fila = document.createElement('tr')

      fila.innerHTML = `
                        <td><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button>${contador}</td>
                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button>${producto.id}</td> 
  
                        <td class='cantidad'><input type='number'  min="0" step="0.1" class='cantidad2' id='${producto.id}' value=${producto.cantidad}></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td class='cantidad'><input type='number' min="0" step="0.1" class='cantidad2'  id='${producto.id}' value=${producto.precio}></td>
                        <td class='cantidad'><input type='number'  id='${producto.id}' class='cantidad2'  value=${producto.importe.toFixed(2)}></td>
                                              
                        `
      contador++
      tabla.appendChild(fila)
    });
    sincronizarLocalStorage(objetos)
  };

  function sincronizarLocalStorage(objetos) {
    localStorage.setItem('cotizacion', JSON.stringify(objetos))
    objetos = JSON.parse(localStorage.getItem('cotizacion'))
  }

  function pintarFecha() {
    let date = new Date(Date.now())
    if (date.getMonth() < 10 && date.getDate() < 10) {
      return `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
    } else if (date.getMonth() < 10 && date.getDate() >= 10) {
      return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
    } else {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }

  async function ingresarProducto(e) {

    //e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    //console.log('dentro de funcion ingresarproducto',e.target)
    let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:', id)
    if (id) {
      console.log('objeto a evaluar:', objetos)
      if (objetos == null) {
        objetos = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
      }
      let duplicado = objetos.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto

      if (!duplicado) {
        inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
        btn_semaforo.classList.toggle('semaforo-verde')
        btn_semaforo.textContent = 'exito!'
        let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB

        let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
        fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
        fila.cantidad = 1                                             //por defecto cantidad igual a 1
        fila.importe = fila.precio * fila.cantidad                      //calculamos l importe

        objetos.push(fila)                                          //metemos los datos de fila en objetos
        limpiarTabla(e)                                             //limpir datos de la tabla
        pintarTabla(objetos)
      } else {
        btn_semaforo.classList.toggle('semaforo-rojo');
        btn_semaforo.textContent = 'duplicado';
      }

      console.log('contenido del objeto:', objetos)

    } else {
      btn_semaforo.classList.toggle('semaforo-ambar');
      btn_semaforo.textContent = 'vacio';
    }
  }

  function activarEnter(e) {
    if (e.key === 'Enter') {
      ingresarProducto();
    }
  }

  async function activarEnter2(e) {
    if (e.key === 'Enter' || e.type == 'panright') {
      let id = inpCodigoCliente.value.trim();
      console.log('presionaste enter...', id)                   //trae un nombre de cliente de la DB
      let traerDoc = await traerUnSocio(id);
      let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
      let razonSocial = fila.razonSocial;

      saldo = Number(fila.saldo);
      console.log('presionaste enter...', razonSocial, saldo)
      inpCliente.value = razonSocial

      let traerDoc3 = await traerUnColaborador(fila.vendidoPor)
      let dato3 = traerDoc3.data()
      form['vendedor'].value = `${dato3.nombres} ${dato3.apellidos}`;

      let traerDoc2 = await traerUnNumeracion('Cotizacion')
      let dato = traerDoc2.data()
      numeroCotizacion.value = Number(dato.ultimoNumero) + 1;
    }
  };


  function limpiarDocumento() {
    localStorage.removeItem('cotizacion');
    objetos = []
    numeroCotizacion.value = '';//corregir aparece como no definido al crear nuevo pedido
    celdaSubTotal.value = '';
    inpDescuento.value = '';
    celda_total.value = '';
    form.reset()
    pintarTabla(objetos) //vueve a pintar el formulario vacio
  };

};

function editarPedido(arrayObjeto) {
  //console.log('descubriendo arrayObjeto:',arrayObjeto)
  let idPedido = arrayObjeto.id;
  const flotante = document.getElementById('flotante');
  flotante.innerHTML = `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante2">Modal</button>
  <div class="modal modal-lg" id="flotante2">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>
<div class="modal-body" id="flotante2">

 
<section id="documentoPDF">


<div>
  <form class="form" id="formulario">
    <div class="grupo1 container">
      <div class="cajita4">
        <datalist id="tipoPago">
          <option value="Contado">
          <option value="Credito">
        </datalist>
        <datalist id="metodoCobro">
          <option value="Efectivo">
          <option value="Transferencia">
          <option value="Tarjeta">
        </datalist>

        <div class="fecha"><label for="fecha">Fecha:</label><input type="date" id="fecha"></div>
        <div><label for="tipoPago">Pago:</label><input type="text" list="tipoPago" id="tipoPago"></div>
        <div><label for="metodoCobro">Cobro:</label><input type="text" list="metodoCobro" id="metodoCobro"></div>
      </div>

      <div class="cajita2">
        <h1>PEDIDO N°</h1>
        <input class='celda-cotizacion' type="number" id="cotizacion" placeholder="Numero">
      </div>
    </div>

    <div class="cajita1_1">
      <div class="input-group">
        <label for="ruc">CODIGO :</label>
        <input type="text" id="ruc" list="datoClientes" required placeholder="Ingresar RUC o DNI">
      </div>
      <div class="input-group">
        <label for="cliente">CLIENTE :</label>
        <input type="text" id="cliente" placeholder="Razon Social o Nombre">
      </div>
      <div class="input-group">
        <label for="vendedor">VENDEDOR :</label>
        <input type="text" id="vendedor" placeholder="Razon Social o Nombre">
      </div>
    </div>
  </form>
  <div class="table-responsive">
  <table id='table' class="table table-striped table-hover">
    <thead>
      <tr>
        
        <th>N°</th>
        <th>Cod</th>
        <th class='cantidad'>Cant</th>
        <th>Uni</th>
        <th>Descripcion</th>
        <th class='cantidad'>Precio</th>
        <th class='cantidad'>Importe</th>
      </tr>
    </thead>
    <tbody class="container" id="container"></tbody>
  </table>
</div>
  <div class="row">
    <div class="input-group"><label>Total (S/)</label><input id="celdaSubTotal" class="col" type="text" value="0">
    </div>
    <div class="input-group"><label>Descuento (S/)</label><input id="descuento" class="col" type="text" value="0">
    </div>
    <div class="input-group"><label>Total (S/)</label><input id="celda_total" class="col" type="text" value="0">
    </div>
  </div>

</div>

</section>



<div class="cajaBotones" id="entradaDato">
  <div class="entradaDato">
    <label for="codigo" class='codigo'>Codigo:</label>
    <input class='celda ' type="text" id="codigo" list="productos" placeholder="Ingrese código de producto"><span class="validity"></span>
    <button id="boton">Ingresar</button>
    <button class="semaforo" id="semaforo">''</button>
  </div>


</div>

</div>

<div class="modal-footer">
  
  <button id="btn-guardar" class="btn btn-primary">Guardar</button>
  <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
  <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
</div>
</div>
</div>
</div>


  `
  let sentinelaGuardar = false;//se cambia a true cuando se presiono el boton guardado por vez primera
  let estadoPedido = arrayObjeto['values'].estado;
  const btn_ingresar = document.getElementById('boton');
  const form = document.getElementById('formulario');
  const tabla = document.getElementById('container');
  const btn_guardar = document.getElementById('btn-guardar');
  const btn_imprimir = document.getElementById('btn-imprimir')
  const celdaSubTotal = document.getElementById('celdaSubTotal')
  const inpDescuento = document.getElementById('descuento')
  const celda_total = document.getElementById('celda_total')
  const inpCodigo = document.getElementById('codigo')
  const inpCodigoCliente = document.getElementById('ruc');
  const inpCliente = document.getElementById('cliente')
  const fecha = document.getElementById('fecha')
  const btn_semaforo = document.querySelector('.semaforo')
  const numeroCotizacion = document.getElementById('cotizacion')
  const cajaClientes = document.getElementById('ruc')
  let detalleCotizacionOld = JSON.parse(arrayObjeto['values'].detalleCotizacion)
  let detalleCotizacion = JSON.parse(arrayObjeto['values'].detalleCotizacion);

  let f = new Hammer(inpCodigoCliente)
  f.on('panright', activarEnter2)

  //let objetos = JSON.parse(localStorage.getItem('cotizacion'))

  rellenarDocumento(arrayObjeto);
  rellenarDatalist();
  cargarEventListeners();
  if (estadoPedido == 'nuevo') {
    deleteAssignedStock(detalleCotizacionOld)
  } else if (estadoPedido == 'enviado') {
    alert('Codigo para editar documentos enviado en construcción...')
    deleteStock(detalleCotizacionOld)
  } else {
    alert('Los pedidos que fueron enviados no se pueden editar...')
  }

  function cargarEventListeners() {
    //pintarFecha()
    //pintarTabla(objetos)

    btn_ingresar.addEventListener('click', ingresarProducto)
    inpCodigo.addEventListener('keypress', activarEnter)
    inpCodigoCliente.addEventListener('keypress', activarEnter2)
    btn_guardar.addEventListener('click', registrarVenta)
    btn_imprimir.addEventListener('click', generaPDF)
    tabla.addEventListener('click', operacionesEnTabla)
    tabla.addEventListener('keypress', actualizaImporte)

  };

  function rellenarDocumento(arrayObjeto) {
    form['fecha'].value = arrayObjeto['values'].fecha;
    form['tipoPago'].value = arrayObjeto['values'].tipoPago;
    form['metodoCobro'].value = arrayObjeto['values'].metodoCobro;
    form['cotizacion'].value = arrayObjeto['values'].numero;
    form['ruc'].value = arrayObjeto['values'].ruc;
    form['cliente'].value = arrayObjeto['values'].cliente;
    form['vendedor'].value = arrayObjeto['values'].vendedor;
    pintarTabla(detalleCotizacion)

    celdaSubTotal.value = arrayObjeto['values'].subTotal;
    inpDescuento.value = arrayObjeto['values'].descuento;
    celda_total.value = arrayObjeto['values'].importeTotal;
  };

  function rellenarDatalist() {
    //datalist para clientes
    let datalist1 = document.createElement('datalist')
    datalist1.setAttribute('id', 'datoClientes')
    datalist1.innerHTML = `
  <option value='08604665'>OSORIO SIGUAS AMERICO REMIGIO</option>
  <option value='09462653'>HENRY MESA GARAY RUDY</option>
  <option value='10013031083'>Eulogio Huancco Ticona</option>
  <option value='10086833315'>LINGAN SEJURO OSCAR ANTONIO</option>
  <option value='10105176363'>ALVARADO ROMAN ISOLINA SILVIA</option>
  <option value='10400035801'>QUENAYA TORRES IOVANNA MARILU</option>
  <option value='10401249716'>ORE GUERRA NELCI</option>
  <option value='10421927788'>ALAYO CRUZ WILSON DAVID</option>
  <option value='10450270461'>LUNG ISIDRO BETSY NATALY</option>
  <option value='10473550151'>Wilfredo Mayta</option>
  <option value='20428756518'>PALAVA E.I.R.L.</option>
  <option value='20518248147'>CEMPLASTIC S.A.C.</option>
  <option value='20508679514'>DISTRIBUIDORA MURDOCK S.R.L.</option>
  <option value='20512048839'>FREDY PONCE & MARANATHA S.A.C.</option>
  <option value='20601632137'>JAL PERU INVERSIONES EIRL</option>
  <option value='20602683461'>RHENACER & CARMEN S.A.C.</option>
  <option value='20608956868'>BIOSELVA PACK S.A.C.</option>
  <option value='48348426'>MANUEL HUANUCO ALBINO</option>
  <option value='73675942'>DEINER CAMPOS</option>
  <option value='77269606'>PAOLA ELIZABETH GARCIA VILCHEZ</option>
  `
    cajaClientes.appendChild(datalist1)

    //datalist para productos
    let datalist = document.createElement('datalist')
    datalist.setAttribute('id', 'productos')
    datalist.innerHTML = `
  <option value='EB0010'>Funda Sorbetes S/M</option>
  <option value='EB0011'>Bolsa Plancha para Sorbetes</option>
  <option value='EB0020'>Funda Palo delgado</option>
  <option value='EB0021'>Funda Copitas paliglobos</option>
  <option value='EB0022'>Bolsa palos chicos millar</option>
  <option value='EB0030'>Funda Sorbeton 50U</option>
  <option value='EB0050'>Funda palo grueso 50U</option>
  <option value='EB0051'>Funda Copa Grande 50U</option>
  <option value='EB0052'>Bolsa Palos Grueso Milla</option>
  <option value='EB0053'>'Bolsa Copa Grande Millar</option>
  <option value='EB0060'>Manga Azul Baja 40x2.5</option>
  <option value='MB0010'>MB Blanco</option>
  <option value='MB0011'>MB Naranja Colortec</option>
  <option value='MB0012'>MB Rojo Escarlata</option>
  <option value='MB0013'>MB Verde Palta</option>
  <option value='MB0014'>MB Amarillo Electrico</option>
  <option value='MB0015'>MB Celeste Andino</option>
  <option value='PB0070'>Paliglobos desarmables base</option>
  <option value='PC0050'>Palito Chupetin Blanco (1.4MillxKg)</option>
  <option value='PD0070'>Paliglobos delgados</option>
  <option value='PD0071'>Paliglobos delgados palos transp.</option>
  <option value='PD0072'>Paliglobos delgados copas transp.</option>
  <option value='PD0073'>Paliglobos delgados palos blanco</option>
  <option value='PD0074'>Paliglobos delgados copas blanco</option>
  <option value='PD0075'>Paliglobos delgados palos rojo</option>
  <option value='PD0076'>Paliglobos delgados copas rojo</option>
  <option value='PG0070'>Paliglobos #40 Transp.</option>
  <option value='PG0071'>Palos #40 transparente</option>
  <option value='PG0072'>Copas #40 transparente</option>
  <option value='PG0073'>Palos #40 blanco</option>
  <option value='PG0074'>Copas #40 blanco</option>
  <option value='PG0075'>Palos #40 rojo</option>
  <option value='PG0076'>Copas #40 rojo</option>
  <option value='PI0010'>Pig. Flourecente Fucsia</option>
  <option value='PI0011'>Pig. Azul Ultramar</option>
  <option value='PI0012'>Pig. Dioxido Titanio </option>
  <option value='PI0013'>Col. Azul a la Grasa</option>
  <option value='PP0010'>PP peletizado cristal extrusion</option>
  <option value='PP0011'>PP peletizado negro rafia</option>
  <option value='PV0010'>Polipropileno Virgen Extrusión</option>
  <option value='SB0050'>Sorbete monocolor clasicos</option>
  <option value='SB0051'>Sorbetes Clásico Negro S/M</option>
  <option value='SB0052'>Sorbetes Clásico Blanco S/M</option>
  <option value='SB0070'>Sorbetes Rayados Surtido S/M </option>
  <option value='SD0070'>Sorbetes Forrados 50UNID. </option>
  <option value='SF0010'>Sorbetes flexibles rayados</option>
  <option value='SF0011'>Sorbetes Flexible Negro S/M</option>
  <option value='SF0012'>Sorbete Flexible Blanco S/M</option>
  <option value='SF0013'>Sorbetes Flexible Colores S/M</option>
  <option value='ST0070'>Sorbeton Forrado</option>
  <option value='ST0071'>Sorbeton Colores </option>
  <option value='ST6000'>Sorbeton Recto Colores S/M</option>
  <option value='ST7001'>Sorbeton Blanco S/M</option>
  <option value='ST7003'>Sorbeton Naranja S/M</option>
  <option value='SP7000'>Sorbete Papel Blanco S/M</option>
  <option value='PR1000'>Picador Color Surtido S/M</option>
  <option value='CU1000'>Cucharitas #4 Colores S/M</option>
  `
    entradaDato.appendChild(datalist)
  };

  function deleteAssignedStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()
      console.log('in deleteAssignedStock:assignedStock,obj.cantidad', fila.assignedStock, obj.cantidad)                                  //.data() metodo para mostrar solo los datos del producto
      let newAssignedStock = Number(fila.assignedStock) - Number(obj.cantidad)
      updateProduct(obj.id, { actualizado: Date.now() })//esta linea se utiliza para abrir un canal con firebase y asi las demas actualizaciones se realicen instantaneamente
      await updateProduct(obj.id, { assignedStock: newAssignedStock })
      //updateAssignedStock(detalleCotizacion)//debido a que esta dentro en un bucle, realiza muchas actualizaciones a DB
      //console.log('in deleteAssignedStock newAssignedStock:',newAssignedStock)
      //console.log('hola mundo2...')
    })
    //alert(`Se deleteAssignedStock: ${counter} productos`)
  };

  function updateAssignedStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    //hay que cambiar de ubicacion para que actualice el stock asignado despues que se presiona un boton y no al arrancar

    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()
      //let cantidadOld=detalleCotizacionOld.filter((producto)=>{return producto.id==obj.id}).cantidad;                                 //.data() metodo para mostrar solo los datos del producto
      //console.log('producto traido id viendo el detalleCotizacion:',cantidadOld,fila.cantidad, fila.assignedStock)
      //fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar                                            //por defecto cantidad igual a 1
      //fila.detallePedido
      //let id = obj.id
      console.log('fila.assignedStock:', fila.assignedStock)
      console.log('obj.cantidad new:', obj.cantidad)
      let newAssignedStock = Number(fila.assignedStock) + Number(obj.cantidad)
      updateProduct(obj.id, { assignedStock: newAssignedStock })
      console.log('se actualizo assignedStock:', newAssignedStock)
    })
    //alert(`Se realizo la actualizacion de ${counter} Productos `)
  };

  function deleteStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()
      console.log('in deleteStock:obj.stock,obj.cantidad', fila.stock, obj.cantidad)                                  //.data() metodo para mostrar solo los datos del producto
      let newStock = Number(fila.stock) + Number(obj.cantidad)
      updateProduct(obj.id, { actualizado: Date.now() })//esta linea se utiliza para abrir un canal con firebase y asi las demas actualizaciones se realicen instantaneamente
      await updateProduct(obj.id, { stock: newStock })
      //updateAssignedStock(detalleCotizacion)//debido a que esta dentro en un bucle, realiza muchas actualizaciones a DB
      //console.log('in deleteAssignedStock newAssignedStock:',newAssignedStock)
      //console.log('hola mundo2...')
    })
    //alert(`Se deleteAssignedStock: ${counter} productos`)
  };

  function updateStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    //hay que cambiar de ubicacion para que actualice el stock asignado despues que se presiona un boton y no al arrancar

    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()
      //let cantidadOld=detalleCotizacionOld.filter((producto)=>{return producto.id==obj.id}).cantidad;                                 //.data() metodo para mostrar solo los datos del producto
      //console.log('producto traido id viendo el detalleCotizacion:',cantidadOld,fila.cantidad, fila.assignedStock)
      //fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar                                            //por defecto cantidad igual a 1
      //fila.detallePedido
      //let id = obj.id
      console.log('fila.Stock:', fila.stock)
      console.log('obj.cantidad new:', obj.cantidad)
      let newStock = Number(fila.stock) - Number(obj.cantidad)
      updateProduct(obj.id, { stock: newStock })
      console.log('se actualizo assignedStock:', newStock)
    })
    //alert(`Se realizo la actualizacion de ${counter} Productos `)
  };

  function pintarTabla(objetos) {
    console.log('Lo que hay en LS:', objetos)
    if (objetos == null) {
      alert('no hay que pintar...')
      return;
    } else {
      limpiarTabla()
      pintarFilasLlenas(objetos)
      //pintarFilasVacias(objetos)
      actualizaImporteTotal()
    }
  };

  function registrarVenta() {


    console.log('dentro funcion registraVenta:')

    //let tiempo = Date.now()
    let cliente = form['cliente'].value
    let ruc = form['ruc'].value
    let vendedor = form['vendedor'].value
    let detalleCotizacion2 = JSON.stringify(detalleCotizacion)
    let estado = 'nuevo';
    let tipoPago = form['tipoPago'].value;
    let metodoCobro = form['metodoCobro'].value;
    let nuevoNumero = Number(numeroCotizacion.value);
    let fecha = form['fecha'].value;
    let subTotal = Number(celdaSubTotal.value);
    let descuento = Number(inpDescuento.value)
    let importeTotal = subTotal - descuento
    let transportedBy = 'sin enviar';
    console.log('importeTotal:', importeTotal);
    console.log('descuento:', descuento);
    //console.log('tiempo:', tiempo)

    if (estadoPedido == 'nuevo' && !sentinelaGuardar) {
      //deleteAssignedStock(detalleCotizacionOld);

      updateAssignedStock(detalleCotizacion)
      console.log('se edito el pedido y se registro el pedido con id:', idPedido)
      //guardarCotizacion(nuevoNumero, fecha, vendedor, cliente, ruc, detalleCotizacion, estado, tipoPago, metodoCobro, subTotal, descuento, importeTotal, tiempo, transportedBy)
      updatePedido(idPedido, { fecha: fecha, detalleCotizacion: detalleCotizacion2, subTotal: subTotal, descuento: descuento, importeTotal: importeTotal })
      //updateNumeracion('Cotizacion', { ultimoNumero: nuevoNumero })
      //updateClientes(ruc, { saldo: nuevoSaldo,clienteRank: 2 })

      //console.log('se edito el pedido y se registro el pedido con id:',arrayObjeto[0].id,)
      sentinelaGuardar = true;
    } else if (estadoPedido == 'enviado' && !sentinelaGuardar) {
      alert('El pedido estado enviado se actualizara stock codigo en construccion...')
      updateStock(detalleCotizacion)
      updatePedido(idPedido, { fecha: fecha, detalleCotizacion: detalleCotizacion2, subTotal: subTotal, descuento: descuento, importeTotal: importeTotal })
    } else {
      alert('El pedido debe ser nuevo enviado o no se puede actualizar varias veces, ya fue actualizado...')
      updateStock(detalleCotizacion2)
    }
  };

  function actualizaImporte(e) {

    if (e.key === 'Enter') {
      e.preventDefault()

      for (let i = 0; i < detalleCotizacion.length; i++) {
        detalleCotizacion[i].cantidad = parseFloat(tabla.children[i].children[2].children[0].value)
        detalleCotizacion[i].precio = parseFloat(tabla.children[i].children[5].children[0].value)
        detalleCotizacion[i].importe = parseFloat(detalleCotizacion[i].cantidad * detalleCotizacion[i].precio)
      }
      limpiarTabla(e)
      pintarTabla(detalleCotizacion)
      actualizaImporteTotal()
      console.log('objeto actualizado:', detalleCotizacion)
    }
  };

  function limpiarTabla() {
    while (tabla.firstChild) {
      tabla.removeChild(tabla.firstChild)
    }
  };

  function actualizaImporteTotal() {

    let total = detalleCotizacion.reduce((tot, producto) => tot + producto.importe, 0)

    celdaSubTotal.value = total.toFixed(2)
    let desc = inpDescuento.value
    celda_total.value = Intl.NumberFormat('es-419').format(celdaSubTotal.value - desc)
    //Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
  };

  function operacionesEnTabla(e) {

    if (e.target.classList.contains('btn-delete')) {
      eliminarProducto(e)
    }
    if (e.target.classList.contains('btn-stock')) {
      filaMuestraStock(e)
    }
  };

  function eliminarProducto(e) {
    let id_producto = e.target.getAttribute('data-id')

    objetos = detalleCotizacion.filter((producto) => producto.id !== id_producto);
    detalleCotizacion = objetos;
    limpiarTabla()
    console.log('diste clik en boton delete... nuevo objeto', objetos)
    pintarTabla(detalleCotizacion)
  };

  function filaMuestraStock(e) {
    let filasTabla = document.querySelectorAll('tbody tr');
    console.log('filasTabla:', filasTabla);
    let id_producto = e.target.getAttribute('data-id')                            //captura el ID producto de la fila
    let ubicacion = detalleCotizacion.findIndex((elem) => { return elem.id == id_producto })    //captura el indice o poscion del objeto producto de la fila

    if (alternador) {//para expandir o contraer fila
      let producto_encontado = detalleCotizacion.find((elem) => { return elem.id == id_producto })  //encuentra el productos en el objeto con el ID anterior
      console.log('clik en (+), el stock es:', producto_encontado.stock)
      let fila = document.createElement('tr')
      let celda = document.createElement('td')
      celda.textContent = producto_encontado.stock
      fila.appendChild(celda)
      console.log('Filas Ubicacion:', ubicacion)
      tabla.insertBefore(fila, tabla.children[ubicacion + 1])
      alternador = false
    } else {
      tabla.removeChild(tabla.children[ubicacion + 1])
      alternador = true
    }
  };

  function pintarFilasLlenas(objetos) {
    let contador = 1
    objetos.forEach(producto => {
      let fila = document.createElement('tr')

      fila.innerHTML = `
                        <td><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button>${contador}</td>
                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button>${producto.id}</td> 
  
                        <td class='cantidad'><input type='number'  min="0" step="0.1" class='cantidad2' id='${producto.id}' value=${producto.cantidad}></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td class='cantidad'><input type='number' min="0" step="0.1" class='cantidad2'  id='${producto.id}' value=${producto.precio}></td>
                        <td class='cantidad'><input type='number'  id='${producto.id}' class='cantidad2'  value=${producto.importe.toFixed(2)}></td>
                                              
                        `
      contador++
      tabla.appendChild(fila)
    });
    sincronizarLocalStorage(detalleCotizacion)
  };

  function sincronizarLocalStorage(detalleCotizacion) {
    localStorage.setItem('cotizacion', JSON.stringify(detalleCotizacion))
    detalleCotizacion = JSON.parse(localStorage.getItem('cotizacion'))
    console.log('guardado en LS')
  }

  async function ingresarProducto(e) {

    //e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    //console.log('dentro de funcion ingresarproducto',e.target)
    let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:', id)
    if (id) {
      console.log('objeto a evaluar:', detalleCotizacion)
      if (detalleCotizacion == null) {
        detalleCotizacion = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
      }
      let duplicado = detalleCotizacion.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto

      if (!duplicado) {
        inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
        btn_semaforo.classList.toggle('semaforo-verde')
        btn_semaforo.textContent = 'exito!';
        let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB

        let fila = traerDoc.data()                                  // aca debe eliminarse varios campos innecesarios.data() metodo para mostrar solo los datos del producto
        fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
        fila.cantidad = 1                                             //por defecto cantidad igual a 1
        fila.importe = fila.precio * fila.cantidad                      //calculamos l importe

        detalleCotizacion.push(fila)                                          //metemos los datos de fila en detalleCotizacion
        limpiarTabla(e)                                             //limpir datos de la tabla
        pintarTabla(detalleCotizacion)
      } else {
        btn_semaforo.classList.toggle('semaforo-rojo');
        btn_semaforo.textContent = 'duplicado';
      }

      console.log('contenido del objeto:', detalleCotizacion)

    } else {
      btn_semaforo.classList.toggle('semaforo-ambar');
      btn_semaforo.textContent = 'vacio';
    }
  }

  function activarEnter(e) {
    if (e.key === 'Enter') {
      ingresarProducto();
    }
  }

  async function activarEnter2(e) {
    if (e.key === 'Enter' || e.type == 'panright') {
      let id = inpCodigoCliente.value.trim();
      console.log('presionaste enter...', id)                   //trae un nombre de cliente de la DB
      let traerDoc = await traerUnSocio(id);
      let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
      let razonSocial = fila.razonSocial;
      form['vendedor'].value = fila.vendidoPor
      saldo = Number(fila.saldo);
      console.log('presionaste enter...', razonSocial, saldo)
      inpCliente.value = razonSocial

      let traerDoc2 = await traerUnNumeracion('Cotizacion')
      let dato = traerDoc2.data()
      numeroCotizacion.value = Number(dato.ultimoNumero) + 1;
    }
  }

};

async function registrarEnvio(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
  let id = arrayObjeto.id
  console.log(' id consulta venta arrayObjeto :', id)
  const flotante = document.getElementById('flotante');

  flotante.innerHTML = `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante2">Modal</button>
  <div class="modal modal-lg" id="flotante2">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>
<div class="modal-body" id="flotante2">

  <section id="documentoPDF">

  <div class="grupo1">
      <div class="logo">
          <img src="./imagenes/heinz_sport_sac_logo.png" width="250" >
          </div>
      <div class="contacto">
          <h1 class="h6">www.heinzsport.com <i class="fa-solid fa-globe"></i></h1>
          <h1 class="h6">info@heinzsport.com <i class="fa-regular fa-envelope"></i></h1>
          <h1 class="h6">+51 962833765<i class="fa-brands fa-whatsapp"></i></h1>
      </div>
      <div class="cajita2">
          <h3 class="h6" id="ruc2">RUC: 20605216715</h3>
          <h3 class="h6">PEDIDO VENTA</h3>
          <h3 class="h6" id="cotizacion"></h3>
      </div>
  </div>

<form class="form2" id="formulario">
<div class="cajita1b">
  <div class="input-group">    
  <label for="ruc">CODIGO :</label>
  <h1 class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
  </div>

  <div class="input-group"> 
  <label for="cliente">CLIENTE :</label>
  <h1  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
  </div>

  <div class="input-group"> 
  <label for="vendedor">VENDEDOR:</label>
  <h1  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
  </div>       
</div>

  <div class="cajita4">
      <div class="input-group">
          <label for="fecha">Fecha:</label>
          <h3 class="form-control celda" id="fecha"></h3>
      </div>
      <div class="input-group">
          <label for="tipoPago">Pago:</label>
          <h3 class="form-control celda" type="text" id="tipoPago"></h3>
      </div>
      <div class="input-group">
          <label for="metodoCobro">Cobro:</label>
          <h3 class="form-control celda" type="text" id="metodoCobro"></h3>
      </div>
  </div>
</form>

  <table id='table' class="tabla">  
      <thead class="tituloTabla">
          <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
      </thead>

      <tbody id="container"></tbody>
      
      <tfoot class="button-content">
      <tr><th>Sub_Total (S/)</th><th></th><th><h1 id="celdaSubTotal"  class="h6"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="h6"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="h3"></h1></th></tr>
      </tfoot>
  </table>
  
  <div class="cajaEnvio">
        <div class="fecha"><label for="fechaEnvio">Fecha Envio:</label><input type="date" id="fechaEnvio"></div>
        <div><label for="gastoEnvio">Pago:</label><input type="number" id="gastoEnvio"></div>
        <div><label for="empresaEnvio">Empresa Transporte:</label><input type="text" id="empresaEnvio"></div>
        <div><label for="personaEnvio">Enviado por:</label><input type="text" id="personaEnvio"></div>
        
      </div>
 
  </section>



  </div>
  <div class="modal-footer">
  <button class="btn btn-primary" type="button" id ="registrarEnvio">Registrar Envio</button>
  <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
    <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
  </div>
</div>
</div>
</div>
    `

  const fechaEnvio = document.getElementById('fechaEnvio');
  const gastoEnvio = document.getElementById('gastoEnvio');
  const btn_imprimir = document.getElementById('btn-imprimir')
  fechaEnvio.value=pintarFecha(`${arrayObjeto['values'].fecha}T12:00:00Z`);

  btn_imprimir.addEventListener('click', generaPDF)


  cotizacion.textContent = arrayObjeto['values'].numero
  vendedor.textContent = arrayObjeto['values'].vendedor
  ruc.textContent = arrayObjeto['values'].ruc
  cliente.textContent = arrayObjeto['values'].cliente
  fecha.textContent = pintarFecha(`${arrayObjeto['values'].fecha}T12:00:00Z`)
  tipoPago.value = arrayObjeto['values'].tipoPago
  metodoCobro.value = arrayObjeto['values'].metodoCobro
  celdaSubTotal.textContent = arrayObjeto['values'].subTotal
  descuento.textContent = arrayObjeto['values'].descuento
  celda_total.textContent = arrayObjeto['values'].importeTotal

  let clienteTraido = await traerUnSocio(arrayObjeto['values'].ruc); //trae un cliente por ruc de la DB
  let clienteDatos = clienteTraido.data() //calcula la cantidad que quedaria despues del registro
  console.log('clienteTraido clienteDatos:', clienteTraido, clienteDatos);
  let nuevoSaldo = arrayObjeto['values'].importeTotal + Number(clienteDatos['saldo']);
  let nuevoClienteRank = Number(clienteDatos['clienteRank']) + 1;

  let detalleCotizacion = JSON.parse(arrayObjeto['values'].detalleCotizacion);
  let contador = 1;
  detalleCotizacion.forEach(producto => {
    let fila = document.createElement('tr');

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
    const tabla = document.getElementById('table');
    tabla.appendChild(fila)
  });

  const registrarEnvio = document.getElementById('registrarEnvio');
  registrarEnvio.addEventListener('click', () => {
    if (!(arrayObjeto['values'].fechaEnvio)) {
      console.log('fechaEnvio y GastoEnvio:', fechaEnvio.value, gastoEnvio.value, empresaEnvio.value)
      actualizarStock(detalleCotizacion)
      updatePedido(id, { fechaEnvio: fechaEnvio.value, gastoEnvio: gastoEnvio.value, transportedBy: empresaEnvio.value, personaEnvio: personaEnvio.value, estado: 'enviado' })
      updateClientes(arrayObjeto['values'].ruc, { saldo: nuevoSaldo, clienteRank: nuevoClienteRank })
      alert('se paso el registro nuevoSaldo:', nuevoSaldo)
    } else {
      alert('ya se registro el envio con:', empresaEnvio.value)
    }
  });

  function actualizarStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
      console.log('producto traido id stock:', fila.id, fila.stock)
      //fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar                                            //por defecto cantidad igual a 1
      //fila.detallePedido
      //let id = obj.id
      let nuevo_stock = Number(fila.stock) - Number(obj.cantidad)
      let newAssignedStock = Number(fila.assignedStock) - Number(obj.cantidad)
      updateProduct(obj.id, { stock: nuevo_stock, assignedStock: newAssignedStock })//actualizamos el stock y el stock que se separo
      console.log('updateProduct:', nuevo_stock, newAssignedStock)
      counter++
    })
    alert(`Se actualizó: ${counter} productos`)
  }
};

async function registrarPago(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
  let idPedido = arrayObjeto.id
  let idCliente = arrayObjeto['values'].ruc
  console.log(' id consulta venta arrayObjeto :', idPedido)
  const flotante = document.getElementById('flotante');

  flotante.innerHTML = `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante2">Modal</button>
  <div class="modal modal-lg" id="flotante2">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>
<div class="modal-body" id="flotante2">

  <section id="documentoPDF">

  <div class="grupo1">
      <div class="logo">
          <img src="./imagenes/heinz_sport_sac_logo.png" width="250" >
          </div>
      <div class="contacto">
          <h1 class="h6">www.heinzsport.com <i class="fa-solid fa-globe"></i></h1>
          <h1 class="h6">info@heinzsport.com <i class="fa-regular fa-envelope"></i></h1>
          <h1 class="h6">+51 962833765<i class="fa-brands fa-whatsapp"></i></h1>
      </div>
      <div class="cajita2">
          <h3 class="h6" id="ruc2">RUC: 20605216715</h3>
          <h3 class="h6">PEDIDO VENTA</h3>
          <h3 class="h6" id="cotizacion"></h3>
      </div>
  </div>

<form class="form2" id="formulario">
<div class="cajita1b">
  <div class="input-group">    
  <label for="ruc">CODIGO :</label>
  <h1 class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
  </div>

  <div class="input-group"> 
  <label for="cliente">CLIENTE :</label>
  <h1  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
  </div>

  <div class="input-group"> 
  <label for="vendedor">VENDEDOR:</label>
  <h1  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
  </div>       
</div>

  <div class="cajita4">
      <div class="input-group">
          <label for="fecha">Fecha:</label>
          <h3 class="form-control celda" id="fecha"></h3>
      </div>
      <div class="input-group">
          <label for="tipoPago">Pago:</label>
          <h3 class="form-control celda" type="text" id="tipoPago"></h3>
      </div>
      <div class="input-group">
          <label for="metodoCobro">Cobro:</label>
          <h3 class="form-control celda" type="text" id="metodoCobro"></h3>
      </div>
  </div>
</form>

  <table id='table' class="tabla">  
      <thead class="tituloTabla">
          <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
      </thead>

      <tbody id="container"></tbody>
      
      <tfoot class="button-content">
      <tr><th>Sub_Total (S/)</th><th></th><th><h1 id="celdaSubTotal"  class="h6"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="h6"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="h3"></h1></th></tr>
      </tfoot>
  </table>

    <div class="cajaEnvio">
        <div><label for="saldoDocumento">Saldo Documento:</label><h1 type="date" id="saldoDocumento"></h1></div>

        <div><label for="fechaPago">Fecha Pago:</label><input type="date" id="fechaPago"></div>
        <div><label for="metodoPago">Metodo:</label><input type="text"id="metodoPago"></div>
        <div><label for="importePago">Importe (S/):</label><input type="number" id="importePago"></div>
        
      </div>

</section>

</div>
  <div class="modal-footer">
  <button class="btn btn-primary" type="button" id ="btnRegistrarPago">Registrar Pago</button>
  <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
  <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
  </div>
</div>
</div>
</div>


`

  const btn_imprimir = document.getElementById('btn-imprimir')
  const btnRegistrarPago = document.getElementById('btnRegistrarPago');
  btn_imprimir.addEventListener('click', generaPDF)
  btnRegistrarPago.addEventListener('click', procesarEnvio);


  cotizacion.textContent = arrayObjeto['values'].numero
  vendedor.textContent = arrayObjeto['values'].vendedor
  ruc.textContent = arrayObjeto['values'].ruc
  cliente.textContent = arrayObjeto['values'].cliente
  fecha.textContent = new Date(`${arrayObjeto['values'].fecha}T12:00:00Z`).toLocaleDateString()
  tipoPago.value = arrayObjeto['values'].tipoPago
  metodoPago.value = arrayObjeto['values'].metodoCobro
  celdaSubTotal.textContent = arrayObjeto['values'].subTotal
  descuento.textContent = arrayObjeto['values'].descuento
  celda_total.textContent = arrayObjeto['values'].importeTotal
  //importePago.value         =arrayObjeto['values'].importeTotal


  let detalleCotizacion = JSON.parse(arrayObjeto['values'].detalleCotizacion)
  let contador = 1;
  const tabla = document.getElementById('table');
  detalleCotizacion.forEach(producto => {
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
    tabla.appendChild(fila)
  });

  console.log('idCliente :', idCliente);
  let clienteTraido = await traerUnSocio(idCliente); //trae un cliente por ruc de la DB
  let datosCliente = clienteTraido.data() //calcula la cantidad que quedaria despues del registro
  let clienteDatosSaldo = 0;

  if (!(clienteTraido.data())) {
    console.log('Firebase no envio el documento del cliente:', clienteTraido);
  } else {
    clienteDatosSaldo = datosCliente['saldo']
    console.log('clienteTraido :', datosCliente, clienteDatosSaldo);
  }

  let Pagos = [];
  let pagoAcumuladoAntiguo = 0;

  if (arrayObjeto['values'].pagosPedido) {
    let pagos = JSON.parse(arrayObjeto['values'].pagosPedido)
    pagos.forEach((pago) => {
      pagoAcumuladoAntiguo += Number(pago.importePago);
      Pagos.push(pago);
    })
  }

  let saldoDocumentoActual = arrayObjeto['values'].importeTotal - pagoAcumuladoAntiguo
  saldoDocumento.textContent = saldoDocumentoActual;
  let nuevoEstadoPedido = arrayObjeto['values'].estado;
  let fechaPago = '';
  document.getElementById('importePago').value = saldoDocumentoActual;
  //document.getElementById('fechaPago').value = pintarFecha();
  document.getElementById('fechaPago').value = pintarFecha(`${arrayObjeto['values'].fecha}T12:00:00Z`);
  console.log('new Date(Date.now()).toLocaleDateString():', pintarFecha(`${arrayObjeto['values'].fecha}T12:00:00Z`))
  //{fechaPago:'fechaPago',metodoPago:'metodoPago',importePago:'importePago'}




  function procesarEnvio() {
    let objPago = {};
    objPago['fechaPago'] = document.getElementById('fechaPago').value;
    objPago['metodoPago'] = document.getElementById('metodoPago').value;
    objPago['importePago'] = document.getElementById('importePago').value;
    Pagos.push(objPago)

    saldoDocumentoActual = saldoDocumentoActual - Number(document.getElementById('importePago').value)

    if (saldoDocumentoActual <= 0) {
      nuevoEstadoPedido = 'cancelado';
      fechaPago = document.getElementById('fechaPago').value;
      console.log('se cambio el estado:', nuevoEstadoPedido)
    }

    let nuevoSaldo = Number(clienteDatosSaldo) - Number(document.getElementById('importePago').value);


    updatePedido(idPedido, { pagosPedido: JSON.stringify(Pagos), estado: nuevoEstadoPedido, fechaPago: fechaPago })
    //console.log('se registro exitosamente el importePago:',Number(importePago.value))
    updateClientes(idCliente, { saldo: nuevoSaldo })
    console.log('se actualizo el saldo del cliente nuevo saldo:', idCliente, nuevoSaldo)
    //await updateProduct(id,{stock:nuevoStockProducto});//actualiza el stock del producto
    //console.log('se actualizo el pago del documento,sin actualizar en saldo del cliente...')
  }




};

async function generaPDF() {
  console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
  const areaImpresion = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
  let id_cotizacion = document.getElementById('cotizacion').value

  await html2pdf()
    .set({
      margin: 5,
      filename: `PV${cotizacion.textContent}_${Math.round(celda_total.textContent)}`,
      //se borro image jpg, averiguar codigo origina en github del cdn html2pdf form['cliente'].value
      html2canvas: {
        scale: 5, // A mayor escala, mejores gráficos, pero más peso
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: 'a5',
        orientation: 'landscape' // landscape o portrait
      }
    })
    .from(areaImpresion)
    .save()
    .catch(err => console.log(err));

};

function pintarFecha(fecha = Date.now()) {
  let date = new Date(fecha)
  if (date.getMonth() < 9 && date.getDate() < 10) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
  } else if (date.getMonth() < 9 && date.getDate() >= 10) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
  } else if (date.getMonth() >= 9 && date.getDate() < 10) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`;
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}