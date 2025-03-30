import { onGetSocios, updateClientes, guardarSocios } from './firebase.js'
import { Datatable } from './dataTable.js'

//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')


const registroSocios = await onGetSocios((sociosSnapShot) => {
  let items = [];
  let numeroSocio = 0;
  if (sociosSnapShot) {
    sociosSnapShot.forEach(doc => {
      let obj = {};
      obj.id = doc.id;
      obj['values'] = doc.data();
      obj['values'].ruc = obj.id;
      if (obj['values'].proveedorRank >= 1) {
        obj['values'].contador = numeroSocio + 1;
        items.push(obj);
        numeroSocio++;
      };
    });
  };
  sincronizarLocalStorage(items,'Socios');
  renderTableSocios(items);
});


function sincronizarLocalStorage(objInput, nameString) {
  console.log('sincronizando LS...')
  localStorage.setItem(nameString, JSON.stringify(objInput));
};

function renderTableSocios(items) {
  console.log('entrando a render table SOCIOS...')
  clearHTML(sociosContainer);

  const titulo = { '#': 'contador', RANK: 'proveedorRank', RUC: 'ruc', NOMBRE: 'razonSocial', TELEFONO: 'telefono', CONTACTO: 'nombresContacto', SALDO: 'saldo' }
  const dt = new Datatable('#sociosContainer',
    [
      {
        id: 'btnEdit', text: 'editar', icon: 'note_add', targetModal: '#myModal',
        action: function () {
          //const elementos = dt.getSelected();
          //console.log('mostrando documento formato PC...', elementos);
          createPartner();
        }
      },
      {
        id: 'btnDocument', text: 'doc', icon: 'document_scanner', targetModal: '#myModal',
        action: function () {
          const elementos = dt.getSelected();
          viewDocument(elementos);
          console.log('mostrando documento Formato Ticket...', elementos);
        }
      }
    ]
  );
  dt.setData(items, titulo);
  dt.makeTable2();
};

