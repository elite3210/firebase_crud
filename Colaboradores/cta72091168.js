import {db,traerConsulta,guardarTask} from './firebaseLaboral.js'
import {collection,onSnapshot} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {Datatable} from './dataTable.js'

const dniColaborador  =document.getElementById('dniUsuario').textContent;
const tabla           =document.getElementById('table');

console.log('dniUsuario:',dniColaborador)
const transaccionesLaboral  = (callback)=> onSnapshot(collection(db,'TransaccionesLaboral'),callback)//trae los registro de la base de la collecion transaccioneslaborales

//Datos a personalizar por pagina
let tarifaJornada=[
  {tarifa:3.6164,'dni':'72091168','nombre':'Angela',horario:'regular'},
  {tarifa:3.6857,'dni':'71338629','nombre':'Alexandra',horario:'regular'},
  {tarifa:3.6857,'dni':'71338629','nombre':'Alexandra',horario:'noche'},
  {tarifa:3.700,'dni':'71338629','nombre':'Xiomara',horario:'regular'},
  {tarifa:3.3594,'dni':'09551196','nombre':'Rocio',horario:'regular'},
  {tarifa:3.3594,'dni':'09551196','nombre':'Rocío',horario:'noche'},
  {tarifa:3.10,'dni':'70528292','nombre':'Heinz',horario:'regular'},
  {tarifa:3.595,'dni':'10216274','nombre':'Mariela',horario:'regular'},
  {tarifa:3.595,'dni':'10216274','nombre':'Mariela',horario:'noche'},
  {tarifa:4.9144,'dni':'42231772','nombre':'Elí',horario:'regular'},
  {tarifa:4.9144,'dni':'42231772','nombre':'Alison',horario:'regular'},
  {tarifa:4.5455,'dni':'80400965','nombre':'Oswaldo',horario:'noche'},
  {tarifa:4.0909,'dni':'77269606','nombre':'Paola',horario:'noche'}
]

//itemsFiltradoDni=items.filter((obj)=>{return obj['values'].dniColaborador===dniColaborador})
let nombreColaborador =tarifaJornada.filter((obj)=>{return obj.dni===dniColaborador})[0].nombre
let tarifaHora        =tarifaJornada.filter((obj)=>{return obj.dni===dniColaborador})[0].tarifa//sobre la base de S/1100 mensual
//console.log('array Filter:',nombreColaborador,tarifaHora);

//las transacciones traidas filtra por persona para elaborar su estado de cuenta

let index=0;
const registroCompras = transaccionesLaboral((querySnapShot) =>{
    let items =[]
    console.log('TransaccionLaboral querySnapShot:',querySnapShot);
    
    if(querySnapShot){
        querySnapShot.forEach(doc =>{
            let obj ={};
            obj.id=index
            obj.values=doc.data()
            items.push(obj)
            index+1;
        })
    }
    
    let itemsFiltradoDni=items.filter((obj)=>{return obj['values'].dniColaborador===dniColaborador})
    itemsFiltradoDni.sort((a, b) => b.values.fechaTransaccion-a.values.fechaTransaccion);

    console.log(`Nombre:${nombreColaborador} con DNI ${dniColaborador}`,itemsFiltradoDni);

    let totalDebe=itemsFiltradoDni.reduce((tot,obj)=>tot+Number(obj['values'].importeDebe),0);
    let totalHaber=itemsFiltradoDni.reduce((tot,obj)=>tot+Number(obj['values'].importeHaber),0);
    let saldo=totalDebe-totalHaber;
    //let saldo=objetos.reduce((tot,producto)=>tot+producto.importe,0)
    
    const titulo   = {FECHA:'fechaTransaccion',DESCRIPCION:'descripcion',CARGO:'importeDebe',ABONO:'importeHaber'}
    const tituloFoot   = {TOTAL:'SALDO',SALDO:saldo.toFixed(2)};
    const dt = new Datatable('#dataTable',[]);
    
    dt.setDatos(itemsFiltradoDni,titulo,tituloFoot);
    dt.renderTable();
});


function nombreDia(entrada){
  const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  return nombreDia[new Date(entrada).getDay()]
};

//trayendo modulo jornada a pagina personal:
//llamando a la funcion traer consulta para rellenar la tabla grid.js
//const boton     =document.getElementById('registrar');
  
const querySnapshot = await traerConsulta(nombreColaborador);
const objetos       =[];
let indice          =0;
let horasAcumuladas =0;
  
