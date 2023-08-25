import {queryBoletaPago} from './firebase.js'


//traer los registros de produccion de firebase
const produccionContainer = document.getElementById('produccionContainer')

let tarifaJornada=[
    {'tarifa':3.5738,'dni':'72091168','nombre':'Angela'},
    {'tarifa':3.6719,'dni':'71338629','nombre':'Alexandra'},
    {'tarifa':3.3594,'dni':'09551196','nombre':'Rocio'},
    {'tarifa':3.0000,'dni':'70528292','nombre':'Heinz'},
    {'tarifa':3.3594,'dni':'10216274','nombre':'Mariela'},
    {'tarifa':4.9144,'dni':'42231772','nombre':'Elí'}
]
let objetosLS =''
let datosInicioLS = JSON.parse(localStorage.getItem('datosBoleta'))

let activarLS = false

if (activarLS) {
    pintarFilas(datosInicioLS)
    
} else {
    datosFirebase(queryBoletaPago)
    pintarFilas(objetosLS)
    
}








function pintarFilas(array){

    array.forEach((obj,i) => {
    let fila        = document.createElement('tr')
    fila.setAttribute('class','fila')
    fila.setAttribute('data-id',`${i}`)

    
    fila.innerHTML  = `<input type="checkbox" class="check">
                    
                    <td>${obj.numBoleta}</td>
                    <td>${obj.nomBoleta}</td>
                    <td>${obj.fechaBoleta}</td>
                    <td>${obj.tiempoTotal.toFixed(2)}</td>
                    <td>${obj.importe.toFixed(2)}</td>
                    <td>${obj.payStatus}</td>            
                    ` 
    produccionContainer.appendChild(fila);
    
    });
    eventoClickFila()
}

function sincronizarLocalStorage(objetos){//recibe nuevos datos lo guarda en LS y lo trae en memoria
    

    let objetoOrdenado=objetos.sort(function(a,b){return new Date(b.fechaBoleta).getTime()-new Date(a.fechaBoleta).getTime()})
    
    localStorage.removeItem('datosBoleta');
    localStorage.setItem('datosBoleta',JSON.stringify(objetoOrdenado))
    objetosLS=JSON.parse(localStorage.getItem('datosBoleta'))
    console.log('se actualizó el LS...')
}

function datosFirebase(queryFirebase){//trae los datos de firebase y los guarda en LocalStorage
    console.log('query que se trajo de Firebase:',queryBoletaPago)
    let array =[]

    queryFirebase.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        const objeto        = doc.data()
        objeto.id           = doc.id 
        array.push(objeto)
    })
    sincronizarLocalStorage(array)
}

function eventoClickFila(){//pinta la fila si se hace check
    vtnDetalle.innerHTML=''
    const btnCheck = produccionContainer.querySelectorAll('.check')
    const btnFila = produccionContainer.querySelectorAll('.fila')
    btnFila.forEach(fila=>{
        fila.addEventListener('click',(e)=>{
            let id = fila.getAttribute('data-id')
            if(fila.firstChild.checked){
                fila.setAttribute('class','filaSeleccionada')
                pintarOpciones(id)

            }else{fila.setAttribute('class','fila')
            }
        })
    })
}

function pintarOpciones(id){//crea la cinta de opciones para la fila seleccionada
    const cajaOpciones = document.getElementById('cajaOpciones')
    //let filaPciones = document.createElement('tr')
    //cajaOpciones.appendChild(filaPciones)
    
    cajaOpciones.innerHTML=`
                        <button class="btn-boleta fa-solid fa-receipt" data-id='${id}' id='btnBoleta' ></button>
                        <button class ='btn-delete fa fa-trash' data-id='${id}'></button>
                        <button class ='btn-pagar fa fa-hand-holding-dollar' data-id='${id}' value='${id}' color='transparent'></button>
                        <button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id='${id}'></button>
                        `
    //eventoClickPagar()
    //eventoClickEliminar()
    //eventoClickEditar()
    eventoClickBoleta()
}

function eventoClickBoleta(){
    const btnBoleta         = document.getElementById('btnBoleta')
    let id = btnBoleta.getAttribute('data-id')
    
    btnBoleta.addEventListener('click',crearBoleta)
}

function crearBoleta(){//comentario
    const btnBoleta         = document.getElementById('btnBoleta')
    let id = btnBoleta.getAttribute('data-id')

    let detalle=JSON.parse(objetosLS[id].detalle)
    console.log('El detalle es:',detalle)

    pintarFilasDetalle(detalle)
}

function pintarFilasDetalle(array){
    
    const vtnDetalle = document.getElementById("vtnDetalle")
    vtnDetalle.innerHTML=''
    const divSuperior = document.createElement('div')
    divSuperior.setAttribute('class','divSuperior')
    const qr = document.createElement('div')
    qr.setAttribute('id','qr')
    const img=document.createElement('img')
    const divTicket=document.createElement('div')
    divTicket.setAttribute('class','divTicket')
    divTicket.textContent='TICKET TIEMPO'
    img.setAttribute('src',"https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=100x100")
    img.setAttribute('width','60px')
    qr.appendChild(img)
    const nombreDoc = document.createElement('div')
    nombreDoc.setAttribute('id','nombreDoc')
    nombreDoc.appendChild(divTicket)
    const divMedio = document.createElement('div')
    divMedio.setAttribute('class','divMedio')
    const divFecha = document.createElement('div')
    divFecha.setAttribute('class','divFecha')
    divFecha.textContent=new Date(Date.now()).toLocaleDateString()
     
    divSuperior.appendChild(qr)
    divSuperior.appendChild(nombreDoc)
    const divInput = document.createElement('div')
    divInput.setAttribute('class','divImput')
    const nombre = document.createElement('div')
    nombre.textContent='Angela'
    const DNI = document.createElement('div')
    DNI.textContent='72091168'
    divInput.appendChild(nombre)
    divInput.appendChild(DNI)
    divMedio.appendChild(divInput)
    divMedio.appendChild(divFecha)
    divSuperior.appendChild(nombreDoc)
    const tblDetalle = document.createElement("table")
    tblDetalle.setAttribute('id','tblDetalle')
    vtnDetalle.appendChild(divSuperior)
    vtnDetalle.appendChild(divMedio)
    
    const tbody = document.createElement("tbody")
    let thead       = document.createElement('thead')
    let tfoot       = document.createElement('tfoot')
    thead.innerHTML=`<tr><th>Dia</th><th>Entrada</th><th>Salida</th><th>Horas</th></tr>`
    tfoot.innerHTML=`<tr><th>Horas</th><th>64</th><th>Importe</th><th>S/235</th></tr>`

    array.forEach((obj,i) => {
    let fila        = document.createElement('tr')
    //fila.setAttribute('class','fila')
    //fila.setAttribute('data-id',`${i}`)
    
    fila.innerHTML  = `
                    <td>${obj.nombreDia}</td>
                    <td>${obj.title.slice(11,16)}</td>
                    <td>${obj.salida.slice(11,16)}</td>
                    <td>${obj.hora}</td>
                    ` 
    tbody.appendChild(fila);
    });

    
    tblDetalle.appendChild(thead)
    tblDetalle.appendChild(tbody)
    tblDetalle.appendChild(tfoot)
    vtnDetalle.appendChild(tblDetalle)
    //eventoClickFila()
}