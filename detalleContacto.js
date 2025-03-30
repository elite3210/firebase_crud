import { Datatable } from './dataTable.js'
import { updateClientes } from './firebase.js';
import { viewDocument } from "./ventas/viewDocument.js";

//const url = window.location.href;
const url = new URL(window.location.href); //captura la URL y se crea el objeto URL, el cual almacena toda la URL
const params = url.searchParams; //seleciona los parámetros y almacenan todos  en una variable
const id = params.get("id"); // se utiliza el método GET para captar el valor del parámetro nombre despues de el signo "?"
//const edad = params.get("edad"); // se utiliza el método GET para captar el valor del parámetro edad
console.log('el id del contacto es:', id); // se muestra en consola el valor "Juan"
//console.log(edad); // se muestra en consola el valor "25"
console.log('url:', url)

const form = document.getElementById('formularioClientes')
const btnEditar = document.getElementById('btnEditar')
const linkVentas = document.getElementById('ventas')

linkVentas.addEventListener('click', () => {
    window.location = `./ventas.html?id=${id}`
})

btnEditar.addEventListener('click', editarCliente)

let contactosLS = JSON.parse(localStorage.getItem('Socios'))//PREVIAMENTE SE GURDO EN LS Y ACA LO RECUPERAMOS
let obj = contactosLS.filter((fila) => { return fila.id == id })
console.log('Cliente:', obj)

let ventasLS = JSON.parse(localStorage.getItem('todasLasVentas'))//PREVIAMENTE SE GURDO EN LS Y ACA LO RECUPERAMOS
let objVentas = ventasLS.filter((fila) => { return fila['values'].ruc == id })
console.log('objVentas:', objVentas)

form['razonSocial'].value = obj[0]['values'].razonSocial;
form['ruc'].value = obj[0]['values'].ruc;
form['inicioActividad'].value = obj[0]['values'].inicioActividad;
form['nombresContacto'].value = obj[0]['values'].nombresContacto;
form['apellidosContacto'].value = obj[0]['values'].apellidosContacto;
form['email'].value = obj[0]['values'].email;
form['dni'].value = obj[0]['values'].dni;
form['cargo'].value = obj[0]['values'].cargo;
form['telefono'].value = obj[0]['values'].telefono;
form['direccion'].value = obj[0]['values'].direccion;
form['distrito'].value = obj[0]['values'].distrito;
form['provincia'].value = obj[0]['values'].provincia;
form['departamento'].value = obj[0]['values'].departamento;
form['ubicacion'].value = obj[0]['values'].ubicacion;
form['saldo'].value = obj[0]['values'].saldo;
form['clienteRank'].value = obj[0]['values'].clienteRank;
form['proveedorRank'].value = obj[0]['values'].proveedorRank;
form['vendidoPor'].value = obj[0]['values'].vendidoPor;
form['nota'].value = obj[0]['values'].nota;


let itemsIndividual = [];
let importeDebeTotal = 0;
let importeHaberTotal = 0;


objVentas.forEach((pedido, i) => {
    if (pedido['values'].estado != 'nuevo') {
        let obj = {};
        obj.id = pedido.id;
        obj.values = {};
        obj['values'].fecha = pedido['values'].fecha;
        obj['values'].glosa = `Venta segun Pedido N°${pedido['values'].numero}`;
        obj['values'].importeDebe = pedido['values'].importeTotal;
        importeDebeTotal += Number(pedido['values'].importeTotal)
        obj['values'].importeHaber = '';
        itemsIndividual.push(obj);

        if (pedido['values'].pagosPedido) {
            let pagosParciales = JSON.parse(pedido['values'].pagosPedido)
            pagosParciales.forEach((parcial) => {
                let obj = {};
                obj.id = pedido.id;
                obj.values = {};
                obj['values'].fecha = parcial.fechaPago;
                obj['values'].glosa = `_Pago de Pedido N°${pedido['values'].numero} ${parcial.metodoPago}`;
                obj['values'].importeDebe = '';
                obj['values'].importeHaber = parcial.importePago;
                importeHaberTotal += Number(parcial.importePago);
                itemsIndividual.push(obj);
            })
        }
    }


    //console.log('itemsIndividual:', itemsIndividual)
})
let saldoCliente = importeDebeTotal - importeHaberTotal


