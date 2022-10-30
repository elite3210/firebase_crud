import {guardarTask,traerTasks} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')
const total_container = document.getElementById('total_container')

window.addEventListener('DOMContentLoaded',async ()=>{
    console.log(traerTasks())                 
    const tasks = await traerTasks()

    let html = ""
    let horas =0;
    const dia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
    let lista = 'Hola'

    tasks.forEach(doc => {
        
        const tasks = doc.data()
        html += `<tr><td>${tasks.description}</td><td>${dia[`${new Date(`${tasks.title}`).getDay()}`]}</td><td>${tasks.title}</td><td>${tasks.salida}</td>
                <td>${(((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))-((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))%(1000*60*60))/(1000*60*60)}
                <span>:${((((new Date(`${tasks.salida}`).getTime()))-(new Date(`${tasks.title}`).getTime()))%(1000*60*60))/60000}</span></td>
                <td><span>S/</span>${Math.round(((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))/(1000*60*60)*3.125)}</td>
                
                </tr>`
        
        horas += ((new Date(`${tasks.salida}`).getTime())-(new Date(`${tasks.title}`).getTime()))/(1000*60*60)
    });

    console.log('Horas:',lista.substring(lista.length,2))
    console.log('Importe:',horas*3.125)
    
    tareasContainer.innerHTML = html
})



tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo =      tareaForm['tarea-title'];
    const descripcion = tareaForm['tarea-description'];
    const salida =      tareaForm['salida-title'];

    guardarTask(titulo.value,descripcion.value,salida.value)

    tareaForm.reset()
    tareasContainer.reset()
})


