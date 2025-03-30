import { translateDate } from "../plugins/translateDate.js";
export const formularioVenta = `
<section id="documentoPDF">

    <div class="grupo1">
        
        <div class="contacto">
            <div>
                <h1><i class="fa-regular fa-building"></i> Heinz Sport SAC</h1>
                <h1><i class="fa-solid fa-globe"></i> www.heinzsport.com</h1>
                <h1><i class="fa-regular fa-envelope"></i> info@heinzsport.com</h1>
                <h1><i class="fa-brands fa-whatsapp"></i> +51 962833765</h1>
            </div>
        </div>

        <div class="cajita2">
            <h3 class="h6" id="ruc2">RUC: 20605216715</h3>
            <h3 class="h6" id="documentName">PEDIDO VENTA</h3>
            <input class='h6 celda-cotizacion' type="number" id="cotizacion" placeholder="Numero">
        </div>
    </div>

    <form class="form2" id="formulario">
        <div class="cajita1b">
            <div class="input-group">    
                <label for="ruc">CODIGO :</label>
                <input class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></input>
            </div>

            <div class="input-group"> 
                <label for="cliente">CLIENTE :</label>
                <input  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></input>
            </div>

        </div>

        <div class="cajita4">
            <div class="input-group">
                <label for="fecha">FECHA:</label>
                <input class="form-control celda" type="date" id="fecha">
            </div>

            <div class="input-group"> 
                <label for="vendedor">VENDEDOR:</label>
                <input  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></input>
            </div>

        </div>
    </form>



    <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Detalle</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Envio</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#tablaPagos" type="button" role="tab" aria-controls="tablaPagos" aria-selected="false">Pago</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#invoice" type="button" role="tab" aria-controls="contact" aria-selected="false">Documentos</button>
                </li>
    </ul>
    <div class="table-responsive">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <table id='table' class="tabla">  
                    <thead class="tituloTabla">
                        <tr><th class="no-print">#</th><th class="no-print">CODIGO</th><th>CANT.</th><th>UNIDAD</th><th>DESCRIPCION</th><th>PRECIO</th><th>IMPORTE</th></tr>
                    </thead>
                    <tbody class="container" id="container"></tbody>
                    <tfoot class="tfootTotales" id="tfoot">
                        <tr><td class="no-print"></td><td class="no-print"></td><td></td><td></td><td><label>Total (S/)</label></td><td></td><td><input id="celdaSubTotal" class="col" type="number" value="0"></td></tr>
                        <tr><td class="no-print"></td><td class="no-print"></td><td></td><td></td><td><label>Descuento (S/)</label></td><td></td><td><input id="descuento" class="col" type="number" value="0"></td></tr>
                        <tr><td class="no-print"></td><td class="no-print"></td><td></td><td></td><td><label>Total (S/)</label></td><td></td><td><input id="celda_total" class="col" type="number" value="0"></td></tr>
                    </tfoot>
                </table>
            </div>
            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <form id="deliveryForm">
                    <div><label for="numberGuia">Numero Guia:</label><input type="text" id="numberGuia" placeholder="Guia de remisón"></div>
                    <div><label for="fechaEnvio">Fecha Envio:</label><input type="date" id="fechaEnvio" required></div>
                    <div><label for="empresaEnvio">Empresa Transporte:</label><input type="text" id="empresaEnvio" required></div>
                    <div><label for="pesoEnvio">peso declarado:</label><input type="text" id="pesoEnvio"></div>
                    <div><label for="addressDelivery">Direccion Envio:</label><input type="text" id="" placeholder="Dirección del cliente" required></div>
                    <div><label for="gastoEnvio">Gasto Envio:</label><input type="number" id="gastoEnvio" required></div>
                    <div><label for="personaEnvio">Recibido por:</label><input type="text" id="personaEnvio" required></div>
                    <div><label for="telefonoEmpresaEnvio">Telefono Empresa:</label><input type="text" id="telefonoEmpresaEnvio" required></div>
                </form>
            </div>
            <div class="tab-pane fade" id="tablaPagos" role="tabpanel" aria-labelledby="contact-tab">
                <form class="row row-cols-1 row-cols-md-2 row-cols-lg-4" id="form-pagos">
                    <div><label for="fechaPago">Fecha Pago:</label><input type="date" id="fechaPago"></div>
                    <div><label for="metodoPago">Metodo Pago:</label><input type="text"id="metodoPago"></div>
                    <div><label for="importePago">Importe (S/):</label><input type="number" id="importePago"></div>
                </form>
                <div id="tablaPagos" class="tabla">
                    <table>
                    <thead>
                        <tr><th>N°</th><th>Fecha</th><th>Metodo</th><th>Importe</th></tr>
                    </thead>
                    <tbody id="containerPagos"></tbody>
                    <tfoot>
                        <tr><td></td><td>DOCUMENTO:</td><td>SALDO S/</td><td id="saldoDocumento"></td></tr>
                    </tfoot>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade" id="invoice" role="tabpanel" aria-labelledby="contact-tab">
                <form class="row row-cols-1 row-cols-md-2 row-cols-lg-4" id="form-guia">
                    <div><label for="tipoGuia">Tipo Guia:</label><input type="text" id="tipoGuia"></div>
                    <div><label for="serieNumeroGuia">Serie y Numero:</label><input type="text" id="serieNumeroGuia"></div>
                    <div><label for="fechaGuia">Fecha Guia:</label><input type="date"id="fechaGuia"></div>
                    <div><label for="pesoDeclarado">Peso declarado:</label><input type="number" id="pesoDeclarado"></div>
                    <div><label for="transportedBy">transportado por:</label><input type="text" id="transportedBy"></div>
                </form>
                 <form class="row row-cols-1 row-cols-md-2 row-cols-lg-4" id="form-invoice">
                    <div><label for="tipoDocumento">Tipo Documento:</label><input type="text" id="tipoDocumento"></div>
                    <div><label for="serieNumero">Serie y Numero:</label><input type="text" id="serieNumero"></div>
                    <div><label for="fechaDocumento">Fecha Documento:</label><input type="date"id="fechaDocumento"></div>
                    <div><label for="importeDocumento">Importe Total:</label><input type="number" id="importeDocumento"></div>
                </form>
            </div>
        </div>
    </div>

</section>
`;

