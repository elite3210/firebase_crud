import {jornadaRef,deleteTask,updateTask,guardarBoletaPago,traerUnNumeracion,updateNumeracion} from './firebase.js'
import {getDocs,query,where,orderBy,limit} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

console.log('Modulo consultaJornada.js trabajando... Inicio:')

const queryJornada     = await getDocs(query(jornadaRef,where("payStatus", "==", false)));

let numeroTicket = await traerUnNumeracion('Ticket');

const tabla                 = document.getElementById('tabla')
const cajaOpciones          = document.getElementById('opciones')
const listaSeleccion        = document.getElementById('colaborador')
const cajaFormularios       = document.getElementById('cajaFormlarios')
const tareaForm             = document.getElementById('tarea-form')

let editStatus=false;
let personaFiltrada=''
let tiempoTotBoleta=0
let id =''          //por comodidad se volvio el id una variable global, hay que corregir que sea local y pasarlo por e.target.dataset
let objetosLS =''
let objetosLSFiltrado=''
let objetosLSBoleta      =[]




let tarifaJornada=[
                    {tarifa:3.6164,'dni':'72091168','nombre':'Angela','dia':'laborable'},
                    {tarifa:3.6857,'dni':'71338629','nombre':'Alexandra','dia':'laborable'},
                    {tarifa:3.700,'dni':'71338629','nombre':'Xiomara','dia':'laborable'},
                    {tarifa:3.3594,'dni':'09551196','nombre':'Rocio','dia':'laborable'},
                    {tarifa:3.3594,'dni':'09551196','nombre':'Rocío','dia':'laborable'},
                    {tarifa:3.10,'dni':'70528292','nombre':'Heinz','dia':'laborable'},
                    {tarifa:3.595,'dni':'10216274','nombre':'Mariela','dia':'laborable'},
                    {tarifa:4.9144,'dni':'42231772','nombre':'Elí','dia':'laborable'},
                    {tarifa:4.9144,'dni':'42231772','nombre':'Alison','dia':'laborable'}
                ]
                
               // {tarifa:3.6719,'dni':'71338629','nombre':'Xiomara'},


               let tarifaJornada_19_11_23=[
                {tarifa:3.6164,'dni':'72091168','nombre':'Angela','dia':'laborable'},
                {tarifa:3.6857,'dni':'71338629','nombre':'Alexandra','dia':'laborable'},
                {tarifa:3.700,'dni':'71338629','nombre':'Xiomara','dia':'laborable'},
                {tarifa:3.3594,'dni':'09551196','nombre':'Rocio','dia':'laborable'},
                {tarifa:3.3594,'dni':'09551196','nombre':'Rocío','dia':'laborable'},
                {tarifa:3.1000,'dni':'70528292','nombre':'Heinz','dia':'laborable'},
                {tarifa:3.3594,'dni':'10216274','nombre':'Mariela','dia':'laborable'},
                {tarifa:4.9144,'dni':'42231772','nombre':'Elí','dia':'laborable'}
            ]
            
           // {tarifa:3.6719,'dni':'71338629','nombre':'Xiomara'},




let tarifaJornadaAnterior=[
                    {'tarifa':3.5738,'dni':'72091168','nombre':'Angela','turno':'dia'},
                    {'tarifa':3.6719,'dni':'71338629','nombre':'Alexandra','turno':'dia'},
                    {'tarifa':3.3594,'dni':'09551196','nombre':'Rocio','turno':'dia'},
                    {'tarifa':3.0000,'dni':'70528292','nombre':'Heinz','turno':'dia'},
                    {'tarifa':3.3594,'dni':'10216274','nombre':'Mariela','turno':'dia'},
                    {'tarifa':4.9144,'dni':'42231772','nombre':'Elí','turno':'dia'}
                ]

console.log('Datos traidos de Firestore:',queryJornada)

datosFirebase()
pintarTabla(objetosLS,tabla)
listaSeleccion.addEventListener('blur',filtrarTabla)

