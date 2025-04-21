import { Datatable } from "./dataTable.js";
import { getJobPositions,getJobPosition,createJobPositions } from "./heinzBase.js";
import { showMessage } from "./src/app/showMessage.js";

renderTable()

async function renderTable() {
    const datatableEspacio = document.querySelector('#dataTable')
    datatableEspacio.textContent = '';
    const respuesta = await getJobPositions();
    if (respuesta.message) {
        showMessage(`${respuesta.message}`, 'success');
    } else {
        showMessage(`${respuesta.error}`, 'danger');
    };
    // Renderizar los datos en la tabla
    const items = [];
    //const tabla = document.getElementById('tabla');
    respuesta.forEach(res => {
        const objeto = {};
        objeto['id'] = res.position_id;
        delete res.position_id
        objeto['values'] = res;
        items.push(objeto);
    });


    const titulo = { TITULO: 'position_title', DEPARTAMENTO: 'department_id', SUELDO: 'min_salary'}
    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'read', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    leerPuesto(item);
                }
            },
            {
                id: 'btnAdd', text: 'add', icon: 'add', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    crearPuesto();
                }
            },
            {
                id: 'btnDelete', text: 'delete', icon: 'delete', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    eliminarPuesto(item);
                }
            },
            {
                id: 'btnUpdate', text: 'edit', icon: 'edit', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    actualizarPuesto(item)
                }
            }

        ]);
    dt.setData(items, titulo)
    dt.makeTable2();
};


function crearPuesto() {
    formPuesto()
    const form = document.getElementById('formEmpleado');

    const btnGuardar = document.getElementById('btn-guardar')
    btnGuardar.textContent='Guardar'
    btnGuardar.addEventListener('click', async () => {
        const nuevoPuesto = {};

        //nuevoPuesto.department_id = null;
        nuevoPuesto.position_title = form['position_title'].value;
        nuevoPuesto.min_salary = form['min_salary'].value;
        nuevoPuesto.max_salary = Number(form['max_salary'].value);
        nuevoPuesto.department_id = null;
        
        console.log('objeto {nuevoPuesto}:',nuevoPuesto);
        
        const respuesta = await createJobPositions(nuevoPuesto);
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

function eliminarPuesto(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Elimar empleado</h4>';
    const id = item.id;
    formPuesto();
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

function actualizarPuesto(item) {
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.innerHTML = '<h4 class="modal-title">Actualizar empleado</h4>';
    const id = item.id;
    formPuesto();
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

async function leerPuesto(item) {
    const id = item.id;
    const respuesta = await getJobPosition(id);
    //const modalHeader = document.querySelector('.modal-header');
    //modalHeader.innerHTML='<h4 class="modal-title">Detalles:</h4>';

    formPuesto();
    const form = document.getElementById('formEmpleado');
    form['position_id'].value = respuesta.position_id;
    form['position_title'].value = respuesta.position_title;
    form['min_salary'].value = respuesta.min_salary;
    form['max_salary'].value = respuesta.max_salary;
    form['department_id'].value = respuesta.department_id;
    
    if (respuesta.message) {
        showMessage(`${respuesta.message}`, 'success');
    } else {
        showMessage(`${respuesta.error}`, 'danger');
    };
};
//position_title,min_salary,max_salary,department_id
function formPuesto() {
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';

    const formHTML = `
        <form class="form" id="formEmpleado">
            <div class="input-group"> 
                <label for="position_id">position_id</label>
                <input  class='form-control' type="number" id="position_id"></input>
            </div>
            <div class="input-group"> 
                <label for="position_title">position_title</label>
                <input  class='form-control' type="text" id="position_title"></input>
            </div>
            <div class="input-group"> 
                <label for="min_salary">min_salary</label>
                <input  class='form-control' type="number" id="min_salary"></input>
            </div>
            <div class="input-group"> 
                <label for="max_salary">max_salary</label>
                <input  class='form-control' type="number" id="max_salary"></input>
            </div>
            <div class="input-group"> 
                <label for="department_id">department_id</label>
                <input  class='form-control' type="number" id="department_id"></input>
            </div>
            
        </form>
    `;

    modalBody.innerHTML = formHTML;
    console.log('saliendo de formPuesto()');

    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Cerrar';
    modalFooter.appendChild(btnSaveDocument);
};