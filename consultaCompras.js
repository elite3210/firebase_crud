import { db } from './firebase.js'
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { Datatable } from './dataTable.js'


const onGetCompras = (callback) => onSnapshot(collection(db, 'Compras'), callback)

//traer los socios comerciales clientes de firebase

const nombreMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
const registroCompras = onGetCompras((comprasSnapShot) => {
    let items = []
    let comprasTotal = 0
    console.log('comprasSnapShot:', comprasSnapShot);

    if (comprasSnapShot) {
        comprasSnapShot.forEach(doc => {
            let obj = {};
            obj.id = doc.id
            obj.values = doc.data()
            obj.values.mes = nombreMes[new Date(obj.values.tiempo).getMonth()];
            let date = new Date(obj.values.tiempo);
            obj.values.fechaRegistro = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            //console.log('obj.values:',obj.values);

            let detalle = JSON.parse(obj['values'].detalleCompra)
            let importeTotal = detalle.reduce((total, obj) => { return total + obj.importe }, 0)
            comprasTotal += importeTotal

            obj['values'].importe = Math.round(importeTotal)
            //obj['values'].id=obj.values.numero
            items.push(obj)
        })
    }

    console.log(' consulta venta :', items)

    items.sort((a, b) => b.values.nuevoNumero - a.values.nuevoNumero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b


    const titulo = { ' ': '', DOCUMENTO: 'nuevoNumero', PROVEEDOR: 'proveedor', RUC: 'ruc', FECHA: 'fecha', REGISTRO: 'fechaRegistro', FACTURA: 'documento', IMPORTE: 'importe' }

    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'editar', icon: 'contract',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    pintarDocumento(item);
                }
            },
            {
                id: 'btnEdit', text: 'editar', icon: 'edit',
                action: function () {
                    const elementos = dt.getSelected();
                    console.log('editar datos...', elementos);
                }
            },
            { id: 'btnDelete', text: 'eliminar', icon: 'delete', action: function () { const elemntos = dt.getSelected(); console.log('eliminar datos...', elemntos); } }
        ]
    );

    dt.setData(items, titulo);
    dt.makeTable();

});

async function pintarDocumento(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    console.log(' consulta venta arrayObjeto :', arrayObjeto)
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
  
  <form class="form" id="formulario">
  <div class="cajita1">
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
          <div class="extra">
            <label class="etiqueta" for="fechaEnvio">Fecha Envio:<h3 class="h6" type="date" id="fechaEnvio"></h3></label>
            <label class="etiqueta" for="empresaEnvio">Empresa Transporte:<h3 class="h6" type="text" id="empresaEnvio"></h3></label>
            <label class="etiqueta" for="addressTransportedBy">Telefono Transporte:<h3 class="h6" type="text" id="addressTransportedBy"></h3></label>
          </div>
         
          
        </div>
  
        
      <br>
      <br>
   
    </section>
  
  
  
    </div>
    <div class="modal-footer">
    
    <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
      <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
    </div>
  </div>
  </div>
  </div>
  `
    const btn_imprimir = document.getElementById('btn-imprimir')
    btn_imprimir.addEventListener('click', generaPDF)

    cotizacion.textContent = arrayObjeto['values'].nuevoNumero
    //vendedor.textContent = arrayObjeto['values'].vendedor
    ruc.textContent = arrayObjeto['values'].ruc
    cliente.textContent = arrayObjeto['values'].proveedor
    fecha.textContent = new Date(`${arrayObjeto['values'].fecha}T12:00:00Z`).toLocaleDateString()
    //tipoPago.value = arrayObjeto['values'].tipoPago
    //metodoCobro.value = arrayObjeto['values'].metodoCobro
    celdaSubTotal.textContent = arrayObjeto['values'].subTotal
    descuento.textContent = arrayObjeto['values'].descuento
    celda_total.textContent = arrayObjeto['values'].importeTotal
    //fechaEnvio.textContent = arrayObjeto['values'].fechaEnvio

    //let traerDoc = await traerUnSocio(arrayObjeto['values'].transportedBy);
    //let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
    //empresaEnvio.textContent = fila.razonSocial;
    //addressTransportedBy.textContent = fila.telefono;

    let objetos = JSON.parse(arrayObjeto['values'].detalleCompra)
    let contador = 1;
    objetos.forEach(producto => {
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
        const tabla = document.getElementById('table');
        tabla.appendChild(fila)
    });

};

async function generaPDF() {
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
    let id_cotizacion = document.getElementById('cotizacion').value
  
    await html2pdf()
      .set({
        margin: 5,
        filename: `PV${id_cotizacion}`,
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
  
  }

