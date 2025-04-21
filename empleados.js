import { Datatable } from "./dataTable.js";
import { cargarEmpleados, eliminarUsuario, crearEmpleado, actualizarUsuario, cargarEmpleado,getDepartaments } from "./heinzBase.js";
import { showMessage } from "./src/app/showMessage.js";

renderTableEmployeed()

async function renderTableEmployeed() {
    const datatableEspacio = document.querySelector('#dataTable')
    datatableEspacio.textContent = '';
    const respuestaEmpleados = await cargarEmpleados();
    const respuestaDepartamentos = await getDepartaments();
    console.log('respuestaDepartamentos:',respuestaDepartamentos);
    
    if (respuestaEmpleados.message) {
        showMessage(`${respuestaEmpleados.message}`, 'success');
    } else {
        showMessage(`${respuestaEmpleados.error}`, 'danger');
    };
    // Renderizar los datos en la tabla
    const items = [];
    //const tabla = document.getElementById('tabla');
    respuestaEmpleados.forEach(empleado => {
        const objeto = {};
        objeto['id'] = empleado.employee_id;
        objeto['values'] = empleado;
        //objeto['values'].position_id = respuestaDepartamentos.filter();
        delete empleado.employee_id
        items.push(objeto);
    });


    const titulo = { NOMBRE: 'first_name', DNI: 'identity_document', TELEFONO: 'phone_number', PUESTO: 'position_id' }
    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'read', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    renderEmployeed(item);
                }
            },
            {
                id: 'btnAdd', text: 'add', icon: 'add', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    fillEmployeeForm();
                }
            },
            {
                id: 'btnDelete', text: 'delete', icon: 'delete', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    deleteEmployeed(item);
                }
            },
            {
                id: 'btnUpdate', text: 'edit', icon: 'edit', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    updateEmployeed(item)
                }
            }

        ]);
    dt.setData(items, titulo)
    dt.makeTable2();
};

function renderFormEmpleado() {
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';
    const formHTML = `
        <form class="form" id="formEmpleado">
            <div class="input-group"> 
                <label for="name">Nombre</label>
                <input  class='form-control' type="text" id="nombre"></input>
            </div>
            <div class="input-group"> 
                <label for="edad">Edad</label>
                <input  class='form-control' type="text" id="edad"></input>
            </div>
            <div class="input-group"> 
                <label for="telefono">Telefono</label>
                <input  class='form-control' type="text" id="telefono"></input>
            </div>
            <div class="input-group"> 
                <label for="cargo">cargo</label>
                <input  class='form-control' type="text" id="cargo"></input>
            </div>
        </form>
    `;

    modalBody.innerHTML = formHTML;
    console.log('saliendo de renderFormEmpleado()');

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Guardar';
    modalFooter.appendChild(btnSaveDocument);
};

function fillEmployeeForm() {
    formEmpleado()
    const form = document.getElementById('formEmpleado');

    const btnGuardar = document.getElementById('btn-guardar')
    btnGuardar.textContent='Guardar'
    btnGuardar.addEventListener('click', async () => {
        const nuevoEmpleado = {};

        //nuevoEmpleado.employee_id = Number(form['employee_id'].value);
        nuevoEmpleado.identity_document = form['identity_document'].value;
        nuevoEmpleado.first_name = form['first_name'].value;
        nuevoEmpleado.last_name = form['last_name'].value;
        nuevoEmpleado.email = form['email'].value;
        nuevoEmpleado.phone_number = form['phone_number'].value;
        nuevoEmpleado.hire_date = form['hire_date'].value;
        nuevoEmpleado.position_id = Number(form['position_id'].value);
        nuevoEmpleado.department_id = Number(form['department_id'].value);
        nuevoEmpleado.manager_id = Number(form['manager_id'].value);
        nuevoEmpleado.hourly_rate = Number(form['hourly_rate'].value);
        nuevoEmpleado.status = form['status'].value;
        nuevoEmpleado.address = form['address'].value;
        nuevoEmpleado.city = form['city'].value;
        nuevoEmpleado.state = form['state'].value;
        nuevoEmpleado.zip_code = form['zip_code'].value;
        nuevoEmpleado.birth_date = form['birth_date'].value;
        nuevoEmpleado.gender = form['gender'].value;
        console.log('objeto {nuevoEmpleado}:',nuevoEmpleado);
        
        const respuesta = await crearEmpleado(nuevoEmpleado);
        if (respuesta.message) {
            showMessage(`${respuesta.message}`, 'success');
        } else {
            showMessage(`${respuesta.error}`, 'danger');
        };
        renderTableEmployeed();
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    })

};

function deleteEmployeed(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Elimar empleado</h4>';
    const id = item.id;
    renderFormEmpleado();
    const form = document.getElementById('formEmpleado');
    form['nombre'].value = item['values'].nombre;
    form['edad'].value = item['values'].edad;
    form['telefono'].value = item['values'].telefono;
    form['cargo'].value = item['values'].cargo;

    const btnGuardar = document.getElementById('btn-guardar')
    btnGuardar.textContent = 'Eliminar';
    btnGuardar.setAttribute('class', 'btn btn-danger');
    btnGuardar.addEventListener('click', async () => {
        const respuesta = await eliminarUsuario(id);
        showMessage(`${respuesta.message}`, 'success');
        renderTableEmployeed();
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    });
};

