import { traeroneProduct, updateProduct, guardarCotizacion, traerUnSocio, traerUnNumeracion, updateNumeracion, updateClientes } from './firebase.js'


//const url = window.location.href;
const url = new URL(window.location.href); // se crea el objeto URL, el cual almacena toda la URL
const params = url.searchParams; //se almacenan todos los parámetros en una variable
const id = params.get("id"); // se utiliza el método GET para captar el valor del parámetro nombre
//const edad = params.get("edad"); // se utiliza el método GET para captar el valor del parámetro edad
console.log('el id del contacto es:',id); // se muestra en consola el valor "Juan"
//console.log(edad); // se muestra en consola el valor "25"
console.log('url:',url)

const btn_ingresar = document.getElementById('boton');
const form = document.getElementById('formulario');
const tabla = document.getElementById('container');
const tabla2 = document.getElementById('container2');
const btn_guardar = document.getElementById('btn-guardar');
const btn_imprimir = document.getElementById('btn-imprimir')
const celdaSubTotal = document.getElementById('celdaSubTotal')
const inpDescuento = document.getElementById('descuento')
const inpDescuento2 = document.getElementById('descuento2')
const celda_total = document.getElementById('celda_total')
const celda_total2 = document.getElementById('celda_total2')
const inpCodigo = document.getElementById('codigo')
const inpCodigoCliente = document.getElementById('ruc');
const inpCliente = document.getElementById('cliente')
const fecha = document.getElementById('fecha')
const btn_semaforo = document.querySelector('.semaforo')
const numeroCotizacion = document.getElementById('cotizacion')
const cajaClientes = document.getElementById('cajaClientes')





let alternador = true
let sentinelaGuardar = false;//se cambia a true cuando se presiono el boton guardado por vez primera
//let objetos=[]
let start = true
let start2 = true
//Inventario=[{Materiales:1000},{Procesos:700},{Terminados:0}]
let saldo = 0; //espacio para guardar el saldo anterior del cliente

