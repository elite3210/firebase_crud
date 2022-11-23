import {traerConsulta,guardarTask} from './firebase.js'


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton=document.getElementById('boton');

boton.addEventListener('click',async(nombre)=>{
  nombre.preventDefault()
  console.log('estoy dentro de addevent'+nombre)
  var nombre = document.getElementById('nombre')
  var nombre =nombre.value
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