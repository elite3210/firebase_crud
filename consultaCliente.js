import { onGetSocios } from './firebase.js'
import { onGetVentas } from './firebase.js'
import { Datatable } from './dataTable.js'

//window.open("http://127.0.0.1:5500/consultaCliente.html");
console.log('inicio de la carga de pagina..')
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')
const btnTable = document.getElementById('btnTable');
let objContact = '';
let objVentas = '';

getContactTolS(objContact)
console.log('objContact', objContact)

//renderCardsContact(objContact, sociosContainer);



getSalesTolS(objVentas)

async function getContactTolS(objContact) {
    const registroSocios = await onGetSocios((sociosSnapShot) => {
        let items = [];

        if (sociosSnapShot) {
            sociosSnapShot.forEach(doc => {
                let obj = {};
                obj.id = doc.id;
                obj['values'] = doc.data();
                obj['values'].ruc = obj.id;
                items.push(obj);
            });
        }

        //console.log('clientes traidos de firebase convertido:', items)
        sincronizarLocalStorage(items, objContact, 'Contactos')

        renderCardsContact(items,sociosContainer);
    });
    

}

//let element='#sociosContainer'
function renderTableContact() {
    sociosContainer.innerHTML = '';
    if (btnTable.textContent == 'Cards') {
        renderCardsContact(items, sociosContainer);
    } else {
        let itemsCliente = items.filter((obj) => { return obj['values'].clienteRank > 0 })
        console.log('itemsClientes en tabla:', itemsCliente)

        const titulo = { ' ': '', NOMBRE: 'razonSocial', RANK: 'clienteRank', CONTACTO: 'nombresContacto', SALDO: 'saldo' }
        const dt = new Datatable('#sociosContainer',
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

        dt.setData(itemsCliente, titulo);
        dt.makeTable();
        btnTable.textContent = 'Cards';
    }


};

function getSalesTolS(objVentas) {
    const registroVentas = onGetVentas((ventasSnapShot) => {
        let itemsVentas = [];
        if (ventasSnapShot) {
            ventasSnapShot.forEach(doc => {
                //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
                let obj = {};
                obj.id = doc.id
                obj.values = doc.data()
                itemsVentas.push(obj)
            })
        }
        console.log('total de ventas traido :', itemsVentas)
        sincronizarLocalStorage(itemsVentas, objVentas, 'Ventas')
    });
}

function renderCardsContact(items, element) {
    sociosContainer.innerHTML = '';
    let itemsCliente = items.filter((obj) => { return obj['values'].clienteRank > 0 })
    console.log('itemsClientes en cards:', itemsCliente)
    itemsCliente.forEach((obj) => {

        let fila = document.createElement('div')
        fila.setAttribute('class', 'col')
        fila.setAttribute('id', obj.id)

        fila.innerHTML = `<div class="card">
                            <!--<img class="img-fluid" src="imagenes/contact.png" style="width:18rem;" alt="Card image cap">-->
                            <div class="card-body">
                                    
                                    <h1 class= "h4">${obj['values'].razonSocial}</h1>
                                    <h4 class="h6 rucTexto">${obj.id}</h4>
                                    <h4 class="h6 rucTexto">${obj['values'].telefono}</h4>
                                    <h3 class="h6" ></h3>
                                    
                                    <h3 class="h6"><span>S/</span>${obj['values'].saldo}</h3>
                                    <h3 class="h6">${obj['values'].departamento}</h3>
                                    
                            </div>
                            </div>
                                `
        sociosContainer.appendChild(fila);
    });


    console.log('itemsCliente.forEach:', element)
    console.log('despues de cards...:....')

    btnTable.addEventListener('click', renderTableContact)

let filas = document.querySelectorAll('.col');

filas.forEach((fila) => {
    fila.addEventListener('click', () => {
        console.log('seras redirigido....')
        let id = fila.getAttribute('id');
        window.location = `./detalleContacto.html?id=${id}`;
    })
})
};

function pintarDocumento(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle

    const flotante = document.getElementById('flotante');
    flotante.innerHTML = `
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
        <thead class="tituloTabla">
            <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
        </thead>

        <tbody id="container"></tbody>
        
        <tfoot class="button-content">
        <tr><th>Sub_Total (S/)</th></th><th><h1 id="celdaSubTotal"  class="total"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="total"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="total"></h1></th></tr>
        </tfoot>
    </table>
    <br>
    <br>
</section>`

    cotizacion.textContent = arrayObjeto[0]['values'].numero
    vendedor.textContent = arrayObjeto[0]['values'].vendedor
    ruc.textContent = arrayObjeto[0]['values'].ruc
    cliente.textContent = arrayObjeto[0]['values'].cliente
    fecha.textContent = new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.value = arrayObjeto[0]['values'].tipoPago
    metodoCobro.value = arrayObjeto[0]['values'].metodoCobro
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


    let cerrar = document.getElementById('cerrar')
    cerrar.addEventListener('click', () => {

        while (flotante.firstChild) {
            flotante.removeChild(flotante.firstChild)
        }
    })

};

function sincronizarLocalStorage(objInput, objOutput, nameString) {
    localStorage.setItem(nameString, JSON.stringify(objInput));
    objOutput = JSON.parse(localStorage.getItem(nameString));
}
