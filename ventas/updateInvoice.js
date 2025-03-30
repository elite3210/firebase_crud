import {updatePedido} from '../firebase.js';
import { } from "../src/app/logout.js";
import { showMessage } from "../src/app/showMessage.js";


export async function updateInvoice(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle    
    let idPedido = arrayObjeto.id
    const formInvoice = document.getElementById('form-invoice');
    
    const tipoDocumento = formInvoice['tipoDocumento'].value;
    const serieNumero = formInvoice['serieNumero'].value;
    const fechaDocumento = formInvoice['fechaDocumento'].value;
    const importeDocumento = formInvoice['importeDocumento'].value;

    if (tipoDocumento && serieNumero && fechaDocumento && importeDocumento) {
        updatePedido(idPedido, { move_type: tipoDocumento,number_invoice:serieNumero,invoice_date:fechaDocumento, amount_total:importeDocumento})
        showMessage(`Factura registrada:${serieNumero}`,'success');
    } else {
        showMessage(`Completar todos los campos`);
    }
};

export async function updateGuia(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle    
    let idPedido = arrayObjeto.id
    const formGuia = document.getElementById('form-guia');

    const tipoGuia = formGuia['tipoGuia'].value;
    const numberGuia = formGuia['serieNumeroGuia'].value;
    const fechaEnvio = formGuia['fechaGuia'].value;
    const pesoEnvio = formGuia['pesoDeclarado'].value;
    const transportedBy = formGuia['transportedBy'].value;

    if (tipoGuia && numberGuia && fechaEnvio && pesoEnvio && transportedBy) {
        updatePedido(idPedido, { tipoGuia: tipoGuia,numberGuia:numberGuia,fechaEnvio:fechaEnvio, pesoEnvio:pesoEnvio,transportedBy:transportedBy})
        showMessage(`Guia registrada:${numberGuia}`,'success');
    } else {
        showMessage(`Completar todos los campos`);
    }
};