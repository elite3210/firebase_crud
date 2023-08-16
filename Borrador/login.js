import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { db, auth} from "./firebase.js";


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


/*
export const traerConsulta = async (nombre)=>{
    const objetos=[]
    const querySnapshot = await getDocs(query(collection(db,'Micoleccion'), where("description", "==", nombre)));
*/
