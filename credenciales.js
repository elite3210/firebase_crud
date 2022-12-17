import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { db, auth} from "./firebase.js";
import {guardarTask,onGetTasks,deleteTask,traerTask,updateTask} from './firebase.js'
//import { setupPosts } from "./main_2.js";
//import { registroTrabajadores } from "./index.js";

import { getDocs, collection,query,where} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

 /* signup  script */
const signupform = document.querySelector('#signup-form')
let editStatus=false;
let id=''

signupform.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value

    const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
    console.log(userCredentials)
    signupform.reset()
})

    /* signin o login script */
const signinform = document.querySelector('#login-form')

signinform.addEventListener('submit',async (e)=>{
    e.preventDefault();

    const email     = document.querySelector('#login-email').value
    const password  = document.querySelector('#login-password').value
        
    const credentials = await signInWithEmailAndPassword(auth, email,password)
        signupform.reset()
        console.log('sesion iniciada')
         
    })

/* signout o logout script */
const logout = document.querySelector('#logout')

logout.addEventListener('click', async(e)=>{
    await signOut(auth)
    console.log('sesion terminada')

})



/*
onAuthStateChanged(auth, async (user)=>{
    if (user){
        window.addEventListener('DOMContentLoaded', async ()=>{ 
      //  const querySnapshot = await getDocs(collection(db,'Micollecion'))
        registroTrabajadores(querySnapshot.docs)
        //console.log(querySnapshot.docs)
    })
    }else{
        console.log('Registrarse para ver los datos')
    }
})



export const traerConsulta = async (nombre)=>{
    const objetos=[]
    const querySnapshot = await getDocs(query(collection(db,'Micoleccion'), where("description", "==", nombre)));
*/

onAuthStateChanged(auth, async (user)=>{
    if (user){
        window.addEventListener('DOMContentLoaded',()=>{ 
        console.log('estoy dentro del user true')
       // const querySnapshot = await getDocs(query(collection(db,'Micoleccion'), where("description", "==", 'Xiomara')));
        registroTrabajadores()
        //console.log(querySnapshot.docs)
    })
   }else{
       console.log('User False, Registrarse para ver los datos')
   }
})






const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')

const registroTrabajadores = onGetTasks((querySnapshot) =>{
    console.time('tiempo consulta')
    if(querySnapshot){
        console.log('estoy dentro del if de registrotrabajadores')
        let html = "";
        let contador =0;

        const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}

        const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia

        const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas

        const minutosEnteros= (entrada,salida)=>{return (Math.round(lapsoHoras(entrada,salida)*(60))%(60))}        //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos

        const horasEnteras  = (entrada,salida)=>{return (lapsoMiliseg(entrada,salida)-lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)}

        const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + Math.trunc((lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)*100)/100}

        const horasMinutos= (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+minutosEnteros(entrada,salida)}
        let registros=[]
      
        querySnapshot.forEach(doc =>{
            let id =doc.id
            const fila = doc.data()
            fila.id=id
            registros.push(fila)
            
            contador += 1
            //horas += ((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))/(1000*60*60)
            
        });

        let sinPago= registros.filter((jornada)=>{return jornada.title>'2022-12-12T08:00' & jornada.description=='Mariela'} )
        console.log(sinPago)
        sinPago.forEach(jornada=>{

            html += `<tr><td>${jornada.description}</td>
                        <td>${nombreDia(`${jornada.title}`)}</td>
                        <td>${jornada.title}</td>
                        <td>${jornada.salida}</td>
                        <td>${horasMinutos(`${jornada.title}`,`${jornada.salida}`)}</span></td>
                        <td>${horasDecimales(`${jornada.title}`,`${jornada.salida}`)}</td>
                        <td>${jornada.payStatus}</td>
                        
                        <td><button class ='btn-delete' data-id=${jornada.id}>del</button></td>
                        <td><button class ='btn-edit' data-id=${jornada.id}>edit</button></td>
                    </tr>`
            
        })


        console.timeEnd('tiempo consulta')
        
        
        //console.log('Importe:',horas*3.125)
    
        tareasContainer.innerHTML =html;

        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')
            btnDelete.forEach(btn=>{
                btn.addEventListener('click',(e)=>{deleteTask(e.target.dataset.id)})
            })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', async (e)=>{
                
                id=e.target.dataset.id;
                const doc =await traerTask(e.target.dataset.id);
                let tarea=doc.data()

                tareaForm['tarea-title'].value=tarea.title;
                tareaForm['tarea-description'].value=tarea.description;
                tareaForm['salida-title'].value=tarea.salida;
                tareaForm['payStatus'].value=tarea.payStatus 


                editStatus=true;
                tareaForm['boton-task-save'].innerHTML='Actualizar'
                })
        });
             
    } else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})

tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const titulo        = tareaForm['tarea-title'];
    const descripcion   = tareaForm['tarea-description'];
    const salida        = tareaForm['salida-title'];
    let payStatus       = tareaForm['payStatus'];
    
if(!editStatus){
    guardarTask(titulo.value,descripcion.value,salida.value,payStatus)

}else{
    updateTask(id,{title:titulo.value,description:descripcion.value,salida:salida.value,payStatus:payStatus.value})
    editStatus=false
    tareaForm['boton-task-save'].innerHTML='Registrar'
}
    

    tareaForm.reset()
})