function datosFirebase(){//trae los datos de firebase
    let objetoJornada =[]

    queryJornada.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        const objeto        = doc.data()
        objeto.id           = doc.id 
        objetoJornada.push(objeto)
    })
    console.log('objJornada:',objetoJornada)
    let objetosProcesados = procesarDatos(objetoJornada)
    sincronizarLocalStorage(objetosProcesados)
}

function pintarTabla(objetos,contenedor){//crea tablas
    pintarFilas(objetos,contenedor)
    eventoClickFila()
}

function pintarFilas(objetos,contenedor){//crea filas de tabla y coloca datos de local Sorage
    let tiempoTotal = objetos.reduce((total,obj)=>total+obj.tiempo,0)
    let importeTotal = objetos.reduce((total,obj)=>total+obj.importe,0)//buscar la forma de hacer ambas operaciones en uno
    console.log('tiempototal:',tiempoTotal)
    const thead     = document.createElement('thead')
    thead.innerHTML =`<tr><th></th><th>Nombre</th><th>Dia</th><th>Entrada</th><th>Salida</th><th>Hora</th></tr>`
    
    const tfoot     = document.createElement('tfoot')
    
    tfoot.innerHTML =`<tr><th></th><th></th><th>Horas</th><th id="tiempoTotal">${tiempoTotal}</th><th>Importe S/</th><th id="importeTotal">${importeTotal}</th></tr>`
    const tbody     =document.createElement('tbody')
    tbody.setAttribute('id',"jornadaContainer")
    tbody.setAttribute('class',"caja")
    
    objetos.forEach((obj)=>{
        let fila        = document.createElement('tr')
        fila.classList.add('fila')
        fila.setAttribute('data-id',obj.id);

        fila.innerHTML  = `<input type="checkbox" class="check">
                        <td>${obj.description}</td>
                        <td>${obj.nombreDia}</td>
                        <td>${obj.title}</td>
                        <td>${obj.salida}</td>
                        <td>${obj.hora}</td>
                        `
        tbody.appendChild(fila);
    })
    contenedor.appendChild(thead)
    contenedor.appendChild(tbody)
    contenedor.appendChild(tfoot)
}

function filtrarTabla(){//filtra datos de tabla en respuesta al datalist
    console.log('se ejecuto blur...')
    //console.log('evento:',e)
    let seleccion   = listaSeleccion.value;
    console.log('evento:',seleccion )
    objetosLSFiltrado = objetosLS.filter(elemt => elemt.description == seleccion)
    //console.log('filtrado',objetosLSFiltrado)
    limpiarFormulario()
    limpiarTabla()
    pintarFilas(objetosLSFiltrado,tabla)
    eventoClickFila()
    
}
function eventoClickFila(){//pinta la fila si se hace check
    let filaSeleccionada=false;
    //const btnCheck = jornadaContainer.querySelectorAll('.check')
    const btnFila = jornadaContainer.querySelectorAll('.fila')
    btnFila.forEach(fila=>{
        fila.addEventListener('click',(e)=>{
            console.log('hijo de fila:',fila.firstChild.checked)

            /*
            if(!filaSeleccionada){
                fila.setAttribute('class','filaSeleccionada')
                id = fila.getAttribute('data-id')
                console.log('diste click en fila:',id)
                pintarOpciones(id)
                filaSeleccionada=true;
            }else{
                if(fila.getAttribute('class')=='filaSeleccionada'){
                    
                        console.log('fila.getAttribute:',fila.getAttribute('class'))
                        fila.setAttribute('class','fila')
                        filaSeleccionada=false;
                    
                }
            }
            */
            
            if(fila.firstChild.checked){
                fila.setAttribute('class','filaSeleccionada')
                id = fila.getAttribute('data-id')
                console.log('diste click en fila:',id)
                pintarOpciones(id)
            }else{fila.setAttribute('class','fila')
            }
            

            /*//esta funcion pinta una unica fila yy se desactiva unicamente si se da click en la fila seleccionada
            function eventoClickFila(){//pinta la fila si se hace check
    let filaSeleccionada=false;
    //const btnCheck = jornadaContainer.querySelectorAll('.check')
    const btnFila = jornadaContainer.querySelectorAll('.fila')
    btnFila.forEach(fila=>{
        fila.addEventListener('click',(e)=>{
            console.log('hijo de fila:',fila.firstChild.checked)
            if(!filaSeleccionada){
                fila.setAttribute('class','filaSeleccionada')
                id = fila.getAttribute('data-id')
                console.log('diste click en fila:',id)
                pintarOpciones(id)
                filaSeleccionada=true;
            }else{
                if(fila.getAttribute('class')=='filaSeleccionada'){
                    
                        console.log('fila.getAttribute:',fila.getAttribute('class'))
                        fila.setAttribute('class','fila')
                        filaSeleccionada=false;
                    
                }
            }
            /*
            if(fila.firstChild.checked){
                fila.setAttribute('class','filaSeleccionada')
                id = fila.getAttribute('data-id')
                console.log('diste click en fila:',id)
                pintarOpciones(id)
            }else{fila.setAttribute('class','fila')
            }
            */



        })
    })
}

