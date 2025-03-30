import { jornadaRef, deleteTask, updateTask, guardarBoletaPago, traerUnNumeracion, updateNumeracion, guardarTransaccionesLaboral } from './firebase.js'
import { getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { Datatable } from './dataTable.js';
import { showMessage } from "./src/app/showMessage.js";

console.log('Modulo consultaJornada.js trabajando... Inicio:')

const queryJornada = query(jornadaRef, where("payStatus", "==", false), orderBy("title", "desc"));
const querySnapshot = await getDocs(queryJornada);
console.log('querySnapshot:', querySnapshot);

const numeroTicket = await traerUnNumeracion('Ticket');
const tabla = document.getElementById('tabla')
const cajaOpciones = document.getElementById('opciones')
const listaSeleccion = document.getElementById('colaborador')
const tareaForm = document.getElementById('tarea-form')


let editStatus = false;
let id = '';          //por comodidad se volvio el id una variable global, hay que corregir que sea local y pasarlo por e.target.dataset

let objetosLS = JSON.parse(localStorage.getItem('jornadaDatos'));
let objetosLSFiltrado = '';
let objetosLSBoleta = [];
let objetosNoSeleccionados = [];
let tiempoTotBoleta = 0;
let selectedEmployee = '';
let objetosProcesados = '';


//Datos a personalizar por pagina
const tarifaJornada = [
    { tarifa: 3.6164, 'dni': '72091168', 'nombre': 'Angela', horario: 'regular' },
    { tarifa: 3.6857, 'dni': '71338629', 'nombre': 'Alexandra', horario: 'regular' },
    { tarifa: 3.700, 'dni': '71338629', 'nombre': 'Xiomara', horario: 'regular' },
    { tarifa: 3.3594, 'dni': '09551196', 'nombre': 'Rocio', horario: 'regular' },
    { tarifa: 3.10, 'dni': '70528292', 'nombre': 'Heinz', horario: 'regular' },
    { tarifa: 3.595, 'dni': '10216274', 'nombre': 'Mariela', horario: 'regular' },
    { tarifa: 4.9144, 'dni': '42231772', 'nombre': 'Elí', horario: 'regular' },
    { tarifa: 4.9144, 'dni': '42231772', 'nombre': 'Alison', horario: 'regular' },
    { tarifa: 3.6857, 'dni': '48256517', 'nombre': 'Madeleine', horario: 'regular' },
    { tarifa: 4.063, 'dni': '80400965', 'nombre': 'Oswaldo', horario: 'regular' },
    { tarifa: 1, 'dni': '42934967', 'nombre': 'Giovanna', horario: 'regular' },
    { tarifa: 3.6857, 'dni': '74702640', 'nombre': 'Mirella', horario: 'regular' },
    { tarifa: 3.8787, 'dni': '77269606', 'nombre': 'Paola', horario: 'regular' }
  ]
  
  const tarifaJornadaNoche = [
    { tarifa: 4.5455, 'dni': '72091168', 'nombre': 'Angela', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '71338629', 'nombre': 'Alexandra', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '71338629', 'nombre': 'Xiomara', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '09551196', 'nombre': 'Rocio', horario: 'noche' },
    { tarifa: 4.091, 'dni': '70528292', 'nombre': 'Heinz', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '10216274', 'nombre': 'Mariela', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '42231772', 'nombre': 'Elí', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '42231772', 'nombre': 'Alison', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '80400965', 'nombre': 'Oswaldo', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '48256517', 'nombre': 'Madeleine', horario: 'noche' },
    { tarifa: 4.5455, 'dni': '77269606', 'nombre': 'Paola', horario: 'noche' }
  ]
  
  const tarifaJornadaFeriado = [
    { tarifa: 4.5455, 'dni': '72091168', 'nombre': 'Angela', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '71338629', 'nombre': 'Alexandra', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '71338629', 'nombre': 'Xiomara', horario: 'feriado' },
    { tarifa: 6.7187, 'dni': '09551196', 'nombre': 'Rocio', horario: 'feriado' },
    { tarifa: 4.091, 'dni': '70528292', 'nombre': 'Heinz', horario: 'feriado' },
    { tarifa: 7.190, 'dni': '10216274', 'nombre': 'Mariela', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '42231772', 'nombre': 'Elí', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '42231772', 'nombre': 'Alison', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '80400965', 'nombre': 'Oswaldo', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '48256517', 'nombre': 'Madeleine', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '74702640', 'nombre': 'Mirella', horario: 'feriado' },
    { tarifa: 4.5455, 'dni': '77269606', 'nombre': 'Paola', horario: 'feriado' }
  ]

const tarifaJornada_19_11_23 = [
    { tarifa: 3.6164, 'dni': '72091168', 'nombre': 'Angela', 'dia': 'laborable' },
    { tarifa: 3.6857, 'dni': '71338629', 'nombre': 'Alexandra', 'dia': 'laborable' },
    { tarifa: 3.700, 'dni': '71338629', 'nombre': 'Xiomara', 'dia': 'laborable' },
    { tarifa: 3.3594, 'dni': '09551196', 'nombre': 'Rocio', 'dia': 'laborable' },
    { tarifa: 3.3594, 'dni': '09551196', 'nombre': 'Rocío', 'dia': 'laborable' },
    { tarifa: 3.1000, 'dni': '70528292', 'nombre': 'Heinz', 'dia': 'laborable' },
    { tarifa: 3.3594, 'dni': '10216274', 'nombre': 'Mariela', 'dia': 'laborable' },
    { tarifa: 4.9144, 'dni': '42231772', 'nombre': 'Elí', 'dia': 'laborable' }
]

const tarifaJornadaAnterior = [
    { 'tarifa': 3.5738, 'dni': '72091168', 'nombre': 'Angela', 'turno': 'dia' },
    { 'tarifa': 3.6719, 'dni': '71338629', 'nombre': 'Alexandra', 'turno': 'dia' },
    { 'tarifa': 3.3594, 'dni': '09551196', 'nombre': 'Rocio', 'turno': 'dia' },
    { 'tarifa': 3.0000, 'dni': '70528292', 'nombre': 'Heinz', 'turno': 'dia' },
    { 'tarifa': 3.3594, 'dni': '10216274', 'nombre': 'Mariela', 'turno': 'dia' },
    { 'tarifa': 4.9144, 'dni': '42231772', 'nombre': 'Elí', 'turno': 'dia' },
    { 'tarifa': 3.6857, 'dni': '74702640', 'nombre': 'Mirella', 'turno': 'regular' }
]

//console.log('Datos traidos de Firestore:',queryJornada)
datosFirebase();

listaSeleccion.addEventListener('blur', filtrarTabla);

function datosFirebase() {//trae los datos de firebase
    let objetoJornada = [];

    querySnapshot.forEach((doc) => {
        const objeto = {};
        objeto['id'] = doc.id;
        objeto['values'] = doc.data();
        objetoJornada.push(objeto);
    });
    //objetoJornada.sort((a,b)=> a['values'].description-b['values'].description)
    objetosProcesados = procesarDatos(objetoJornada);
    sincronizarLocalStorage(objetosProcesados);
    console.log('items:', objetoJornada);
    pintarTabla(objetosProcesados, tabla);
}
//console.log('tablaSemana(objetosLS):',tablaSemana(objetosLS));

const titulo = { NOMBRE: 'nombrePersona', LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miercoles', JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sabado', DOMINGO: 'Domingo', IMPORTE: 'total' };

const dt = new Datatable('#dataTable', []);
dt.setData(planillaSemanal(objetosLS), titulo);
dt.makeTable2();


function planillaSemanal(items) {
    let personasUnicas = eliminarDuplicados(items, 'description');//array de nombres de personas
    let arraySemana = [];
    let contadorId = 1;
    //
    for (const persona of personasUnicas) {
        let filaPersona = {};
        filaPersona.id = contadorId;
        filaPersona.values = {};
        filaPersona['values'].nombrePersona = persona;
        let itemPersona = items.filter(item => item['values'].description == persona);//separamos todos los datos de una persona,devuelve un array de objetos
        let diasPersona = groupBy(itemPersona, 'nombreDia', 'importe');//devuelve un array objetos
        console.log(`diasPersona-${persona}:`, diasPersona);
        filaPersona['values'].total = diasPersona.reduce((totalizador, obj) => totalizador + obj['values'].importe, 0);

        let diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        //rellenamos de cero la tabla
        for (const dia of diasSemana) {
            filaPersona['values'][dia] = 0;
        }
        //rellenamos cuando hay dato existente
        for (const objDia of diasPersona) {
            filaPersona['values'][objDia['values'].nombreDia] = objDia['values'].importe;//extraemos los valores de cada dia de cada objeto para juntar un solo objeto con todos los dias
        }

        arraySemana.push(filaPersona);
        contadorId++;
    };

    //agregamos una fila final y en este los totales de cada columna.
    let totalPorDia = groupBy(items, 'nombreDia', 'importe');
    let filaPersona = {};
    filaPersona.id = contadorId + 1;
    filaPersona.values = {};
    filaPersona['values'].nombrePersona = 'TotalDia';
    filaPersona['values'].total = totalPorDia.reduce((totalizador, obj) => totalizador + obj['values'].importe, 0);
    for (const objDia of totalPorDia) {
        filaPersona['values'][objDia['values'].nombreDia] = objDia['values'].importe;
    };

    arraySemana.push(filaPersona);
    return arraySemana;
};

function groupBy(items, clave, concepto) {//funcion que recibe un lista de objetos y agrupa segun clave,porejemplo el mes y por variable importe iguala concepto en estecaso
    let itemsAgrupado = []//agrupa objetos en cada mes = clave  e importes=concepto ejemplo: {"id": 1,"values": {"mes": "Setiembre","concepto": 30113}}
    let elementosUnicos = eliminarDuplicados(items, clave);//de los items elimina los meses duplicados=clave

    let contador = 1;
    for (const valor of elementosUnicos) {//coge cada valor=mes y compara para extraer el valor
        let objeto = {}
        let acumulador = 0;

        for (const fila of items) {
            if (fila['values'][clave] == valor) {
                acumulador += fila['values'][concepto];
            };
        };
        objeto.id = contador;
        objeto.values = {};
        objeto.values[clave] = valor;
        objeto.values[concepto] = Math.round(acumulador);
        itemsAgrupado.push(objeto);
        contador++;
        //queda asi ejemplo: {"id": 1,"values": {"mes": "Setiembre","concepto": 3013}}
        //queda asi ejemplo: {"id": 2,"values": {"mes": "octubre","concepto": 3013}}
        //queda asi ejemplo: {"id": 3,"values": {"mes": "noviembre","concepto": 3013}}
        //queda asi ejemplo: {"id": 4,"values": {"mes": "diciembre","concepto": 3013}}
    }
    //console.log('dentro de la funcion groupBy:itemsAgrupado...final');
    return itemsAgrupado;
};

function eliminarDuplicados(arrayObjetos, clave) {//recibe una lista de categoria duplicadas y reduce a unicos
    let grupos = [];//para separar el atributo a reducir meses repetidos
    let elementosUnicos = [];//elementos unicos o meses unicos

    for (const fila of arrayObjetos) {//extraemos los valores de la categoria mes en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'][clave]);
    };

    for (let i = 0; i < grupos.length; i++) {//reducimos los meses a elementos unicos
        let esDuplicado = false;
        for (let j = 0; j < elementosUnicos.length; j++) {//recorre toda la lista de elemntos unicos por cada fila de grupos
            if (grupos[i] == elementosUnicos[j]) {
                esDuplicado = true;
                break;
            };
        }

        if (!esDuplicado) {//solo agrega los que no aparecen en elemento unicos
            elementosUnicos.push(grupos[i]);
        }
    }
    return elementosUnicos;
};

//guardarTransaccionesLaboral = (fechaBoleta,dniBoleta,numBoleta,creado,descripcion,tipoTransaccion,importe)

function pintarTabla(objetos, contenedor) {//crea tablas
    clearHTML(tabla);
    pintarFilas(objetos, contenedor)
    //eventoClickFila()
}

function pintarFilas(objetos, contenedor) {//crea filas de tabla y coloca datos de local Storage
    //objetos.sort((a, b) => b.title - a.title);//metodo para ordenar array de objetos
    //console.log('objetos:', objetos)
    let tiempoTotal = objetos.reduce((total, obj) => total + obj['values'].tiempo, 0)
    let importeTotal = objetos.reduce((total, obj) => total + obj['values'].importe, 0)//buscar la forma de hacer ambas operaciones en uno
    //console.log('ordenado??:',objetos)
    console.log('tiempototal:', tiempoTotal)
    const thead = document.createElement('thead')
    thead.innerHTML = `<tr><th></th><th>Horario</th><th>Nombre</th><th>Dia</th><th>Entrada</th><th>Salida</th><th>Hora</th><th>S/.</th></tr>`

    const tfoot = document.createElement('tfoot')

    tfoot.innerHTML = `<tr><th></th><th></th><th>Horas</th><th id="tiempoTotalVarios">${tiempoTotal}</th><th></th><th></th><th>Importe S/</th><th id="importeTotalVarios">${importeTotal}</th></tr>`
    const tbody = document.createElement('tbody')
    tbody.setAttribute('id', "jornadaContainer")
    tbody.setAttribute('class', "caja")

    objetos.forEach((obj) => {
        let fila = document.createElement('tr')
        fila.classList.add('fila')
        fila.setAttribute('data-id', obj.id);

        fila.innerHTML = `<input type="checkbox" class="check">
                        <td>${obj['values'].horario}</td>
                        <td>${obj['values'].description}</td>
                        <td>${obj['values'].nombreDia}</td>
                        <td>${obj['values'].title}</td>
                        <td>${obj['values'].salida}</td>
                        <td>${obj['values'].hora}</td>
                        <td>${Number(obj['values'].importe).toFixed(2)}</td>
                        `
        tbody.appendChild(fila);
    })
    contenedor.appendChild(thead)
    contenedor.appendChild(tbody)
    contenedor.appendChild(tfoot)
}


function filtrarTabla() {//filtra datos de tabla en respuesta al datalist
    const modalBody = document.querySelector('.modal-body')
    console.log('se ejecuto blur...')
    objetosLSBoleta = [];
    selectedEmployee = '';
    selectedEmployee = listaSeleccion.value;
    console.log('Empleado seleccionado:', selectedEmployee)
    
    objetosLSFiltrado = objetosLS.filter(elemt => elemt['values'].description == selectedEmployee)

    clearHTML(tareaForm);//elimina la el formulario de edicion
    clearHTML(tabla);
    clearHTML(modalBody);
    pintarFilas(objetosLSFiltrado, tabla)
    eventoClickFila()
}

function eventoClickFila() {//pinta la fila y cambia a clase filaseleccionada si se hace check

    const btnFila = jornadaContainer.querySelectorAll('.fila')
    btnFila.forEach(fila => {
        fila.addEventListener('click', (e) => {
            //console.log('hijo de fila:', fila.firstChild.checked)

            if (fila.firstChild.checked) {
                fila.setAttribute('class', 'filaSeleccionada')
                id = fila.getAttribute('data-id')
                //console.log('diste click en fila:', id)
                pintarOpciones(id)
            } else {
                fila.setAttribute('class', 'fila')
            }
        })
    })
}

function pintarOpciones(id) {//crea la cinta de opciones para la fila seleccionada

    cajaOpciones.innerHTML = `
                        <button class="btn-boleta fa-solid fa-receipt" data-id='${id}' data-bs-toggle="modal" data-bs-target="#myModal"></button>
                        <button class ='btn-delete fa fa-trash' data-id='${id}'></button>
                        <button class ='btn-pagar fa fa-hand-holding-dollar' data-id='${id}'  data-bs-toggle="modal" data-bs-target="#myModal" value='${id}' color='transparent'></button>
                        <button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id='${id}'></button>
                        `
    eventoClickPagar();
    eventoClickEliminar();
    eventoClickEditar();
    eventoClickBoleta();
}

function eventoClickEliminar() {//elimina fila selecionada, error: despues de eliminar no se puede hace boleta

    const btnDelete = cajaOpciones.querySelectorAll('.btn-delete')
    btnDelete.forEach(btn => {
        btn.addEventListener('click', (e) => {
            id = e.target.dataset.id
            console.log('diste click en eliminar', id)
            deleteTask(id)      //eliminamos en la BD Firestore

            let objetosLSModificado = objetosLS.filter(elemt => elemt.id != id)
            sincronizarLocalStorage(objetosLSModificado);
            clearHTML(tabla);
            pintarFilas(objetosLSModificado, tabla)
        })
    })
};

function eventoClickPagar() {
    const btnPagar = cajaOpciones.querySelectorAll('.btn-pagar')
    btnPagar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            id = e.target.dataset.id
            console.log('diste click en pagar:', e.target.dataset.id)

            updateTask(id, { payStatus: true })

            let objetosLSModificado = objetosLS.filter(elemt => elemt.id != id);
            sincronizarLocalStorage(objetosLSModificado)
            clearHTML(tabla);
            //let objetosLSFiltrado2=objetosLSFiltrado.filter(elemt => elemt.id != id)
            pintarTabla(objetosLS, tabla) //vuelve a pintar las filas pero no agrega los escuchas de eventos los addEventListener
            //cajaOpciones.innerHTML=''

        })
    })
};