export const formularioGuia = `
<section id="documentoPDF">

    <div class="grupo1">
        
        <div class="contacto">
            <div>
                <h1><i class="fa-regular fa-building"></i> Heinz Sport SAC</h1>
                <h1><i class="fa-solid fa-globe"></i> *****************</h1>
                <h1><i class="fa-regular fa-envelope"></i> *****************</h1>
                <h1><i class="fa-brands fa-whatsapp"></i> *****************</h1>
            </div>
        </div>
        <div></div>
        <div class="cajita2">
            <h3 class="h6" id="ruc2">RUC: 20000000000</h3>
            <h3 class="h6" id="documentName">PEDIDO VENTA</h3>
            <input class='h6 celda-cotizacion' type="number" id="cotizacion" placeholder="Numero">
        </div>
    </div>

    <form class="form2" id="formulario">
        <div class="cajita1b">
            <div class="input-group">    
                <label for="ruc">CODIGO :</label>
                <input class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></input>
            </div>

            <div class="input-group"> 
                <label for="cliente">CLIENTE :</label>
                <input  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></input>
            </div>

        </div>

        <div class="cajita4">
            <div class="input-group">
                <label for="fecha">FECHA:</label>
                <input class="form-control celda" type="date" id="fecha">
            </div>

            <div class="input-group"> 
                <label for="vendedor">VENDEDOR:</label>
                <input  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></input>
            </div>

        </div>
    </form>



    <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Detalle</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Envio</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#tablaPagos" type="button" role="tab" aria-controls="tablaPagos" aria-selected="false">Pago</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#invoice" type="button" role="tab" aria-controls="contact" aria-selected="false">Documentos</button>
                </li>
    </ul>
    <div class="table-responsive">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <table id='table' class="tabla">  
                    <thead class="tituloTabla">
                        <tr><th>#</th><th>CODIGO</th><th>CANT.</th><th>UNIDAD</th><th>DESCRIPCION</th></tr>
                    </thead>
                    <tbody class="container" id="container"></tbody>
                    <tfoot class="tfootTotales" id="tfoot">
                        <tr><td colspan = 4><label>Total Bultos:</label></td><td><input  class="col" type="number" value="0">------------------</td></tr>
                        <tr><td colspan = 4><label></label></td><td><input id="descuento" class="col" type="number" value="0"></td></tr>
                        <tr><td colspan = 4><label>Firma:</label></td><td><input id="descuento" class="col" type="number" value="0">------------------</td></tr>
                        <tr><td colspan = 4><label> Nombre y DNI:</label></td><td><input  class="col" type="number" value="0">------------------</td></tr>
                    </tfoot>
                </table>
            </div>
            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <form id="deliveryForm">
                    <div><label for="addressDelivery">Direccion Envio:</label><input type="text" id="" placeholder="Dirección del cliente" required></div>
                    <div><label for="fechaEnvio">Fecha Envio:</label><input type="date" id="fechaEnvio" required></div>
                    <div><label for="gastoEnvio">Gasto Envio:</label><input type="number" id="gastoEnvio" required></div>
                    <div><label for="empresaEnvio">Empresa Transporte:</label><input type="text" id="empresaEnvio" required></div>
                    <div><label for="personaEnvio">Recibido por:</label><input type="text" id="personaEnvio" required></div>
                    <div><label for="telefonoEmpresaEnvio">Telefono Empresa:</label><input type="text" id="telefonoEmpresaEnvio" required></div>
                </form>
            </div>
            <div class="tab-pane fade" id="tablaPagos" role="tabpanel" aria-labelledby="contact-tab">
                <form class="row row-cols-1 row-cols-md-2 row-cols-lg-4" id="form-pagos">
                    <div><label for="fechaPago">Fecha Pago:</label><input type="date" id="fechaPago"></div>
                    <div><label for="metodoPago">Metodo Pago:</label><input type="text"id="metodoPago"></div>
                    <div><label for="importePago">Importe (S/):</label><input type="number" id="importePago"></div>
                </form>
                <div id="tablaPagos" class="tabla">
                    <table>
                    <thead>
                        <tr><th>N°</th><th>Fecha</th><th>Metodo</th><th>Importe</th></tr>
                    </thead>
                    <tbody id="containerPagos"></tbody>
                    <tfoot>
                        <tr><td></td><td>DOCUMENTO:</td><td>SALDO S/</td><td id="saldoDocumento"></td></tr>
                    </tfoot>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade" id="Invoice" role="tabpanel" aria-labelledby="contact-tab">...</div>
        </div>
    </div>

</section>
`;

