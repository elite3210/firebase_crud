import { Datatable } from "./dataTable.js";
import { getDepartaments,getDepartament,createDepartament } from "./heinzBase.js";
import { showMessage } from "./src/app/showMessage.js";

renderTable()

async function renderTable() {
    const datatableEspacio = document.querySelector('#dataTable')
    datatableEspacio.textContent = '';
    const respuestaDepartamentos = await getDepartaments();
    if (respuestaDepartamentos.message) {
        showMessage(`${respuestaDepartamentos.message}`, 'success');
    } else {
        showMessage(`${respuestaDepartamentos.error}`, 'danger');
    };
    // Renderizar los datos en la tabla
    const items = [];
    //const tabla = document.getElementById('tabla');
    respuestaDepartamentos.forEach(departamento => {
        const objeto = {};
        objeto['id'] = departamento.department_id;
        delete departamento.department_id
        objeto['values'] = departamento;
        items.push(objeto);
    });


    const titulo = { NOMBRE: 'department_name', UBICAION: 'location', MANAGER: 'manager_id'}
    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'read', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    leerDepartamento(item);
                }
            },
            {
                id: 'btnAdd', text: 'add', icon: 'add', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    crearDepartamento();
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


function crearDepartamento() {
    formDepartamento()
    const form = document.getElementById('formEmpleado');

    const btnGuardar = document.getElementById('btn-guardar')
    btnGuardar.textContent='Guardar'
    btnGuardar.addEventListener('click', async () => {
        const nuevoDepartamento = {};

        //nuevoDepartamento.department_id = null;
        nuevoDepartamento.department_name = form['department_name'].value;
        nuevoDepartamento.location = form['location'].value;
        //nuevoDepartamento.manager_id = Number(form['manager_id'].value);
        nuevoDepartamento.manager_id = null;
        
        console.log('objeto {nuevoDepartamento}:',nuevoDepartamento);
        
        const respuesta = await createDepartament(nuevoDepartamento);
        if (respuesta.message) {
            showMessage(`${respuesta.message}`, 'success');
        } else {
            showMessage(`${respuesta.error}`, 'danger');
        };
        renderTable();
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    })

};

function deleteEmployeed(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Elimar empleado</h4>';
    const id = item.id;
    formDepartamento();
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
        renderTable();
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    });
};

function updateEmployeed(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Actualizar empleado</h4>';
    const id = item.id;
    renderFormDepartamento();
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
        renderTable();
        showMessage(`${respuesta.message}`, 'success');
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    });
};

async function leerDepartamento(item) {
    const id = item.id;
    const respuesta = await getDepartament(id);
    //const modalHeader = document.querySelector('.modal-header');
    //modalHeader.innerHTML='<h4 class="modal-title">Detalles:</h4>';

    formDepartamento();
    const form = document.getElementById('formEmpleado');
    form['department_id'].value = respuesta.department_id;
    form['department_name'].value = respuesta.department_name;
    form['location'].value = respuesta.location;
    form['manager_id'].value = respuesta.manager_id;
    
    showMessage('se trajo los datos de un empleado con exito', 'success');
};

function formDepartamento() {
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';

    const formHTML = `
        <form class="form" id="formEmpleado">
            
            <div class="input-group"> 
                <label for="department_id">department_id</label>
                <input  class='form-control' type="number" id="department_id"></input>
            </div>
            <div class="input-group"> 
                <label for="department_name">department_name</label>
                <input  class='form-control' type="text" id="department_name"></input>
            </div>
            <div class="input-group"> 
                <label for="location">location</label>
                <input  class='form-control' type="text" id="location"></input>
            </div>
            <div class="input-group"> 
                <label for="manager_id">manager_id</label>
                <input  class='form-control' type="number" id="manager_id"></input>
            </div>
            
        </form>
    `;

    modalBody.innerHTML = formHTML;
    console.log('saliendo de formDepartamento()');

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Cerrar';
    modalFooter.appendChild(btnSaveDocument);
};