function eventoClickEditar() {//error: despues de eliminar no se puede hace boleta

    if (!editStatus) {
        const btnEdit = cajaOpciones.querySelectorAll('.btn-edit')//hay un solo boton por que recorrerlo?
        btnEdit.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                console.log('diste click en editar:', e.target.dataset.id)
                id = e.target.dataset.id;

                pintarFrmEdicion(id) //pinta formulario con entradas vacias y boton con id
                //const doc =await traerTask(e.target.dataset.id);
                //let obj=doc.data()
                let objetoEncontradoLS = objetosLS.filter(obj => obj.id == id)[0];
                console.log('objeto a editar:', objetoEncontradoLS)

                tareaForm['tarea-title'].value = objetoEncontradoLS['values'].title;
                tareaForm['tarea-description'].value = objetoEncontradoLS['values'].description;
                tareaForm['salida-title'].value = objetoEncontradoLS['values'].salida;
                tareaForm['horario'].value = objetoEncontradoLS['values'].horario;
                tareaForm['payStatus'].value = objetoEncontradoLS['values'].payStatus;

                editStatus = true;
                tareaForm['boton-task-save'].innerHTML = 'Actualizar'
            })
        });
    } else { console.log('no puedes editar...') }
};

function eventoClickBoleta() {
    const btnBoleta = cajaOpciones.querySelectorAll('.btn-boleta')
    btnBoleta.forEach(btn => {
        btn.addEventListener('click', crearBoleta)
    })
};

