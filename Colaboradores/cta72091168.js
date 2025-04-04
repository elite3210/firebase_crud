import { db, traerConsulta, guardarTask } from './firebaseLaboral.js'
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { Datatable } from './dataTableAntiguo.js';
import { showMessage } from "../src/app/showMessage.js";

const dniColaborador = document.getElementById('dniUsuario').textContent;
const tabla = document.getElementById('table');

//console.log('dniUsuario:',dniColaborador)
const transaccionesLaboral = (callback) => onSnapshot(collection(db, 'TransaccionesLaboral'), callback)//trae los registro de la base de la collecion transaccioneslaborales

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



//itemsFiltradoDni=items.filter((obj)=>{return obj['values'].dniColaborador===dniColaborador})
let nombreColaborador = tarifaJornada.filter((obj) => { return obj.dni === dniColaborador })[0].nombre
//let tarifaHora        =tarifaJornada.filter((obj)=>{return obj.dni===dniColaborador})[0].tarifa//sobre la base de S/1100 mensual
//console.log('array Filter:',nombreColaborador,tarifaHora);

//las transacciones traidas filtra por persona para elaborar su estado de cuenta


const registroCompras = transaccionesLaboral((querySnapShot) => {
  let items = []
  console.log('TransaccionLaboral querySnapShot:', querySnapShot);

  if (querySnapShot) {
    querySnapShot.forEach(doc => {
      let obj = {};
      obj.id = doc.id;
      obj.values = doc.data();
      obj.values.tiempo = new Date(obj.values.fechaTransaccion).getTime();
      items.push(obj)
    })
  }
  //console.log('items:',items);
  items.sort((a, b) => b['values'].tiempo - a['values'].tiempo);
  let itemsFiltradoDni = items.filter((obj) => { return obj['values'].dniColaborador === dniColaborador })
  //itemsFiltradoDni.sort((a, b) => {return a['values'].fechaTransaccion-b['values'].fechaTransaccion});
  console.log('itemsFiltradoDni', itemsFiltradoDni);
  //console.log(`Nombre:${nombreColaborador} con DNI ${dniColaborador}`,itemsFiltradoDni);

  let totalDebe = itemsFiltradoDni.reduce((tot, obj) => tot + Number(obj['values'].importeDebe), 0);
  let totalHaber = itemsFiltradoDni.reduce((tot, obj) => tot + Number(obj['values'].importeHaber), 0);
  let saldo = totalDebe - totalHaber;
  //let saldo=objetos.reduce((tot,producto)=>tot+producto.importe,0)

  const titulo = { FECHA: 'fechaTransaccion', DESCRIPCION: 'descripcion', CARGO: 'importeDebe', ABONO: 'importeHaber' }
  const tituloFoot = { TOTAL: 'SALDO', SALDO: saldo.toFixed(2) };
  const dt = new Datatable('#dataTable', []);

  dt.setDatos(itemsFiltradoDni, titulo, tituloFoot);
  dt.renderTable();
});


function nombreDia(entrada) {
  const nombreDia = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return nombreDia[new Date(entrada).getDay()]
};

//trayendo modulo jornada a pagina personal:
//const boton     =document.getElementById('registrar');

const querySnapshot = await traerConsulta(nombreColaborador);//trade datos de la Micollecion filtrado por nombre de coladorador y con paystatus=false
const objetos = [];
let indice = 0;
let horasAcumuladas = 0;
let importeAcumuladas = 0;

querySnapshot.forEach((doc, index) => {
  let obj = {};
  obj.id = doc.id;
  obj.values = doc.data();

  obj['values'].dia = nombreDia(doc.data().title);//PEDIMOS A LA FUNCION QUE NOS DE EL NOMBRE DEL DIA SEMANA
  obj['values'].entrada = doc.data().title
  obj['values'].salida = doc.data().salida
  obj['values'].horas = tiempoTranscurrido(doc.data().title, doc.data().salida).horasMinutos;
  obj['values'].importe = (tiempoTranscurrido(doc.data().title, doc.data().salida).horasDecimal * getTarifaJornada(doc.data(), tarifaJornada, tarifaJornadaNoche, tarifaJornadaFeriado)).toFixed(2);
  //console.log('docData:',doc.data())
  objetos.push(obj);

  horasAcumuladas += tiempoTranscurrido(doc.data().title, doc.data().salida).horasDecimal;
  importeAcumuladas += Number(obj['values'].importe);
  indice += 1;
})

console.log('objetos:', objetos)

