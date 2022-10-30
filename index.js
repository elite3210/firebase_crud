import {guardarTask,traerTasks} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')

const tareasContainer = document.getElementById('tareas-container')

window.addEventListener('DOMContentLoaded',async ()=>{
    console.log(traerTasks())                 
    const tasks = await traerTasks()

    let html = ""

    tasks.forEach(doc => {
        
        const tasks = doc.data()
        suma =64
        html += `<tr><td>${tasks.description}</td><td>${tasks.title}</td><td>${tasks.salida}</td>
                <td>${(((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))-((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))%(1000*60*60))/(1000*60*60)}
                <span>:${((((new Date(`${tasks.salida}`).getTime()))-(new Date(`${tasks.title}`).getTime()))%(1000*60*60))/60000}</span>
                </td><td>${suma}</td></tr>`
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
   