export function renderOrderForm(arrayObjeto) {
    const flotante      = document.querySelector('.modal-body');
    flotante.innerHTML  = formularioVenta;
    let documentName = document.getElementById('documentName')
    documentName.textContent='ORDEN VENTA';
    cotizacion.value    = arrayObjeto['values'].numero;
    vendedor.value      = arrayObjeto['values'].vendedor;
    ruc.value           = arrayObjeto['values'].ruc;
    cliente.value       = arrayObjeto['values'].cliente?arrayObjeto['values'].cliente:arrayObjeto['values'].proveedor;
    fecha.value         = translateDate(arrayObjeto['values'].fecha);


    let objetos = JSON.parse(arrayObjeto['values'].detalleCotizacion);


    pintarFilasLlenas(objetos)

    celdaSubTotal.value = arrayObjeto['values'].subTotal;
    descuento.value     = arrayObjeto['values'].descuento;
    celda_total.value   = arrayObjeto['values'].importeTotal;
};

export function renderBuyForm(arrayObjeto) {
    console.log('en renderbuyorder arrayObjeto:',arrayObjeto);
    
    const flotante      = document.querySelector('.modal-body');
    flotante.innerHTML  = formularioVenta;
    let documentName = document.getElementById('documentName')
    documentName.textContent='ORDEN COMPRA';
    cotizacion.value    = arrayObjeto['values'].nuevoNumero;
    vendedor.value      = arrayObjeto['values'].vendedor;
    ruc.value           = arrayObjeto['values'].ruc;
    cliente.value       = arrayObjeto['values'].cliente?arrayObjeto['values'].cliente:arrayObjeto['values'].proveedor;
    fecha.value         = translateDate(arrayObjeto['values'].fecha);
    //tipoPago.value      = arrayObjeto['values'].tipoPago;
    //metodoCobro.value   = arrayObjeto['values'].metodoCobro;
    

    let objetos = JSON.parse(arrayObjeto['values'].detalleCompra);


    pintarFilasLlenas(objetos)

    celdaSubTotal.value = arrayObjeto['values'].subTotal;
    descuento.value     = arrayObjeto['values'].descuento;
    celda_total.value   = arrayObjeto['values'].importeTotal;
};