async function viewDocument(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
  let id = arrayObjeto.id;
  console.log(' consulta venta arrayObjeto :', arrayObjeto)
  const flotante = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  clearHTML(modalFooter);

  flotante.innerHTML = `
  <section id="documentoPDF">
        <!--Tabs-->
<div class=" container contenedor-socios">

  <form class="form" id="formulario-socios">
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

    
      <div class="tab-content" id="myTabContent">

        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
          tabindex="0">
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
            <label class='input-group-text ubicacion' for="saldo">Saldo S/:</label>
            <input class='form-control' type="number" id="saldo">
          </div>
          <div class="input-group">
            <label class='input-group-text ubicacion' for="partnerCategory">Categoria:</label>
            <input class='form-control  telefono' type="text" id="partnerCategory">
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
            <label class="input-group-text" class='celda cargo' for="licenciaMTC">licenciaMTC :</label>
            <input class='form-control cargo' type="text" id="licenciaMTC">
          </div>
          <div class="input-group">
            <label class="input-group-text" class='telefono' for="cargo">Telefono :</label>
            <input class='form-control celda telefono' type="tel" id="telefono">
          </div>
        </div>

        <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
          
          <div class="input-group"><label class='input-group-text' for="calle">Direccion :</label><input
              class='form-control celda cliente' type="text" id="direccion"></div>
          <div class="input-group"><label class='input-group-text' for="distrito">Distrito :</label><input
              class='form-control celda distrito' type="text" id="distrito"></div>
          <div class="input-group"><label class='input-group-text' for="provincia">Provincia:</label><input
              class='form-control cargo' type="text" id="provincia"></div>
          <div class="input-group"><label class='input-group-text celda telefono' for="departamento">Departamento
              :</label><input class='form-control  telefono' type="text" id="departamento"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="departamento">Ubicacion
              :</label><input class='form-control  telefono' type="text" id="ubicacion"></div>
          
          <div class="input-group"><label class='input-group-text ubicacion' for="clienteRank">clienteRank
              :</label><input class='form-control  telefono' type="number" id="clienteRank"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="proveedorRank">proveedorRank
              :</label><input class='form-control  telefono' type="number" id="proveedorRank"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="vendidoPor">vendido Por
              :</label><input class='form-control  telefono' type="number" id="vendidoPor"></div>
          <div class="input-group"><label class='input-group-text nota' for="nota">Anotacion :</label><textarea
              class='form-control  nota' cols="30" type="text" id="nota"></textarea> </div>
          </div>
        </div>

      <div class="tab-pane fade" id="ventas-tab-pane" role="tabpanel" aria-labelledby="ventas-tab" tabindex="0">
        <div id="dataTable"></div>
      </div>
      <div class="tab-pane fade" id="movimiento-tab-pane" role="tabpanel" aria-labelledby="movimiento-tab" tabindex="0">
        <div id="dataTable2"></div>
      </div>

      <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
        
      </div>

  </form>

</div>
  </section>
`
  const formPartner = document.getElementById('formulario-socios');
  //creando el boton para imprimir y añadiendo al modal footer
  const btnPrintDocument = document.createElement('button');
  btnPrintDocument.setAttribute('id', 'btn-imprimir');
  btnPrintDocument.setAttribute('class', 'btn btn-primary');
  btnPrintDocument.textContent = 'Print Document';
  btnPrintDocument.addEventListener('click', generaPDF);
  modalFooter.appendChild(btnPrintDocument);

  const btnSaveDocument = document.createElement('button');
  btnSaveDocument.setAttribute('id', 'btnEditar');
  btnSaveDocument.setAttribute('class', 'btn btn-primary');
  btnSaveDocument.textContent = 'Actualizar';
  btnSaveDocument.addEventListener('click', updateSocio);
  modalFooter.appendChild(btnSaveDocument);

  let contactosLS = JSON.parse(localStorage.getItem('Socios'))//PREVIAMENTE SE GURDO EN LS Y ACA LO RECUPERAMOS
  let obj = contactosLS.filter((fila) => { return fila.id == id })[0];
  console.log('Cliente:', obj)

  formPartner['razonSocial'].value = obj['values'].razonSocial;
  formPartner['ruc'].value = obj['values'].ruc;
  formPartner['inicioActividad'].value = obj['values'].inicioActividad;
  formPartner['nombresContacto'].value = obj['values'].nombresContacto;
  formPartner['apellidosContacto'].value = obj['values'].apellidosContacto;
  formPartner['email'].value = obj['values'].email;
  formPartner['dni'].value = obj['values'].dni;
  formPartner['cargo'].value = obj['values'].cargo;
  formPartner['telefono'].value = obj['values'].telefono;
  formPartner['direccion'].value = obj['values'].direccion;
  formPartner['distrito'].value = obj['values'].distrito;
  formPartner['provincia'].value = obj['values'].provincia;
  formPartner['departamento'].value = obj['values'].departamento;
  formPartner['ubicacion'].value = obj['values'].ubicacion;
  formPartner['saldo'].value = obj['values'].saldoProveedor;
  formPartner['clienteRank'].value = obj['values'].clienteRank;
  formPartner['proveedorRank'].value = obj['values'].proveedorRank;
  formPartner['partnerCategory'].value = obj['values'].partnerCategory[0]["Socios"];
  formPartner['nota'].value = obj['values'].nota;

  function updateSocio(e) {
    e.preventDefault()
    console.log('el id del contacto es:', id);
    let razonSocial = formPartner['razonSocial'].value;
    let ruc = formPartner['ruc'].value;
    let inicioActividad = formPartner['inicioActividad'].value;
    let nombresContacto = formPartner['nombresContacto'].value;
    let apellidosContacto = formPartner['apellidosContacto'].value;
    let email = formPartner['email'].value;
    let dni = formPartner['dni'].value;
    let cargo = formPartner['cargo'].value;
    let telefono = formPartner['telefono'].value;
    let direccion = formPartner['direccion'].value;
    let distrito = formPartner['distrito'].value;
    let provincia = formPartner['provincia'].value;
    let departamento = formPartner['departamento'].value;
    let ubicacion = formPartner['ubicacion'].value;
    let saldo = formPartner['saldo'].value;
    let clienteRank = formPartner['clienteRank'].value;
    let proveedorRank = formPartner['proveedorRank'].value;
    let partnerCategory = formPartner['vendidoPor'].value;
    let nota = formPartner['nota'].value;

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
      partnerCategory: partnerCategory,
      nota: nota
    })
    alert(`Socio editado:${id}`)
  }
};

