import { updateProduct, traerUnSocio, traeroneProduct, guardarCotizacion, traerUnNumeracion, updateNumeracion, traerUnColaborador, guardarCompras } from '../firebase.js';

console.log('iniciando lectura de archivo consultaVentas.js');
import { translateDate } from "../plugins/translateDate.js";
import { deleteElementHTML } from "../plugins/deleteElementHTML.js";
import { } from "../src/app/logout.js";
import { showMessage } from "../src/app/showMessage.js";
import { formularioVenta } from "./formularioVenta.js";


export function newDocument(typeOperation) {
    let alternador = true

    let objetos = JSON.parse(localStorage.getItem('cotizacion'));
    const flotante = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    deleteElementHTML('.modal-footer');

    //const flotante = document.getElementById('flotante');
    flotante.innerHTML = formularioVenta;

    const tabDetalle = document.getElementById('home')
    tabDetalle.innerHTML = `
    <table id='table' class="tabla">  
    <thead class="tituloTabla">
        <tr><th>#</th><th>CODIGO</th><th>CANT.</th><th>UNIDAD</th><th>DESCRIPCION</th><th>PRECIO</th><th>IMPORTE</th></tr>
    </thead>

    <tbody class="container" id="container"></tbody>
    <tfoot class="tfootTotales" id="tfoot">
        <tr><td></td><td></td><td></td><td></td><td><label>Total</label></td><td>S/</td><td><input id="celdaSubTotal" class="col" type="number" value="0"></td></tr>
        <tr><td></td><td></td><td></td><td></td><td><label>Descuento</label></td><td>S/</td><td><input id="descuento" class="col" type="number" value="0"></td></tr>
        <tr><td></td><td></td><td></td><td></td><td><label>Total</label></td><td>S/</td><td><input id="celda_total" class="col" type="number" value="0"></td></tr>
    </tfoot>
    </table>
    ` ;

    if (typeOperation == 'OrdenCompra') {
        let documentName = document.getElementById('documentName')
        documentName.textContent = 'ORDEN COMPRA';

        const btnSaveDocument = document.createElement('button');
        btnSaveDocument.setAttribute('id', 'btn-guardar');
        btnSaveDocument.setAttribute('class', 'btn btn-primary');
        btnSaveDocument.textContent = 'Guardar';
        btnSaveDocument.addEventListener('click', registrarCompra);
        modalFooter.appendChild(btnSaveDocument);
        console.log('se creo el boton para COMPRA');

    } else {
        //creando el boton guaradar y añadiendo al modal footer
        const btnSaveDocument = document.createElement('button');
        btnSaveDocument.setAttribute('id', 'btn-guardar');
        btnSaveDocument.setAttribute('class', 'btn btn-primary');
        btnSaveDocument.textContent = 'Guardar';
        btnSaveDocument.addEventListener('click', registrarVenta);
        modalFooter.appendChild(btnSaveDocument);
        console.log('se creo el boton para VENTA');
    }

    const documentoPDF = document.getElementById('documentoPDF');
    const cajaIngreso = document.createElement('div');
    cajaIngreso.setAttribute('class', 'cajaBotones');
    cajaIngreso.setAttribute('id', 'entradaDato');
    cajaIngreso.innerHTML = `
    <div class="entradaDato">
    <label for="codigo" class='codigo'>Codigo:</label>
    <input class='celda ' type="text" id="codigo" list="productos" placeholder="Ingrese código de producto"><span class="validity"></span>
    <button id="boton">Ingresar</button>
    <button class="semaforo" id="semaforo">''</button>
    `
    documentoPDF.appendChild(cajaIngreso);

    //botones de modal cuadro de dialogo
    let sentinelaGuardar = false;//se cambia a true cuando se presiono el boton guardado por vez primera
    const btn_ingresar = document.getElementById('boton');
    const form = document.getElementById('formulario');
    const tabla = document.getElementById('container');
    const celdaSubTotal = document.getElementById('celdaSubTotal')
    const inpDescuento = document.getElementById('descuento')
    const celda_total = document.getElementById('celda_total')
    const inpCodigo = document.getElementById('codigo')
    const inpCodigoCliente = document.getElementById('ruc');
    const inpCliente = document.getElementById('cliente')
    const fecha = document.getElementById('fecha')
    const btn_semaforo = document.querySelector('.semaforo')
    const numeroCotizacion = document.getElementById('cotizacion')
    const cajaClientes = document.getElementById('ruc')

    fecha.value = translateDate();
    console.log('translateDate():', translateDate());
    console.log('fecha.value:', fecha);

    //reconoce evento arrastre a la derecha en movil
    let f = new Hammer(inpCodigoCliente)
    f.on('panright', activarEnter2)

    let a = new Hammer(inpCodigo)
    a.on('panright', actualizaImporte)

    //datalist para clientes
    let datalist1 = document.createElement('datalist')
    datalist1.setAttribute('id', 'datoClientes')
    /*
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
        }
    */
    datalist1.innerHTML = `
  <option value='08604665'>OSORIO SIGUAS AMERICO REMIGIO</option>
  <option value='09462653'>HENRY MESA GARAY RUDY</option>
  <option value='10013031083'>Eulogio Huancco Ticona</option>
  <option value='10086833315'>LINGAN SEJURO OSCAR ANTONIO</option>
  <option value='10105176363'>ALVARADO ROMAN ISOLINA SILVIA</option>
  <option value='10400035801'>QUENAYA TORRES IOVANNA MARILU</option>
  <option value='10401249716'>ORE GUERRA NELCI</option>
  <option value='10421927788'>ALAYO CRUZ WILSON DAVID</option>
  <option value='10450270461'>LUNG ISIDRO BETSY NATALY</option>
  <option value='10473550151'>Wilfredo Mayta</option>
  <option value='20428756518'>PALAVA E.I.R.L.</option>
  <option value='20518248147'>CEMPLASTIC S.A.C.</option>
  <option value='20508679514'>DISTRIBUIDORA MURDOCK S.R.L.</option>
  <option value='20512048839'>FREDY PONCE & MARANATHA S.A.C.</option>
  <option value='20601632137'>JAL PERU INVERSIONES EIRL</option>
  <option value='20602683461'>RHENACER & CARMEN S.A.C.</option>
  <option value='20608956868'>BIOSELVA PACK S.A.C.</option>
  <option value='48348426'>MANUEL HUANUCO ALBINO</option>
  <option value='73675942'>DEINER CAMPOS</option>
  <option value='77269606'>PAOLA ELIZABETH GARCIA VILCHEZ</option>
  `
    cajaClientes.appendChild(datalist1)

    //datalist para productos
    let datalist = document.createElement('datalist')
    datalist.setAttribute('id', 'productos')
    datalist.innerHTML = `
  <option value='EB0010'>Funda Sorbetes S/M</option>
  <option value='EB0011'>Bolsa Plancha para Sorbetes</option>
  <option value='EB0020'>Funda Palo delgado</option>
  <option value='EB0021'>Funda Copitas paliglobos</option>
  <option value='EB0022'>Bolsa palos chicos millar</option>
  <option value='EB0030'>Funda Sorbeton 50U</option>
  <option value='EB0050'>Funda palo grueso 50U</option>
  <option value='EB0051'>Funda Copa Grande 50U</option>
  <option value='EB0052'>Bolsa Palos Grueso Milla</option>
  <option value='EB0053'>'Bolsa Copa Grande Millar</option>
  <option value='EB0060'>Manga Azul Baja 40x2.5</option>
  <option value='MB0010'>MB Blanco</option>
  <option value='MB0011'>MB Naranja Colortec</option>
  <option value='MB0012'>MB Rojo Escarlata</option>
  <option value='MB0013'>MB Verde Palta</option>
  <option value='MB0014'>MB Amarillo Electrico</option>
  <option value='MB0015'>MB Celeste Andino</option>
  <option value='PB0070'>Paliglobos desarmables base</option>
  <option value='PC0050'>Palito Chupetin Blanco (1.4MillxKg)</option>
  <option value='PD0070'>Paliglobos delgados</option>
  <option value='PD0071'>Paliglobos delgados palos transp.</option>
  <option value='PD0072'>Paliglobos delgados copas transp.</option>
  <option value='PD0073'>Paliglobos delgados palos blanco</option>
  <option value='PD0074'>Paliglobos delgados copas blanco</option>
  <option value='PD0075'>Paliglobos delgados palos rojo</option>
  <option value='PD0076'>Paliglobos delgados copas rojo</option>
  <option value='PG0070'>Paliglobos #40 Transp.</option>
  <option value='PG0071'>Palos #40 transparente</option>
  <option value='PG0072'>Copas #40 transparente</option>
  <option value='PG0073'>Palos #40 blanco</option>
  <option value='PG0074'>Copas #40 blanco</option>
  <option value='PG0075'>Palos #40 rojo</option>
  <option value='PG0076'>Copas #40 rojo</option>
  <option value='PI0010'>Pig. Flourecente Fucsia</option>
  <option value='PI0011'>Pig. Azul Ultramar</option>
  <option value='PI0012'>Pig. Dioxido Titanio </option>
  <option value='PI0013'>Col. Azul a la Grasa</option>
  <option value='PP0010'>PP peletizado cristal extrusion</option>
  <option value='PP0011'>PP peletizado negro rafia</option>
  <option value='PV0010'>Polipropileno Virgen Extrusión</option>
  <option value='SB0050'>Sorbete monocolor clasicos</option>
  <option value='SB0051'>Sorbetes Clásico Negro S/M</option>
  <option value='SB0052'>Sorbetes Clásico Blanco S/M</option>
  <option value='SB0070'>Sorbetes Rayados Surtido S/M </option>
  <option value='SD0070'>Sorbetes Forrados 50UNID. </option>
  <option value='SF0010'>Sorbetes flexibles rayados</option>
  <option value='SF0011'>Sorbetes Flexible Negro S/M</option>
  <option value='SF0012'>Sorbete Flexible Blanco S/M</option>
  <option value='SF0013'>Sorbetes Flexible Colores S/M</option>
  <option value='ST0070'>Sorbeton Forrado</option>
  <option value='ST0071'>Sorbeton Colores </option>
  <option value='ST6000'>Sorbeton Recto Colores S/M</option>
  <option value='ST7001'>Sorbeton Blanco S/M</option>
  <option value='ST7003'>Sorbeton Naranja S/M</option>
  <option value='SP7000'>Sorbete Papel Blanco S/M</option>
  <option value='PR1000'>Picador Color Surtido S/M</option>
  <option value='CU1000'>Cucharitas #4 Colores S/M</option>
  `
    entradaDato.appendChild(datalist)


    cargarEventListeners()

    function cargarEventListeners() {
        translateDate()
        pintarTabla(objetos)

        btn_ingresar.addEventListener('click', ingresarProducto)
        inpCodigo.addEventListener('keypress', activarEnter)
        inpCodigoCliente.addEventListener('keypress', activarEnter2)
        tabla.addEventListener('click', operacionesEnTabla)
        tabla.addEventListener('keypress', actualizaImporte)
    };

    function updateAssignedStock(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
        let counter = 0
        let newAssignedStock = 0
        ArrayObjetos.forEach(async (obj) => {
            let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            //console.log('producto traido id stock:', fila.id, fila.assignedStock)
            newAssignedStock = Number(fila.assignedStock) + Number(obj.cantidad)
            updateProduct(obj.id, { assignedStock: newAssignedStock })
            counter++
        })
        showMessage(`se actualizo assignedStock::${newAssignedStock}`, 'success')
    };

    function updateProductToReceive(ArrayObjetos) {//ACTUALIZA STOCK VARIOS ITEMS
        console.log('dentro de productos por recibir:', ArrayObjetos);

        let counter = 0;
        let newProductToReceive = 0;
        ArrayObjetos.forEach(async (obj) => {
            let traerDoc = await traeroneProduct(obj.id);                   //trae un producto de la DB
            let fila = await traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            newProductToReceive = Number(fila.productToReceive) + Number(obj.cantidad);
            console.log('fila.productToReceive:', traerDoc.id, fila.productToReceive, obj.cantidad, newProductToReceive);
            updateProduct(obj.id, { productToReceive: newProductToReceive })
            counter++
        })
        showMessage(`se actualizo productToReceive::${newProductToReceive}`, 'success')
    };


    function pintarTabla(objetos) {
        console.log('Lo que hay en LS:', objetos)
        if (objetos == null) {
            return;
            //pintarFilasVacias(objetos)
        } else {
            deleteElementHTML('.container')
            pintarFilasLlenas(objetos)
            actualizaImporteTotal()
        }
    };

    function registrarVenta() {
        console.log('dentro funcion registrar Venta:')

        let tiempo = Date.now()
        let cliente = form['cliente'].value
        let ruc = form['ruc'].value
        let vendedor = form['vendedor'].value
        let detalleCotizacion = JSON.stringify(objetos)
        let estado = 'nuevo'
        let tipoPago = '';
        let nuevoNumero = Number(numeroCotizacion.value)
        let fecha = form['fecha'].value
        let subTotal = Number(celdaSubTotal.value)
        let descuento = Number(inpDescuento.value)
        let importeTotal = subTotal - descuento
        let transportedBy = 'sin enviar';

        console.log('importeTotal:', importeTotal)
        console.log('descuento:', descuento)
        console.log('tiempo:', tiempo)

        if (nuevoNumero && fecha && !sentinelaGuardar) {

            console.log('numero:', nuevoNumero)
            updateAssignedStock(objetos)
            guardarCotizacion(nuevoNumero, fecha, vendedor, cliente, ruc, detalleCotizacion, estado, tipoPago, subTotal, descuento, importeTotal, tiempo, transportedBy)
            updateNumeracion('Cotizacion', { ultimoNumero: nuevoNumero })
            //updateClientes(ruc, { saldo: nuevoSaldo,clienteRank: 2 })
            showMessage(`Se registro un nuevo pedido:${nuevoNumero}`, 'success')
            sentinelaGuardar = true;
            limpiarDocumento();
            const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
            modal.hide()
        } else {
            showMessage(`Poner numero de Venta, fecha o ya se guardado el pedido.`)
        }

    };

    function registrarCompra() {
        console.log('dentro funcion registrar Compra:')

        let tiempo = Date.now()
        //let hoy                 = new Date(tiempo)

        let proveedor = form['cliente'].value
        let ruc = form['ruc'].value
        let usuario = form['vendedor'].value
        let detalleCompra = JSON.stringify(objetos)
        let estado = 'pendiente'
        let tipoPago = '';
        let documento = '';
        let nuevoNumero = Number(numeroCotizacion.value)
        let fecha = form['fecha'].value
        let subTotal = Number(celdaSubTotal.value)
        let descuento = Number(inpDescuento.value)
        let importeTotal = subTotal - descuento

        console.log('tiempo:', tiempo)
        console.log('fecha:', fecha)

        if (nuevoNumero && !sentinelaGuardar) {
            console.log('numero:', nuevoNumero)
            updateProductToReceive(objetos);
            guardarCompras(nuevoNumero, usuario, proveedor, ruc, detalleCompra, estado, tipoPago, subTotal, descuento, importeTotal, tiempo, documento, fecha);
            //actualizarStock(objetos);
            updateNumeracion('Compras', { ultimoNumero: nuevoNumero });
            //updateClientes(ruc, {saldoProveedor: saldoAnterior + importeTotal })

            //console.log('Registro de Compra es un exito:',hoy.toLocaleDateString())
        } else {
            alert('Poner numero de compra')
        }
    };

    function actualizaImporte(e) {

        if (e.key === 'Enter' || e.type == 'panright') {
            e.preventDefault()

            for (let i = 0; i < objetos.length; i++) {
                objetos[i].cantidad = parseFloat(tabla.children[i].children[2].children[0].value)
                objetos[i].precio = parseFloat(tabla.children[i].children[5].children[0].value)
                objetos[i].importe = parseFloat(objetos[i].cantidad * objetos[i].precio)
            }
            deleteElementHTML('.container')
            pintarTabla(objetos)
            actualizaImporteTotal()
            console.log('objeto actualizado:', objetos)
        }
    };

    function actualizaImporteTotal() {
        let total = objetos.reduce((tot, producto) => tot + producto.importe, 0)
        celdaSubTotal.value = total.toFixed(2)
        let desc = inpDescuento.value
        celda_total.value = (celdaSubTotal.value - desc).toFixed(2)
        //Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
    };

    function operacionesEnTabla(e) {

        if (e.target.classList.contains('btn-delete')) {
            eliminarProducto(e)
        }
        if (e.target.classList.contains('btn-stock')) {
            filaMuestraStock(e)
        }
    };

    function eliminarProducto(e) {
        let id_producto = e.target.getAttribute('data-id');
        objetos = objetos.filter((producto) => producto.id !== id_producto);
        //deleteElementHTML('.container');
        pintarTabla(objetos);
    };

    function filaMuestraStock(e) {
        let filasTabla = document.querySelectorAll('tbody tr');
        let id_producto = e.target.getAttribute('data-id')                            //captura el ID producto de la fila
        let ubicacion = objetos.findIndex((elem) => { return elem.id == id_producto })    //captura el indice o poscion del objeto producto de la fila

        if (alternador) {//para expandir o contraer fila
            let producto_encontado = objetos.find((elem) => { return elem.id == id_producto })  //encuentra el productos en el objeto con el ID anterior
            let fila = document.createElement('tr')
            let celda = document.createElement('td')
            celda.textContent = producto_encontado.stock
            fila.appendChild(celda)
            tabla.insertBefore(fila, tabla.children[ubicacion + 1])
            alternador = false
        } else {
            tabla.removeChild(tabla.children[ubicacion + 1])
            alternador = true
        }
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
        sincronizarLocalStorage(objetos)
    };

    function sincronizarLocalStorage(objetos) {
        localStorage.setItem('cotizacion', JSON.stringify(objetos))
        objetos = JSON.parse(localStorage.getItem('cotizacion'))
    };

    async function ingresarProducto(e) {

        //e.preventDefault()
        btn_semaforo.classList.remove('semaforo-verde')
        btn_semaforo.classList.remove('semaforo-ambar')
        btn_semaforo.classList.remove('semaforo-rojo')
        //console.log('dentro de funcion ingresarproducto',e.target)
        let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
        console.log('id ingresado:', id)
        if (id) {
            console.log('objeto a evaluar:', objetos)
            if (objetos == null) {
                objetos = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
            }
            let duplicado = objetos.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto

            if (!duplicado) {
                inpCodigo.select();                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
                btn_semaforo.classList.toggle('semaforo-verde');
                btn_semaforo.textContent = 'exito!';
                let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB
                console.log('lo que trae de firebase:', traerDoc);

                let fila = traerDoc.data();
                //.data() metodo para mostrar solo los datos del producto
                fila.id = traerDoc.id;                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
                fila.cantidad = 1                                             //por defecto cantidad igual a 1
                fila.importe = fila.precio * fila.cantidad                      //calculamos l importe

                objetos.push(fila)                                          //metemos los datos de fila en objetos
                //deleteElementHTML('.container')                                             //limpir datos de la tabla
                pintarTabla(objetos)
            } else {
                btn_semaforo.classList.toggle('semaforo-rojo');
                btn_semaforo.textContent = 'duplicado';
            }

            console.log('contenido del objeto:', objetos)

        } else {
            btn_semaforo.classList.toggle('semaforo-ambar');
            btn_semaforo.textContent = 'vacio';
        }
    };

    function activarEnter(e) {
        if (e.key === 'Enter') {
            ingresarProducto();
        }
    };

    async function activarEnter2(e) {
        if (e.key === 'Enter' || e.type == 'panright') {
            let id = inpCodigoCliente.value.trim();
            console.log('presionaste enter...', id)                   //trae un nombre de cliente de la DB
            let traerDoc = await traerUnSocio(id);
            let fila = await traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            let razonSocial = fila.razonSocial;
            inpCliente.value = razonSocial
            //<h3 class="h6" id="documentName">PEDIDO VENTA</h3>
            let tipoDocumento = document.getElementById('documentName').textContent
            if (tipoDocumento == 'PEDIDO VENTA') {
                let traerDoc2 = await traerUnNumeracion('Cotizacion')
                let dato = traerDoc2.data()
                numeroCotizacion.value = Number(dato.ultimoNumero) + 1;

                let traerDoc3 = await traerUnColaborador(fila.vendidoPor)
                let dato3 = traerDoc3.data()
                if (dato3) {
                    form['vendedor'].value = `${dato3.nombres} ${dato3.apellidos}`;
                }
            } else {
                let traerDoc2 = await traerUnNumeracion('Compras')
                let dato = traerDoc2.data()
                numeroCotizacion.value = Number(dato.ultimoNumero) + 1;

                /*
                let traerDoc3 = await traerUnColaborador(fila.vendidoPor)
                let dato3 = traerDoc3.data()
                if (dato3) {
                    form['vendedor'].value = `${dato3.nombres} ${dato3.apellidos}`;
                }
                */
            }


        }
    };

    function limpiarDocumento() {
        localStorage.removeItem('cotizacion');
        objetos = []
        numeroCotizacion.value = '';//corregir aparece como no definido al crear nuevo pedido
        celdaSubTotal.value = '';
        inpDescuento.value = '';
        celda_total.value = '';
        form.reset()
        pintarTabla(objetos) //vueve a pintar el formulario vacio
    };

};