function pintarFrmEdicion(id) {

    let entradasFormulario = `
                            <datalist id="colaborador">
                                <option value="Angela">
                                <option value="Alexandra">
                                <option value="Rocio">
                                <option value="Mariela">
                                <option value="Xiomara">
                                <option value="Heinz">
                                <option value="Elí">
                                <option value="Mirella">
                            </datalist>
                            <div class="cajota">
                                <div class="cajita2">
                                    <div class="cajita">
                                        <label for="tarea-title" required>Entrada  :</label>
                                        <input class="fecha" type="datetime-local" id='tarea-title'>
                                        <label for="salida-title" required>Salida :</label>
                                        <input class="fecha"  type="datetime-local" id='salida-title'>
                                    </div>
                                        
                                    <label for="tarea-description">Nombre:</label>
                                    <input type="text" list="colaborador" name="car" id="tarea-description" required>
                                    <label for="horario">Horario:</label>
                                    <input type="text" id="horario">
                                    <label for="payStatus">payStatus:</label>
                                    <input type="text" id="payStatus">
                                </div>
                                    <div id="container-btn" class="container-btn">
                                        <button id="boton-task-save" class="boton" data-id=${id}>Guardar</button> 
                                    </div>
                            </div> 
                            `
    tareaForm.innerHTML = entradasFormulario
    tareaForm.addEventListener('submit', registrarFrmEdicion)
};

