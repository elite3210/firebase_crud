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
    pintarConsultaBoleta(datosInicioLS)
} else {
    datosFirebase(queryBoletaPago)
    pintarConsultaBoleta(objetosLS)
}








function pintarConsultaBoleta(objetos){

    objetos.forEach((obj) => {
    let fila        = document.createElement('tr')
    
    fila.innerHTML  = `<input type="checkbox" class="check">
                    
                    <td>${obj.numBoleta}</td>
                    <td>${obj.nomBoleta}</td>
                    <td>${obj.fechaBoleta}</td>
                    <td>${obj.tiempoTotal}</td>
                    <td>${Math.round(obj.importe)}</td>
                    <td>${obj.payStatus}</td>            
                    <td><button class ='btn-delete fa fa-trash' id='' data-id=${obj.id}></button></td>
                    <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${obj.id}></button></td>
                    ` 
    produccionContainer.appendChild(fila);
});
}

function sincronizarLocalStorage(objetos){//recibe nuevos datos lo guarda en LS y lo trae en memoria
    

    let objetoOrdenado=objetos.sort(function(a,b){return new Date(b.fechaBoleta).getTime()-new Date(a.fechaBoleta).getTime()})
    
    localStorage.removeItem('datosBoleta');
    localStorage.setItem('datosBoleta',JSON.stringify(objetoOrdenado))
    objetosLS=JSON.parse(localStorage.getItem('datosBoleta'))
    console.log('se actualizó el LS...')
}

function datosFirebase(queryFirebase){//trae los datos de firebase
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