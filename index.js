import {guardarTask,traerTasks} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')

window.addEventListener('DOMContentLoaded',async ()=>{
    console.log(traerTasks())                 
    const tasks = await traerTasks()

    let html = ""

    tasks.forEach(doc => {
        
        const tasks = doc.data()
        html += `<tr><td>${tasks.description}</td><td>${tasks.title}</td><td>${tasks.salida}</td><td>${Math.round((new Date(`${tasks.salida}`).getTime())/(1000*60*60))-Math.round((new Date(`${tasks.title}`).getTime())/(1000*60*60))}</td></tr>`
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
   


