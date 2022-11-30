import {guardarTask,onGetTasks,deleteTask,traerTask} from './firebase.js'


const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')

export const registroTrabajadores = traerTask((querySnapshot) =>{
    console.time('tiempo consulta')
    if(querySnapshot){
        console.log('estoy dentro del if de registrotrabajadores')
        let html = "";
        let contador =0;
        
        const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}

        const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia

        const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas

        const minutosEnteros= (entrada,salida)=>{return (lapsoHoras(entrada,salida)*(60))%(60)}         //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos

        const horasEnteras  = (entrada,salida)=>{return lapsoHoras(entrada,salida)-minutosEnteros(entrada,salida)/60}

        const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + (Math.round((minutosEnteros(entrada,salida)/60)*100))/100}

        const horasMinutos= (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+minutosEnteros(entrada,salida)}
   
        querySnapshot.forEach(doc =>{
            
            const fila = doc.data()
            html += `<tr><td>${fila.description}</td>
                        <td>${nombreDia(`${fila.title}`)}</td>
                        <td>${fila.title}</td>
                        <td>${fila.salida}</td>
                        <td>${horasMinutos(`${fila.title}`,`${fila.salida}`)}</td>
                        <td><span></span>${horasDecimales(`${fila.title}`,`${fila.salida}`)}</td>
                        <td><button class ='btn-delete' data-id=${doc.id}>del</button></td>
                        <td><button class ='btn-edit' data-id=${doc.id}>edit</button></td>
                    </tr>`
            
            contador += 1
            //horas += ((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))/(1000*60*60)
            
        });
        console.timeEnd('tiempo consulta')
        console.log('# REgistros:',contador)
        //console.log('Importe:',horas*3.125)
        tareasContainer.innerHTML =html;

        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')
            btnDelete.forEach(btn=>{
                btn.addEventListener('click',(e)=>{deleteTask(e.target.dataset.id)})
            })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', async (e)=>{
            
                console.log('id del boton edit:',ie.target.dataset.id);

                const doc = await traerTask(e.target.dataset.id);
                const task = doc.data()
                console.log(task)
                tareaForm['tarea-title'].value=task.title;
                tareaForm['tarea-description'].value=task.description;
                tareaForm['salida-title'].value=task.salida;
                tareaForm['payStatus'].value=task.payStatus;


                })
        });
             
    } else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})





/*
onAuthStateChanged(auth, async (user)=>{
    if (user){
        window.addEventListener('DOMContentLoaded',async ()=>{ 
        const planillaRef = collection(db,'Micollecion')
        const q = query(planillaRef, where("description", "==", "Xiomara"))
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
    })
    }else{
        console.log('Registrarse para ver los datos')
    }
})
*/


//window.addEventListener('DOMContentLoaded',async ()=>{ await registroTrabajadores(querySnapshot)})

/*escucha el evento submit para enviar datos (nombre,fecha de inicio y, fecha de salida ) del formuladrio a la base de datos firesore */

tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo        = tareaForm['tarea-title'];
    const descripcion   = tareaForm['tarea-description'];
    const salida        = tareaForm['salida-title'];
    let payStatus       = false;

    guardarTask(titulo.value,descripcion.value,salida.value,payStatus)

    tareaForm.reset()
})


