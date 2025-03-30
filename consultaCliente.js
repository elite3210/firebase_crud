import { onGetSocios, onGetVentas, updateClientes, guardarSocios } from './firebase.js'
import { Datatable } from './dataTable.js'
import { deleteElementHTML } from './plugins/deleteElementHTML.js'
import { htmlToPDF } from './plugins/htmlToPDF.js'


//window.open("http://127.0.0.1:5500/consultaCliente.html");
console.log('inicio de la carga de pagina..');
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer');
const saldoTotal = document.getElementById('saldoTotal');

let numeroClientes = 0;
let saldoClientes = 0;
let alternadorVista = true;

const registroSocios = await onGetSocios((sociosSnapShot) => {
    numeroClientes = 0;
    saldoClientes = 0;
    let items = [];
    if (sociosSnapShot) {
        sociosSnapShot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj['values'] = doc.data();
            obj['values'].ruc = obj.id;
            if (obj['values'].clienteRank >= 1) {
                //console.log('saldo clientes:',saldoClientes);
                obj['values'].contador = numeroClientes + 1;
                saldoClientes += Number(obj['values'].saldo);
                items.push(obj);
                numeroClientes++;
            };
        });
    };
    sincronizarLocalStorage(items, 'Socios');
    renderTableContact(items);
});

saldoTotal.addEventListener('click', () => {
    if (!alternadorVista) {
        //deleteElementHTML('#sociosContainer')
        //renderTableContact(JSON.parse(localStorage.getItem('Socios')))
        saldoTotal.textContent = saldoClientes;
        alternadorVista = true
    } else {
        saldoTotal.textContent = saldoClientes;
        //deleteElementHTML('#sociosContainer')
        //renderCardsContact(JSON.parse(localStorage.getItem('Socios')))

        alternadorVista = false
    }
})


