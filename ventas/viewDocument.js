import { translateDate } from "../plugins/translateDate.js";
import { deleteElementHTML } from "../plugins/deleteElementHTML.js";
import { htmlToPDF } from "../plugins/htmlToPDF.js";
//import { windowPrint } from "../plugins/windowPrint.js";
import { htmlToImage } from "../plugins/htmlToImage.js";
import { formularioVenta} from "./formularioVenta.js";
import { traerUnSocio } from '../firebase.js';
import { registrarEnvio} from './updateDeliveryOrder.js';
import { updatePayOrder} from './updatePayOrder.js';
import { updateInvoice, updateGuia} from './updateInvoice.js';


export async function viewDocument(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    //console.log(' consulta venta arrayObjeto :', arrayObjeto)

    const modalFooter = document.querySelector('.modal-footer');
    deleteElementHTML('.modal-footer');

    //creando el boton enviar y añadiendo al modal footer
    const btnPrint = document.createElement('button');
    btnPrint.textContent = 'Imprimir';
    btnPrint.addEventListener('click', ()=>window.print());
    modalFooter.appendChild(btnPrint);

    //creando el boton enviar y añadiendo al modal footer
    const btnSaveDocument = document.createElement('button');
    btnSaveDocument.setAttribute('id', 'registrarEnvio');
    btnSaveDocument.setAttribute('class', 'btn btn-primary');
    btnSaveDocument.textContent = 'Registrar Envio';
    btnSaveDocument.addEventListener('click', ()=>registrarEnvio(arrayObjeto));
    modalFooter.appendChild(btnSaveDocument);

    //creando el boton guaradar pagos y añadiendo al modal footer
    const btnPay = document.createElement('button');
    btnPay.setAttribute('id', 'btnRegistrarPago');
    btnPay.setAttribute('class', 'btn btn-primary');
    btnPay.textContent = 'Registrar Pago';
    btnPay.addEventListener('click', ()=>updatePayOrder(arrayObjeto));
    modalFooter.appendChild(btnPay);

    //creando el boton guaradar factura
    const btnInvoice = document.createElement('button');
    btnInvoice.setAttribute('id', 'btnRegistrarInvoice');
    btnInvoice.setAttribute('class', 'btn btn-primary');
    btnInvoice.textContent = 'Registrar Factura';
    btnInvoice.addEventListener('click', ()=>updateInvoice(arrayObjeto));
    modalFooter.appendChild(btnInvoice);

    //creando el boton guaradar Guia
    const btnGuia = document.createElement('button');
    btnGuia.setAttribute('id', 'btnRegistrarGuia');
    btnGuia.setAttribute('class', 'btn btn-primary');
    btnGuia.textContent = 'Actualizar Guia';
    btnGuia.addEventListener('click', ()=>updateGuia(arrayObjeto));
    modalFooter.appendChild(btnGuia);


    //creando el boton para imprimir y añadiendo al modal footer
    const btnPrintDocument = document.createElement('button');
    btnPrintDocument.setAttribute('id', 'btn-imprimir');
    btnPrintDocument.setAttribute('class', 'btn btn-primary');
    btnPrintDocument.textContent = 'Print Document';
    btnPrintDocument.addEventListener('click', () => {htmlToPDF('documentoPDF');});
    modalFooter.appendChild(btnPrintDocument);

    //creando el boton capturar imagen
    const btnCaptureDocument = document.createElement('button');
    btnCaptureDocument.setAttribute('id', 'btn-capture');
    btnCaptureDocument.setAttribute('class', 'btn btn-primary');
    btnCaptureDocument.textContent = 'Capture Document';
    btnCaptureDocument.addEventListener('click', () => htmlToImage('.modal-body'));
    modalFooter.appendChild(btnCaptureDocument);

    //renderiza el documento del pedido inicial, crea el html y los rellena con los datos de DB
    const flotante      = document.querySelector('.modal-body');
    flotante.innerHTML  = formularioVenta;
    let objetos = JSON.parse(arrayObjeto['values'].detalleCotizacion);
    pintarFilasLlenas(objetos)
    //renderFormDelivery(objetos)
    //renderFormPay(objetos)

    cotizacion.value    = arrayObjeto['values'].numero;
    vendedor.value      = arrayObjeto['values'].vendedor;
    ruc.value           = arrayObjeto['values'].ruc;
    cliente.value       = arrayObjeto['values'].cliente;
    fecha.value         = translateDate(arrayObjeto['values'].fecha);
    //tipoPago.value      = arrayObjeto['values'].tipoPago;
    //metodoCobro.value   = arrayObjeto['values'].metodoCobro;
    celdaSubTotal.value = arrayObjeto['values'].subTotal;
    descuento.value     = arrayObjeto['values'].descuento;
    celda_total.value   = arrayObjeto['values'].importeTotal;
    
    let pagoAcumuladoAntiguo = 0;
    let Pagos = [];
    let pagosPedido = '';
    //solo si existen pagos registrados, se renderiza tabla
    if (arrayObjeto['values'].pagosPedido) {
        //const tabPagos=document.getElementById('tablaPagos');  
        pagosPedido = JSON.parse(arrayObjeto['values'].pagosPedido)
        
        pagosPedido.forEach((pago) => {
            pagoAcumuladoAntiguo += Number(pago.importePago);
            Pagos.push(pago);
        })

        let contador2 = 1;

        const saldoDocumento=document.getElementById('saldoDocumento')
        saldoDocumento.textContent=arrayObjeto['values'].importeTotal - pagoAcumuladoAntiguo;
        const tbody = document.getElementById("containerPagos");

        console.log('pagosPedido',pagosPedido);

        pagosPedido.forEach(pago => {            
            let fila = document.createElement('tr')
            fila.innerHTML = `<td>Pago N°${contador2}</td>
                        <td>${pago.fechaPago}</td>
                        <td>${pago.metodoPago}</td>
                        <td>S/${pago.importePago}</td>                                            
                        `
            contador2++
            tbody.appendChild(fila)
        });
    };

    if (arrayObjeto['values'].estado != 'nuevo') {
        let deliveryForm=document.getElementById('deliveryForm')
        
        let traerDoc = await traerUnSocio(arrayObjeto['values'].transportedBy);
        let fila = traerDoc.data()

        deliveryForm['numberGuia'].value=arrayObjeto['values'].numberGuia;
        deliveryForm['fechaEnvio'].value=arrayObjeto['values'].fechaEnvio;
        deliveryForm['empresaEnvio'].value=fila.razonSocial;
        deliveryForm['pesoEnvio'].value=arrayObjeto['values'].pesoEnvio;
        deliveryForm['gastoEnvio'].value=arrayObjeto['values'].gastoEnvio;
        deliveryForm['personaEnvio'].value=arrayObjeto['values'].personaEnvio;
        deliveryForm['telefonoEmpresaEnvio'].value=fila.telefono;

        const formInvoice = document.getElementById('form-invoice')
        formInvoice['tipoDocumento'].value=arrayObjeto['values'].move_type;
        formInvoice['serieNumero'].value=arrayObjeto['values'].number_invoice;
        formInvoice['fechaDocumento'].value=arrayObjeto['values'].invoice_date;
        formInvoice['importeDocumento'].value=arrayObjeto['values'].amount_total;

        const formGuia = document.getElementById('form-guia')
        formGuia['tipoGuia'].value=arrayObjeto['values'].tipoGuia ? arrayObjeto['values'].tipoGuia : 'Guia-Remitente';
        formGuia['serieNumeroGuia'].value=arrayObjeto['values'].numberGuia;
        formGuia['fechaGuia'].value=arrayObjeto['values'].fechaEnvio;
        formGuia['pesoDeclarado'].value=arrayObjeto['values'].pesoEnvio;
        formGuia['transportedBy'].value=arrayObjeto['values'].transportedBy ? arrayObjeto['values'].transportedBy: 'registrar transportista';
    }

};

function pintarFilasLlenas(objetos) {
    const tabla = document.querySelector('.container')
    let contador = 1

    objetos.forEach(producto => {
        let fila = document.createElement('tr')
        
        

        fila.innerHTML = `
                    <td class="no-print"><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button>${contador}</td>
                    <td class="no-print"><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button>${producto.id}</td> 
                    <td class='cantidad'><input type='number'  min="0" step="0.1" class='cantidad2' id='${producto.id}' value=${producto.cantidad}></td>
                    <td>${producto.unidad}</td>
                    <td>${producto.nombre}</td>
                    <td class='cantidad'>${producto.precio}</td>
                    <td class='cantidad'>${producto.importe.toFixed(2)}</td>
                    `
        contador++
        tabla.appendChild(fila)
    });
};



