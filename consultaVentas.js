import { MenuManager } from './src/menuComponent.js';
import { menuItems } from './src/contenidoMenu.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { onGetVentas,auth, db,traeroneProduct,updatePedido,deleteCotizacion} from './firebase.js';
console.log('iniciando lectura de archivo consultaVentas.js');
import { deleteElementHTML } from "./plugins/deleteElementHTML.js";
import { Datatable } from './dataTable.js';
import { } from "./src/app/logout.js";
import { loginCheck } from "./src/app/loginCheck.js";
import { showMessage } from "./src/app/showMessage.js";
import { viewDocument } from "./ventas/viewDocument.js";
import { newDocument } from "./ventas/newOrder.js";
import { editOrder } from "./ventas/editOrder.js";

// Configuración básica del menu
const menuManager = new MenuManager('navbar', { leftMenu: menuItems });
menuManager.init();
menuManager.updateMenuItem('rightMenu', 1, {
    title: 'Iniciar Sesión',
    submenu: [
        { title: 'Login', url: 'login.php' },
        { title: 'Registro', url: 'register.php' }
    ]
});





//console.log('terminando de importar archivos para  consultaVentas.js');
onAuthStateChanged(auth, async (user) => {//esto es para mostrar datos de la DB segun este registrado el usuario o no
  console.log('terminando la autentificacion consultaVentas.js');
  loginCheck(user)
  //let objetos = JSON.parse(localStorage.getItem('cotizacion'))
  
  if (user) {
    //consulta la base de datos de firebase y trae de la tabla usario el nombre con el UID
    const usuariosRef = doc(db, `Usuarios/${user.uid}`)
    const usuarioCifrada = await getDoc(usuariosRef)
    const btnUserName = document.querySelector('#btn-userName')
    btnUserName.textContent = usuarioCifrada.data().userName;

    //traer los pedidos comerciales clientes de firebase
    let todosPedidosLS = JSON.parse(localStorage.getItem('todasLasVentas'))
    let pedidosNuevosLS = JSON.parse(localStorage.getItem('pedidosNuevos'));
    let firebaseConect = true;


    //cortar desde aqui
    if (firebaseConect) {

      const registroVentas = onGetVentas((ventasSnapShot) => {
        let items = [];
        
        if (ventasSnapShot) {
          console.log('terminado de traer los pedidos de firebase');
          ventasSnapShot.forEach(doc => {
            //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            obj.values.importeTotalVista = Intl.NumberFormat('es-419', { maximumSignificantDigits: 7 }).format(obj.values.importeTotal);
            obj.values.invoice=obj.values.number_invoice?obj.values.number_invoice:'';
            obj.values.numberGuia=obj.values.numberGuia?obj.values.numberGuia:'';
            obj.values.amount_total=obj.values.amount_total?obj.values.amount_total:'';
            //obj.values.status = `<span class="${obj.values.estado}"></span>`;
            obj.values.progreso = renderLabelStatus(obj);            
            items.push(obj);
            
          });
          localStorage.setItem('todasLasVentas', JSON.stringify(items))
          todosPedidosLS = JSON.parse(localStorage.getItem('todasLasVentas'))
        }
        renderDatatable(items)
      });
    } else {
      console.log('trabajando offline');
      renderDatatable(todosPedidosLS,pedidosNuevosLS)
      console.log('terminando de renderizar dataTable consultaVentas.js');
    }

  } else {
    deleteElementHTML('#dataTable')
    const messageHTML = document.getElementById('dataTable')
    messageHTML.innerHTML = '<br><br><br><br><h1>Registrarse para visualizar la informacion...</h1>'
    showMessage('Registrase para ver la pagina')
  }
  
})

function renderDatatable(items) {
  
  items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b

  const titulo = { OV:'numero', Factura:'invoice', GUIA:'numberGuia' ,FECHA: 'fecha', CLIENTE: 'cliente',"RUC/DNI":'ruc', IMPORTE: 'importeTotalVista', RE: 'retrasoEnvio', RP: 'retrasoPago', STATUS: 'progreso' }
  const dt = new Datatable('#dataTable',
    [
      {
        id: 'btnNew', text: 'nuevo', icon: 'note_add', targetModal: '#myModal', action: function () {
          const item = dt.getSelected();
          const typeOperation='ordenVenta';
          newDocument(typeOperation);
        }
      },      
      { id: 'btnInvoice', text: 'facturar', icon: 'summarize', targetModal: '#myModal', action: function () { 
        const item = dt.getSelected();
        newOrders(items); 
      }
    },
      {
        id: 'btnEdit', text: 'editar', icon: 'contract', targetModal: '#myModal',
        action: function () {
          const item = dt.getSelected();
          console.log('mostrando documento formato PC...', item);
          viewDocument(item);
        }
      },
      {
        id: 'btnEditar', text: 'editar', icon: 'edit', targetModal: '#myModal',
        action: function () {
          const item = dt.getSelected();
          console.log('mostrando documento formato PC...', item);
          editOrder(item);
        }
      },
      { id: 'btnDelete', text: 'eliminar', icon: 'delete', 
        action: function () { 
          const item = dt.getSelected();
          cancelOrder(item)
         } 
      }
    ]);
  dt.setData(items, titulo);
  dt.makeTable2();
}