//datalist para clientes
let datalist1 = document.createElement('datalist')
datalist1.setAttribute('id', 'datoClientes')
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
let datalist2 = document.createElement('datalist')
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
`;
entradaDato.appendChild(datalist)
entradaDato2.appendChild(datalist2)

let objetosOrigen = JSON.parse(localStorage.getItem('Origen'))
let objetosDestino = JSON.parse(localStorage.getItem('Destino'))


cargarEventListeners()

function cargarEventListeners() {
    pintarFecha()
    pintarTablaOrigen(objetosOrigen)
    pintarTablaDestino(objetosDestino)

    btn_ingresar.addEventListener('click', ingresarProducto)
    inpCodigo.addEventListener('keypress', activarEnter)
    inpCodigoCliente.addEventListener('keypress', activarEnter2)
    btn_guardar.addEventListener('click', registrarVenta)
    btn_imprimir.addEventListener('click', generaPDF)
    tabla.addEventListener('click', operacionesEnTabla)
    tabla.addEventListener('keypress', actualizaImporte)
    //tabla.addEventListener('touchend',actualizaImporteTouch)        
}

function pintarTablaOrigen(objetos) {
    console.log('Lo que hay en LS:', objetos)
    if (objetos == null) {
        pintarFilasVacias(objetos)
    } else {
        limpiarTabla()
        pintarFilasLlenas(objetos)
        pintarFilasVacias(objetos)
        actualizaImporteTotal()
    }
}

function pintarTablaDestino(objetos) {
    console.log('Lo que hay en LS:', objetos)
    if (objetos == null) {
        pintarFilasVacias2(objetos)
    } else {
        limpiarTabla()
        pintarFilasLlenas2(objetos)
        pintarFilasVacias2(objetos)
        actualizaImporteTotal2()
    }
}

function actualizarStock(objetos) {//ACTUALIZA STOCK VARIOS ITEMS
    let counter = 0
    objetos.forEach((obj) => {
        let id = obj.id
        let nuevo_stock = obj.stock - obj.cantidad
        updateProduct(id, { stock: nuevo_stock })
        counter++
    })
    alert(`Se actualizó: ${counter} productos`)
}

function registrarVenta() {
    console.log('dentro funcion registraVenta:')

    let tiempo = Date.now()
    let cliente = form['cliente'].value
    let ruc = form['ruc'].value
    let vendedor = form['vendedor'].value
    let detalleCotizacion = JSON.stringify(objetosOrigen)
    let estado = 'pendiente'
    let tipoPago = form['tipoPago'].value
    let metodoCobro = form['metodoCobro'].value
    let nuevoNumero = Number(numeroCotizacion.value)
    let fecha = form['fecha'].value
    let subTotal = Number(celdaSubTotal.value)
    let descuento = Number(inpDescuento.value)
    let importeTotal = subTotal - descuento
    let nuevoSaldo = saldo + importeTotal;

    console.log('tipoPago:', subTotal)
    console.log('metodoCobro:', descuento)
    console.log('tiempo:', tiempo)

    if (nuevoNumero && !sentinelaGuardar) {

        console.log('numero:', nuevoNumero)
        actualizarStock(objetosOrigen)
        guardarCotizacion(nuevoNumero, fecha, vendedor, cliente, ruc, detalleCotizacion, estado, tipoPago, metodoCobro, subTotal, descuento, importeTotal, tiempo)
        updateNumeracion('Cotizacion', { ultimoNumero: nuevoNumero })
        updateClientes(ruc, { saldo: nuevoSaldo })

        console.log('Registro de cotizacion es un exito:', hoy.toLocaleDateString())
        sentinelaGuardar = true;
    } else {

        alert('Poner numero de Venta o ya se guarado el pedido.')
    }
}

function actualizaImporte(e) {

    if (e.key === 'Enter') {
        e.preventDefault()

        for (let i = 0; i < objetosOrigen.length; i++) {
            objetosOrigen[i].cantidad = parseFloat(tabla.children[i].children[3].children[0].value)
            objetosOrigen[i].precio = parseFloat(tabla.children[i].children[6].children[0].value)
            objetosOrigen[i].importe = parseFloat(objetosOrigen[i].cantidad * objetosOrigen[i].precio)
        }
        limpiarTabla(e)
        pintarTablaOrigen(objetosOrigen)
        actualizaImporteTotal()
        console.log('objeto actualizado:', objetosOrigen)
    }
}

function limpiarTabla() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild)
    }
}

function actualizaImporteTotal(objetos) {

    let total           = objetos.reduce((tot, producto) => tot + producto.importe, 0)
    celdaSubTotal.value = total.toFixed(2)
    let desc            = descuento.value
    celda_total.value   = Intl.NumberFormat('es-419').format(celdaSubTotal.value - desc)
}

function actualizaImporteTotal2(objetos) {

    let total = objetos.reduce((tot, producto) => tot + producto.importe, 0)

    celdaSubTotal.value = total.toFixed(2)
    let desc = descuento.value
    celda_total2.value = Intl.NumberFormat('es-419').format(celdaSubTotal.value - desc)
    //Intl.NumberFormat('es-419',{ maximumSignificantDigits:7}).format(obj.values.importeTotal);
}

function operacionesEnTabla(e) {

    if (e.target.classList.contains('btn-delete')) {
        eliminarProducto(e)
    }
    if (e.target.classList.contains('btn-stock')) {
        filaMuestraStock(e)
    }
}

function eliminarProducto(e) {
    let id_producto = e.target.getAttribute('data-id')

    objetosOrigen = objetosOrigen.filter((producto) => producto.id !== id_producto)
    limpiarTabla()
    console.log('diste clik en boton delete... nuevo objeto', objetosOrigen)
    pintarTablaOrigen(objetosOrigen)
}

function filaMuestraStock(e) {
    let filasTabla = document.querySelectorAll('tbody tr');
    console.log('filasTabla:', filasTabla);
    let id_producto = e.target.getAttribute('data-id')                            //captura el ID producto de la fila
    let ubicacion = objetosOrigen.findIndex((elem) => { return elem.id == id_producto })    //captura el indice o poscion del objeto producto de la fila

    if (alternador) {//para expandir o contraer fila
        let producto_encontado = objetosOrigen.find((elem) => { return elem.id == id_producto })  //encuentra el productos en el objeto con el ID anterior
        console.log('clik en (+), el stock es:', producto_encontado.stock)
        let fila = document.createElement('tr')
        let celda = document.createElement('td')
        celda.textContent = producto_encontado.stock
        fila.appendChild(celda)
        console.log('Filas Ubicacion:', ubicacion)
        tabla.insertBefore(fila, tabla.children[ubicacion + 1])
        alternador = false
    } else {
        tabla.removeChild(tabla.children[ubicacion + 1])
        alternador = true
    }
}

function pintarFilasLlenas(objetos) {
    let contador = 1
    objetos.forEach(producto => {
        let fila = document.createElement('tr')

        fila.innerHTML = `
                        <td><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button></td>
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td><input type='number'  min="0" step="0.1" class='cantidad' id='${producto.id}' value=${producto.cantidad}></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td><input type='number' min="0" step="0.1" class='precio' id='${producto.id}' value=${producto.precio}></td>
                        <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe.toFixed(2)}></td>
                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button></td>                       
                        `
        contador++
        tabla.appendChild(fila)
    });
    sincronizarLocalStorage(objetos,'Origen')
}

function pintarFilasLlenas2(objetos) {
    let contador = 1
    objetos.forEach(producto => {
        let fila = document.createElement('tr')

        fila.innerHTML = `
                        <td><button class ='btn-stock fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button></td>
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td><input type='number'  min="0" step="0.1" class='cantidad' id='${producto.id}' value=${producto.cantidad}></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.nombre}</td>
                        <td><input type='number' min="0" step="0.1" class='precio' id='${producto.id}' value=${producto.precio}></td>
                        <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe.toFixed(2)}></td>
                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button></td>                       
                        `
        contador++
        tabla2.appendChild(fila)
    });
    sincronizarLocalStorage(objetos,'Destino')
}

function pintarFilasVacias(objetos) {
    if (start) { objetos = []; start = false }
    let filasLlenas = objetos.length
    let filasVacias = 8
    for (let i = 0; i < filasVacias - filasLlenas; i++) {
        let fila = document.createElement('tr')
        fila.innerHTML = ` <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td> 
                            `
        //al borrar el tag input del td no funcionara la funcion presente, averiguar
        tabla.appendChild(fila)
    }
}

function pintarFilasVacias2(objetos) {
    if (start2) { objetos = []; start2 = false }
    let filasLlenas = objetos.length
    let filasVacias = 8
    for (let i = 0; i < filasVacias - filasLlenas; i++) {
        let fila = document.createElement('tr')
        fila.innerHTML = ` <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><input></td>
                            <td></td>
                            <td></td> 
                            `
        //al borrar el tag input del td no funcionara la funcion presente, averiguar
        tabla2.appendChild(fila)
    }
}

function sincronizarLocalStorage(objetos,nombreObj) {
    localStorage.setItem(nombreObj, JSON.stringify(objetos))
    objetos = JSON.parse(localStorage.getItem(nombreObj))
}

async function generaPDF() {
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
    let id_cotizacion = document.getElementById('cotizacion').value

    await html2pdf()
        .set({
            margin: 5,
            filename: `PV${id_cotizacion}_${form['cliente'].value}`,
            //se borro image jpg, averiguar codigo origina en github del cdn html2pdf form['cliente'].value
            html2canvas: {
                scale: 5, // A mayor escala, mejores gráficos, pero más peso
                letterRendering: true,
            },
            jsPDF: {
                unit: "mm",
                format: 'a5',
                orientation: 'landscape' // landscape o portrait
            }
        })
        .from(areaImpresion)
        .save()
        .catch(err => console.log(err));
    /*
    navigator.share({
        title:'probando esta nueva API',
        text:'Desde Heinz Sport SAC',
        url:'./cotizacion.pdf'
    })
*/
    localStorage.removeItem('cotizacion');
    objetosOrigen = []
    numeroCotizacion.value = '';
    celdaSubTotal.value = '';
    inpDescuento.value = '';
    celda_total.value = '';
    form.reset()
    pintarTablaOrigen(objetosOrigen) //vueve a pintar el formulario vacio
}

function pintarFecha() {
    let date = new Date(Date.now())
    fecha.value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    //console.log('fecha:...',fecha.value)
}

async function ingresarProducto(e) {

    //e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    //console.log('dentro de funcion ingresarproducto',e.target)
    let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:', id)
    if (id) {
        console.log('objeto a evaluar:', objetosOrigen)
        if (objetosOrigen == null) {
            objetosOrigen = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
        }
        let duplicado = objetosOrigen.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto

        if (!duplicado) {
            inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
            btn_semaforo.classList.toggle('semaforo-verde')
            btn_semaforo.textContent = 'exito!'
            let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB

            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            fila.id = traerDoc.id;                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
            fila.cantidad = 1;                                            //por defecto cantidad igual a 1
            fila.importe = fila.precio * fila.cantidad;                      //calculamos l importe

            objetosOrigen.push(fila)                                          //metemos los datos de fila en objetos
            limpiarTabla(e)                                             //limpir datos de la tabla
            pintarTablaOrigen(objetosOrigen)
        } else {
            btn_semaforo.classList.toggle('semaforo-rojo')
            btn_semaforo.textContent = 'duplicado'
        }

        console.log('contenido del objeto:', objetosOrigen)

    } else {
        btn_semaforo.classList.toggle('semaforo-ambar')
        btn_semaforo.textContent = 'vacio'
    }

}

async function ingresarProductoDestino(e) {

    //e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    //console.log('dentro de funcion ingresarproducto',e.target)
    let id = inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:', id)
    if (id) {
        console.log('objeto a evaluar:', objetosDestino)
        if (objetosDestino == null) {
            objetosDestino = []                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
        }
        let duplicado = objetosDestino.some((elem) => { return elem.id === id })     //verifica por ID si el nuevo elemento ya existe en el objeto

        if (!duplicado) {
            inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
            btn_semaforo.classList.toggle('semaforo-verde')
            btn_semaforo.textContent = 'exito!'
            let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB

            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            fila.id = traerDoc.id;                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
            fila.cantidad = 1;                                            //por defecto cantidad igual a 1
            fila.importe = fila.precio * fila.cantidad;                      //calculamos l importe

            objetosDestino.push(fila)                                          //metemos los datos de fila en objetos
            limpiarTabla(e)                                             //limpir datos de la tabla
            pintarTablaDestino(objetosDestino)
        } else {
            btn_semaforo.classList.toggle('semaforo-rojo')
            btn_semaforo.textContent = 'duplicado'
        }

        console.log('contenido del objeto:', objetosDestino)

    } else {
        btn_semaforo.classList.toggle('semaforo-ambar')
        btn_semaforo.textContent = 'vacio'
    }

}

function activarEnter(e) {
    if (e.key === 'Enter') {
        ingresarProducto();
    }
}

async function activarEnter2(e) {
    if (e.key === 'Enter') {
        let id = inpCodigoCliente.value.trim();
        console.log('presionaste enter...', id)                   //trae un nombre de cliente de la DB
        let traerDoc = await traerUnSocio(id);
        let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
        let razonSocial = fila.razonSocial;
        saldo = Number(fila.saldo);
        console.log('presionaste enter...', razonSocial, saldo)
        inpCliente.value = razonSocial


        let traerDoc2 = await traerUnNumeracion('Cotizacion')
        let dato = traerDoc2.data()
        numeroCotizacion.value = Number(dato.ultimoNumero) + 1;
    }
}

function actualizaImporteTouch(e) {
    e.preventDefault()

    for (let i = 0; i < objetosOrigen.length; i++) {
        objetosOrigen[i].cantidad = parseInt(tabla.children[i].children[3].children[0].value)
        objetosOrigen[i].precio = parseFloat(tabla.children[i].children[6].children[0].value)
        objetosOrigen[i].importe = parseFloat(objetosOrigen[i].cantidad * objetosOrigen[i].precio)
    }
    limpiarTabla(e)
    pintarTablaOrigen(objetosOrigen)
    console.log('objeto actualizado:', objetosOrigen)

}