function registrarFrmEdicion(e) {
    e.preventDefault()  //cancela envio datos por metodo post y su posterior reset

    const titulo = tareaForm['tarea-title'];
    const descripcion = tareaForm['tarea-description'];
    const salida = tareaForm['salida-title'];
    const horario = tareaForm['horario'];

    const payStatus = false;                       //por defecto cuando se edita sera falso el pago, porque no se puede editar algo ppagado

    if (!editStatus) {
        console.log('guardando...')
        guardarTask(titulo.value, descripcion.value, salida.value, payStatus)//false el pago, por defecto al registrar por primera vez
    } else {
        console.log('actualizando Firebase...', id)
        updateTask(id, { title: titulo.value, description: descripcion.value, salida: salida.value, payStatus: payStatus, horario: horario.value })
        editStatus = false
        //tareaForm['boton-task-save'].innerHTML='Registrar'
        console.log('filtrando..', id)
        //actualizando local storage
        let objetosLSActualizado = objetosLS.filter(elemt => elemt.id != id);
        let objetoEditado = [{ title: titulo.value, description: descripcion.value, salida: salida.value, payStatus: payStatus, id: id }];

        objetosLSActualizado.push(procesarDatos(objetoEditado))
        sincronizarLocalStorage(objetosLSActualizado)
        objetosLS = JSON.parse(localStorage.getItem('jornadaDatos'));
        console.log('sincronizado LSActualizado..')

    }
    tareaForm.reset()
    clearHTML(tareaForm);
    clearHTML(tabla);
    pintarFilas(objetosLS, tabla) //vuelve a pintar las filas pero no agrega los escuchas de eventos los addEventListener
};

function clearHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    }
};

function crearBoleta() {//crea una ventana emergente de boleta
        try {
            const filasSeleccionadas = jornadaContainer.querySelectorAll('.filaSeleccionada')//selecciona todas las filas seleccionadas
        const filasNoSeleccionadas = jornadaContainer.querySelectorAll('.fila')//selecciona todas las filas seleccionadas

        filasSeleccionadas.forEach((fila) => {
            let id = fila.getAttribute('data-id');
            objetosLSBoleta.push(objetosLS.filter(obj => obj.id == id)[0]);
        })
    
        filasNoSeleccionadas.forEach((fila) => {
            let id = fila.getAttribute('data-id');
            objetosNoSeleccionados.push(objetosLS.filter(obj => obj.id == id)[0]);
        })
        pintarFormularioBoleta(objetosLSBoleta)
        } catch (error) {
            console.log('algo esta fallando en function crearBoleta()',error);
            
        }
    
        
  
    

}


function pintarFormularioBoleta(arrayObj) {
    tiempoTotBoleta = arrayObj.reduce((total, obj) => total + obj['values'].tiempo, 0)
    console.log('selectedEmployee:', selectedEmployee);
    if (selectedEmployee) {
        let entradasFormulario = `
                            <div class="boletaFormulario" id="boletaFormulario">
                                <form class="ctnInpBoleta" id="formTicket">
                                    <label for="dni">DNI:</label>
                                    <input type="text" class= "inpBoleta" min="8"  id="dniBoleta" list="Colaboradores" required><br>
                                    <label for="nombre">Nombre:</label>
                                    <input type="text" class= "inpBoleta" list="colaboradorList" name="persona" id="nomBoleta" required><br>
                                    <label for="tarea-title">N° Ticket :</label>
                                    <input class="boleta inpBoleta" type="text" id='numeroTicket' required><br>
                                    <label for="salida-title">Fecha :</label>
                                    <input class="fecha2 inpBoleta"  type="date" id='fechaBoleta' required>
                                </form>
                            </div>
                            `
        let bodyModal = document.querySelector('.modal-body');
        let footerModal = document.querySelector('.modal-footer');
        
        clearHTML(footerModal);
        bodyModal.innerHTML = entradasFormulario
        let formTicket = document.getElementById('formTicket');
        let boletaFormulario = document.getElementById('boletaFormulario');
        let obtenerDNI = tarifaJornada.filter(elemt => elemt.nombre == selectedEmployee)[0];
        console.log('obtenerDNI', obtenerDNI);

        formTicket['dniBoleta'].value = obtenerDNI.dni
        formTicket['nomBoleta'].value = selectedEmployee;
        formTicket['numeroTicket'].value = Number(numeroTicket.data().ultimoNumero) + 1;

        console.log('Numero de ticket Anterior:', numeroTicket.data().ultimoNumero)
        pintarFilasBoleta(arrayObj,boletaFormulario)

        const btnGuardar = document.createElement('button')
        btnGuardar.setAttribute('class', 'btn btn-primary')
        btnGuardar.textContent = 'Guardar';
        footerModal.appendChild(btnGuardar);
        btnGuardar.addEventListener('click', guardarBoleta);
        pintarTabla(objetosProcesados, tabla);
    } else {
        showMessage(`Error:Debe filtrar una persona primero`)
    }
};

