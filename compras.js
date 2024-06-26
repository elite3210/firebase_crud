import {traeroneProduct,updateProduct,guardarCompras,traerUnSocio,traerUnNumeracion,updateNumeracion,updateClientes} from './firebase.js'


const btn_ingresar      = document.getElementById('boton')
const form              = document.getElementById('formulario')
const tabla             = document.getElementById('container');
const btn_guardar       = document.getElementById('btn-guardar')
const btn_imprimir      = document.getElementById('btn-imprimir')
const celdaSubTotal     = document.getElementById('celdaSubTotal')
const inpDescuento      = document.getElementById('descuento')
const celda_total       = document.getElementById('celda_total')
const inpCodigo         = document.getElementById('codigo')
const inpCodigoCliente  = document.getElementById('ruc')
const inpCliente        = document.getElementById('proveedor')
const fecha             = document.getElementById('fecha')
const btn_semaforo      = document.querySelector('.semaforo')
const numeroCotizacion  = document.getElementById('cotizacion')
const entradaDato       = document.getElementById('entradaDato')

let datalist = document.createElement('datalist')
datalist.setAttribute('id','productos')
datalist.innerHTML=`
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
`
entradaDato.appendChild(datalist)


let objetos=JSON.parse(localStorage.getItem('compras'))
//let objetos=[]
let start=true
let proveedorRank=0;
let saldoAnterior=0;


cargarEventListeners()

function cargarEventListeners(){
    pintarFecha()
    pintarTabla(objetos)

    btn_ingresar.addEventListener('click',ingresarProducto)
    inpCodigo.addEventListener('keypress',activarEnter)
    inpCodigoCliente.addEventListener('keypress',activarEnter2)
    btn_guardar.addEventListener('click',registrarVenta)
    btn_imprimir.addEventListener('click',generaPDF)
    tabla.addEventListener('click',operacionesEnTabla)
    tabla.addEventListener('keypress',actualizaImporte)
    //tabla.addEventListener('touchend',actualizaImporteTouch)        
}


function pintarTabla(objetos){
    console.log('Lo que hay en LS:',objetos)
    if(objetos==null){
        pintarFilasVacias(objetos)
    }else{
        limpiarTabla()
        pintarFilasLlenas(objetos)
        pintarFilasVacias(objetos)
        actualizaImporteTotal()   
    }
}


function actualizarStock(objetos){//ACTUALIZA STOCK VARIOS ITEMS
    let counter=0
    objetos.forEach((obj)=>{
        let id=obj.id
        
        let nuevo_stock=Number(obj.stock) + Number(obj.cantidad)
        updateProduct(id,{stock:nuevo_stock})
        counter++
    })
    alert(`Se actualizó la compra: ${counter} productos`)
}

function registrarVenta(){
    console.log('dentro funcion registraVenta:')
    
    let tiempo              = Date.now()
    //let hoy                 = new Date(tiempo)

    let proveedor             = form['proveedor'].value
    let ruc                 = form['ruc'].value
    let usuario            = form['usuario'].value
    let detalleCompra   = JSON.stringify(objetos)
    let estado              = 'pendiente'
    let tipoPago            = form['tipoPago'].value
    let documento         = form['documento'].value
    let nuevoNumero         = Number(numeroCotizacion.value)
    let fecha               = form['fecha'].value
    let subTotal            = celdaSubTotal.value
    let descuento           = inpDescuento.value
    let importeTotal        = subTotal-descuento

    console.log('tipoPago:',subTotal)
    console.log('metodoCobro:',descuento)
    console.log('tiempo:',tiempo)
    console.log('fecha:',fecha)
    
    if (nuevoNumero){
        console.log('numero:',nuevoNumero)

        guardarCompras(nuevoNumero,usuario,proveedor,ruc,detalleCompra,estado,tipoPago,subTotal,descuento,importeTotal,tiempo,documento,fecha)
        actualizarStock(objetos)
        updateNumeracion('Compras',{ultimoNumero:nuevoNumero})
        updateClientes(ruc,{proveedorRank:proveedorRank+1,saldoProveedor:saldoAnterior+importeTotal})

        //console.log('Registro de Compra es un exito:',hoy.toLocaleDateString())
    } else {
        alert('Poner numero de compra')
    }
}



function actualizaImporte(e){
        
    if(e.key==='Enter'){
        e.preventDefault()
            
        for(let i =0;i<objetos.length;i++){
            objetos[i].cantidad = parseFloat(tabla.children[i].children[3].children[0].value) 
            objetos[i].precio   = parseFloat(tabla.children[i].children[6].children[0].value)
            objetos[i].importe  = parseFloat(objetos[i].cantidad*objetos[i].precio)
        }
        limpiarTabla(e)
        pintarTabla(objetos)
        actualizaImporteTotal()
        console.log('objeto actualizado:',objetos)
    }
}

function limpiarTabla(){

    while(tabla.firstChild){
        tabla.removeChild(tabla.firstChild)
    }
}

function actualizaImporteTotal(){
    
    let total=objetos.reduce((tot,producto)=>tot+producto.importe,0)
    
    celdaSubTotal.value=total.toFixed(2)
    let desc=descuento.value
    celda_total.value=celdaSubTotal.value-desc

}

function operacionesEnTabla(e){
    
    if(e.target.classList.contains('btn-delete')){
        eliminarProducto(e)
    }
    if(e.target.classList.contains('btn-stock')){
        filaMuestraStock(e)
    }
}

