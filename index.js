import {guardarTask,traerTasks} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')

window.addEventListener('DOMContentLoaded',async ()=>{
    console.log(traerTasks())                 
    const tasks = await traerTasks()

    let html = ""

    tasks.forEach(doc => {
        
        const tasks = doc.data()
        html += '<div><h3>$[tasks.titulo]</h3><p>${tasks.descripcion.value}</p><p>${tasks.salida.value}</p></div><br>'
    });
    
    tareasContainer.innerHTML = html
})



tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo =      tareaForm['tarea-title'];
    const descripcion = tareaForm['tarea-description'];
    const salida =      tareaForm['salida-title'];

    guardarTask(titulo.value,descripcion.value,salida.value)

    tareaForm.reset()
})
   