const titulo = { ' ': '', DOC: 'numero', FECHA: 'fecha', IMPORTE: 'importeTotal', RE: 'retrasoEnvio', RP: 'retrasoPago', ST: 'status' }
const dt = new Datatable('#dataTable',
    [
        {
            id: 'btnEdit', text: 'editar', icon: 'contract',
            action: function () {
                const elementos = dt.getSelected();
                console.log('mostrando documento formato PC...', elementos);
                viewDocument(elementos)
            }
        },
        {
            id: 'btnDocument', text: 'doc', icon: 'document_scanner',
            action: function () {
                const elementos = dt.getSelected();
                viewDocument(elementos);
                console.log('mostrando documento Formato Ticket...', elementos);
            }
        }
    ]
);

dt.setData(objVentas, titulo);
dt.makeTable();


const titulo2 = { FECHA: 'fecha', DESCRIPCION: 'glosa', CARGO: 'importeDebe', ABONO: 'importeHaber' }
const titulo2Foot = { '': '', DEBE: '', HABER: 'SALDO', SALDO: saldoCliente }
const dt2 = new Datatable('#dataTable2',
    [
        {
            id: 'btnEdit', text: 'editar', icon: 'contract',
            action: function () {
                const elementos = dt.getSelected();
                console.log('mostrando documento formato PC...', elementos);
                pintarDocumento(elementos)
            }
        },
        {
            id: 'btnDocument', text: 'doc', icon: 'document_scanner',
            action: function () {
                const elementos = dt.getSelected();
                pintarDocumento(elementos);
                console.log('mostrando documento Formato Ticket...', elementos);
            }
        }
    ]
);

dt2.setDatos(itemsIndividual, titulo2, titulo2Foot);
dt2.renderTable();


function pintarDocumento(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    console.log('DENTRO DE PINTAR DCUMENTO MODAL')
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
                        <tr><th>Sub_Total (S/)</th><th></th><th><h1 id="celdaSubTotal"  class="total"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="total"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="total"></h1></th></tr>
                        </tfoot>
                    </table>
                    <br>
                    <br>
                    </section>



                    </div>
                    <div class="modal-footer">
                      <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>

                `

    cotizacion.textContent = arrayObjeto[0]['values'].numero
    vendedor.textContent = arrayObjeto[0]['values'].vendedor
    ruc.textContent = arrayObjeto[0]['values'].ruc
    cliente.textContent = arrayObjeto[0]['values'].cliente
    fecha.textContent = new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.textContent = arrayObjeto[0]['values'].tipoPago
    metodoCobro.textContent = arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.textContent = arrayObjeto[0]['values'].subTotal
    descuento.textContent = arrayObjeto[0]['values'].descuento
    celda_total.textContent = arrayObjeto[0]['values'].importeTotal

    let objetos = JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
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
}

function editarCliente(e) {
    e.preventDefault()
    console.log('el id del contacto es:', id);
    let razonSocial = form['razonSocial'].value;
    let ruc = form['ruc'].value;
    let inicioActividad = form['inicioActividad'].value;
    let nombresContacto = form['nombresContacto'].value;
    let apellidosContacto = form['apellidosContacto'].value;
    let email = form['email'].value;
    let dni = form['dni'].value;
    let cargo = form['cargo'].value;
    let telefono = form['telefono'].value;
    let direccion = form['direccion'].value;
    let distrito = form['distrito'].value;
    let provincia = form['provincia'].value;
    let departamento = form['departamento'].value;
    let ubicacion = form['ubicacion'].value;
    let saldo = form['saldo'].value;
    let clienteRank = form['clienteRank'].value;
    let proveedorRank = form['proveedorRank'].value;
    let vendidoPor = form['vendidoPor'].value;
    let nota = form['nota'].value;

    updateClientes(id, {
        razonSocial: razonSocial,
        ruc: ruc,
        inicioActividad: inicioActividad,
        nombresContacto: nombresContacto,
        apellidosContacto: apellidosContacto,
        email: email,
        dni: dni,
        cargo: cargo,
        telefono: telefono,
        direccion: direccion,
        distrito: distrito,
        provincia: provincia,
        departamento: departamento,
        ubicacion: ubicacion,
        saldo: saldo,
        clienteRank: clienteRank,
        proveedorRank: proveedorRank,
        vendidoPor: vendidoPor,
        nota: nota
    })
    alert(`cliente editado:${id}`)
}