function pintarOpciones(id){//crea la cinta de opciones para la fila seleccionada
    
    cajaOpciones.innerHTML=`
                        <button class="btn-boleta fa-solid fa-receipt" data-id='${id}'></button>
                        <button class ='btn-delete fa fa-trash' data-id='${id}'></button>
                        <button class ='btn-pagar fa fa-hand-holding-dollar' data-id='${id}' value='${id}' color='transparent'></button>
                        <button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id='${id}'></button>
                        `
    eventoClickPagar()
    eventoClickEliminar()
    eventoClickEditar()
    
    eventoClickBoleta()
}

function eventoClickEliminar(){//elimina fila selecionada, error: despues de eliminar no se puede hace boleta

    const btnDelete = cajaOpciones.querySelectorAll('.btn-delete')
    btnDelete.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            id = e.target.dataset.id
            console.log('diste click en eliminar',id)
            deleteTask(id)      //eliminamos en la BD Firestore

            let objetosLSModificado = objetosLS.filter(elemt => elemt.id != id)
            sincronizarLocalStorage(objetosLSModificado)
            limpiarTabla()
            pintarFilas(objetosLSModificado,tabla)
        })       
    })
}

function eventoClickPagar(){
    const btnPagar          = cajaOpciones.querySelectorAll('.btn-pagar')
    btnPagar.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            id = e.target.dataset.id
            console.log('diste click en pagar:',e.target.dataset.id)
            
            updateTask(id,{payStatus:true})

            let objetosLSModificado = objetosLS.filter(elemt => elemt.id != id);
            sincronizarLocalStorage(objetosLSModificado)
            limpiarTabla()
            //let objetosLSFiltrado2=objetosLSFiltrado.filter(elemt => elemt.id != id)
            pintarTabla(objetosLS,tabla) //vuelve a pintar las filas pero no agrega los escuchas de eventos los addEventListener
            //cajaOpciones.innerHTML=''
            
        })
    })
}

function eventoClickEditar(){//error: despues de eliminar no se puede hace boleta
    
    if(!editStatus){
        const btnEdit = cajaOpciones.querySelectorAll('.btn-edit')//hay un solo boton por que recorrerlo?
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', (e)=>{
                console.log('diste click en editar:',e.target.dataset.id)
                id=e.target.dataset.id;
                
                pintarFrmEdicion(id) //pinta formulario con entradas vacias y boton con id
                //const doc =await traerTask(e.target.dataset.id);
                //let obj=doc.data()
                let objetoEncontradoLS = objetosLS.filter(obj=>obj.id==id)
                console.log('objeto a editar:',objetoEncontradoLS[0])

                tareaForm['tarea-title'].value          =objetoEncontradoLS[0].title;
                tareaForm['tarea-description'].value    =objetoEncontradoLS[0].description;
                tareaForm['salida-title'].value         =objetoEncontradoLS[0].salida;
                //tareaForm['nombreDia'].value            =objetoEncontradoLS[0].nombreDia
                //tareaForm['hora'].value                 =objetoEncontradoLS[0].hora
                //['tiempo'].value               =objetoEncontradoLS[0].tiempo
                //tareaForm['payStatus'].value            =tarea.payStatus;

                editStatus=true;
                tareaForm['boton-task-save'].innerHTML='Actualizar'
            })
        });
    }else{console.log('no puedes editar...')} 
}

