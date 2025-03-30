import { Datatable } from "./dataTable.js";
// Función para consumir la API
const api = 'https://www.heinzsport.com/api.php';

export async function cargarEmpleados() {
    try {
        const respuesta = await fetch(api);
        const empleados= await respuesta.json();
        // Renderizar los datos en la tabla
        const items=[];
        //const tabla = document.getElementById('tabla');
        empleados.forEach(empleado => {
            const objeto={};
            objeto['id']=empleado.id;
            delete empleado.id
            objeto['values']=empleado;
            items.push(objeto);
        });
        
        //console.log('respuesta la API HeinzSport.com:',respuesta);
        console.log('empleados la API HeinzSport.com:',items);

        const titulo = {NOMBRE: 'nombre', EDAD: 'edad', TELEFONO: 'telefono', CARGO: 'cargo' }
        const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'editar', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    fillEmployeeForm(item);
                }
            },
            {
                id: 'btnAdd', text: 'add', icon: 'add', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    renderFormEmpleado();
                    crearBotonGuardar();
                }
            },
            {
                id: 'btnDelete', text: 'add', icon: 'delete', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    eliminarUsuario(item.id);
                }
            },
            {
                id: 'btnUpdate', text: 'edit', icon: 'edit', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    updateEmployeeForm(item)
                }
            }

        ]);
    dt.setData(items,titulo)
    dt.makeTable2();

    } catch (error) {
        console.error('Error al cargar los empleados:', error);
    }
}

export async function crearUsuario() {

    const form = document.getElementById('formEmpleado');
    const nuevoUsuario = {};

            nuevoUsuario.nombre   =form['nombre'].value  ;
            nuevoUsuario.edad =form['edad'].value    ;
            nuevoUsuario.telefono =form['telefono'].value;
            nuevoUsuario.cargo    =form['cargo'].value   ;

    const respuesta = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
    });
    const resultado = await respuesta.json();
    console.log(resultado);
    cargarEmpleados()
}


export async function eliminarUsuario(id) {
    //const id = 1; // ID del usuario a eliminar
    const respuesta = await fetch(`https://www.heinzsport.com/api.php?id=${id}`, {
        method: 'DELETE'
    });
    const resultado = await respuesta.json();
    console.log(resultado);
    cargarEmpleados()
}

export async function actualizarUsuario(id) {
    const usuarioActualizado = {};

            const form = document.getElementById('formEmpleado');
        
                    usuarioActualizado.id       =id ;
                    usuarioActualizado.nombre   =form['nombre'].value  ;
                    usuarioActualizado.edad     =form['edad'].value    ;
                    usuarioActualizado.telefono =form['telefono'].value;
                    usuarioActualizado.cargo    =form['cargo'].value   ;

    const respuesta = await fetch('https://www.heinzsport.com/api.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActualizado)
    });
    const resultado = await respuesta.json();
    console.log(resultado);
    cargarEmpleados();
}


function renderFormEmpleado(){
    const modalBody= document.querySelector('.modal-body');
    const formHTML=`
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

    modalBody.innerHTML=formHTML;
    console.log('saliendo de renderFormEmpleado()');

    
};

function crearBotonGuardar() {
    const modalFooter= document.querySelector('.modal-footer');
    modalFooter.innerHTML='';
    
    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'btn-guardar');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Guardar';
    btnSaveDocument.addEventListener('click',crearUsuario);
    modalFooter.appendChild(btnSaveDocument);
}

function updateEmployeeForm(item) {
    renderFormEmpleado()
    const form = document.getElementById('formEmpleado');
    form['nombre'].value    =item['values'].nombre;
    form['edad'].value      =item['values'].edad;
    form['telefono'].value  =item['values'].telefono;
    form['cargo'].value     =item['values'].cargo;




    const modalFooter= document.querySelector('.modal-footer');
    modalFooter.innerHTML='';
    const btnSaveDocument = document.createElement('button');
btnSaveDocument.setAttribute('id', 'btn-guardar');
btnSaveDocument.setAttribute('class', 'btn btn-primary');
btnSaveDocument.textContent = 'Actualizar';
btnSaveDocument.addEventListener('click', ()=>actualizarUsuario(item.id));
modalFooter.appendChild(btnSaveDocument);

}

function fillEmployeeForm(item) {
    renderFormEmpleado()
    const form = document.getElementById('formEmpleado');
    form['nombre'].value    =item['values'].nombre;
    form['edad'].value      =item['values'].edad;
    form['telefono'].value  =item['values'].telefono;
    form['cargo'].value     =item['values'].cargo;

    


    const modalFooter= document.querySelector('.modal-footer');
    modalFooter.innerHTML='';
    /*
    const btnSaveDocument = document.createElement('button');
btnSaveDocument.setAttribute('id', 'btn-guardar');
btnSaveDocument.setAttribute('class', 'btn btn-primary');
btnSaveDocument.textContent = 'Guardar';
btnSaveDocument.addEventListener('click', crearUsuario);
modalFooter.appendChild(btnSaveDocument);
*/
}