querySnapshot.forEach((doc,index) => {
    let obj={};
    obj.id=indice;
    obj.values={};
    
    obj['values'].dia     =nombreDia(doc.data().title);//PEDIMOS A LA FUNCION QUE NOS DE EL NOMBRE DEL DIA SEMANA
    obj['values'].entrada =doc.data().title
    obj['values'].salida  =doc.data().salida
    obj['values'].horas   =tiempoTranscurrido(doc.data().title,doc.data().salida).horasMinutos;
    objetos.push(obj);

    horasAcumuladas       +=tiempoTranscurrido(doc.data().title,doc.data().salida).horasDecimal;
    indice+=1;
  })

  console.log('objetos:',objetos)

  function tiempoTranscurrido(entrada,salida){//recibe fecha con horas de entra y salida en texto y devuelve un objeto con las horas enteras y minutos separados y en decimales
    const horas={}
    const lapsoMiliseg=(new Date(salida).getTime())-(new Date(entrada).getTime());//calculamos los milisegundos transcurridos por diferencia
    
    horas.horasEnteras=Math.trunc(lapsoMiliseg/(1000*60*60));//los milisegundos pasamos a horas y que extraemos la parte entrea con math.trunc
    horas.minutosEnteros=Math.trunc(lapsoMiliseg/(1000*60)%60);//los milisegundos pasamos a minutos y que extraemos el modulo de 60 con % 60 y extraemos parte entera con math.trunc
    horas.horasDecimal=lapsoMiliseg/(1000*60*60).toFixed(2);
    horas.horasMinutos=`${horas.horasEnteras}:${horas.minutosEnteros}`;
    return horas;//return objeto horas={horasEnteras:valor,minutosEnteros:valor,horasDecimal:valor,horasMinutos:valor}
  };
  
  function limpiarTabla(){
    console.log('dentro de la funcion limpiar tabla');
    while(tabla.firstChild){
        tabla.removeChild(tabla.firstChild)
        console.log('removiendo tabla...')
    };
  };

  //renderizando datatable
  const titulo      = {DIA:'dia',ENTRADA:'entrada',SALIDA:'salida',HORAS:'horas'}
  const tituloFoot  = {H:'IMPORTE S/',B:`${Number(horasAcumuladas*tarifaHora).toFixed(2)}`,'':'HORAS',HORAS:horasAcumuladas.toFixed(2)};
  const dt          = new Datatable('#table',[]);
    
    dt.setDatos(objetos,titulo,tituloFoot);
    dt.renderTable();
  //new gridjs.Grid({data:objetos}).render(tabla);
  //setTimeout(limpiarTabla,3000)

//para guaradr los registo en firebase
const tareaForm = document.getElementById('product-form')

tareaForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  limpiarTabla(tabla);

  const HoraEntrada = tareaForm['HoraEntrada'];
  const HoraSalida  = tareaForm['HoraSalida'];
  const horario     = tareaForm['horario'];
  let payStatus     = false;

  
  
  let obj={};
  obj.id=indice+1;
  obj.values={};

  obj['values'].dia     =nombreDia(HoraEntrada.value);//PEDIMOS A LA FUNCION QUE NOS DE EL NOMBRE DEL DIA SEMANA
  obj['values'].entrada =HoraEntrada.value
  obj['values'].salida  =HoraSalida.value
  obj['values'].horas   =tiempoTranscurrido(HoraEntrada.value,HoraSalida.value).horasMinutos;
  objetos.push(obj);
  horasAcumuladas+=tiempoTranscurrido(HoraEntrada.value,HoraSalida.value).horasDecimal;

  //evitar registrar formulario vacio
  console.log('antes de evlacuacion')
  if(HoraEntrada.value==='' || HoraSalida.vale==='' || horario.value ==='' ){
    return alert('completar formulario antes de enviar crj!...');
  }
  console.log('antes de evlacuacion',HoraEntrada,HoraSalida,horario)
  //registrando en la base de datos firestore
  guardarTask(HoraEntrada.value,nombreColaborador,HoraSalida.value,dniColaborador,horario.value,payStatus)
  console.log(`${nombreColaborador} con DNI:${dniColaborador} ingreso ${HoraEntrada.value} salio ${HoraSalida.value} es ${horario.value} estado:${payStatus}`)

  //renderizando datatable
  const titulo      = {DIA:'dia',ENTRADA:'entrada',SALIDA:'salida',HORAS:'horas'}
  const tituloFoot  = {H:'IMPORTE S/',B:`${Number(horasAcumuladas*tarifaHora).toFixed(2)}`,'':'HORAS',HORAS:horasAcumuladas.toFixed(2)};
  const dt          = new Datatable('#table',[]);
  dt.setDatos(objetos,titulo,tituloFoot);
  dt.renderTable();

  //reseteando el formulario
  tareaForm.reset()
})