function tiempoTranscurrido(entrada, salida) {//recibe horas de entra y salida en texto y devuelve un objeto con las horas enteras y minutos separados y en decimales
    const horas = {}
    const lapsoMiliseg = (new Date(salida).getTime()) - (new Date(entrada).getTime());//calculamos los milisegundos transcurridos por diferencia

    horas.horasEnteras = Math.trunc(lapsoMiliseg / (1000 * 60 * 60));//los milisegundos pasamos a horas y que extraemos la parte entrea con math.trunc
    horas.minutosEnteros = Math.trunc(lapsoMiliseg / (1000 * 60) % 60);//los milisegundos pasamos a minutos y que extraemos el modulo de 60 con % 60 y extraemos parte entera con math.trunc
    horas.horasDecimal = lapsoMiliseg / (1000 * 60 * 60).toFixed(2);
    horas.horasMinutos = `${horas.horasEnteras}:${horas.minutosEnteros}`;
    return horas;//return un objeto horas={horasEnteras:valor,minutosEnteros:valor,horasDecimal:valor,horasMinutos:valor}
};

function nombreDia(entrada) {//retorna nombre del dia de semana
    const nombreDia = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return nombreDia[new Date(entrada).getDay()]
};

function procesarDatos(objetos) {//realiza los calculos de hora y asigna el precio por hora trabajada    

    objetos.forEach((obj) => {
        //console.log('obj de cada foreach',obj)
        obj['values'].nombreDia = nombreDia(obj['values'].title);
        obj['values'].hora = tiempoTranscurrido(obj['values'].title, obj['values'].salida).horasMinutos;
        obj['values'].tiempo = tiempoTranscurrido(obj['values'].title, obj['values'].salida).horasDecimal;
        obj['values'].importe = obj['values'].tiempo * getTarifaJornada(obj, tarifaJornada, tarifaJornadaNoche, tarifaJornadaFeriado);
        //console.log('lo que devuelve el filter:',tarifaJornada.filter(elemt => elemt.nombre == obj.description.trim())[0])
    })

    //console.log('lo que se va ordenar:',objetos)
    let objetoOrdenado = objetos.sort((a, b) => a.title - b.title);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
    //console.log('lo que esta ordenado:',objetoOrdenado)
    return objetoOrdenado
};

