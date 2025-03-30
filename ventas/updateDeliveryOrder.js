import {updatePedido, updateClientes, updateProduct,traeroneProduct,traerUnSocio} from '../firebase.js';
import { } from "../src/app/logout.js";
import { showMessage } from "../src/app/showMessage.js";




export async function registrarEnvio(arrayObjeto) {//guarda base datos
      let id = arrayObjeto.id//id del pedido cotizacion para actualizar el envio
      const numberGuia = document.getElementById('numberGuia').value;
      const fechaEnvio = document.getElementById('fechaEnvio').value;
      const empresaEnvio = document.getElementById('empresaEnvio').value;
      const pesoEnvio = document.getElementById('pesoEnvio').value;
      const gastoEnvio = Number(document.getElementById('gastoEnvio').value);
      const personaEnvio = document.getElementById('personaEnvio').value;

      let traerDoc = await traerUnSocio(arrayObjeto['values'].ruc);//para actualizar su saldo
      let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
      //actualizamos el saldo del cliente por regla de negocio cuando se envia el pedido
      let saldoAnterior = Number(fila.saldo);
      let nuevoSaldo=saldoAnterior + Number(arrayObjeto['values'].importeTotal);
      //actualizamos la cantidad de pedidos
      let nuevoClienteRank=Number(Number(fila.ClienteRank)+1);

      console.log('razonSocial, saldoAnterior,nuevoSaldo,nuevoClienteRank...', arrayObjeto['values'].cliente, saldoAnterior,nuevoSaldo,nuevoClienteRank)

      if (arrayObjeto['values'].estado ='nuevo') {
        console.log('fechaEnvio y GastoEnvio:', fechaEnvio, gastoEnvio, empresaEnvio)
        actualizarStock(JSON.parse(arrayObjeto['values'].detalleCotizacion))//actualiza cada linea los inventarios
        updatePedido(id, {numberGuia:numberGuia, fechaEnvio: fechaEnvio,transportedBy: empresaEnvio, pesoEnvio:pesoEnvio ,gastoEnvio: gastoEnvio, personaEnvio: personaEnvio, estado: 'enviado' })
        updateClientes(arrayObjeto['values'].ruc, { saldo: nuevoSaldo, clienteRank: nuevoClienteRank})
        showMessage(`Saldo actualizado:${nuevoSaldo}`, 'success')
      } else {
        alert('ya se registro el envio con:', empresaEnvio.value)
      }
};

function actualizarStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
      console.log('ArrayObjetos a actualizar stock:', ArrayObjetos)
      let counter = 0
      ArrayObjetos.forEach(async (obj) => {
        let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
        let fila = await traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
        console.log('producto traido id stock:', fila.id, fila.stock)

        let nuevo_stock = Number(fila.stock) - Number(obj.cantidad)
        let newAssignedStock = Number(fila.assignedStock) - Number(obj.cantidad)
        updateProduct(obj.id, { stock: nuevo_stock, assignedStock: newAssignedStock })//actualizamos el stock y el stock que se separo
        console.log('updateProduct:', nuevo_stock, newAssignedStock)
        counter++
        showMessage(`Stock de ${obj.id} actualizado a:${nuevo_stock}`, 'success')
      })

      const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
      modal.hide()
};

export function renderFormDelivery(objetos) {
  const tabDelivery=document.getElementById('profile')
  
  tabDelivery.innerHTML =`
      <form id="deliveryForm">
          <div><label for="addressDelivery">Direccion Envio:</label><input type="text" id="" placeholder="Dirección del cliente" required></div>
          <div><label for="fechaEnvio">Fecha Envio:</label><input type="date" id="fechaEnvio" required></div>
          <div><label for="gastoEnvio">Gasto Envio:</label><input type="number" id="gastoEnvio" required></div>
          <div><label for="empresaEnvio">Empresa Transporte:</label><input type="text" id="empresaEnvio" required></div>
          <div><label for="personaEnvio">Recibido por:</label><input type="text" id="personaEnvio" required></div>
          <div><label for="telefonoEmpresaEnvio">Telefono Empresa:</label><input type="text" id="telefonoEmpresaEnvio" required></div>
      </form>
      ` 
};

