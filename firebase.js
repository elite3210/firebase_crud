  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import {getFirestore,collection,addDoc,getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc,query,where,orderBy,limit,setDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
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

  const numeracionRef =collection(db,'Numeracion')
  const productRef    =collection(db,'Productos')
  const ventasRef     =collection(db,'Ventas')
  const cotizacionRef =collection(db,'Cotizacion')
  const comprasRef =collection(db,'Compras')
  const sociosRef     =collection(db,'Socios')
  export const produccionRef =collection(db,'Produccion')
  export const jornadaRef    =collection(db,'Micoleccion')
  export const boletaPagoRef =collection(db,'BoletaPago')
  export const diario2023Ref =collection(db,'Diario2023')
  const cta41110      =collection(db,'41110')
  console.log('Modulo Firebase.js trabajando... Inicio:')

//sospecho que todo lo que sigue abajo los exportados deben implementarse en su respectivo modulo, ya que se ejecuta varias veces con cada pagina

  /*Save a New registro in Firestore con metodo addDoc()*/ 
  export const guardarTask        = (title,description,salida,payStatus)=>{addDoc(collection(db,'Micoleccion'),{title,description,salida,payStatus})}
  export const guardarVenta       = (cliente,vendedor,productoVendido,cantidad)=>{addDoc(ventasRef,{cliente,vendedor,productoVendido,cantidad})}
  export const guardarProduccion  = (almacenProcesos,usuario,almacen,detalleProduccion,estado,fechaRegistro,tiempo,numero,idProducto,cantidad)=>{addDoc(produccionRef,{almacenProcesos,usuario,almacen,detalleProduccion,estado,fechaRegistro,tiempo,numero,idProducto,cantidad})}
  export const guardarBoletaPago  = (numBoleta,dniBoleta,nomBoleta,fechaBoleta,tiempoTotal,creado,detalle,payStatus,importe)=>{addDoc(boletaPagoRef,{numBoleta,dniBoleta,nomBoleta,fechaBoleta,tiempoTotal,creado,detalle,payStatus,importe})}
  export const guardarCotizacion  = (numero,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal,tiempo)=>{addDoc(cotizacionRef,{numero,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal,tiempo})}
  export const guardarCompras  = (nuevoNumero,usuario,proveedor,ruc,detalleCompra,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,documento)=>{addDoc(comprasRef,{nuevoNumero,usuario,proveedor,ruc,detalleCompra,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,documento})}

  /*registrando un nuevo documento en firestore indicando el id de la DB personalizado setDoc() */
  export const guardarProduct     = async (codigo,categoria,nombre,costo,stock,unidad,peso,precio,activo,descripcion,imagen,medidas,pesoBruto)=>{await setDoc(doc(productRef,codigo),{imagen,categoria,nombre,costo,stock,unidad,peso,precio,activo,descripcion,medidas,pesoBruto})}
  export const guardarCotizacion2 = async (id,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal)=>{await setDoc(doc(cotizacionRef,id),{fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal})}
  export const guardarSocios      = async (ruc,razonSocial,inicioActividad,nombresContacto,apellidosContacto,email,dni,cargo,telefono,calle,distrito,provincia,departamento,ubicacion,nota)=>{await setDoc(doc(sociosRef,ruc),{razonSocial,inicioActividad,nombresContacto,apellidosContacto,email,dni,cargo,telefono,calle,distrito,provincia,departamento,ubicacion,nota})}

  /*creando la suscripcion que se deseara escuchar cuando los datos cambian
    crea un efecto inmediato sobre la tabla, como si se introduciera directo a la tabla cuando se guarda*/

  export const onGetTasks   = (callback)=> onSnapshot(collection(db,'Micoleccion'),callback)
  export const onGetProduct = (callback)=> onSnapshot(collection(db,'Productos'),callback)
  export const onGetSocios  = (callback)=> onSnapshot(collection(db,'Socios'),callback)
  export const onGetVentas  = (callback)=> onSnapshot(collection(db,'Cotizacion'),callback)

  /*metodo de firestore para eliminar un registro de db */
  export const deleteTask       = (id)=>{deleteDoc(doc(db,'Micoleccion',id))}
  export const deleteProduct    = (id)=>{deleteDoc(doc(db,'Productos',id))}

  /*metodo getDoc 'en singular' para traer un documento de firestore */
  export const traerTask          = (id)=>getDoc(doc(db,'Micoleccion',id))
  export const traeroneProduct    = (id)=> getDoc(doc(db,'Productos',id))
  export const traerUnSocio       = (id)=> getDoc(doc(db,'Socios',id))
  export const traerUnProveedor      = (id)=> getDoc(doc(db,'Proveedor',id))
  export const traerUnNumeracion  = (id)=> getDoc(doc(db,'Numeracion',id))

  //updateDoc() actualiza una documento
  export const updateProduct    = (id,newFields)=>updateDoc(doc(db,'Productos',id),newFields)
  export const updateTask       = (id,newFields)=>updateDoc(doc(db,'Micoleccion',id),newFields)
  export const updateNumeracion = (id,newFields)=>updateDoc(doc(db,'Numeracion',id),newFields)
  export const updateMovimientoInventario = (id,newFields)=>updateDoc(doc(db,'Produccion',id),newFields)
  
  //realizar una consulta where con funcion pasandole un valor
  
  export const traerConsulta    = (nombre)=>{return getDocs(query(jornadaRef,where("description", "==", nombre), where("payStatus", "==", false), orderBy('title','desc'),limit(60)))}
  console.log('Modulo Firebase.js trabajando... Final:')



/*
  //consulta un documento con query y where, En construccion...
  export const queryProduccion  = await getDocs(query(produccionRef,where("estado", "==", "pendiente"),orderBy('fechaRegistro','desc')));
  export const queryJornada     = await getDocs(query(jornadaRef,where("payStatus", "==", false)));
  export const queryBoletaPago  = await getDocs(query(boletaPagoRef,where("payStatus", "==", false)));
  export const queryDiario      = await getDocs(query(diario2023Ref));
  export const query41110      = await getDocs(query(cta41110));
*/