function eliminarProducto(e){
    let id_producto=e.target.getAttribute('data-id')
        
    objetos=objetos.filter((producto)=>producto.id!==id_producto)
    limpiarTabla()
        console.log('diste clik en boton delete... nuevo objeto',objetos)
        pintarTabla(objetos)
}

let alternador = true

function filaMuestraStock(e){
    let id_producto=e.target.getAttribute('data-id')                            //captura el ID producto de la fila
    let ubicacion = objetos.findIndex((elem)=>{return elem.id==id_producto})    //captura el indice o poscion del objeto producto de la fila
    
    if(alternador){
        let producto_encontado=objetos.find((elem)=>{return elem.id==id_producto})  //encuentra el productos en el objeto con el ID anterior
        console.log('clik en (+), el stock es:',producto_encontado.stock)
        let fila =document.createElement('tr')
        let celda =document.createElement('td')
        celda.textContent=producto_encontado.stock
        fila.appendChild(celda)
        console.log('findIndex:',ubicacion)
        tabla.insertBefore(fila,tabla.children[ubicacion+1]) 
        alternador=false
    }else{
        tabla.removeChild(tabla.children[ubicacion+1])
        alternador=true
    }
}

function pintarFilasLlenas(objetos){
    let contador=1
    objetos.forEach(producto=>{
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
    sincronizarLocalStorage(objetos)
}

function pintarFilasVacias(objetos){
    if(start){objetos=[];start=false}
    let filasLlenas=objetos.length
    let filasVacias=7
    for(let i =0;i<filasVacias-filasLlenas;i++){
        let fila = document.createElement('tr')
        fila.innerHTML= ` <td></td>
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
        tabla.appendChild(fila)
    }
}

function sincronizarLocalStorage(objetos){
    localStorage.setItem('compras',JSON.stringify(objetos))
    objetos=JSON.parse(localStorage.getItem('compras'))
}

async function generaPDF(){
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion       = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
    let id_cotizacion      = document.getElementById('cotizacion').value

        await html2pdf()
            .set({
                margin: 5,
                filename: `"PC"${id_cotizacion}_${celda_total.value}`,
                //se borro image jpg, averiguar codigo origina en github del cdn html2pdf
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

    localStorage.removeItem('cotizacion');
    objetos=[]
    numeroCotizacion.value='';
    form.reset()
    pintarTabla(objetos) //vueve a pintar el formulario vacio
}

function pintarFecha(){
    let date =new Date(Date.now())
    fecha.value = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`;//solucionar el hecho de poner un cero cuando el dia es entreel 1 y el 9 y lo mismo en el mes 1 al 9
    

    console.log('FECHA A MOSTRAR:',fecha.value)    
    //fecha.textContent       =new Date(Date.now()).toLocaleDateString()
}

async function ingresarProducto(e){

      //e.preventDefault()
      btn_semaforo.classList.remove('semaforo-verde')
      btn_semaforo.classList.remove('semaforo-ambar')
      btn_semaforo.classList.remove('semaforo-rojo')
      //console.log('dentro de funcion ingresarproducto',e.target)
      let id=inpCodigo.value.toUpperCase();        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:',id)
    if(id){   
        console.log('objeto a evaluar:',objetos)
        if(objetos==null){
            objetos=[]                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
        }
        let duplicado = objetos.some((elem)=>{return elem.id===id})     //verifica por ID si el nuevo elemento ya existe en el objeto
        
        if(!duplicado){
            inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
            btn_semaforo.classList.toggle('semaforo-verde')
            btn_semaforo.textContent='exito!'
            let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB
            
            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            fila.id=traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
            fila.cantidad=1                                             //por defecto cantidad igual a 1
            fila.importe=fila.precio*fila.cantidad                      //calculamos l importe
            
            objetos.push(fila)                                          //metemos los datos de fila en objetos
            limpiarTabla(e)                                             //limpir datos de la tabla
            pintarTabla(objetos)
        }else{
            btn_semaforo.classList.toggle('semaforo-rojo')
            btn_semaforo.textContent='duplicado'
        }
            
        console.log('contenido del objeto:',objetos)
            
    }else{
        btn_semaforo.classList.toggle('semaforo-ambar')
        btn_semaforo.textContent='vacio'
    } 

}

function activarEnter(e){
    if(e.key==='Enter'){
        ingresarProducto();
    }
}

async function activarEnter2(e){
    if(e.key==='Enter'){
            let id = inpCodigoCliente.value.trim();
            let traerDoc = await traerUnSocio(id);                   //trae un nombre de cliente de la DB
            let fila = traerDoc.data()
            console.log('CONTACTO',traerDoc)                                  //.data() metodo para mostrar solo los datos del producto
            let razonSocial=fila.razonSocial;
            inpCliente.value=razonSocial 
            proveedorRank=Number(fila.proveedorRank);
            saldoAnterior=Number(fila.saldoProveedor);

            let traerDoc2 = await traerUnNumeracion('Compras')
            let dato = traerDoc2.data()
            numeroCotizacion.value=Number(dato.ultimoNumero)+1;
    }
}

function actualizaImporteTouch(e){
    e.preventDefault()
    
    for(let i =0;i<objetos.length;i++){
        objetos[i].cantidad = parseInt(tabla.children[i].children[3].children[0].value) 
        objetos[i].precio   = parseFloat(tabla.children[i].children[6].children[0].value)
        objetos[i].importe  = parseFloat(objetos[i].cantidad*objetos[i].precio)
    }
    limpiarTabla(e)
    pintarTabla(objetos)
    console.log('objeto actualizado:',objetos)

}