function pintarFrmEdicion(id){

    let entradasFormulario =`
                            <datalist id="colaborador">
                                <option value="Angela">
                                <option value="Alexandra">
                                <option value="Rocio">
                                <option value="Mariela">
                                <option value="Xiomara">
                                <option value="Heinz">
                                <option value="Elí">
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
                                </div>
                                    <div id="container-btn" class="container-btn">
                                        <button id="boton-task-save" class="boton" data-id=${id}>Guardar</button> 
                                    </div>
                            </div> 
                            `
    tareaForm.innerHTML=entradasFormulario 
    tareaForm.addEventListener('submit',registrarFrmEdicion)
}

function registrarFrmEdicion(e){
    e.preventDefault()  //cancela envio datos por metodo post y su posterior reset

    const titulo        = tareaForm['tarea-title'];
    const descripcion   = tareaForm['tarea-description'];
    const salida        = tareaForm['salida-title'];
    //const nombreDia       = tareaForm['nombreDia'];
    //const hora        = tareaForm['hora'];
    //const tiempo       = tareaForm['tiempo'];
    const payStatus     = false;                       //por defecto cuando se edita sera falso el pago, porque no se puede editar algo ppagado
    
    if(!editStatus){
        console.log('guardando...')

        guardarTask(titulo.value,descripcion.value,salida.value,payStatus)//false el pago, por defecto al registrar por primera vez
    }else{
        console.log('actualizando Firebase...',id)
        updateTask(id,{title:titulo.value,description:descripcion.value,salida:salida.value,payStatus:payStatus})
        editStatus=false
        //tareaForm['boton-task-save'].innerHTML='Registrar'
        console.log('filtrando..',id)
        //actualizando local storage
        let objetosLSActualizado = objetosLS.filter(elemt => elemt.id != id);
        objetosLSActualizado.push({title:titulo.value,description:descripcion.value,salida:salida.value,payStatus:payStatus,id:id})
        sincronizarLocalStorage(objetosLSActualizado)
        console.log('sincronizado LSActualizado..')
        
    }
    tareaForm.reset()
    limpiarFormulario()
    limpiarTabla()
    pintarFilas(objetosLS,tabla) //vuelve a pintar las filas pero no agrega los escuchas de eventos los addEventListener
}

function limpiarTabla(){
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML=''
    while(tabla.firstChild){
        tabla.removeChild(tabla.firstChild)
    }
}

function limpiarElemento(elemento){
    console.log('dentro de limpiar elemto...')
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML=''
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild)
    }
}

function crearBoleta(){//crea una ventana emergente de boleta
    const filasSeleccionadas = jornadaContainer.querySelectorAll('.filaSeleccionada')//selecciona todas las filas seleccionadas

    filasSeleccionadas.forEach((fila)=>{
        let id = fila.getAttribute('data-id')
        objetosLSBoleta.push(objetosLS.filter(obj=>obj.id ==id)[0])
    })
    pintarFormularioBoleta(objetosLSBoleta)
}

function eventoClickBoleta(){
    
    const btnBoleta         = cajaOpciones.querySelectorAll('.btn-boleta')
    btnBoleta.forEach(btn=>{
        btn.addEventListener('click',crearBoleta)
    })
}

function limpiarFormulario(){
    tareaForm.innerHTML=''
}