function getSalesTolS() {
    const registroVentas = onGetVentas((ventasSnapShot) => {
        let itemsVentas = [];
        if (ventasSnapShot) {
            ventasSnapShot.forEach(doc => {
                //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
                let date = new Date(Date.now())
                let obj = {};
                obj.id = doc.id
                obj.values = doc.data()
                obj.values.importeTotalVista = Intl.NumberFormat('es-419', { maximumSignificantDigits: 7 }).format(obj.values.importeTotal);
                obj.values.status = `<span class="${obj.values.estado}"></span>`;
                //console.log('obj.values:',obj.values)
                if (obj.values.estado == 'nuevo') {
                    obj.values.retrasoEnvio = Math.round((date.getTime() - new Date(`${obj.values.fecha}T12:00:00Z`).getTime()) / 86400000);
                    obj.values.retrasoPago = 0;
                } else if (obj.values.estado == 'cancelado') {
                    obj.values.retrasoEnvio = Math.round((new Date(`${obj.values.fechaEnvio}T12:00:00Z`) - new Date(`${obj.values.fecha}T12:00:00Z`).getTime()) / 86400000);
                    obj.values.retrasoPago = Math.round((new Date(`${obj.values.fechaPago}T12:00:00Z`).getTime() - new Date(`${obj.values.fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
                } else {
                    obj.values.retrasoEnvio = Math.round((new Date(`${obj.values.fechaEnvio}T12:00:00Z`) - new Date(`${obj.values.fecha}T12:00:00Z`).getTime()) / 86400000);
                    obj.values.retrasoPago = Math.round((date.getTime() - new Date(`${obj.values.fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
                }
                itemsVentas.push(obj)
            })
        }
        sincronizarLocalStorage(itemsVentas, 'Ventas');
    });
};

function renderTableContact(objContact) {
    console.log('entrando a render table clientes...')
    //clearHTML(sociosContainer);

    const titulo = { '#': 'contador', RANK: 'clienteRank', NOMBRE: 'razonSocial', RUC: 'ruc', TELEFONO: 'telefono', SALDO: 'saldo' }
    const dt = new Datatable('#sociosContainer',
        [
            {
                id: 'btnAdd', text: 'editar', icon: 'group_add', targetModal: '#myModal',
                action: function () {
                    newPartner();
                }
            },
            {
                id: 'btnEdit', text: 'editar', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const elementos = dt.getSelected();
                    console.log('mostrando documento formato PC...', elementos);
                    viewDocument(elementos);
                }
            },
            {
                id: 'btnDocument', text: 'doc', icon: 'document_scanner',
                action: function () {
                    const elementos = dt.getSelected();
                    redirigirDetalleContacto(elementos);
                    console.log('mostrando documento Formato Ticket...', elementos);
                }
            }
        ]
    );

    dt.setData(objContact, titulo);
    dt.makeTable2();
    console.log('saldoClientes:', saldoClientes);

    saldoTotal.textContent = saldoClientes;

};

function renderCardsContact(items) {
    console.log('entrando function renderCardsContact...', items);

    items.forEach((obj) => {
        let card = document.createElement('div')
        card.setAttribute('class', 'col');
        card.setAttribute('data-id', obj.id);

        card.innerHTML = `<div class="card">
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

        card.addEventListener('click', () => {
            let id = card.getAttribute('data-id');
            window.location = `./detalleContacto.html?id=${id}`;
        })

        sociosContainer.appendChild(card);
    });
    console.log('sociosContainer', sociosContainer);
    saldoTotal.textContent = saldoClientes;
};

function sincronizarLocalStorage(objInput, nameString) {
    console.log('sincronizando LS...')
    localStorage.removeItem(nameString);
    localStorage.setItem(nameString, JSON.stringify(objInput));
};

async function viewDocument(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    let id = arrayObjeto.id;
    console.log(' consulta venta arrayObjeto :', arrayObjeto)
    const flotante = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    deleteElementHTML('.modal-footer');

    flotante.innerHTML = `
    <section id="documentoPDF">
        <!--Tabs-->
        <div class=" container contenedorClientes">

    
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">General</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Contacto</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Direccion</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="ventas-tab" data-bs-toggle="tab" data-bs-target="#ventas-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Ventas</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="movimiento-tab" data-bs-toggle="tab" data-bs-target="#movimiento-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Movimiento</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane"
                    type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button>
                </li>
            </ul>

            <form class="form" id="formularioClientes">
            <div class="tab-content" id="myTabContent">
                
                    <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <br>
                        <div class="input-group">
                            <label class="input-group-text" for="razonSocial">Razon social:</label>
                            <input class='form-control celda empresa' type="text" id="razonSocial">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="ruc">RUC :</label>
                            <input class='form-control empresa' type="text" maxlength="11" minlength="8" id="ruc">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="inicioActividad">Inicio Actividad:</label>
                            <input class='form-control celda inicio' type="date" id="inicioActividad">
                        </div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="saldo">Saldo:</label>
                            <input class='form-control  telefono' type="number" id="saldo">
                        </div>
                    </div>

                    <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                        <br>
                        <div class="input-group">
                            <label class="input-group-text" for="nombresContacto">Nombres :</label>
                            <input class='form-control celda cliente' type="text" id="nombresContacto">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="apellidosContacto">Apellidos :</label>
                            <input class='form-control celda cliente' type="text" id="apellidosContacto">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="email">Correo:</label>
                            <input class='form-control celda correo' type="email" id="email">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="dni">DNI :</label>
                            <input class='form-control dni' type="number" id="dni">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" class='celda cargo' for="cargo">Cargo :</label>
                            <input class='form-control cargo' type="text" id="cargo">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" class='telefono' for="cargo">Telefono :</label>
                            <input class='form-control celda telefono' type="tel" id="telefono">
                        </div>
                    </div>

                    <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                        
                        <div class="input-group">
                            <label class='input-group-text' for="calle">Direccion :</label>
                            <input class='form-control celda cliente' type="text" id="direccion"></div>
                        <div class="input-group">
                            <label class='input-group-text' for="distrito">Distrito :</label>
                            <input class='form-control celda distrito' type="text" id="distrito"></div>
                        <div class="input-group">
                            <label class='input-group-text' for="provincia">Provincia:</label>
                            <input class='form-control cargo' type="text" id="provincia"></div>
                        <div class="input-group">
                            <label class='input-group-text celda telefono' for="departamento">Departamento:</label>
                            <input class='form-control  telefono' type="text" id="departamento"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="departamento">Ubicacion:</label>
                            <input class='form-control  telefono' type="text" id="ubicacion"></div>
                        
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="clienteRank">clienteRank:</label>
                            <input class='form-control  telefono' type="number" id="clienteRank"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="proveedorRank">proveedorRank:</label>
                            <input class='form-control  telefono' type="number" id="proveedorRank"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="vendidoPor">vendido Por:</label>
                            <input class='form-control  telefono' type="number" id="vendidoPor"></div>
                        <div class="input-group">
                            <label class='input-group-text nota' for="nota">Anotacion:</label>
                            <textarea class='form-control  nota' cols="30" type="text" id="nota"></textarea>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="ventas-tab-pane" role="tabpanel" aria-labelledby="ventas-tab" tabindex="0">
                        <div id="dataTable"></div>
                    </div>
                    <div class="tab-pane fade" id="movimiento-tab-pane" role="tabpanel" aria-labelledby="movimiento-tab" tabindex="0">
                        <div id="dataTable2">
                    </div>

                    <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
                    </div>
            </div>        
            </form>    
        </div>
    </section>
  `
    const form = document.getElementById('formularioClientes');
    //creando el boton para imprimir y añadiendo al modal footer
    const btnPrintDocument = document.createElement('button');
    btnPrintDocument.setAttribute('id', 'btn-imprimir');
    btnPrintDocument.setAttribute('class', 'btn btn-primary');
    btnPrintDocument.textContent = 'Print Document';
    btnPrintDocument.addEventListener('click', () => htmlToPDF('#documentoPDF'));
    modalFooter.appendChild(btnPrintDocument);

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btnEditar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Actualizar';
    btnSaveDocument.addEventListener('click', updateSocio);
    modalFooter.appendChild(btnSaveDocument);

    let contactosLS = JSON.parse(localStorage.getItem('Socios'))//PREVIAMENTE SE GURDO EN LS Y ACA LO RECUPERAMOS
    let obj = contactosLS.filter((fila) => { return fila.id == id })
    console.log('Cliente:', obj)

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

    function updateSocio(e) {
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
        let clienteRank = Number(form['clienteRank'].value);
        let proveedorRank = Number(form['proveedorRank'].value);
        let vendidoPor = form['vendidoPor'].value;
        let nota = form['nota'].value;
        console.log('telefono:', telefono);

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
        alert(`Socio editado:${id}`)
    }
};

async function newPartner() {//crea una ventana modal con los datos de la venta el detalle
    const flotante = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    deleteElementHTML('.modal-footer');

    flotante.innerHTML = `
    <section id="documentoPDF">
        <!--Tabs-->
        <div class=" container contenedorClientes">

    
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">General</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Contacto</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Direccion</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane"
                    type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button>
                </li>
            </ul>

            <form class="form" id="formularioClientes">
            <div class="tab-content" id="myTabContent">
                
                    <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <br>
                        <div class="input-group">
                            <label class="input-group-text" for="razonSocial">Razon social:</label>
                            <input class='form-control celda empresa' type="text" id="razonSocial">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="ruc">RUC :</label>
                            <input class='form-control empresa' type="text" maxlength="11" minlength="8" id="ruc">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="inicioActividad">Inicio Actividad:</label>
                            <input class='form-control celda inicio' type="date" id="inicioActividad">
                        </div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="saldo">Saldo:</label>
                            <input class='form-control  telefono' type="number" id="saldo">
                        </div>
                    </div>

                    <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                        <br>
                        <div class="input-group">
                            <label class="input-group-text" for="nombresContacto">Nombres :</label>
                            <input class='form-control celda cliente' type="text" id="nombresContacto">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="apellidosContacto">Apellidos :</label>
                            <input class='form-control celda cliente' type="text" id="apellidosContacto">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="email">Correo:</label>
                            <input class='form-control celda correo' type="email" id="email">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="dni">DNI :</label>
                            <input class='form-control dni' type="number" id="dni">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" class='celda cargo' for="cargo">Cargo :</label>
                            <input class='form-control cargo' type="text" id="cargo">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" class='telefono' for="cargo">Telefono :</label>
                            <input class='form-control celda telefono' type="tel" id="telefono">
                        </div>
                        <div class="input-group">
                            <label class="input-group-text" for="partnerCategory">partnerCategory :</label>
                            <input class='form-control dni' type="text" id="partnerCategory">
                        </div>
                    </div>

                    <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                        
                        <div class="input-group">
                            <label class='input-group-text' for="calle">Direccion :</label>
                            <input class='form-control celda cliente' type="text" id="direccion"></div>
                        <div class="input-group">
                            <label class='input-group-text' for="distrito">Distrito :</label>
                            <input class='form-control celda distrito' type="text" id="distrito"></div>
                        <div class="input-group">
                            <label class='input-group-text' for="provincia">Provincia:</label>
                            <input class='form-control cargo' type="text" id="provincia"></div>
                        <div class="input-group">
                            <label class='input-group-text celda telefono' for="departamento">Departamento:</label>
                            <input class='form-control  telefono' type="text" id="departamento"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="ubicacion">Ubicacion:</label>
                            <input class='form-control  telefono' type="text" id="ubicacion">
                        </div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="licenciaMTC">licenciaMTC:</label>
                            <input class='form-control  telefono' type="text" id="licenciaMTC">
                        </div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="clienteRank">clienteRank:</label>
                            <input class='form-control  telefono' type="number" id="clienteRank"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="proveedorRank">proveedorRank:</label>
                            <input class='form-control  telefono' type="number" id="proveedorRank"></div>
                        <div class="input-group">
                            <label class='input-group-text ubicacion' for="vendidoPor">vendido Por:</label>
                            <input class='form-control  telefono' type="number" id="vendidoPor"></div>
                        <div class="input-group">
                            <label class='input-group-text nota' for="nota">Anotacion:</label>
                            <textarea class='form-control  nota' cols="30" type="text" id="nota"></textarea>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
                    </div>
            </div>        
            </form>    
        </div>
    </section>
  `
    const form = document.getElementById('formularioClientes');
    //creando el boton para imprimir y añadiendo al modal footer
    const btnPrintDocument = document.createElement('button');
    btnPrintDocument.setAttribute('id', 'btn-imprimir');
    btnPrintDocument.setAttribute('class', 'btn btn-primary');
    btnPrintDocument.textContent = 'Print Document';
    btnPrintDocument.addEventListener('click', () => htmlToPDF('#documentoPDF'));
    modalFooter.appendChild(btnPrintDocument);

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btnEditar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Crear';
    btnSaveDocument.addEventListener('click', createPartner);
    modalFooter.appendChild(btnSaveDocument);


    function createPartner(e) {
        e.preventDefault();

        const razonSocial = form['razonSocial'].value;          //1
        const ruc = form['ruc'].value;                  //2
        const inicioActividad = form['inicioActividad'].value;      //3
        const nombresContacto = form['nombresContacto'].value;      //4
        const apellidosContacto = form['apellidosContacto'].value;    //5
        const email = form['email'].value;                //6
        const dni = form['dni'].value;                  //7
        const cargo = form['cargo'].value;                //8
        const telefono = form['telefono'].value;             //9
        const direccion = form['direccion'].value;                //10
        const distrito = form['distrito'].value;             //11
        const provincia = form['provincia'].value;            //12
        const departamento = form['departamento'].value;         //13
        const ubicacion = form['ubicacion'].value;            //14
        const nota = form['nota'].value;                 //15
        const idImpuesto = form['ruc'].value;                  //16
        const licenciaMTC = form['licenciaMTC'].value;                  //16
        const clienteRank = 1;                                          //17
        const proveedorRank = 0;                                          //18
        const saldoCliente = 0;
        const saldoProveedor = 0;                                         //19
        const partnerCategory = form['partnerCategory'].value;                                         //19

        //
        //razonSocial,inicioActividad,nombresContacto,apellidosContacto,email,dni,cargo,telefono,direccion,distrito,provincia,departamento,ubicacion,nota,idImpuesto,clienteRank,proveedorRank,saldoProveedor,saldoCliente,licenciaMTC,partnerCategory
        guardarSocios(
            ruc,
            razonSocial,
            inicioActividad,
            nombresContacto,
            apellidosContacto,
            email,
            dni,
            cargo,
            telefono,
            direccion,
            distrito,
            provincia,
            departamento,
            ubicacion,
            nota,
            idImpuesto,
            clienteRank,
            proveedorRank,
            saldoProveedor,
            saldoCliente,
            licenciaMTC,
            partnerCategory
        )

        alert('SOCIO guarado', razonSocial)

        function updatePartner() {
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
            let clienteRank = Number(form['clienteRank'].value);
            let proveedorRank = Number(form['proveedorRank'].value);
            let vendidoPor = form['vendidoPor'].value;
            let nota = form['nota'].value;
            console.log('telefono:', telefono);

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
            alert(`Socio editado:${id}`)
        }
    };
};

function redirigirDetalleContacto(elementos) {
    window.location = `./detalleContacto.html?id=${elementos.id}`;
};