function updateEmployeed(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Actualizar empleado</h4>';
    const id = item.id;
    renderFormEmpleado();
    const form = document.getElementById('formEmpleado');
    form['nombre'].value = item['values'].nombre;
    form['edad'].value = item['values'].edad;
    form['telefono'].value = item['values'].telefono;
    form['cargo'].value = item['values'].cargo;

    const btnGuardar = document.getElementById('btn-guardar')
    btnGuardar.textContent = 'Actualizar';
    btnGuardar.setAttribute('class', 'btn btn-danger');
    btnGuardar.addEventListener('click', async () => {
        const empleadoActualizado = {};
        empleadoActualizado.id = item.id;
        empleadoActualizado.nombre = form['nombre'].value;
        empleadoActualizado.edad = form['edad'].value;
        empleadoActualizado.telefono = form['telefono'].value;
        empleadoActualizado.cargo = form['cargo'].value;
        const respuesta = await actualizarUsuario(empleadoActualizado);
        renderTableEmployeed();
        showMessage(`${respuesta.message}`, 'success');
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    });
};

async function renderEmployeed(item) {
    const id = item.id;
    const respuesta = await cargarEmpleado(id);
    //const modalHeader = document.querySelector('.modal-header');
    //modalHeader.innerHTML='<h4 class="modal-title">Detalles:</h4>';

    formEmpleado();
    const form = document.getElementById('formEmpleado');
    form['employee_id'].value = respuesta.employee_id;
    form['identity_document'].value = respuesta.identity_document;
    form['first_name'].value = respuesta.first_name;
    form['last_name'].value = respuesta.last_name;
    form['email'].value = respuesta.email;
    form['phone_number'].value = respuesta.phone_number;
    form['hire_date'].value = respuesta.hire_date;
    form['position_id'].value = respuesta.position_id;
    form['department_id'].value = respuesta.department_id;
    form['manager_id'].value = respuesta.manager_id;
    form['hourly_rate'].value = respuesta.hourly_rate;
    form['status'].value = respuesta.status;
    form['address'].value = respuesta.address;
    form['city'].value = respuesta.city;
    form['state'].value = respuesta.state;
    form['zip_code'].value = respuesta.zip_code;
    form['birth_date'].value = respuesta.birth_date;
    form['gender'].value = respuesta.gender;
    showMessage('se trajo los datos de un empleado con exito', 'success');
};

function formEmpleado() {
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';
    const formHTML = `
        <form class="form" id="formEmpleado">
            <div class="input-group"> 
                <label for="employee_id">employee_id</label>
                <input  class='form-control' type="text" id="employee_id"></input>
            </div>
            <div class="input-group"> 
                <label for="identity_document">identity_document</label>
                <input  class='form-control' type="text" id="identity_document"></input>
            </div>
            <div class="input-group"> 
                <label for="first_name">first_name</label>
                <input  class='form-control' type="text" id="first_name"></input>
            </div>
            <div class="input-group"> 
                <label for="last_name">last_name</label>
                <input  class='form-control' type="text" id="last_name"></input>
            </div>
            <div class="input-group"> 
                <label for="email">email</label>
                <input  class='form-control' type="text" id="email"></input>
            </div>
            <div class="input-group"> 
                <label for="phone_number">phone_number</label>
                <input  class='form-control' type="text" id="phone_number"></input>
            </div>
            <div class="input-group"> 
                <label for="hire_date">hire_date</label>
                <input  class='form-control' type="date" id="hire_date"></input>
            </div>
            <div class="input-group"> 
                <label for="position_id">position_id</label>
                <input  class='form-control' type="number" id="position_id"></input>
            </div>
            <div class="input-group"> 
                <label for="department_id">department_id</label>
                <input  class='form-control' type="number" id="department_id"></input>
            </div>
            <div class="input-group"> 
                <label for="manager_id">manager_id</label>
                <input  class='form-control' type="number" id="manager_id"></input>
            </div>
            <div class="input-group"> 
                <label for="hourly_rate">hourly_rate</label>
                <input  class='form-control' type="number" id="hourly_rate"></input>
            </div>
            <div class="input-group"> 
                <label for="status">status</label>
                <input  class='form-control' type="text" id="status"></input>
            </div>
            <div class="input-group"> 
                <label for="address">address</label>
                <input  class='form-control' type="text" id="address"></input>
            </div>
            <div class="input-group"> 
                <label for="city">city</label>
                <input  class='form-control' type="text" id="city"></input>
            </div>
            <div class="input-group"> 
                <label for="state">state</label>
                <input  class='form-control' type="text" id="state"></input>
            </div>
            <div class="input-group"> 
                <label for="zip_code">zip_code</label>
                <input  class='form-control' type="text" id="zip_code"></input>
            </div>
            <div class="input-group"> 
                <label for="birth_date">birth_date</label>
                <input  class='form-control' type="date" id="birth_date"></input>
            </div>
            <div class="input-group"> 
                <label for="gender">gender</label>
                <input  class='form-control' type="text" id="gender"></input>
            </div>
        </form>
    `;

    modalBody.innerHTML = formHTML;
    console.log('saliendo de renderFormEmpleado()');

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Cerrar';
    modalFooter.appendChild(btnSaveDocument);
};