import {traerConsultaZapato} from './firebase.js'


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton=document.getElementById('boton');

boton.addEventListener('click',async(e)=>{
  e.preventDefault()
  
  let modelo = document.getElementById('modelo').value
  console.log('nombre de adevent',modelo)

  await traerConsultaZapato(modelo)
 
})