import {guardarTask,onGetTasks,deleteTask,traerTask,traeroneProduct,updateProduct,guardarVenta} from './firebase.js'


const btn_ingresar = document.getElementById('boton')
const btn_semaforo   = document.querySelector('.semaforo')
const form=document.getElementById('formulario')
const tabla = document.getElementById('container');
const btn_guardar =document.getElementById('btn-guardar')
const celda_total=document.getElementById('celda_total')
const fecha=document.getElementById('fecha')

let objetos=[]
let indice =0

cargarEventListeners()

function cargarEventListeners(){
    pintarTabla(objetos)
    let tiempoTranscurrido=Date.now()
    let hoy=new Date(tiempoTranscurrido)
    fecha.textContent=hoy.toLocaleDateString()
    btn_ingresar.addEventListener('click',async(e)=>{
        e.preventDefault()
        btn_semaforo.classList.remove('semaforo-verde')
        btn_semaforo.classList.remove('semaforo-ambar')
        btn_semaforo.classList.remove('semaforo-rojo')
        var id=form['codigo'].value.toUpperCase()        //captura el codigo del formulario, puede ser tambien un barcode
        console.log('id:',id)
        if(id){                                             //comprueba si se ingreso un codigo
            
            if(indice==0){
                form['codigo'].select()
                btn_semaforo.classList.toggle('semaforo-verde')
                btn_semaforo.textContent='exito!'
                let traerDoc = await traeroneProduct(id);
                console.log('traerDoc:',traerDoc)
                let fila = traerDoc.data()
                fila.id=traerDoc.id
                fila.cantidad=1
                fila.importe=fila.precio*fila.cantidad
                
                objetos.push(fila)
                indice++
                pintarTabla(objetos)
                
            }else{
                
                let duplicado = objetos.some((elem)=>{return elem.id===id})     //verifica por ID si el nuevo elemento ya existe en el objeto
                
                if(!duplicado){
                    form['codigo'].select()                                     //selecciona el texto para ser borrado con el siguiente ingreso de lector barcode   
                    btn_semaforo.classList.toggle('semaforo-verde')
                    btn_semaforo.textContent='exito!'
                    let traerDoc = await traeroneProduct(id);                   //trae un producto de la DB
                    
                    let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del usuario
                    fila.id=traerDoc.id
                    fila.cantidad=1
                    fila.importe=fila.precio*fila.cantidad
                    
                    objetos.push(fila)
                    limpiarTabla(e)
                    pintarTabla(objetos)
                    indice++
                }else{
                    btn_semaforo.classList.toggle('semaforo-rojo')
                    btn_semaforo.textContent='duplicado'
                }
            }
            console.log('contenido del objeto llamados:',objetos)
            
        }else{
            btn_semaforo.classList.toggle('semaforo-ambar')
            btn_semaforo.textContent='vacio'
        }
        importeTotal()
    })

    btn_guardar.addEventListener('click',crearVenta)
    tabla.addEventListener('click',operacionesEnTabla)
    tabla.addEventListener('keypress',actualizaImporte)       
}

function pintarTabla(objetos){
    
    
    if(objetos.length==0){
        let contador=1
        pintarFilasVacias(contador)
    }else{
        
        limpiarTabla()
        console.log('objetos antes de llamra db:',objetos)
        let contador=1 
        objetos.forEach(producto=>{
            let fila = document.createElement('tr')    
            
            fila.innerHTML = `
                            <td><button class ='btn-edit fa-solid fa-circle-plus' color='transparent'data-id=${producto.id}></button></td>
                            <td>${contador}</td>
                            <td>${producto.id}</td>
                            <td><input type='number' class='cantidad' id='${producto.id}' value=${producto.cantidad} ></td>
                            <td>${producto.unidad}</td>
                            <td>${producto.descripcion}</td>
                            <td><input type='number' class='precio' id='${producto.id}' value=${producto.precio} min="0"></td>
                            <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe}></td>
                            <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button></td>                       
                            `
            contador++
            
            tabla.appendChild(fila)
            
        });
        pintarFilasVacias(contador)
    }
    
}

