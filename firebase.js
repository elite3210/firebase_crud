
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import {getFirestore,collection,addDoc,getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc ,query,where,orderBy,limit} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
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
  export const guardarTask = (title,description,salida,payStatus)=>{addDoc(collection(db,'Micoleccion'),{title,description,salida,payStatus})}
  export const guardarProduct = (categoria,codigo,descripcion,active)=>{addDoc(collection(db,'Productos'),{categoria,codigo,descripcion,active})}
 
  /*funcion de firestore que trae los datos de la carpeta coleccion */
 // export const traerTasks = () => getDocs(collection(db,'Micoleccion'));

  /*creando la suscripcion que se deseara escuchar cuando los datos cambian
   crea un efecto inmediato sobre la tabla, como si se introduciera dorecto a la tabla cuando se guarda*/
  export const onGetTasks = (callback)=> onSnapshot(collection(db,'Micoleccion'),callback)
  export const onGetProduct = (callback)=> onSnapshot(collection(db,'Productos'),callback)

  /*metodo de firesote para eliminar un registro de db */
  export const deleteTask = (id)=>{deleteDoc(doc(db,'Micoleccion',id))}
  export const deleteProduct = (id)=>{deleteDoc(doc(db,'Productos',id))}

  /*metodo getDoc 'en singular' para traer un documento de firestore */
  export const traerTask = (id)=>getDoc(doc(db,'Micoleccion',id))
  export const traeroneProduct = (id)=>getDoc(doc(db,'Productos',id))

  //actualiza una documento
  export const updateProduct = (id,newFields)=>updateDoc(doc(db,'Productos',id),newFields)
  export const updateTask = (id,newFields)=>updateDoc(doc(db,'Micoleccion',id),newFields)

  // Create a reference to the cities collection
//import { collection, query, where } from "firebase/firestore";
export const traerConsulta2 = async (nombre)=>{await getDocs(query(collection(db,'Micoleccion'), where("description", "==", nombre)));}


export const traerConsulta = async (nombre)=>{

  let nombre2 = document.getElementById('nombre').value
  
  const objetos       =[]
  const querySnapshot = await getDocs(query(collection(db,'Micoleccion'), where("description", "==", nombre), where("payStatus", "==", false),orderBy('title','desc'),limit(30)));
  const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}
  const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia
  const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas
  const minutosEnteros= (entrada,salida)=>{return (lapsoHoras(entrada,salida)*(60))%(60)}         //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos
  const horasEnteras  = (entrada,salida)=>{return lapsoHoras(entrada,salida)-minutosEnteros(entrada,salida)/60}
  const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + (Math.round((minutosEnteros(entrada,salida)/60)*100))/100}
  const horasMinutos= (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+Math.trunc(minutosEnteros(entrada,salida))}
  const salario=(nombre2)=>{return {"Angela":3.39623,"Xiomara":3.125,"Mariela":3.28125,"Elí":4}.nombre2}
  
  
 
  console.log('desde funcion:',salario(nombre2))
  console.log('extraccion 3directa:',nombre2)
  console.log('extraccion directa:',2*salario.nombre2)
  let index           =0


  querySnapshot.forEach((doc) => {
    objetos.push(doc.data());
    objetos[index]['dia']=nombreDia(doc.data().title);
    objetos[index]['entrada']=doc.data().title
    objetos[index]['horas']=horasMinutos(doc.data().title,doc.data().salida);
    objetos[index]['pago']=horasDecimales(doc.data().title,doc.data().salida)*salario.Angela
    delete objetos[index].description;
    delete objetos[index].payStatus;
    delete objetos[index].title;
   
    index +=1; 
  })
  console.log(objetos)
  
  new gridjs.Grid({ 
  
    data:objetos
    
  }).render(document.getElementById('table'));
}