function renderLabelStatus(obj){
  let diasMaximoEntregaPedido = 61; //espacio para guardar el saldo anterior del cliente
  let diasCreditoNormal = 10; //espacio para guardar el saldo anterior del cliente
  let diasCreditoRetrazo = 30; //espacio para guardar el saldo anterior del cliente
  let diasCreditoProblemas = 90; //espacio para guardar el saldo anterior del cliente
  let diasMaximoCredito = 180; //espacio para guardar el saldo anterior del cliente

  let date = new Date(Date.now())
  if (obj['values'].estado == 'nuevo') {

    obj['values'].retrasoEnvio = Math.round((date.getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
    obj['values'].retrasoPago = 0;

    if (obj['values'].pagosPedido) {//pago adelantado parcial
      obj['values'].pagosAcumulados = JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
      //console.log('pagosacumulados', obj['values'].pagosAcumulados);
      //obj['values'].progreso = 
      return `<div class="corona"><div class="progress-adelantado"  style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div></div>`;
    } else {
      //obj['values'].progreso = 
      return `<div class="corona verde 
                  title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (${10 - obj['values'].retrasoEnvio} dias) Saldo S/${obj['values'].importeTotal - obj['values'].pagosAcumulados}" 
                  title="${obj['values'].estado} ${Math.round(1 / 10) * 100}% Saldo (${obj['values'].importeTotal - 0}) (${diasMaximoEntregaPedido - obj['values'].retrasoEnvio} dias plazo para entregar)">
                <div class="progress-nuevo"  style="width:${Math.round((obj['values'].retrasoEnvio / diasMaximoEntregaPedido) * 100)}%;">
                </div>
              </div>`;
    }
  } else if (obj['values'].fechaEnvio && obj['values'].estado != 'cancelado') {//se existe fecha envio, entonces estado enviado

    obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fechaEnvio}T12:00:00Z`) - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
    obj['values'].retrasoPago = Math.round((date.getTime() - new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
    let arrayPagos = obj['values'].pagosPedido ? JSON.parse(obj['values'].pagosPedido):[];
    obj['values'].pagosAcumulados = arrayPagos.reduce((total, obj) => total += Number(obj.importePago), 0)
    
    //<div class="progress-${obj['values'].estado}" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div>
    
      if (obj['values'].retrasoPago<=10) {
        return `<div class="corona blue">
                <div class="progress-${obj['values'].estado}" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].retrasoPago /diasCreditoNormal) * 100)}%;"></div>
            </div>`;
      } else if (obj['values'].retrasoPago>10 && obj['values'].retrasoPago<=30) {
        return `<div class="corona blue">
                  <div class="progress-pendiente" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].retrasoPago /diasCreditoRetrazo) * 100)}%;"></div>
                </div>`;
      } else if (obj['values'].retrasoPago>30 && obj['values'].retrasoPago<=60) {
        return `<div class="corona blue">
                  <div class="progress-retrazado" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].retrasoPago /diasCreditoProblemas) * 100)}%;"></div>
                </div>`;
      }
      else {
        return `<div class="corona blue">
                  <div class="progress-problemas" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (S/${obj['values'].importeTotal - obj['values'].pagosAcumulados})" style="width:${Math.round((obj['values'].retrasoPago /diasMaximoCredito) * 100)}%;"></div>
                </div>`;
      }
    
  } else if (obj['values'].estado == 'cancelado') {
    if (obj['values'].fechaEnvio) {
      obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
      obj['values'].retrasoPago = Math.round((new Date(`${obj['values'].fechaPago}T12:00:00Z`).getTime() - new Date(`${obj['values'].fechaEnvio}T12:00:00Z`).getTime()) / 86400000);
      //obj['values'].progreso =
      return `<div class="corona gris" title="${obj['values'].estado} 100% (S/0)"><div class="progress-${obj['values'].estado}"  style="width:100%"></div></div>`;
    } else {
      if (!(obj['values'].fechaEnvio)) {
        console.log('entre!!! no enviado pero cancelado...');
        obj['values'].retrasoEnvio = Math.round((date.getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
        obj['values'].pagosAcumulados = JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
        //obj['values'].progreso =
        return `<div class="corona" title="${obj['values'].estado} ${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}% (${10 - obj['values'].retrasoEnvio} dias) Saldo S/${obj['values'].importeTotal - obj['values'].pagosAcumulados}"><div class="progress-adelantado"  style="width:${Math.round((obj['values'].pagosAcumulados / obj['values'].importeTotal) * 100)}%;"></div></div>`;
        //break;
      }
      obj['values'].retrasoEnvio = Math.round((new Date(`${obj['values'].fecha}T12:00:00Z`).getTime() - new Date(`${obj['values'].fecha}T12:00:00Z`).getTime()) / 86400000);
      obj['values'].retrasoPago = 0;
      //obj['values'].progreso = `<div class="progress-${obj['values'].estado}" title="${obj['values'].estado} 100% (S/0)" style="width:100%"></div>`;
      //obj['values'].pagosAcumulados=JSON.parse(obj['values'].pagosPedido).reduce((total, obj) => total += Number(obj.importePago), 0)
    }

  } else {
    obj['values'].retrasoEnvio = 0;
    obj['values'].retrasoPago=0; 
    return `<div class="corona gris" title="${obj['values'].estado} 100% (S/0)"><div class="progress-${obj['values'].estado}"  style="width:0%"></div></div>`;
  }

}

function newOrders(items){
  let tabsHTML=`
  <div class="table-responsive">

    <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#tab-1" type="button" role="tab" aria-controls="home" aria-selected="true">Detalle</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#tab-2" type="button" role="tab" aria-controls="profile" aria-selected="false">Resumen</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#tab-3" type="button" role="tab" aria-controls="contact" aria-selected="false">tab-3</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#tab-4" type="button" role="tab" aria-controls="contact" aria-selected="false">tab-4</button>
                </li>
    </ul>
    <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="home-tab">...</div>
                <div class="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="profile-tab">...</div>
                <div class="tab-pane fade" id="tab-3" role="tabpanel" aria-labelledby="contact-tab">...</div>
                <div class="tab-pane fade" id="tab-4" role="tabpanel" aria-labelledby="contact-tab">...</div>
    </div>

