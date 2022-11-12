
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import {getFirestore,collection,addDoc,getDocs,onSnapshot,deleteDoc,doc,getDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration

  const firebaseConfig = {
    apiKey: "AIzaSyBfxYYrvBKbDEt0VNmFAyLGaSS9WzbMx6A",
    authDomain: "fir-crud-b6554.firebaseapp.com",
    projectId: "fir-crud-b6554",
    storageBucket: "fir-crud-b6554.appspot.com",
    messagingSenderId: "117285018947",
    appId: "1:117285018947:web:e08ffbe2963e5fe2d0e3f6"
  };

  // Initialize Firebase
  export const app  = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db   = getFirestore();

  /*Save a New Task in Firestore*/ 
  export const guardarTask = (title,description,salida)=>{addDoc(collection(db,'Micoleccion'),{title,description,salida})}
 
  /*funcion de firestore que trae los datos de la carpeta coleccion */
  export const traerTasks = () => getDocs(collection(db,'Micoleccion'));

  /*creando la suscripcion que se deseara escuchar cuando los datos cambian
   crea un efecto inmediato sobre la tabla, como si se introduciera dorecto a la tabla cuando se guarda*/
  export const onGetTasks = (callback)=> onSnapshot(collection(db,'Micoleccion'),callback)

  /*metodo de firesote para eliminar un registro de db */
  export const deleteTask = (id)=>{deleteDoc(doc(db,'Micoleccion',id))}

  /*metodo getDoc 'en singular' para traer un documento de firestore */
  export const traerTask = (id)=>{getDoc(doc(db,'Micoleccion',id))}