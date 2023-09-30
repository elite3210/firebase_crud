import {traeroneProduct,updateProduct,guardarCotizacion,traerUnSocio,traerUnNumeracion,updateNumeracion} from './firebase.js'


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
const inpCliente        = document.getElementById('cliente')
const fecha             = document.getElementById('fecha')
const btn_semaforo      = document.querySelector('.semaforo')
const numeroCotizacion  = document.getElementById('cotizacion')

let objetos=JSON.parse(localStorage.getItem('cotizacion'))
//let objetos=[]
let start=true

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
        let nuevo_stock=obj.stock - obj.cantidad
        updateProduct(id,{stock:nuevo_stock})
        counter++
    })
    alert(`Se actualizó: ${counter} productos`)
}

function registrarVenta(){
    console.log('dentro funcion registraVenta:')
    
    let tiempoTranscurrido  = Date.now()
    let hoy                 = new Date(tiempoTranscurrido)

    let cliente             = form['cliente'].value
    let ruc                 = form['ruc'].value
    let vendedor            = form['vendedor'].value
    let detalleCotizacion   = JSON.stringify(objetos)
    let estado              = 'pendiente'
    let tipoPago            = form['tipoPago'].value
    let metodoCobro         = form['metodoCobro'].value
    let nuevoNumero         = Number(numeroCotizacion.value)
    let fecha               = hoy.toLocaleDateString()
    let subTotal            = celdaSubTotal.value
    let descuento           = inpDescuento.value
    let importeTotal        = subTotal-descuento

    console.log('tipoPago:',subTotal)
    console.log('metodoCobro:',descuento)
    
    if (nuevoNumero){
        console.log('numero:',nuevoNumero)

        guardarCotizacion(nuevoNumero,fecha,vendedor,cliente,ruc,detalleCotizacion,estado,tipoPago,metodoCobro,subTotal,descuento,importeTotal)
        actualizarStock(objetos)
        updateNumeracion('Cotizacion',{ultimoNumero:nuevoNumero})

        console.log('Registro de cotizacion es un exito:',hoy.toLocaleDateString())
    } else {
        alert('Poner numero de Venta')
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
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML=''
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
    let filasVacias=10
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
    localStorage.setItem('cotizacion',JSON.stringify(objetos))
    objetos=JSON.parse(localStorage.getItem('cotizacion'))
}

async function generaPDF(){
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion       = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
    let id_cotizacion      = document.getElementById('cotizacion').value

        await html2pdf()
            .set({
                margin: 5,
                filename: `${id_cotizacion}`,
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
        /*
        navigator.share({
            title:'probando esta nueva API',
            text:'Desde Heinz Sport SAC',
            url:'./cotizacion.pdf'
        })
    */
    localStorage.removeItem('cotizacion');
    objetos=[]
    numeroCotizacion.value='';
    form.reset()
    pintarTabla(objetos) //vueve a pintar el formulario vacio
}

function pintarFecha(){
    
    fecha.textContent       =new Date(Date.now()).toLocaleDateString()
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
            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            let razonSocial=fila.razonSocial;
            inpCliente.value=razonSocial 
            
            let traerDoc2 = await traerUnNumeracion('Cotizacion')
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


/*
JsBarcode(".barcode",'SB0070', {
    lineColor: "#000",
    width: 1.5,
    height: 40,
    displayValue: false
  });
*/