function crearVenta(e){

    let id=''
    let nuevo_stock=''
    let cantidad_venta=1

    id=tabla.childNodes[0].childNodes[5].childNodes[0].id                       //obtener id de cada fila
    console.log('id:',id)
    console.log('objetos de contenedor:',objetos)
    cantidad_venta = tabla.childNodes[0].childNodes[5].childNodes[0].value      // extrayendo la cantidad a vender
    let en_almacen=objetos[0].stock                                             //cantidad en stock
    nuevo_stock=en_almacen-cantidad_venta                                       // calculo para nuevo stock
    console.log('saldo stock:',nuevo_stock)

    actualizarStock(id,nuevo_stock)
    registrarVenta(id,cantidad_venta)
}

function actualizarStock(id,nuevo_stock){

    updateProduct(id,{stock:nuevo_stock
        })
    
}

function registrarVenta(id,cantidad_venta){
    console.log('registrando la venta en la DB')
    //const imagen              = form['imagen']
    let cliente='Heinz'
    let vendedor='Smith'
    let productoVendido=id
    let cantidad=cantidad_venta

    guardarVenta(cliente,vendedor,productoVendido,cantidad)
    console.log('venta registrada')
}

function actualizaImporte(e){
        
        if(e.key==='Enter'){
            e.preventDefault()
            
            for(let i =0;i<objetos.length;i++){
            
                objetos[i].cantidad = parseInt(tabla.children[i].children[3].children[0].value) 
                objetos[i].precio   = parseFloat(tabla.children[i].children[6].children[0].value)
                objetos[i].importe  =parseFloat(objetos[i].cantidad*objetos[i].precio)
            }
            limpiarTabla(e)
            pintarTabla(objetos)
            importeTotal()
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

function importeTotal(){
    
    let total=objetos.reduce((tot,producto)=>tot+producto.importe,0)
    
    celda_total.value=total

}

function operacionesEnTabla(e){
    
    if(e.target.classList.contains('btn-delete')){
        eliminarProducto(e)
    }
    if(e.target.classList.contains('btn-edit')){
        mostrarStock(e)
    }
}

function eliminarProducto(e){
    let id_producto=e.target.getAttribute('data-id')
        
    objetos=objetos.filter((producto)=>producto.id!==id_producto)
    limpiarTabla()
        console.log('diste clik en boton delete... nuevo objeto',objetos)
        pintarTabla(objetos)
}
var counter = true
function mostrarStock(e){
    
    if(counter){
        let id_producto=e.target.getAttribute('data-id')
        let producto_encontado=objetos.find((elem)=>{return elem.id==id_producto})
        console.log('clik en editar, el stock es:',producto_encontado.stock)
        let fila =document.createElement('tr')
        let celda =document.createElement('td')
        celda.textContent=producto_encontado.stock
        fila.appendChild(celda)
        let ubicacion = e.target.getElementsByTagName('td')
        console.log(ubicacion)
        tabla.insertBefore(fila,tabla.children[1]) 
        counter=false
    }else{
        tabla.removeChild(tabla.children[1])
        counter++
    }

}

function pintarFilasVacias(contador){
    let filasVacias=13
    let counter=contador
    for(let i =0;i<filasVacias-counter;i++){
        let fila = document.createElement('tr')
            fila.innerHTML= ` <td></td>
                    <td></td>
                    <td></td>
                    <td><input type='number' class='cantidad'  value='' ></td>
                    <td></td>
                    <td></td>
                    <td><input type='number' class='precio'  value='' min="0"></td>
                    <td><input type='number' class='importe'  value=''></td>
                    <td></td> 
                    `
            tabla.appendChild(fila)
    }
        
        
}

