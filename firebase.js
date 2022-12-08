
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import {getFirestore,collection,addDoc,getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc ,query,where,orderBy,limit,setDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
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

  const productRef  = collection(db,'Productos')
  const ventasRef   =collection(db,'Ventas')



  /*Save a New Task in Firestore*/ 
  export const guardarTask = (title,description,salida,payStatus)=>{addDoc(collection(db,'Micoleccion'),{title,description,salida,payStatus})}
  export const guardarVenta = (cliente,vendedor,productoVendido,cantidad)=>{addDoc(ventasRef,{cliente,vendedor,productoVendido,cantidad})}
  export const guardarProduct = async (imagen,categoria,nombre,costo,stock,unidad,precio_anterior,precio,activo,descripcion)=>{await setDoc(doc(productRef,'TT0071'),{imagen,categoria,nombre,costo,stock,unidad,precio_anterior,precio,activo,descripcion})}
 
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
  export const traeroneProduct = (id)=> getDoc(doc(db,'Productos',id))

  //actualiza una documento
  export const updateProduct = (id,newFields)=>updateDoc(doc(db,'Productos',id),newFields)
  export const updateTask = (id,newFields)=>updateDoc(doc(db,'Micoleccion',id),newFields)

  // Create a reference to the cities collection
//import { collection, query, where } from "firebase/firestore";
export const queryProductos = (nombre)=>getDocs(query(collection(db,'Productos'), where("web_site", "==", true)));


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
  let horasAcumuladas =0


  querySnapshot.forEach((doc) => {
    objetos.push(doc.data());
    objetos[index]['dia']=nombreDia(doc.data().title);
    objetos[index]['entrada']=doc.data().title
    objetos[index]['salida_']=doc.data().salida
    objetos[index]['horas']=horasMinutos(doc.data().title,doc.data().salida);
    delete objetos[index].description;
    delete objetos[index].payStatus;
    delete objetos[index].title;
    delete objetos[index].salida;
   
    index +=1; 
    horasAcumuladas  +=horasDecimales(doc.data().title,doc.data().salida)
  })

  let acumulador = document.getElementById('acumulador')
  acumulador.innerHTML=horasAcumuladas.toFixed(2)

  
  
  
  new gridjs.Grid({ 
  
    data:objetos
    
  }).render(document.getElementById('table'));
}

