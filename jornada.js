import {traerConsulta,guardarTask} from './firebase.js'


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton     =document.getElementById('boton');
let acumulador  = document.getElementById('acumulador')


boton.addEventListener('click',async(e)=>{
  e.preventDefault()
  
  let nombre      = document.getElementById('nombre').value
  
  const querySnapshot = await traerConsulta(nombre)

  const objetos       =[]
  const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}
  const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia
  const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas
  const minutosEnteros= (entrada,salida)=>{return (lapsoHoras(entrada,salida)*(60))%(60)}         //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos
  const horasEnteras  = (entrada,salida)=>{return lapsoHoras(entrada,salida)-minutosEnteros(entrada,salida)/60}
  const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + (Math.round((minutosEnteros(entrada,salida)/60)*100))/100}
  const horasMinutos= (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+Math.trunc(minutosEnteros(entrada,salida))}
  
  let index           =0
  let horasAcumuladas =0


  querySnapshot.forEach((doc) => {
    objetos.push(doc.data());
    objetos[index]['dia']=nombreDia(doc.data().title);//renombrandos los datos traidos firebase
    objetos[index]['entrada']=doc.data().title
    objetos[index]['salida_']=doc.data().salida
    objetos[index]['horas']=horasMinutos(doc.data().title,doc.data().salida);
    delete objetos[index].description;
    delete objetos[index].payStatus;
    delete objetos[index].title;
    delete objetos[index].salida;
   
    index +=1; 
    horasAcumuladas  +=horasDecimales(doc.data().title,doc.data().salida)
  })


  let acumulador = document.getElementById('acumulador')
  acumulador.innerHTML=horasAcumuladas.toFixed(2)

  
  
  
  new gridjs.Grid({data:objetos}).render(document.getElementById('table'));
 
})



//para guaradr los registo en firebase
const tareaForm = document.getElementById('tarea-form')
tareaForm.addEventListener('submit',(e)=>{
  e.preventDefault()

  const titulo        = tareaForm['tarea-title'];
  const descripcion   = tareaForm['tarea-description'];
  const salida        = tareaForm['salida-title'];
  let payStatus       = false;

  guardarTask(titulo.value,descripcion.value,salida.value,payStatus)

  tareaForm.reset()
})