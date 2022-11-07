import {guardarTask,onGetTasks, deleteTask, traerTask} from './firebase.js'

const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')


window.addEventListener('DOMContentLoaded',async ()=>{
     
    onGetTasks((querySnapshot) =>{

        /*const task = await traerTasks()*/
        let html = "";
        let contador =0;
        const dia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
        
        querySnapshot.forEach(doc =>{
            
            const task = doc.data()
            html += `<tr><td>${task.description}</td><td>${dia[`${new Date(`${task.title}`).getDay()}`]}</td><td>${task.title}</td><td>${task.salida}</td>
                    <td>${(((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))-((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))%(1000*60*60))/(1000*60*60)}
                    <span>:${((((new Date(`${task.salida}`).getTime()))-(new Date(`${task.title}`).getTime()))%(1000*60*60))/60000}</span></td>
                    <td><span></span>${((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))/(1000*60*60)/**3.125*/}</td>
                    <td><button class ='btn-delete' data-id=${doc.id}>del</button></td>
                    <td><button class ='btn-edit' data-id=${doc.id}>edit</button></td>
                    </tr>`
            
            contador += 1
            //horas += ((new Date(`${task.salida}`).getTime())-(new Date(`${task.title}`).getTime()))/(1000*60*60)
        });

        console.log('# REgistros:',contador)
        //console.log('Importe:',horas*3.125)
    
        tareasContainer.innerHTML =html;

        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')
        btnDelete.forEach(btn=>{
            btn.addEventListener('click',(e)=>{deleteTask(e.target.dataset.id)})
        })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click',(e)=>{console.log(e.target.dataset.id)});
           // btn.addEventListener('click', async(e)=>{
                //const fila = await traerTask(e.target.dataset.id)
                //console.log(fila)
            //});
             
        })
    })

    
})

/*escucha el evento submit para enviar datos del formuladrio a la base de datos firesore */

tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo =      tareaForm['tarea-title'];
    const descripcion = tareaForm['tarea-description'];
    const salida =      tareaForm['salida-title'];

    guardarTask(titulo.value,descripcion.value,salida.value)

    /*tareaForm.reset()*/
})


