import { updatePedido, updateProduct, traerUnSocio, traeroneProduct,updateClientes, traerUnNumeracion } from '../firebase.js';
import { deleteElementHTML } from "../plugins/deleteElementHTML.js";
import { showMessage } from "../src/app/showMessage.js";
import { formularioVenta } from "./formularioVenta.js";

export function editOrder(arrayObjeto) {
  let sentinelaGuardar = false;//se cambia a true cuando se presiono el boton guardado por vez primera
  let alternador = true;
  let estadoPedido = arrayObjeto['values'].estado;
  let idPedido = arrayObjeto.id;
  let detalleCotizacionOld = JSON.parse(arrayObjeto['values'].detalleCotizacion);
  let detalleCotizacion = JSON.parse(arrayObjeto['values'].detalleCotizacion);
  

  if (estadoPedido == 'nuevo') {
    console.log('modificando el modulo editarPedido');

    const flotante = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    const modalHeader = document.querySelector('.modal-header');
    
    deleteElementHTML('.modal-footer');
    deleteElementHTML('.modal-header');

    modalHeader.innerHTML='<h4 class="modal-title">Editar Pedido</h4>';
    //const flotante = document.getElementById('flotante');
    flotante.innerHTML = formularioVenta;

    const tabDetalle = document.getElementById('home')
    tabDetalle.innerHTML = `
    <table id='table' class="tabla">  
    <thead class="tituloTabla">
        <tr><th>#</th><th>CODIGO</th><th>CANT.</th><th>UNIDAD</th><th>DESCRIPCION</th><th>PRECIO</th><th>IMPORTE</th></tr>
    </thead>

    <tbody class="container" id="container"></tbody>
    <tfoot class="tfootTotales" id="tfoot">
        <tr><td></td><td></td><td></td><td></td><td><label>Total (S/)</label></td><td></td><td><input id="celdaSubTotal" class="col" type="number" value="0"></td></tr>
        <tr><td></td><td></td><td></td><td></td><td><label>Descuento (S/)</label></td><td></td><td><input id="descuento" class="col" type="number" value="0"></td></tr>
        <tr><td></td><td></td><td></td><td></td><td><label>Total (S/)</label></td><td></td><td><input id="celda_total" class="col" type="number" value="0"></td></tr>
    </tfoot>
    </table>
    ` ;
    
    const documentoPDF = document.getElementById('documentoPDF');
    const cajaIngreso = document.createElement('div');
    cajaIngreso.setAttribute('class', 'cajaBotones');
    cajaIngreso.setAttribute('id', 'entradaDato');
    cajaIngreso.innerHTML = `
    <div class="entradaDato">
    <label for="codigo" class='codigo'>Codigo:</label>
    <input class='celda ' type="text" id="codigo" list="productos" placeholder="Ingrese código de producto"><span class="validity"></span>
    <button id="boton">Ingresar</button>
    <button class="semaforo" id="semaforo">''</button>
    `
    documentoPDF.appendChild(cajaIngreso);
    
    //creando el boton guaradar y añadiendo al modal footer
    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Actualizar';
    btnSaveDocument.addEventListener('click',()=>registrarVenta(detalleCotizacion));
    modalFooter.appendChild(btnSaveDocument);

    //creando el boton cancelar y añadiendo al modal footer
    const btnCancelEdit = document.createElement('button');
    btnCancelEdit.setAttribute('id', 'btnCancelar');
    btnCancelEdit.setAttribute('class', 'btn btn-primary');
    btnCancelEdit.textContent = 'Cancelar';
    btnCancelEdit.addEventListener('click',()=>registrarVenta(detalleCotizacionOld));
    modalFooter.appendChild(btnCancelEdit);


    
    const form = document.getElementById('formulario');
    //const tabla = document.getElementById('container');
    const inpCodigoCliente = document.getElementById('ruc');
    
    //const inpCliente = document.getElementById('cliente')
    //const fecha = document.getElementById('fecha')
    
    const numeroCotizacion = document.getElementById('cotizacion')
    
    

    let f = new Hammer(inpCodigoCliente)
    f.on('panright', activarEnter2)

    //let objetos = JSON.parse(localStorage.getItem('cotizacion'))

    numeroCotizacion.value = arrayObjeto['values'].numero;
    form['fecha'].value = arrayObjeto['values'].fecha;
    //form['tipoPago'].value = arrayObjeto['values'].tipoPago;
    //form['metodoCobro'].value = arrayObjeto['values'].metodoCobro;
    form['ruc'].value = arrayObjeto['values'].ruc;
    form['cliente'].value = arrayObjeto['values'].cliente;
    form['vendedor'].value = arrayObjeto['values'].vendedor;
    pintarTabla(detalleCotizacion)

    //celdaSubTotal.value = arrayObjeto['values'].subTotal;
    //inpDescuento.value = arrayObjeto['values'].descuento;
    //celda_total.value = arrayObjeto['values'].importeTotal;

    rellenarDatalist();
    cargarEventListeners(detalleCotizacion);
    deleteAssignedStock(detalleCotizacionOld)
  } else {
    let sign = prompt("El pedido esta enviado, si deseas eliminar el envio ingrese su clave");

    if (sign === "123456") {
      showMessage(`Clave correcta...`)
      deleteDeliveryOrder(arrayObjeto);
    }
  }

  function cargarEventListeners(detalleCotizacion) {
    const btn_ingresar = document.getElementById('boton');
    const inpCodigo = document.getElementById('codigo');
    const inpCodigoCliente = document.getElementById('ruc');
    const tabla = document.getElementById('container');
    
    btn_ingresar.addEventListener('click',ingresarProducto);
    inpCodigo.addEventListener('keypress',activarEnter);
    inpCodigoCliente.addEventListener('keypress', activarEnter2);
    tabla.addEventListener('click',(e)=> operacionesEnTabla(e,tabla));
    tabla.addEventListener('keypress',(e)=> actualizaImporte(e,detalleCotizacion));
  };


  function rellenarDatalist() {
    //datalist para clientes
    const cajaClientes = document.getElementById('ruc')
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
      await updateProduct(obj.id, { actualizado: Date.now() })//esta linea se utiliza para abrir un canal con firebase y asi las demas actualizaciones se realicen instantaneamente
      await updateProduct(obj.id, { assignedStock: newAssignedStock })
    })
    showMessage(`se devolvió a AssignedStock ${counter} productos`)
  };

  async function deleteDeliveryOrder(item) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    let ArrayObjetos= JSON.parse(item['values'].detalleCotizacion)
    let fechaEnvio='';
    let estado='nuevo';
    let idPedido=item.id;
    let idSocio=item['values'].ruc;
    
    //Actualizar productos devolver stock y AssignedStock
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = await  traerDoc.data();
      //console.log('in deleteAssignedStock:assignedStock,obj.cantidad', fila.assignedStock, obj.cantidad)                                  //.data() metodo para mostrar solo los datos del producto
      let newStock = Number(fila.stock) + Number(obj.cantidad);
      let newAssignedStock = Number(fila.assignedStock) + Number(obj.cantidad);
      
      await updateProduct(obj.id, { actualizado: Date.now() })//esta linea se utiliza para abrir un canal con firebase y asi las demas actualizaciones se realicen instantaneamente
      await updateProduct(obj.id, { stock: newStock })
      await updateProduct(obj.id, { assignedStock: newAssignedStock })
    })
    //actualizar saldo cliente y rankcliente disminuir
    
    let clienteTraido = await traerUnSocio(idSocio); //trae un cliente por ruc de la DB
    let datosCliente = await clienteTraido.data(); //calcula la cantidad que quedaria despues del registro
    let nuevoSaldo = datosCliente.saldo-item['values'].importeTotal;
    let newClienteRank= Number(Number(datosCliente.clienteRank)-1);
    let transportedBy='';


    updateClientes(idSocio, { saldo: nuevoSaldo,clienteRank:newClienteRank })
    //actualizar el pedido: estado del pedido a nuevo y fecha de envio
    updatePedido(idPedido, {fechaEnvio: fechaEnvio, estado: estado,transportedBy:transportedBy});


    
    
    showMessage(`se elimino el envio del pedido: ${idPedido} y cliente ${idSocio} `)
  };

  function updateAssignedStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
    //hay que cambiar de ubicacion para que actualice el stock asignado despues que se presiona un boton y no al arrancar

    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = await traerDoc.data()
      let newAssignedStock = Number(fila.assignedStock) + Number(obj.cantidad)
      updateProduct(obj.id, { assignedStock: newAssignedStock })

    })
    showMessage(`se actualizo assignedStock ${counter} productos`)
  };

  function deleteStock(ArrayObjetos) {//ACTUALIZA STOCK agregando al stock las cantidades del documento
    let counter = 0
    ArrayObjetos.forEach(async (obj) => {
      counter++
      let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
      let fila = traerDoc.data()
      console.log('in deleteStock:obj.stock,obj.cantidad', fila.stock, obj.cantidad)                                  //.data() metodo para mostrar solo los datos del producto
      let newStock = Number(fila.stock) + Number(obj.cantidad)
      updateProduct(obj.id, { actualizado: Date.now() })//esta linea se utiliza para abrir un canal con firebase y asi las demas actualizaciones se realicen instantaneamente
      await updateProduct(obj.id, { stock: newStock })
    })
    showMessage(`se devolvió a stock ${counter} productos`)
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
    })
    showMessage(`se actualizo assignedStock ${counter} productos`)
  };

  function pintarTabla(detallePedido) {
    console.log('Lo que hay en LS:', detallePedido)
    if (detallePedido == null) {
      alert('no hay que pintar...')
      return;
    } else {
      deleteElementHTML('.container')
      pintarFilasLlenas(detallePedido)
      actualizaImporteTotal(detallePedido)
      sincronizarLocalStorage(detallePedido)
    }
  };

  function registrarVenta(detalleCotizacion) {
    const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
    const detalleCotizacion2 = JSON.stringify(detalleCotizacion)
    const form = document.getElementById('formulario');
    const subTotal = Number(document.getElementById('celdaSubTotal').value);
    const descuento = Number(document.getElementById('descuento').value);
    const importeTotal = Number(document.getElementById('celda_total').value);
    //const numeroCotizacion = document.getElementById('cotizacion').value;
    console.log('dentro funcion registraVenta:')

    //let tiempo = Date.now()
    let cliente = form['cliente'].value
    let ruc = form['ruc'].value
    let vendedor = form['vendedor'].value
    let fecha = form['fecha'].value;
    let tipoPago = '';
    let metodoCobro = '';
    //let estado = 'nuevo';
    //let nuevoNumero = Number(numeroCotizacion.value);
    //let subTotal = Number(celdaSubTotal.value);
    //let descuento = Number(inpDescuento.value)
    //let importeTotal = subTotal - descuento
    //let transportedBy = 'sin enviar';
    console.log('importeTotal:', importeTotal);
    console.log('descuento:', descuento);
    //console.log('tiempo:', tiempo)

    if (estadoPedido == 'nuevo' && !sentinelaGuardar) {
      //deleteAssignedStock(detalleCotizacionOld);

      updateAssignedStock(detalleCotizacion)
      console.log('se edito el pedido y se registro el pedido con id:', idPedido)
      updatePedido(idPedido, { cliente: cliente, ruc: ruc, vendedor: vendedor, fecha: fecha, detalleCotizacion: detalleCotizacion2, subTotal: subTotal, descuento: descuento, importeTotal: importeTotal });
      showMessage(`Se editó pedido nuevo id:${idPedido}`, 'success')
      modal.hide();
      sentinelaGuardar = true;
    } else {
      alert('El pedido no se puede actualizar varias veces, ya fue actualizado...');
      modal.hide();
    }
  };

  function actualizaImporte(e,detalleCotizacion) {
    const tabla = document.getElementById('container');
    if (e.key === 'Enter' || e.type == 'panright') {
      e.preventDefault()

      for (let i = 0; i < detalleCotizacion.length; i++) {
        detalleCotizacion[i].cantidad = parseFloat(tabla.children[i].children[2].children[0].value)
        detalleCotizacion[i].precio = parseFloat(tabla.children[i].children[5].children[0].value)
        detalleCotizacion[i].importe = parseFloat(detalleCotizacion[i].cantidad * detalleCotizacion[i].precio)
      }
      deleteElementHTML('.container');
      pintarTabla(detalleCotizacion);
      actualizaImporteTotal(detalleCotizacion);
      console.log('objeto actualizado:', detalleCotizacion)
    }
  };

  function actualizaImporteTotal(detalleCotizacion) {
    const inpDescuento = document.getElementById('descuento');
    let total = detalleCotizacion.reduce((tot, producto) => tot + producto.importe, 0);

    celdaSubTotal.value = total.toFixed(2)
    let desc = Number(inpDescuento.value)
    celda_total.value = celdaSubTotal.value - desc;
    //Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
  };

  function operacionesEnTabla(e,tabla) {

    if (e.target.classList.contains('btn-delete')) {
      eliminarProducto(e)
    }
    if (e.target.classList.contains('btn-stock')) {
      filaMuestraStock(e,tabla)
    }
  };

  function eliminarProducto(e) {
    let id_producto = e.target.getAttribute('data-id')

    let objetos = detalleCotizacion.filter((producto) => producto.id !== id_producto);
    detalleCotizacion = objetos;
    deleteElementHTML('.container')
    console.log('diste clik en boton delete... nuevo objeto', objetos)
    pintarTabla(detalleCotizacion)
  };

  function filaMuestraStock(e,tabla) {
    let filasTabla = document.querySelectorAll('.container tr');
    console.log('filasTabla:', filasTabla);
    let id_producto = e.target.getAttribute('data-id'); 
    console.log('e.target fila:', id_producto);                           //captura el ID producto de la fila
    console.log('detalleCotizacion:',detalleCotizacion);                           //captura el ID producto de la fila
    let ubicacion = detalleCotizacion.findIndex((elem) => { return elem.id == id_producto })    //captura el indice o poscion del objeto producto de la fila

    if (alternador) {//para expandir o contraer fila
      let producto_encontado = detalleCotizacion.find((elem) => { return elem.id == id_producto })  //encuentra el productos en el objeto con el ID anterior
      console.log('clik en (+), el costo es:', producto_encontado.costo)
      let fila = document.createElement('tr')
      let celda = document.createElement('td')
      celda.textContent = producto_encontado.costo
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
    const tabla = document.getElementById('container');
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

  };

  function sincronizarLocalStorage(detalleCotizacion) {
    localStorage.setItem('cotizacion', JSON.stringify(detalleCotizacion))
    detalleCotizacion = JSON.parse(localStorage.getItem('cotizacion'))
    console.log('guardado en LS')
  }

  async function ingresarProducto() {
    const btn_semaforo = document.querySelector('.semaforo')
    const inpCodigo = document.getElementById('codigo');
    //e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    //console.log('dentro de funcion ingresarproducto',e.target)
    let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:', id)
    if (id) {
      console.log('detalleCotizacion:', detalleCotizacion)
      if (detalleCotizacion == null) {
        detalleCotizacion = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
      }
      let duplicado = detalleCotizacion.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto
      console.log('duplicado:', duplicado);
      if (!duplicado) {
        inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
        btn_semaforo.classList.toggle('semaforo-verde')
        btn_semaforo.textContent = 'exito!';
        let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB

        let fila = traerDoc.data()                                  // aca debe eliminarse varios campos innecesarios.data() metodo para mostrar solo los datos del producto
        fila.id = traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
        fila.cantidad = 1                                             //por defecto cantidad igual a 1
        fila.importe = fila.precio * fila.cantidad                      //calculamos l importe

        detalleCotizacion.push(fila)                                          //metemos los datos de fila en detalleCotizacion                                             //limpir datos de la tabla
        pintarTabla(detalleCotizacion)
      } else {
        btn_semaforo.classList.toggle('semaforo-rojo');
        btn_semaforo.textContent = 'duplicado!!!';
      }

      console.log('contenido del objeto:', detalleCotizacion)

    } else {
      btn_semaforo.classList.toggle('semaforo-ambar');
      btn_semaforo.textContent = 'vacio';
    }
  }

  function activarEnter(e) {
    console.log('evento activar enter:',e.key);
    
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
      let saldo = Number(fila.saldo);
      console.log('presionaste enter...', razonSocial, saldo)
      inpCliente.value = razonSocial

      //let traerDoc2 = await traerUnNumeracion('Cotizacion')
      //let dato = traerDoc2.data()
      //numeroCotizacion.value = Number(dato.ultimoNumero) + 1;
    }
  }

};