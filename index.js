import {guardarTask,traerTasks,onSnapshot, collection,db} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')


window.addEventListener('DOMContentLoaded',async ()=>{
     
    onSnapshot(collection(db,'Micoleccion'),(querySnapshot)=>{

        /*const task = await traerTasks()*/
        let html = "";
        let horas =0;
        const dia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
        
        querySnapshot.forEach(doc =>{
            
            const task = doc.data()
            html += `<tr><td>${task.description}</td><td>${dia[`${new Date(`${task.title}`).getDay()}`]}</td><td>${task.title}</td><td>${task.salida}</td>
                    <td>${(((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))-((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))%(1000*60*60))/(1000*60*60)}
                    <span>:${((((new Date(`${task.salida}`).getTime()))-(new Date(`${task.title}`).getTime()))%(1000*60*60))/60000}</span></td>
                    <td><span></span>${((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))/(1000*60*60)/**3.125*/}</td>
                    
                    </tr>`
            
            horas += ((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))/(1000*60*60)
        });

        /*console.log('Horas:',lista.substring(lista.length,2))
        console.log('Importe:',horas*3.125)*/
    
        tareasContainer.innerHTML =html
    })

    
})



tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo =      tareaForm['tarea-title'];
    const descripcion = tareaForm['tarea-description'];
    const salida =      tareaForm['salida-title'];

    guardarTask(titulo.value,descripcion.value,salida.value)

    tareaForm.reset()
})


