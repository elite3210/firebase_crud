import {traeroneProduct,updateProduct,guardarProduccion} from './firebase.js'


const btn_ingresar      = document.getElementById('boton')
const form              = document.getElementById('formulario')
const tabla             = document.getElementById('container');
const btn_guardar       = document.getElementById('btn-guardar')
const btn_imprimir      = document.getElementById('btn-imprimir')
const celda_total       = document.getElementById('celda_total')
const fecha             = document.getElementById('fecha')
const btn_semaforo      = document.querySelector('.semaforo')

let objetos=JSON.parse(localStorage.getItem('produccion'))
//let objetos=[]
let start=true

cargarEventListeners()

function cargarEventListeners(){
    pintarFecha()
    pintarTabla(objetos)

    btn_ingresar.addEventListener('click',ingresarProducto)
    btn_guardar.addEventListener('click',crearVenta)
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

function crearVenta(){

    registrarVenta()
    actualizarStock(objetos)
    localStorage.removeItem('produccion');
    objetos=[]
    form.reset()
    pintarTabla(objetos) //vueve a pintar el formulario vacio
}

function actualizarStock(objetos){
    let id=objetos[0].id 
    let nuevo_stock=Number(objetos[0].stock) + objetos[0].cantidad                                     // calculo para nuevo stock
    
    updateProduct(id,{stock:nuevo_stock})
    console.log('stock actualizado:',id,nuevo_stock)
}

function registrarVenta(){
    console.log('dentro funcion registraVenta:')
    let fecha               = form['fecha'].value
    let tiempoTranscurrido  = Date.now()
    let hoy                 = new Date(tiempoTranscurrido)    
    
    let usuario             = form['usuario'].value
    let almacen             = form['almacen'].value
    let detalleProduccion   = JSON.stringify(objetos)
    let estado              = 'pendiente'
    let fechaRegistro       = hoy.toLocaleDateString()
    
    guardarProduccion(fecha,usuario,almacen,detalleProduccion,estado,fechaRegistro)
    
    console.log('Registro de cotizacion es un exito:',hoy.toLocaleDateString())
}

function actualizaImporte(e){
        
    if(e.key==='Enter'){
        e.preventDefault()
            
        for(let i =0;i<objetos.length;i++){
            objetos[i].cantidad = parseInt(tabla.children[i].children[3].children[0].value) 
            objetos[i].costo   = parseFloat(tabla.children[i].children[6].children[0].value)
            objetos[i].importe  = parseFloat(objetos[i].cantidad*objetos[i].peso)
        }
        limpiarTabla(e)
        pintarTabla(objetos)
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
    
    celda_total.value=total

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
                        <td><input type='number'  min="0" step="0.1" class='cantidad' id='${producto.id}' value=${producto.cantidad} ></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.descripcion}</td>
                        <td><input type='number' min="0" step="0.01" class='precio' id='${producto.id}' value=${producto.peso}></td>
                        <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe}></td>
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
    localStorage.setItem('produccion',JSON.stringify(objetos))
    objetos=JSON.parse(localStorage.getItem('produccion'))
}

/*
JsBarcode(".barcode",'SB0070', {
    lineColor: "#000",
    width: 1.5,
    height: 40,
    displayValue: false
  });
*/
function generaPDF(){
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const elementoParaConvertir = document.body; // <-- Aquí puedes elegir cualquier elemento del DOM
        html2pdf()
            .set({
                margin: 0.25,
                filename: 'cotizacion',
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
            .from(elementoParaConvertir)
            .save()
            .catch(err => console.log(err));
        /*
        navigator.share({
            title:'probando esta nueva API',
            text:'Desde Heinz Sport SAC',
            url:'./cotizacion.pdf'
        })
    */
}

function pintarFecha(){
    let tiempoTranscurrido  =Date.now()
    let hoy                 =new Date(tiempoTranscurrido)
    fecha.textContent       =hoy.toLocaleDateString()
}

async function ingresarProducto(e){
    e.preventDefault()
    btn_semaforo.classList.remove('semaforo-verde')
    btn_semaforo.classList.remove('semaforo-ambar')
    btn_semaforo.classList.remove('semaforo-rojo')
    var id=form['codigo'].value.toUpperCase()        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:',id)
    if(id){   
        console.log('objeto a evaluar:',objetos)
        if(objetos==null){
            objetos=[]                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
        }
        let duplicado = objetos.some((elem)=>{return elem.id===id})     //verifica por ID si el nuevo elemento ya existe en el objeto
        
        if(!duplicado){
            form['codigo'].select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
            btn_semaforo.classList.toggle('semaforo-verde')
            btn_semaforo.textContent='exito!'
            let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB
            
            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            fila.id=traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
            fila.cantidad=1                                             //por defecto cantidad igual a 1
            fila.importe=fila.peso*fila.cantidad                      //calculamos l importe
            
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