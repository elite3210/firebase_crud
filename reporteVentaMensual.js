import { onGetVentas, updatePedido, updateClientes, updateProduct, traerUnSocio, traeroneProduct } from './firebase.js'
import { guardarCotizacion, traerUnNumeracion, updateNumeracion, traerUnColaborador } from './firebase.js'
import { Datatable } from './dataTable.js'

//traer los socios comerciales clientes de firebase
let objetos = JSON.parse(localStorage.getItem('cotizacion'))
let mesReporte = document.getElementById('mesReporte')
let btnConsulta = document.getElementById('btnConsulta')

btnConsulta.addEventListener('click',()=>{

  console.log('mesReporte',mesReporte.value);

  const registroVentas = onGetVentas((ventasSnapShot) => {
    let items = [];
  
    //progressBar.style.width = width + '%';  // Actualizamos el ancho de la barra
    //progressBar.textContent = width + '%';  // Actualizamos el texto de la barra
  
    if (ventasSnapShot) {
      ventasSnapShot.forEach(doc => {
        //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
        let obj = {};
        let date = new Date(Date.now())
        obj.id = doc.id;
        obj.values = doc.data();
        obj.values.importeTotalVista = Intl.NumberFormat('es-419', { maximumSignificantDigits: 7 }).format(obj.values.importeTotal);
        items.push(obj);
      });
    }
  
    //console.log('items:', items)
    items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
  
    let ventaMensual=items.filter((venta)=>venta.values.fechaEnvio>=`${mesReporte.value}-01` && venta.values.fechaEnvio<=`${mesReporte.value}-31`);
    //console.log('ventaMensual:',ventaMensual);
    const titulo = { DOCUMENTO: 'numero', FECHA: 'fechaEnvio', CLIENTE: 'cliente', RUC:'ruc', IMPORTE: 'importeTotalVista'}
  
    const dt = new Datatable('#dataTable',[]);
  
    dt.setData(ventaMensual, titulo);
    dt.renderTable();
  });


})