function pintarFormularioBoleta(objetosLSBoleta){
    tiempoTotBoleta = objetosLSBoleta.reduce((total,obj)=>total+obj.tiempo,0)
    const formularioBoleta  = document.createElement('section')
    formularioBoleta.setAttribute('class','vtnEmergente')
    
    
    let entradasFormulario =`
                            <datalist id="colaborador">
                                <option value="Angela">
                                <option value="Alexandra">
                                <option value="Rocio">
                                <option value="Mariela">
                                <option value="Xiomara">
                                <option value="Heinz">
                                <option value="Elí">
                            </datalist>
                            <div class="boletaFormulario">
                                <h1>^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^</h1>
                                <div class="ctnInpBoleta">
                                    <label for="dni">DNI:</label>
                                    <input type="text" class= "inpBoleta" min="8"  id="dniBoleta" required><br>
                                    <label for="nombre">Nombre:</label>
                                    <input type="text" class= "inpBoleta" list="colaborador" name="persona" id="nomBoleta" required><br>
                                    <label for="tarea-title" required>Numero Ticket :</label>
                                    <input class="boleta inpBoleta" type="text" id='numeroTicket'><br>
                                    <label for="salida-title" required>Fecha :</label>
                                    <input class="fecha2 inpBoleta"  type="date" id='fechaBoleta'>
                                </div>
                                <div class="ctnBtnCerrar"><i class="fa-solid fa-circle-xmark" id="btnCerrar"></i></div>
                            </div>
                            <h1>^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^</h1>
                            `


    formularioBoleta.innerHTML=entradasFormulario   

    const body = document.getElementById('body')
    body.style.display='none';
    pintarFilasBoleta(objetosLSBoleta,formularioBoleta)

    

    const btnGuardar = document.createElement('button')
    btnGuardar.textContent='Guardar'
    btnGuardar.addEventListener('click',guardarBoleta)
    formularioBoleta.appendChild(btnGuardar)

    const btnImprimir = document.createElement('button')
    btnImprimir.textContent='Imprimir'
    btnImprimir.addEventListener('click',generaPDF)
    formularioBoleta.appendChild(btnImprimir)
    
    cajaFormularios.appendChild(formularioBoleta)

    const btnCerrar = document.getElementById('btnCerrar')
    btnCerrar.addEventListener('click',cerrarFrmBoleta)

    //rellenamos el input correspondiente a numeracion de ticket
    const nuevoNumeroTicket = document.getElementById('numeroTicket')
    nuevoNumeroTicket.value=Number(numeroTicket.data().ultimoNumero)+1;
    console.log('Numero de ticket Anterior:',numeroTicket.data().ultimoNumero)

}

function determinaTurno(){};

function determinaFeriado(){};

function procesarDatos(objetos){
    const nombreDia         = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}
    const lapsoMiliseg      = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos 1970 por diferencia
    const lapsoHoras        = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas
    const minutosEnteros    = (entrada,salida)=>{return (Math.round(lapsoHoras(entrada,salida)*(60))%(60))}        //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos
    const horasEnteras      = (entrada,salida)=>{return (lapsoMiliseg(entrada,salida)-lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)}
    const horasDecimales    = (entrada,salida)=>{return horasEnteras(entrada,salida) + Number((((lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)*100)/100).toFixed(2))}
    const horasMinutos      = (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+minutosEnteros(entrada,salida).toFixed(0)}
    
    objetos.forEach((obj)=>{
        obj['nombreDia']        = nombreDia(obj.title)
        obj['hora']             = horasMinutos(obj.title,obj.salida)
        obj['tiempo']           = horasDecimales(obj.title,obj.salida)
        const {tarifa}          = tarifaJornada.filter(elemt => elemt.nombre == obj.description.trim())[0]//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
        obj['importe']          = horasDecimales(obj.title,obj.salida)*tarifa;

        //console.log('lo que devuelve el filter:',tarifaJornada.filter(elemt => elemt.nombre == obj.description.trim())[0])
    })

    let objetoOrdenado=objetos.sort(function(a,b){return b.numBoleta-a.numBoleta})

    return objetoOrdenado
}

function cerrarFrmBoleta(){//error: despues de hacer la segunda boleta no se puede cerrar form boleta
    console.log('in fun cerrando la vtnEmergente...')
    const vtnEmergente = document.querySelector('.vtnEmergente')
    console.log(vtnEmergente)
    vtnEmergente.style.display="none"
    body.style.display='block';
    limpiarElemento(vtnEmergente)
    objetosLSBoleta      =[]

}

