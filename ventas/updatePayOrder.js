
import {updatePedido, updateClientes,traerUnSocio} from '../firebase.js';
import { } from "../src/app/logout.js";
import { showMessage } from "../src/app/showMessage.js";


export async function updatePayOrder(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    
    let idPedido = arrayObjeto.id
    let idCliente = arrayObjeto['values'].ruc
    
    //btnSaveDocument.addEventListener('click', procesarPago);
    
    console.log('idCliente :', idCliente);
    let clienteTraido = await traerUnSocio(idCliente); //trae un cliente por ruc de la DB
    let datosCliente = clienteTraido.data(); //calcula la cantidad que quedaria despues del registro
    let clienteDatosSaldo = 0;

    if (!(clienteTraido.data())) {
      console.log('Firebase no envio el documento del cliente:', clienteTraido);
    } else {
      clienteDatosSaldo = datosCliente['saldo'];
      console.log('clienteTraido :', datosCliente, clienteDatosSaldo);
    }

    let pagosParcialesPedido = [];
    let pagoAcumuladoAntiguo = 0;

    if (arrayObjeto['values'].pagosPedido) {
      let pagosPedido = JSON.parse(arrayObjeto['values'].pagosPedido);
      pagosPedido.forEach((pago) => {
        pagosParcialesPedido.push(pago);//agregamos cada objeto de pago, para mas adelante agregar en nuevo pago tambien
        pagoAcumuladoAntiguo += Number(pago.importePago);//acumulamos los pagos realizados anteriormente
      })
    }

    let saldoDocumentoAnterior = arrayObjeto['values'].importeTotal - pagoAcumuladoAntiguo
    let nuevoEstadoPedido = arrayObjeto['values'].estado;
    let fechaPago = '';
    //document.getElementById('importePago').value = saldoDocumentoActual;
    //document.getElementById('fechaPago').value = translateDate(`${arrayObjeto['values'].fecha}`);

    procesarPago()

    function procesarPago() {
      let nuevoPago = {};
      nuevoPago['fechaPago'] = document.getElementById('fechaPago').value;
      nuevoPago['metodoPago'] = document.getElementById('metodoPago').value;
      nuevoPago['importePago'] = document.getElementById('importePago').value;
      pagosParcialesPedido.push(nuevoPago);

      let saldoDocumentoActual = saldoDocumentoAnterior - Number(document.getElementById('importePago').value)

      if (saldoDocumentoActual <= 0 && nuevoEstadoPedido=='enviado') {
        nuevoEstadoPedido = 'cancelado';
        fechaPago = document.getElementById('fechaPago').value;
        console.log('se cambio el estado:', nuevoEstadoPedido);
      }

      let nuevoSaldo = Number(clienteDatosSaldo) - Number(document.getElementById('importePago').value);

      updatePedido(idPedido, { pagosPedido: JSON.stringify(pagosParcialesPedido), estado: nuevoEstadoPedido, fechaPago: fechaPago })
      updateClientes(idCliente, { saldo: nuevoSaldo })
      console.log('Pago registrado...se actualizo el saldo:', idCliente, nuevoSaldo)

      const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
      modal.hide()
      showMessage(`Pago realizado... nuevo saldo:${nuevoSaldo}`)
    }
  };