async function createPartner() {//crea una ventana modal con los datos de la venta el detalle
  //let id=arrayObjeto.id;
  //console.log(' consulta venta arrayObjeto :', arrayObjeto)
  const flotante = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  clearHTML(modalFooter);

  flotante.innerHTML = `
  <section id="documentoPDF">
        <!--Tabs-->
<div class=" container contenedor-socios">

  <form class="form" id="formulario-socios">
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

    
      <div class="tab-content" id="myTabContent">

        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
          tabindex="0">
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
            <label class='input-group-text ubicacion' for="partnerCategory">Categoria:</label>
            <input class='form-control  telefono' type="number" id="partnerCategory">
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
            <label class="input-group-text" class='celda cargo' for="licenciaMTC">licenciaMTC :</label>
            <input class='form-control cargo' type="text" id="licenciaMTC">
          </div>
          <div class="input-group">
            <label class="input-group-text" class='telefono' for="cargo">Telefono :</label>
            <input class='form-control celda telefono' type="tel" id="telefono">
          </div>
        </div>

        <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
          
          <div class="input-group"><label class='input-group-text' for="calle">Direccion :</label><input
              class='form-control celda cliente' type="text" id="direccion"></div>
          <div class="input-group"><label class='input-group-text' for="distrito">Distrito :</label><input
              class='form-control celda distrito' type="text" id="distrito"></div>
          <div class="input-group"><label class='input-group-text' for="provincia">Provincia:</label><input
              class='form-control cargo' type="text" id="provincia"></div>
          <div class="input-group"><label class='input-group-text celda telefono' for="departamento">Departamento
              :</label><input class='form-control  telefono' type="text" id="departamento"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="departamento">Ubicacion
              :</label><input class='form-control  telefono' type="text" id="ubicacion"></div>
          
          <div class="input-group"><label class='input-group-text ubicacion' for="clienteRank">clienteRank
              :</label><input class='form-control  telefono' type="number" id="clienteRank"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="proveedorRank">proveedorRank
              :</label><input class='form-control  telefono' type="number" id="proveedorRank"></div>
          <div class="input-group"><label class='input-group-text ubicacion' for="vendidoPor">vendido Por
              :</label><input class='form-control  telefono' type="number" id="vendidoPor"></div>
          <div class="input-group"><label class='input-group-text nota' for="nota">Anotacion :</label><textarea
              class='form-control  nota' cols="30" type="text" id="nota"></textarea> </div>
          </div>
        </div>

      <div class="tab-pane fade" id="ventas-tab-pane" role="tabpanel" aria-labelledby="ventas-tab" tabindex="0">
        <div id="dataTable"></div>
      </div>
      <div class="tab-pane fade" id="movimiento-tab-pane" role="tabpanel" aria-labelledby="movimiento-tab" tabindex="0">
        <div id="dataTable2"></div>
      </div>

      <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
        
      </div>

  </form>

</div>
  </section>
`
  const formPartner = document.getElementById('formulario-socios');
  formPartner.reset();

  const btnSaveDocument = document.createElement('button');
  btnSaveDocument.setAttribute('id', 'btnEditar');
  btnSaveDocument.setAttribute('class', 'btn btn-primary');
  btnSaveDocument.textContent = 'Guardar';
  btnSaveDocument.addEventListener('click', savePartner);
  modalFooter.appendChild(btnSaveDocument);

  //let contactosLS = JSON.parse(localStorage.getItem('Socios'))
  //PREVIAMENTE SE GUARDO EN LS Y ACA LO RECUPERAMOS
  //let obj = contactosLS.filter((fila) => { return fila.id == id })
  //console.log('Cliente:', obj)
  /*
    formPartner['razonSocial'].value = obj['values'].razonSocial;
    formPartner['ruc'].value = obj['values'].ruc;
    formPartner['inicioActividad'].value = obj['values'].inicioActividad;
    formPartner['nombresContacto'].value = obj['values'].nombresContacto;
    formPartner['apellidosContacto'].value = obj['values'].apellidosContacto;
    formPartner['email'].value = obj['values'].email;
    formPartner['dni'].value = obj['values'].dni;
    formPartner['cargo'].value = obj['values'].cargo;
    formPartner['telefono'].value = obj['values'].telefono;
    formPartner['direccion'].value = obj['values'].direccion;
    formPartner['distrito'].value = obj['values'].distrito;
    formPartner['provincia'].value = obj['values'].provincia;
    formPartner['departamento'].value = obj['values'].departamento;
    formPartner['ubicacion'].value = obj['values'].ubicacion;
    formPartner['saldo'].value = obj['values'].saldo;
    formPartner['clienteRank'].value = obj['values'].clienteRank;
    formPartner['proveedorRank'].value = obj['values'].proveedorRank;
    formPartner['vendidoPor'].value = obj['values'].vendidoPor;
    formPartner['nota'].value = obj['values'].nota;
  */
  function savePartner(e) {
    e.preventDefault()
    
    let razonSocial = formPartner['razonSocial'].value;
    let ruc = formPartner['ruc'].value;
    let idImpuesto = formPartner['ruc'].value;
    let inicioActividad = formPartner['inicioActividad'].value;
    let nombresContacto = formPartner['nombresContacto'].value;
    let apellidosContacto = formPartner['apellidosContacto'].value;
    let email = formPartner['email'].value;
    let dni = formPartner['dni'].value;
    let cargo = formPartner['cargo'].value;
    let telefono = formPartner['telefono'].value;
    let licenciaMTC = formPartner['licenciaMTC'].value;
    let direccion = formPartner['direccion'].value;
    let distrito = formPartner['distrito'].value;
    let provincia = formPartner['provincia'].value;
    let departamento = formPartner['departamento'].value;
    let ubicacion = formPartner['ubicacion'].value;
    let saldoProveedor = 0;
    let saldoCliente = 0;
    let clienteRank = 0;
    let proveedorRank = 1;
    let partnerCategory = [{"Socios":"Mayorista"},{"Productos":"Sorbetes"},{"Cuentas":"Ingresos"}];//formPartner['partnerCategory'].value;
    let nota = formPartner['nota'].value;
    //console.log('dentro de la funcion savePartner...',ruc,razonSocial,inicioActividad,telefono);
    guardarSocios(ruc,
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

      alert(`Socio Guardado:${ruc}`)
  }
};

function clearHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild)
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