function pintarFilasLlenas(objetos) {
    const tabla = document.querySelector('.container')
    let contador = 1

    objetos.forEach(producto => {
        let fila = document.createElement('tr')

        fila.innerHTML = `
                    <td><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button>${contador}</td>
                    <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button>${producto.id}</td> 
                    <td class='cantidad'><input type='number'  min="0" step="0.1" class='cantidad2' id='${producto.id}' value=${producto.cantidad}></td>
                    <td>${producto.unidad}</td>
                    <td>${producto.nombre}</td>
                    <td class='cantidad'><input type='number' min="0" step="0.1" class='cantidad2'  id='${producto.id}' value=${producto.precio}></td>
                    <td class='cantidad'><input type='number'  id='${producto.id}' class='cantidad2'  value=${producto.importe.toFixed(2)}></td>
                    `
        contador++
        tabla.appendChild(fila)
    });
};

export function renderOrdenManufacture(arrayObjeto) {
    console.log('dentro de renderOrdenManufacture',arrayObjeto['values'].productRoute);
    
    const flotante      = document.querySelector('.modal-body');
    flotante.innerHTML  = formularioVenta;
    let documentName = document.getElementById('documentName');

    if (arrayObjeto['values'].productRoute=='buy') {
        documentName.textContent='ORDEN COMPRA';
    } else {
        documentName.textContent='ORDEN PRODUCCION';
    }
    
    /*
    cotizacion.value    = arrayObjeto['values'].numero;
    vendedor.value      = arrayObjeto['values'].vendedor;
    ruc.value           = arrayObjeto['values'].ruc;
    cliente.value       = arrayObjeto['values'].cliente?arrayObjeto['values'].cliente:arrayObjeto['values'].proveedor;
    fecha.value         = translateDate(arrayObjeto['values'].fecha);
    //tipoPago.value      = arrayObjeto['values'].tipoPago;
    //metodoCobro.value   = arrayObjeto['values'].metodoCobro;
    
    let objetos = JSON.parse(arrayObjeto['values'].detalleCotizacion);
    */
    let objetos = [{},{},{}];

    pintarFilasLlenas(objetos)

    //celdaSubTotal.value = arrayObjeto['values'].subTotal;
    //descuento.value     = arrayObjeto['values'].descuento;
    //celda_total.value   = arrayObjeto['values'].importeTotal;
};

