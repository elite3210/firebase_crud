import {traeroneProduct,updateProduct,guardarProduccion,traerUnNumeracion,updateNumeracion} from './firebase.js'//esto es el causante que demora mucho en cargar la tabla, investigue y se debe a los query en firebase


const btn_ingresar      = document.getElementById('boton')
const form              = document.getElementById('formulario')
const tabla             = document.getElementById('container');
const btn_guardar       = document.getElementById('btn-guardar')
const btn_imprimir      = document.getElementById('btn-imprimir')
const celda_total       = document.getElementById('celda_total')
const fecha             = document.getElementById('fecha')
const btn_semaforo      = document.querySelector('.semaforo')
const inpCodigo         = document.getElementById('codigo')
const numeroInventario  = document.getElementById('numeroInventario')
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


let objetos=JSON.parse(localStorage.getItem('produccion'))
//let objetos=[]
let start=true
console.log('iniciando...: ')

cargarEventListeners()

function cargarEventListeners(){
    pintarFecha()
    pintarTabla(objetos)

    btn_ingresar.addEventListener('click',ingresarProducto)
    btn_guardar.addEventListener('click',crearVenta)
    btn_imprimir.addEventListener('click',generaPDF)
    tabla.addEventListener('click',operacionesEnTabla)
    tabla.addEventListener('keypress',actualizaImporte)
    inpCodigo.addEventListener('keypress',activarEnter)
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
    
    localStorage.removeItem('produccion');
    objetos=[]
    form.reset()
    pintarTabla(objetos) //vueve a pintar el formulario vacio
    numeroInventario.value='';
}

async function actualizarStockInsumos(objetos){//actualiza incremento de produccion y disminuye cantidad de insumos
    let id=objetos[0].id;
    console.log('dentro de la funcion actualizar stock de insumos de receta:...')
    let cantidadProduccion=objetos[0].cantidad;//cantidad de produccion a registrar
    let nuevoStockProducto=Number(objetos[0].stock) + cantidadProduccion // calculo para nuevo stock

    if (objetos[0].receta) {//si tiene receta
        let receta = JSON.parse(objetos[0].receta)
        console.log('el preducto tiene una receta de produccion:',receta)
        let contadorInsumo=0
        for (const insumo of receta) {//recorre la receta y realiza el calculo del nuevo stock y los actualizara
            let productoIntermedio = await traeroneProduct(insumo.id); //trae un producto de la DB
            let nuevoStockInsumo    = productoIntermedio.data()['stock']-cantidadProduccion*insumo.cantidad; //calcula la cantidad que quedaria despues del registro
            console.log(`Cantidad:${cantidadProduccion} Planchas Material:${insumo.id}  Stock: ${productoIntermedio.data()['stock']} Consumo: ${cantidadProduccion*insumo.cantidad} nuevo Stock: ${nuevoStockInsumo}`)
            updateProduct(insumo.id,{stock:nuevoStockInsumo})//actualiza el stock del insumo
            contadorInsumo++;
        }
        await updateProduct(id,{stock:nuevoStockProducto});//actualiza el stock del producto
        alert(`Se registró: ${cantidadProduccion} ${objetos[0].unidad} ${objetos[0].nombre} Fabricado con ${contadorInsumo} Isumos`);

    } else {
        alert('registrando otros productos sin receta la cantidad de:',nuevoStockProducto,id);
        await updateProduct(id,{stock:nuevoStockProducto});//actualiza el stock de la mercaderia
    }
    
    
}

function registrarVenta(){//captura los datos del formulario para guardar en BD
    console.log('dentro funcion registraVenta:')
    let tiempo              = Date.now()
    let hoy                 = new Date(tiempo)
    let fechaRegistro       = hoy.toLocaleDateString()

    let usuario             = form['usuario'].value
    let almacenProcesos     = form['almacenProcesos'].value
    let almacen             = form['almacen'].value
    let detalleProduccion   = JSON.stringify(objetos)
    let idProducto          = objetos[0].id
    let cantidad            = objetos[0].cantidad
    let estado              = 'pendiente';
    let nuevoNumero         = Number(numeroInventario.value)

    if (nuevoNumero){
        console.log('numero:',nuevoNumero)

        actualizarStockInsumos(objetos)
        guardarProduccion(almacenProcesos,usuario,almacen,detalleProduccion,estado,fechaRegistro,tiempo,nuevoNumero,idProducto,cantidad)
        updateNumeracion('Inventario',{ultimoNumero:nuevoNumero,creado:hoy})

        console.log('Registro de cotizacion es un exito:',hoy.toLocaleDateString())
    } else {
        alert('Poner numero de Venta')
    }

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

function operacionesEnTabla(e){//eliminar item o ver stock en cadafila
    
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
    let filasVacias=8
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

function generaPDF(){
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const elementoParaConvertir = document.body; // <-- Aquí puedes elegir cualquier elemento del DOM
        html2pdf()
            .set({
                margin: 0.25,
                filename: 'Produccion',
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
    localStorage.removeItem('cotizacion');
    //objetos=[]
    //numeroInventario.value='';
    //form.reset()
    //pintarTabla(objetos) //vueve a pintar el formulario vacio

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
    var id=inpCodigo.value.toUpperCase()        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id ingresado:',id)
    if(id){   
        console.log('objeto a evaluar:',objetos)
        if(objetos==null){
            objetos=[]                                                  //un atajo para que funcione el codigo por primera vez, corregir en futuro
        }
        let duplicado = objetos.some((elem)=>{return elem.id===id})     //verifica por ID si el nuevo elemento ya existe en el objeto o en el documento que se muestraen pantalla
        let traerDoc = await traerUnNumeracion('Inventario');
        numeroInventario.value=Number(traerDoc.data().ultimoNumero)+1;
        

        if(!duplicado){
            inpCodigo.select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
            btn_semaforo.classList.toggle('semaforo-verde')
            btn_semaforo.textContent='exito!'
            let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB
            
            let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
            fila.id=traerDoc.id                                         // el id esta en otro campo, por eso se llama aparte y luego agregar
            fila.cantidad=1                                             //por defecto cantidad igual a 1
            fila.importe=fila.peso*fila.cantidad                      //calculamos l importe
if (!fila.receta) {
alert('producto sin receta, desea continuar?...')
}
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

async function activarEnter(e){
    if(e.key==='Enter'){
        ingresarProducto(e)
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