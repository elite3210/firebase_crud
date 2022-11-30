import {traerConsulta,guardarTask} from './firebase.js'


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton=document.getElementById('boton');


boton.addEventListener('click',async(e)=>{
  e.preventDefault()
  
  let nombre = document.getElementById('nombre').value
  let acumulador = document.getElementById('acumulador')
  acumulador.innerHTML=traerConsulta(nombre).horasAcumuladas
  

  console.log('nombre de adevent',nombre)
 
  console.log('nombre de adevent value', nombre)
  await traerConsulta(nombre)
 
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