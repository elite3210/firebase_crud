
// Función para consumir la API
const api = 'https://www.heinzsport.com/api.php';
const apiDepartament = 'https://www.heinzsport.com/apiDepartament.php';
const apiJobPositions = 'https://www.heinzsport.com/apiPuestos.php';

//Empleados:
export async function cargarEmpleados() {
    try {
        const respuesta = await fetch(api);
        const empleadosDatos = await respuesta.json();
        return empleadosDatos;
    } catch (error) {
        console.error('Error al cargar los empleados:', error);
    }
};

export async function cargarEmpleado(id) {
    try {
        const respuesta = await fetch(`https://www.heinzsport.com/api.php?employee_id=${id}`);
        const respuestaEmpleados = await respuesta.json();
        return respuestaEmpleados;
    } catch (error) {
        console.error('Error al cargar el empleado:', error);
    }
};

export async function crearEmpleado(nuevoEmpleado) {
    try {
        const respuesta = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEmpleado)
        });
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error al crear el empleado:', error);
    }
};

export async function eliminarUsuario(id) {
    try {
        const respuesta = await fetch(`https://www.heinzsport.com/api.php?id=${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
    }
};

export async function actualizarUsuario(usuarioActualizado) {
    try {
        const respuesta = await fetch('https://www.heinzsport.com/api.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioActualizado)
        });
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el empleado:',error);
        return error;
    }
};

//Departamentos:
export async function getDepartaments() {
    try {
        const respuesta = await fetch(apiDepartament);
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al cargar los departamentos:', error);
    }
};

export async function getDepartament(id) {
    try {
        const respuesta = await fetch(`https://www.heinzsport.com/apiDepartament.php?department_id=${id}`);
        const respuestaEmpleados = await respuesta.json();
        return respuestaEmpleados;
    } catch (error) {
        console.error('Error al cargar el empleado:', error);
    }
};

export async function createDepartament(nuevoDepartamento) {
    try {
        const respuesta = await fetch(apiDepartament, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoDepartamento)
        });
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error al crear el nuevoDepartamento:', error);
    }
};
//Puestos:
export async function getJobPositions() {
    try {
        const respuesta = await fetch(apiJobPositions);
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al cargar los Puestos:', error);
    }
};

export async function getJobPosition(id) {
    try {
        const respuesta = await fetch(`https://www.heinzsport.com/apiPuestos.php?position_id=${id}`);
        const dato= await respuesta.json();
        return dato;
    } catch (error) {
        console.error('Error al cargar el empleado:', error);
    }
};

export async function createJobPositions(nuevoObjeto) {
    try {
        const respuesta = await fetch(apiJobPositions, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoObjeto)
        });
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error al crear el nuevoObjeto:', error);
    }
};




