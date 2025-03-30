  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import {getFirestore,collection,addDoc,getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc,query,where,orderBy,limit,setDoc} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
  import { getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"

  
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
  export const db   = getFirestore(app);

  // Initialize Cloud Firestore and get a reference to the service

  const numeracionRef         =collection(db,'Numeracion');
  const productRef            =collection(db,'Productos');
  const ventasRef             =collection(db,'Ventas');
  const cotizacionRef         =collection(db,'Cotizacion');
  const comprasRef            =collection(db,'Compras');
  const sociosRef             =collection(db,'Socios');
  export const produccionRef  =collection(db,'Produccion')
  export const jornadaRef     =collection(db,'Micoleccion')
  export const boletaPagoRef  =collection(db,'BoletaPago')
  export const TransaccionesLaboral  =collection(db,'TransaccionesLaboral')
  export const colaboradorRef  =collection(db,'Colaboradores')
  export const diario2023Ref  =collection(db,'Diario2023')
  export const categoriaRef  =collection(db,'Categorias');
  const cta41110              =collection(db,'41110')
  console.log('Modulo Firebase.js trabajando... Inicio:')

//sospecho que todo lo que sigue abajo los exportados deben implementarse en su respectivo modulo, ya que se ejecuta varias veces con cada pagina

  /*Save a New registro in Firestore con metodo addDoc() este metodo no necesita o requiere un id, la base de datos lo pone por defecto*/ 
  export const guardarTask        = (title,description,salida,payStatus)=>{addDoc(collection(db,'Micoleccion'),{title,description,salida,payStatus})}
  export const guardarVenta       = (cliente,vendedor,productoVendido,cantidad)=>{addDoc(ventasRef,{cliente,vendedor,productoVendido,cantidad})}
  export const guardarProduccion  = (almacenProcesos,usuario,almacen,detalleProduccion,estado,fechaRegistro,tiempo,numero,idProducto,cantidad)=>{addDoc(produccionRef,{almacenProcesos,usuario,almacen,detalleProduccion,estado,fechaRegistro,tiempo,numero,idProducto,cantidad})}
  export const guardarBoletaPago  = (numBoleta,dniBoleta,nomBoleta,fechaBoleta,tiempoTotal,creado,horasTrabajadas,payStatus,importe)=>{addDoc(boletaPagoRef,{numBoleta,dniBoleta,nomBoleta,fechaBoleta,tiempoTotal,creado,horasTrabajadas,payStatus,importe})}
  export const guardarCotizacion  = (numero,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,transportedBy)=>{addDoc(cotizacionRef,{numero,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,transportedBy})}
  export const guardarCompras     = (nuevoNumero,usuario,proveedor,ruc,detalleCompra,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,documento,fecha)=>{addDoc(comprasRef,{nuevoNumero,usuario,proveedor,ruc,detalleCompra,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,documento,fecha})}
  export const guardarTransaccionesLaboral = (fechaTransaccion,dniColaborador,numeroDocumento,creado,descripcion,tipoTransaccion,importeDebe,importeHaber)=>{addDoc(TransaccionesLaboral,{fechaTransaccion,dniColaborador,numeroDocumento,creado,descripcion,tipoTransaccion,importeDebe,importeHaber})}

  /*registrando un nuevo documento en firestore indicando el id de la DB personalizado setDoc(). ACA UNO MISMO DEBE PONER EL ID DEL DOCUMENTO DE LA BASE DE DATOS EN FIRBASE*/
  export const guardarProduct     = async (codigo,categoriaPadre,categoria,nombre,costo,stock,unidad,peso,precio,activo,descripcion,imagen,medidas,pesoBruto,assignedStock,targetStock)=>{await setDoc(doc(productRef,codigo),{categoriaPadre,categoria,nombre,costo,stock,unidad,peso,precio,activo,descripcion,imagen,medidas,pesoBruto,assignedStock,targetStock})};
  export const guardarCotizacion2 = async (id,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal)=>{await setDoc(doc(cotizacionRef,id),{fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal})};
  export const guardarSocios      = async (ruc,razonSocial,inicioActividad,nombresContacto,apellidosContacto,email,dni,cargo,telefono,direccion,distrito,provincia,departamento,ubicacion,nota,idImpuesto,clienteRank,proveedorRank,saldoProveedor,saldo,licenciaMTC,partnerCategory)=>{await setDoc(doc(sociosRef,ruc),{razonSocial,inicioActividad,nombresContacto,apellidosContacto,email,dni,cargo,telefono,direccion,distrito,provincia,departamento,ubicacion,nota,idImpuesto,clienteRank,proveedorRank,saldoProveedor,saldo,licenciaMTC,partnerCategory})}
  export const createCategory      = async (categoryType,categoryList,created)=>{await setDoc(doc(categoriaRef,categoryType),{categoryList,created})}
  //{categoryValues,createdBy,createdOn}

  /*creando la suscripcion que se deseara escuchar cuando los datos cambian (websocket)
    crea un efecto inmediato sobre la tabla, como si se introduciera directo a la tabla cuando se guarda*/

  export const onGetTasks     = (callback)=> onSnapshot(collection(db,'Micoleccion'),callback)
  export const onGetProduct   = (callback)=> onSnapshot(collection(db,'Productos'),callback)
  export const onGetSocios    = (callback)=> onSnapshot(collection(db,'Socios'),callback)
  export const onGetProveedor = (callback)=> onSnapshot(collection(db,'Proveedor'),callback)
  export const onGetVentas    = (callback)=> onSnapshot(collection(db,'Cotizacion'),callback)
  export const onGetCategory    = (callback)=> onSnapshot(collection(db,'Categorias'),callback)
  export const onGetBoletapago    = (callback)=> onSnapshot(collection(db,'BoletaPago'),callback)

  /*metodo de firestore para eliminar un registro de db */
  export const deleteTask       = (id)=>{deleteDoc(doc(db,'Micoleccion',id))};
  export const deleteCotizacion = (id)=>{deleteDoc(doc(db,'Cotizacion',id))};
  export const deleteProduct    = (id)=>{deleteDoc(doc(db,'Productos',id))};
  export const deleteBoletaPago = (id)=>{deleteDoc(doc(db,'BoletaPago',id))};

  /*metodo getDoc 'en singular' para traer un documento de firestore */
  export const traerTask          = (id)=>getDoc(doc(db,'Micoleccion',id))
  export const traeroneProduct    = (id)=> getDoc(doc(db,'Productos',id))
  export const traerUnSocio       = (id)=> getDoc(doc(db,'Socios',id))
  export const traerUnProveedor   = (id)=> getDoc(doc(db,'Proveedor',id))
  export const traerUnNumeracion  = (id)=> getDoc(doc(db,'Numeracion',id))
  export const traerUnColaborador  = (id)=> getDoc(doc(db,'Colaboradores',id))

  //updateDoc() actualiza un documento:
  export const updatePedido     = (id,newFields)=>updateDoc(doc(db,'Cotizacion',id),newFields)
  export const updateProduct    = (id,newFields)=>updateDoc(doc(db,'Productos',id),newFields)
  export const updateTask       = (id,newFields)=>updateDoc(doc(db,'Micoleccion',id),newFields)
  export const updateBoleta       = (id,newFields)=>updateDoc(doc(db,'BoletaPago',id),newFields)
  export const updateNumeracion = (id,newFields)=>updateDoc(doc(db,'Numeracion',id),newFields)
  export const updateMovimientoInventario = (id,newFields)=>updateDoc(doc(db,'Produccion',id),newFields)
  export const updateClientes = (id,newFields)=>updateDoc(doc(db,'Socios',id),newFields)
  export const updateCategory = (id,newFields)=>updateDoc(doc(db,'Categorias',id),newFields)
  //export const updateProveedor = (id,newFields)=>updateDoc(doc(db,'Proveedor',id),newFields)
  
  //realizar una consulta where con funcion pasandole un valor
  
  export const traerConsulta    = (nombre)=>{return getDocs(query(jornadaRef,where("description", "==", nombre), where("payStatus", "==", false), orderBy('title','desc')))}

   
  console.log('Modulo Firebase.js trabajando... Final:')

  export const queryProductos     = await getDocs(query(productRef));

/*
  //consulta un documento con query y where, En construccion...
  export const queryProduccion  = await getDocs(query(produccionRef,where("estado", "==", "pendiente"),orderBy('fechaRegistro','desc')));
  export const queryJornada     = await getDocs(query(jornadaRef,where("payStatus", "==", false)));
  export const queryBoletaPago  = await getDocs(query(boletaPagoRef,where("payStatus", "==", false)));
  export const queryDiario      = await getDocs(query(diario2023Ref));
  export const query41110      = await getDocs(query(cta41110));
*/