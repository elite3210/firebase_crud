import {boletaPagoRef,onGetBoletapago} from './firebase.js'
import {getDocs,query,where} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { Datatable } from './dataTable.js';

datosFirebase();

async function datosFirebase(){//trae los datos de firebase y los guarda en LocalStorage
    let items =[]
    const queryBoletaPago  = await onGetBoletapago((boletaSnapShot)=>{
    //console.log('query que se trajo de Firebase_:',queryBoletaPago)
    boletaSnapShot.forEach((doc) => {
        const objeto={};
        objeto.id                       = doc.id; 
        objeto['values']                = doc.data();
        objeto['values'].tiempoTotal    = Number(objeto['values'].tiempoTotal).toFixed(2);
        objeto['values'].importe        = `S/${Number(objeto['values'].importe).toFixed(2)}`;
        objeto['values'].estado        = objeto['values'].payStatus==false?`<div class="corona"><div class="progress-adelantado" title="hola mundo" style="width:50%;"></div></div>`:`<span class="cancelado"></span>`;
        items.push(objeto)
    })

    items.sort((a,b)=> b['values'].numBoleta - a['values'].numBoleta)
    //sincronizarLocalStorage(items);
    pintarTabla(items);
})
};

function pintarTabla(array){//renderiza la tabla
    const titulo = { NUMERO: 'numBoleta', NOMBRE: 'nomBoleta', FECHA: 'fechaBoleta', HORAS:'tiempoTotal', IMPORTE: 'importe',ESTADO:'estado'};
    const toolsHeader=[
        {
        id: 'btnNew',text: 'nuevo', icon: 'overview', targetModal:'#myModal', action: function () {const item = dt.getSelected();crearBoleta(item);}
        }
    ]

    const dt = new Datatable('#dataTable',toolsHeader);
    dt.setData(array, titulo);
    dt.makeTable2();
};

function crearBoleta(item){//prepra para pasar los datos a pintarFilasDetalle
    console.log('__item:',item);
    let detalle     =JSON.parse(item['values'].horasTrabajadas);
    console.log('__Detalle boleta:',detalle);
    pintarTablaDetalle(detalle,item);
};

function pintarTablaDetalle(array,item){//renderiza el detalle de horasTrabajas en cada boleta
    
    let importe=array.reduce((acc, obj) => acc + obj['values'].importe, 0);
    let horas=array.reduce((acc, obj) => acc + obj['values'].tiempo, 0);
    
    //const vtnDetalle = document.getElementById("vtnDetalle")
    const vtnDetalle = document.querySelector(".modal-body")//se debe llamar al body del modal para rellenarlo, previament el boton debe renderizar el modal
    vtnDetalle.innerHTML='';
    const divSuperior = document.createElement('div')
    divSuperior.setAttribute('class','divSuperior')
    const qr = document.createElement('div')
    qr.setAttribute('id','qr')
    const img=document.createElement('img')
    const divTicket=document.createElement('div')
    divTicket.setAttribute('class','divTicket')
    divTicket.innerHTML=`<h6>TICKET TIEMPO</h6><h6>${item['values'].numBoleta}</h6>`
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
    divFecha.textContent=`FECHA: ${new Date(item['values'].fechaBoleta+'T12:00:00Z').toLocaleDateString()}`;
    //divFecha.textContent=new Date(Date.now()).toLocaleDateString()
     
    divSuperior.appendChild(qr)
    divSuperior.appendChild(nombreDoc)
    const divInput = document.createElement('div')
    divInput.setAttribute('class','divImput')
    const nombre = document.createElement('div')
    
    const DNI = document.createElement('div')
    //DNI.textContent='72091168'
    divInput.appendChild(nombre)
    divInput.appendChild(DNI)
    divMedio.appendChild(divInput)
    divMedio.appendChild(divFecha)
    divSuperior.appendChild(nombreDoc)
    const tblDetalle = document.createElement("table")
    tblDetalle.setAttribute('id','tblDetalle')
    vtnDetalle.appendChild(divSuperior)
    vtnDetalle.appendChild(divMedio)
    
    const tbody     = document.createElement("tbody")
    let thead       = document.createElement('thead')
    let tfoot       = document.createElement('tfoot')
    thead.innerHTML =`<tr><th>Turno</th><th>Dia</th><th>Entrada</th><th>Salida</th><th>Horas</th></tr>`
    tfoot.innerHTML =`<tr><th>Horas</th><th id="celdaHoras">${horas.toFixed(2)}</th><th>Importe</th><th></th><th id="celdaImporte">${importe.toFixed(2)}</th></tr>`
    
    
    array.forEach((obj,i) => {
    let fila        = document.createElement('tr')
    
    fila.innerHTML  = `
                    <td>${obj['values'].horario}</td>
                    <td>${obj['values'].nombreDia}${obj['values'].salida.slice(7,10)}</td>
                    <td>${obj['values'].title.slice(11,16)}</td>
                    <td>${obj['values'].salida.slice(11,16)}</td>
                    <td>${obj['values'].hora}</td>
                    ` 
    tbody.appendChild(fila);
});
nombre.textContent=`NOMBRE: ${item['values'].nomBoleta}`;

    tblDetalle.appendChild(thead)
    tblDetalle.appendChild(tbody)
    tblDetalle.appendChild(tfoot)
    vtnDetalle.appendChild(tblDetalle)
    //eventoClickFila()
};

function sincronizarLocalStorage(objetos){//recibe nuevos datos lo guarda en LS y lo trae en memoria
    localStorage.removeItem('datosBoleta');
    localStorage.setItem('datosBoleta',JSON.stringify(objetos));
    objetosLS=JSON.parse(localStorage.getItem('datosBoleta'));
    console.log('se actualizó el LS...');
};