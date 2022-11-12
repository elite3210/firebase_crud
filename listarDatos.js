import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { db, auth } from "./firebase.js";
/* collections es un metodo para escoger colleciones de la db y getDocs es para traer todos documentos de una collecion */
const tareaForm = document.getElementById('tarea-form')
const tareasContainer = document.getElementById('tareas-container')
//trae la informacion de la base de datos y los lista
const postList = document.querySelector('.posts');

//se crea una funcion para pintar datos
export const setupPosts = (data) =>{
    if(data.length){
        let html = ''
        data.forEach(doc => {
            const post =doc.data()
            //console.log(post)
            const li = `<li class='list-group-item list-group-item-action'>
                        <h5>${post.codigo}</h5>
                        <p>${post.descripcion}</p>
                        </li>`;
            html += li
        });
        postList.innerHTML=html;
    } else{
        postList.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'
    }
}

/* ver es estado de cambio de autentificacion del usuario */
/*onAuthStateChanged(auth, async (user)=>{
    if (user){
        const querySnapshot = await getDocs(collection(db,'Productos'))
        console.log(querySnapshot)
    }else{

    }
})*/

//Events
//Listar los datos del estado de cambios, mostrar si esta autentificado
/*auth.onAuthStateChanged((user)=>{
    if (user){
        fs.collection('Productos').get().then((snapshot)=>{
            console.log(snapshot.docs)
            setupPosts(snapshot.docs)
        }) 
        
    } else{
        setupPosts([])
    }
})*/