function getTarifaJornada(objeto, arrayObj, arrayObj2, arrayObj3) {
    //econsole.log('objeto_getTarifa:',objeto);
    switch (objeto['values'].horario) {
        case 'Regular': {
            let nombre = objeto['values'].description;
            const { tarifa } = arrayObj.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
            return tarifa
        }
            break;

        case 'Noche': {
            let nombre = objeto['values'].description;
            const { tarifa } = arrayObj2.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
            return tarifa
        }
            break;

        case 'Feriado': {
            let nombre = objeto['values'].description;
            const { tarifa } = arrayObj3.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
            return tarifa
        }
            break;

        default: {
            let nombre = objeto['values'].description;
            const { tarifa } = arrayObj.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
            return tarifa
        }
            break;
    }

};

function sincronizarLocalStorage(objetos) {//recibe nuevos datos lo guarda en LS y lo trae en memoria
    localStorage.removeItem('jornadaDatos');
    localStorage.setItem('jornadaDatos', JSON.stringify(objetos))
};

function guardarBoleta() {//escritura en collecion boleta y transaccionesLaboral de FB 

    let numBoleta = document.getElementById('numeroTicket').value;
    let dniBoleta = document.getElementById('dniBoleta').value;
    let nomBoleta = document.getElementById('nomBoleta').value;
    let fechaBoleta = document.getElementById('fechaBoleta').value;
    let tiempoTotal = tiempoTotBoleta;
    let creado = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString();
    let horasTrabajadas = JSON.stringify(objetosLSBoleta);
    let payStatusBol = false;
    let importeTotal = Number(document.getElementById('importeTotal').textContent);
    let descripcion = `Ticket N°${numBoleta} por ${tiempoTotal.toFixed(2)} horas laboradas`;
    let tipoTransaccion = 'debe';
    let importeHaber = '';
    console.log('importe extraido de th:', importeTotal, document.getElementById('importeTotal').textContent)
    if (Number(numBoleta) > 1000) {
        guardarTransaccionesLaboral(fechaBoleta, dniBoleta, numBoleta, creado, descripcion, tipoTransaccion, importeTotal, importeHaber);
        guardarBoletaPago(numBoleta, dniBoleta, nomBoleta, fechaBoleta, tiempoTotal, creado, horasTrabajadas, payStatusBol, importeTotal);
        actualizaEstadoPago(objetosLSBoleta);
        updateNumeracion('Ticket', { ultimoNumero: numBoleta });
        console.log('Documento creado el:', creado);
        //borrar datos de filas seleccionadas
        objetosLSBoleta = [];

        //cierra el modal y muestra un mensage de guardado
        showMessage(`Se registró Ticket N°${numBoleta}`, 'success')
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        modal.hide()

        //restear formulario
        let formTicket = document.getElementById('formTicket');
        formTicket['dniBoleta'].value = '';
        formTicket['nomBoleta'].value = '';
        formTicket['numeroTicket'].value = '';
        //objetosProcesados = procesarDatos(objetoJornada);
        //console.log('se elimino los detalles del ticket');

        clearHTML(tabla);
        //clearHTML(modalBody);
        //objetosLS=objetosNoSeleccionados;
        pintarFilas(objetosNoSeleccionados, tabla)
    } else {
        alert('No se puede guardar...')
    }


};