function sincronizarLocalStorage(objetos){//recibe nuevos datos lo guarda en LS y lo trae en memoria
    

    localStorage.removeItem('jornadaDatos');
    localStorage.setItem('jornadaDatos',JSON.stringify(objetos))
    objetosLS=JSON.parse(localStorage.getItem('jornadaDatos'))
}

function guardarBoleta(){//escritura en collecion boleta de FB
    console.log('Tu boleta se guaradá en Firebase, con el detalle...')
    
    let numBoleta   = document.getElementById('numeroTicket').value;
    let dniBoleta   = document.getElementById('dniBoleta').value;
    let nomBoleta   = document.getElementById('nomBoleta').value;
    let fechaBoleta = document.getElementById('fechaBoleta').value;
    let tiempoTotal = tiempoTotBoleta;
    let creado      = new Date().toLocaleDateString('en-US')+' '+new Date().toLocaleTimeString();
    let detalle     = JSON.stringify(objetosLSBoleta);
    let payStatusBol= false;
    let importeTotal= Number(document.getElementById('importeTotal').textContent);
    console.log('importe extraido de th:',importeTotal)

    guardarBoletaPago(numBoleta,dniBoleta,nomBoleta,fechaBoleta,tiempoTotal,creado,detalle,payStatusBol,importeTotal)
    actualizarFirestore(objetosLSBoleta)
    updateNumeracion('Ticket',{ultimoNumero:numBoleta})

    console.log('Documento creado el:',creado)    
    
    cerrarFrmBoleta()
}

function generaPDF(){//crea pdf error:no funciona libreria
    
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion       = document.querySelector('vtnEmergente'); // <-- Aquí puedes elegir cualquier elemento del DOM
        html2pdf()
            .set({
                margin: 5,
                filename: 'Boleta',
                //se borro image jpg, averiguar codigo origina en github del cdn html2pdf
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
        /*
        navigator.share({
            title:'probando esta nueva API',
            text:'Desde Heinz Sport SAC',
            url:'./cotizacion.pdf'
        })
    */
}

function actualizarFirestore(objeto){

    objeto.forEach(obj=>{
        let idJor =obj.id;
        updateTask(idJor,{payStatus:true})
    })
}

function pintarFilasBoleta(objetos,contenedor){//crea filas de tabla y coloca datos de local Sorage
    let tiempoTotal = objetos.reduce((total,obj)=>total+obj.tiempo,0)
    let importeTotal = objetos.reduce((total,obj)=>total+obj.importe,0)//buscar la forma de hacer ambas operaciones en uno
    console.log('tiempototal:',tiempoTotal)
    const thead     = document.createElement('thead')
    thead.innerHTML =`<tr><th>Dia</th><th>Entrada</th><th>Salida</th><th>Hora</th></tr>`
    
    const tfoot     = document.createElement('tfoot')
    
    tfoot.innerHTML =`<tr><th>Horas</th><th id="tiempoTotal">${tiempoTotal}</th><th>Importe S/</th><th id="importeTotal">${importeTotal.toFixed(2)}</th></tr>`
    const tbody     =document.createElement('tbody')
    tbody.setAttribute('id',"jornadaContainer")
    tbody.setAttribute('class',"caja")
    
    objetos.forEach((obj)=>{
        let fila        = document.createElement('tr')
        fila.classList.add('fila')
        fila.setAttribute('data-id',obj.id);

        fila.innerHTML  = `
                        <td>${obj.nombreDia}</td>
                        <td class="date">${obj.title.slice(11,16)}</td>
                        <td class="date">${obj.salida.slice(11,16)}</td>
                        <td class="hora">${obj.hora}</td>
                        `
        tbody.appendChild(fila);
    })
    contenedor.appendChild(thead)
    contenedor.appendChild(tbody)
    contenedor.appendChild(tfoot)
}