/*

const citiesRef = collection(db, "cities");

await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
await setDoc(doc(citiesRef, "LA"), {
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
await setDoc(doc(citiesRef, "DC"), {
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
await setDoc(doc(citiesRef, "TOK"), {
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
await setDoc(doc(citiesRef, "BJ"), {
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });


const productosRef = collection(db, "Productos");

await setDoc(doc(productosRef, "SB0070"), {
            name: "Sorbetes clasico rayado", 
            precio: 13, 
            Stock: 780,
            web_site: false, 
            Categoria: 'Descartables',
            atributos: ["22cm", "blanco"] 
});
*/
/*
const productosRef = collection(db, "Productos");

await setDoc(doc(productosRef,"PB0070"),
  {
    unidad: "Caja",
    precio: 180,
    categoria: "Piñateria",
    imagen: "img/paliglobos desarmables base.jpg",
    precio_anterior: 200,
    descripcion: "Paliglobos desarmables base tra",
    stock: 5,
    activo: 1,
    nombre: "Paliglobos desarmables base",
    web_site: 1,
    costo:6,
    almacen: "Chimpu",
    atributos: ["Blanco","22cm"]
  })

  
  await setDoc(doc(productosRef,"SB0070"),
  {
    nombre: "Sorbetes rayados clásico ",
    precio_anterior: 14,
    unidad: "Planchas",
    activo: 1,
    precio: 13,
    stock: 750,
    categoria: "Descartables",
    almacen: "Chimpu",
    descripcion: "Sorbetes clásico surtido",
    web_site: 1,
    imagen: "img/sorbetes_rayados_clasicos.jpg",
    atributos: ["Surtido","22cm"]
  })
  await setDoc(doc(productosRef,"SB0050"),
  {

    web_site: 1,
    almacen: "fabrica17",
    imagen: "img/sorbetes_monocolor_clasicos.jpg",
    stock: 20,
    precio_anterior: 13,
    precio: 12.5,
    nombre: "Sorbete monocolor clasicos",
    descripcion: "Sorbetes monocolor clásicos",
    unidad: "Planchas",
    activo: 1,
    categoria: "Descartables",
    costo:6,
    atributos: ["Surtido","22cm"]
  })
  await setDoc(doc(productosRef,"ST0070"),
  {
    unidad: "Planchas",
    stock: 110,
    web_site: true,
    imagen: "img/sorbeton.jpg",
    precio: 32,
    activo: 1,
    precio_anterior: 38,
    almacen: "fabrica17",
    descripcion: "Sorbetones corte recto ",
    categoria: "Descartables ",
    nombre: "Sorbeton recto",
    costo:6,
    atributos: ["Surtido","22cm"]
  })
  await setDoc(doc(productosRef,"PG0070"),
  {
    nombre: "Paliglobos gruesos #40",
    activo: 1,
    unidad: "Millares",
    descripcion: "Paliglobos gruesos #40 Trans",
    precio: 132,
    costo:6,
    categoria: "Piñateria",
    stock: 90,
    precio_anterior: 142,
    web_site: 1,
    imagen: "img/paliglobos_gruesos40.png",
    almacen:'Chimpu',
    atributos: ["Transparente","22cm"]
  })
  await setDoc(doc(productosRef,"PD0070"),
  {
    categoria: "Piñateria",
    imagen: "img/paliglobos_delgados.jpg",
    precio: 39,
    activo: 1,
    descripcion: "Paliglobos delgados",
    stock: 100,
    nombre: "Paliglobos delgados",
    unidad: "Millares",
    precio_anterior: 42,
    web_site: 1,
    costo:6,
    almacen:'Chimpu',
    atributos: ["Transparente","22cm"]
  })
  await setDoc(doc(productosRef,"SF0010"),
  {
    imagen: "img/sorbete_flexible_rayado.jpg",
    web_site: 1,
    precio_anterior: 32,
    stock: 5,
    activo: 1,
    nombre: "Sorbetes flexifles rayados",
    descripcion: "Sorbetes flexibles rayados",
    unidad: "Planchas",
    categoria: "Descartables",
    precio: 1,
    costo:6,
    almacen:'Chimpu',
    atributos: ["Transparente","22cm"]
  })
  await setDoc(doc(productosRef,"PPH030"),
  {
    unidad: "Kilos",
    imagen: "img/polipropileno.jpg",
    precio_anterior: 7.8,
    stock: 3250,
    activo: 1,
    nombre: "Polipropileno Virgen Extrusion",
    precio: 6.5,
    categoria: "Material",
    descripcion: "Polipropileno Virgen Extrusion",
    costo:7.8,
    web_site: 0,
    atributos: ["Transparente","Granulos"]
  })
  await setDoc(doc(productosRef,"SB0051"),
  {
    unidad: "Planchas",
    nombre: "Sorbetes monocolor negro",
    stock: 102,
    precio_anterior: 13,
    categoria: "Descartables",
    almacen: "fabrica17",
    descripcion: "Sorbetes monocolor negro",
    precio: 12.5,
    costo:6,
    web_site: 1,
    activo: 1,
    imagen: "img/sorbetes_monocolor_negro.jpg",
    atributos: ["Negro","22cm"]
  })
  await setDoc(doc(productosRef,"SD0070"),
  {
    precio_anterior: 33,
    categoria: "Descartables",
    almacen: "fabrica17",
    imagen: "img/sorbetes_forrados_papel.jpg",
    unidad: "Planchas",
    descripcion: "Sorbetes Forrados papel",
    precio: 32,
    activo: 1,
    nombre: "Sorbetes forrados papel",
    web_site: true,
    stock: 2,
    costo:27.5,
    atributos: ["Blanco","22cm"]

  })


PD0070x
SB0070x
SB0050x
ST0070x
PG0070x
PD0070
SF0010x
PPH030x
SB0051x
SD0070x
*/