function tiempoTranscurrido(entrada, salida) {//recibe fecha con horas de entra y salida en texto y devuelve un objeto con las horas enteras y minutos separados y en decimales
  const horas = {}
  const lapsoMiliseg = (new Date(salida).getTime()) - (new Date(entrada).getTime());//calculamos los milisegundos transcurridos por diferencia

  horas.horasEnteras = Math.trunc(lapsoMiliseg / (1000 * 60 * 60));//los milisegundos pasamos a horas y que extraemos la parte entrea con math.trunc
  horas.minutosEnteros = Math.trunc(lapsoMiliseg / (1000 * 60) % 60);//los milisegundos pasamos a minutos y que extraemos el modulo de 60 con % 60 y extraemos parte entera con math.trunc
  horas.horasDecimal = lapsoMiliseg / (1000 * 60 * 60).toFixed(2);
  horas.horasMinutos = `${horas.horasEnteras}:${horas.minutosEnteros}`;
  return horas;//return objeto horas={horasEnteras:valor,minutosEnteros:valor,horasDecimal:valor,horasMinutos:valor}
};

function getTarifaJornada(objeto, arrayObj, arrayObj2, arrayObj3) {

  switch (objeto.horario) {
    case 'Regular': {
      let nombre = objeto.description
      //console.log('obj dentro funcion tarifa:', objeto.horario)
      const { tarifa } = arrayObj.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
      return tarifa
    }

      break;

    case 'Noche': {
      let nombre = objeto.description
      //console.log('obj dentro funcion tarifa:', objeto.horario)
      const { tarifa } = arrayObj2.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
      return tarifa
    }

      break;

    case 'Feriado': {
      let nombre = objeto.description
      //console.log('obj dentro funcion tarifa:', objeto.horario)
      const { tarifa } = arrayObj3.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
      return tarifa
    }

      break;

    default: {
      let nombre = objeto.description
      //console.log('obj dentro funcion tarifa:', objeto.horario)
      const { tarifa } = arrayObj.filter(elemt => elemt.nombre == nombre.trim())[0];//del objeto tarifaJornada buscar el objeto con el mismo nombre y sacar su tarifa
      return tarifa
    }

      break;
  }

}

function limpiarTabla(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
    console.log('removiendo elemento...')
  };
};

//renderizando datatable
renderDatatable(objetos)


//para guaradr los registo en firebase
const tareaForm = document.getElementById('product-form')

tareaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  limpiarTabla(tabla);

  const HoraEntrada = tareaForm['HoraEntrada'];
  const HoraSalida = tareaForm['HoraSalida'];
  const horario = tareaForm['horario'];
  let payStatus = false;


  //evitar registrar formulario vacio y guardar en firbase
  console.log('antes de evalacuacion', HoraEntrada, HoraSalida, horario)

  if (HoraEntrada.value !== '' && HoraSalida.vale !== '' && horario.value !== '') {
    let obj = {};
    obj.id = indice + 1;
    obj.values = {};

    obj['values'].dia = nombreDia(HoraEntrada.value);//PEDIMOS A LA FUNCION QUE NOS DE EL NOMBRE DEL DIA SEMANA
    obj['values'].entrada = HoraEntrada.value
    obj['values'].salida = HoraSalida.value
    obj['values'].horario = horario.value
    obj['values'].description = nombreColaborador
    obj['values'].horas = tiempoTranscurrido(HoraEntrada.value, HoraSalida.value).horasMinutos;
    obj['values'].importe = (tiempoTranscurrido(HoraEntrada.value, HoraSalida.value).horasDecimal * getTarifaJornada(obj['values'], tarifaJornada, tarifaJornadaNoche, tarifaJornadaFeriado)).toFixed(2);;
    console.log('obj:', obj);

    objetos.push(obj);
    horasAcumuladas += tiempoTranscurrido(HoraEntrada.value, HoraSalida.value).horasDecimal;
    importeAcumuladas += Number(obj['values'].importe);

    guardarTask(HoraEntrada.value, nombreColaborador, HoraSalida.value, dniColaborador, horario.value, payStatus)
    console.log(`${nombreColaborador} con DNI:${dniColaborador} ingreso ${HoraEntrada.value} salio ${HoraSalida.value} es ${horario.value} estado:${payStatus}`);
    tareaForm.reset();
    renderDatatable(objetos)
    showMessage(`Se registró hasta: ${HoraSalida.value.slice(11, 16)}`, 'success')
  } else {
    showMessage(`Error:Rellenar las horas!!!`);
  }

  //reseteando el formulario
  tareaForm.reset()
})

function renderDatatable(arrayObj) {
  //console.log('items:',items);
  arrayObj.sort((a, b) => b['values'].entrada - a['values'].entrada);

  const titulo = { TURNO: 'horario', DIA: 'dia', ENTRADA: 'entrada', SALIDA: 'salida', HORAS: 'horas', 'S/': 'importe' }
  const tituloFoot = { H: 'IMPORTE S/', B: `${Number(importeAcumuladas).toFixed(2)}`, '': 'HORAS', HORAS: horasAcumuladas.toFixed(2) };

  const dt = new Datatable('#table', []);
  dt.setDatos(arrayObj, titulo, tituloFoot);
  dt.renderTable();
}