</div>
`
  const modalNuevosPedidos      = document.querySelector('.modal-body');
  modalNuevosPedidos.innerHTML=tabsHTML

  let newItems=detalleNuevosPedidos(items)
  renderTableEasy(newItems)
  const modalFooter = document.querySelector('.modal-footer');
    deleteElementHTML('.modal-footer');
  console.log('PEDIDOSNUEVOS:',newItems);

  const valorClave = "id";
  const resultadoFiltrado = groupByYSumar(newItems,valorClave);
  const resultadoFiltradoWithStock=[];
  
  resultadoFiltrado.forEach(async(producto)=>{
    let objeto={};
    objeto.id=producto.id
    objeto.values=producto.values;
    let productoCaliente=await traeroneProduct(producto.id)
    let stockProducto=productoCaliente.data().stock
    objeto['values'].stockActual=stockProducto
    resultadoFiltradoWithStock.push(objeto);
    //console.log(`${producto.id}:`,resultadoFiltrado['values'].stockActual);
    
  })
  console.log(resultadoFiltrado);
  let tab=document.querySelector('#profile-tab')
  let tab2=document.querySelector('#tab-2')
  tab.addEventListener('click',()=>{renderTableResumen(resultadoFiltradoWithStock,tab2);console.log('se ejecuto despues de dar click en tab-2');
  })

}

function detalleNuevosPedidos(items) {
  let itemsNew = [];
  items.forEach((item)=>{
    if (item['values'].estado=='nuevo') {
      //let counter =1;
      let detallePedido=JSON.parse(item['values'].detalleCotizacion)

      detallePedido.forEach(producto=>{
        let objNuevo = {};
        objNuevo.id = item.id;
        objNuevo.values = producto;
        objNuevo['values'].cliente = item['values'].cliente;
        itemsNew.push(objNuevo);
      });
    };
  });
  return itemsNew
}

function renderTableEasy(objetos) {
  let tab1=document.querySelector('#tab-1')
  let totalPedido=0;

  tab1.innerHTML =`
  <table id='table' class="tabla">  
  <thead class="tituloTabla">
      <tr><th>#</th><th>CLIENTE</th><th>PRODUCTO</th><th>UNIDAD</th><th>CANTIDAD</th><th>PRECIO</th><th>IMPORTE</th></tr>
  </thead>
  <tbody class="container" id="container"></tbody>
  </table>
  ` ;

  const tabla = document.querySelector('.container')
  let contador = 1

  objetos.forEach(producto => {
      let fila = document.createElement('tr')
      fila.setAttribute('data-id',`${producto.id}`)
      totalPedido+=producto['values'].importe

      fila.innerHTML = `
                  <td>${contador}</td>
                  <td>${producto['values'].cliente}</td> 
                  <td>${producto['values'].nombre}</td>
                  <td>${producto['values'].cantidad}</td>
                  <td>${producto['values'].unidad}</td>
                  <td>${producto['values'].precio}</td>
                  <td>${producto['values'].importe}</td>
                  `
      contador++
      tabla.appendChild(fila)
  });

  let filaTotal = document.createElement('tr')
  filaTotal.innerHTML=`<tr><th></th><th>TOTAL</th><th></th><th></th><th>IMPORTE</th><th>S/</th><th>${totalPedido}</th></tr>`
  tabla.appendChild(filaTotal)
};

function renderTableResumen(objetos,tab) {
  
  let totalPedido=0;

  tab.innerHTML =`
  <table id='table' class="tabla">  
  <thead class="tituloTabla">
      <tr><th>#</th><th>PRODUCTO</th><th>CANTIDAD</th><th>STOCK</th><th>IMPORTE</th></tr>
  </thead>
  <tbody class="container2" id="container"></tbody>
  </table>
  ` ;

  const tabla = document.querySelector('.container2')
  let contador = 1

  objetos.forEach(producto => {
      let fila = document.createElement('tr')
      fila.setAttribute('data-id',`${producto.id}`)
      totalPedido+=producto['values'].importe

      fila.innerHTML = `
                  <td>${contador}</td>
                  <td>${producto['values'].nombre}</td>
                  <td>${producto['values'].cantidad}</td>
                  <td>${producto['values'].stockActual}</td>
                  <td>${producto['values'].importe}</td>
                  `
      contador++
      tabla.appendChild(fila)
  });

  let filaTotal = document.createElement('tr')
  filaTotal.innerHTML=`<tr><th></th><th>TOTAL</th><th>IMPORTE</th><th>S/</th><th>${totalPedido}</th></tr>`
  tabla.appendChild(filaTotal)
};


function filtrarPorValor(arrayDeObjetos, valorClave) {
  // Usamos un conjunto (Set) para almacenar elementos únicos
  const elementosUnicos = new Set();

  // Iteramos sobre el array de objetos
  arrayDeObjetos.forEach(objeto => {
    //console.log('objeto de pedidos nuevos:',objeto);
    //console.log('objeto de pedidos nuevos:',objeto['values']);
    
      // Verificamos si el valor de la clave es igual al valor proporcionado
      if (objeto['values'].hasOwnProperty(valorClave) && objeto['values'][valorClave] !== undefined) {
          // Agregamos el objeto al conjunto
          elementosUnicos.add(objeto['values'][valorClave]);
      }
  });

  // Convertimos el conjunto de nuevo a un array antes de devolverlo
  return Array.from(elementosUnicos);
}


function groupByYSumar(arrayDeObjetos, clave) {
  // Objeto para almacenar los resultados agrupados
  const agrupados = {};

  // Iteramos sobre el array de objetos
  arrayDeObjetos.forEach(objeto => {
      if (objeto['values'].hasOwnProperty(clave)) {
          const valor = objeto['values'][clave];

          // Si la clave aún no está en el objeto agrupado, inicializamos
          if (!agrupados[valor]) {
              agrupados[valor] = {};
              for (let propiedad in objeto['values']) {
                  if (typeof objeto['values'][propiedad] === "number") {
                      agrupados[valor][propiedad] = objeto['values'][propiedad];
                  }
              }
              agrupados[valor][clave]=objeto['values'][clave];
              agrupados[valor]['nombre']=objeto['values']['nombre'];
          } else {
              // Si ya existe, acumulamos los valores numéricos
              for (let propiedad in objeto['values']) {
                  if (typeof objeto['values'][propiedad] === "number") {
                      agrupados[valor][propiedad] = (agrupados[valor][propiedad] || 0) + objeto['values'][propiedad];
                  }
              }
          }
      }
  });

  // Convertimos el objeto agrupado de vuelta a un array
  return Object.entries(agrupados).map(([clave, valores]) => (
    {
      ['id']: clave,
      ['values']: valores
    }
  ));
}

function cancelOrder(item) {
  let claveAnulacion=123456;
  let claveEliminacion=654321;
  const aNumber = Number(window.prompt("Ingrese la clave de anulacion"));
  let id =item.id
  if (aNumber==claveAnulacion) {
    const aMotivo = window.prompt("Ingrese el Motivo de anulacion");
    let estado='Anulado';
    console.log('se anulara el pedido:',id,aMotivo);
    
    updatePedido(id,{estado:estado,motivoAnulacion:aMotivo })
    showMessage('se anulo el pedido...');
  } else if(aNumber==claveEliminacion){
    deleteCotizacion(id);
    showMessage(`Se eliminó pedido...${id} ${item['values'].numero}`)
  } else{
    showMessage('clave de anulacion incorrecta...')
  }
}