function actualizaEstadoPago(objeto) {
    objeto.forEach(obj => {
        let idJor = obj.id;
        updateTask(idJor, { payStatus: true })
    })
};

function pintarFilasBoleta(objetos, contenedor) {//crea filas de tabla y coloca datos de local Sorage
    let tiempoTotal = objetos.reduce((total, obj) => total + obj['values'].tiempo, 0)
    let importeTotal = objetos.reduce((total, obj) => total + obj['values'].importe, 0)//buscar la forma de hacer ambas operaciones en uno
    console.log('tiempototal:', tiempoTotal)
    const tableTicket = document.createElement('table')
    const thead = document.createElement('thead')
    thead.innerHTML = `<tr><th>Horario</th><th>Dia</th><th>Entrada</th><th>Salida</th><th>Hora</th></tr>`

    const tfoot = document.createElement('tfoot');

    tfoot.innerHTML = `<tr><th>Horas</th><th id="tiempoTotal">${tiempoTotal}</th><th></th><th>Importe S/</th><th id="importeTotal">${importeTotal.toFixed(2)}</th></tr>`
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', "jornadaContainer");
    tbody.setAttribute('class', "caja");

    objetos.forEach((obj) => {
        let fila = document.createElement('tr')
        fila.classList.add('fila')
        fila.setAttribute('data-id', obj.id);

        fila.innerHTML = `
                        <td>${obj['values'].horario}</td>
                        <td>${obj['values'].nombreDia}</td>
                        <td class="date">${obj['values'].title.slice(11, 16)}</td>
                        <td class="date">${obj['values'].salida.slice(11, 16)}</td>
                        <td class="hora">${obj['values'].hora}</td>
                        `
        tbody.appendChild(fila);
    })
    tableTicket.appendChild(thead)
    tableTicket.appendChild(tbody)
    tableTicket.appendChild(tfoot)
    console.log('tableTicket',tableTicket);
    
    contenedor.appendChild(tableTicket)
};

function restarDatosArray(arrayObjTotal, arrayObjParcial) {

}