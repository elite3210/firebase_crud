import {guardarTask,onGetTasks,deleteTask,traerTask,traeroneProduct,updateProduct,guardarVenta} from './firebase.js'


const btn_ingresar = document.getElementById('boton')
const btn_semaforo   = document.querySelector('.semaforo')
const form=document.getElementById('formulario')
const tabla = document.getElementById('container');
const btn_guardar =document.getElementById('btn-guardar')

let objetos=[]
let indice =0

cargarEventListeners()

function cargarEventListeners(){
    
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
    })

    btn_guardar.addEventListener('click',crearVenta)
    tabla.addEventListener('dblclick',actualizaImporte)
    tabla.addEventListener('keypress',actualizaImporte)       
}

function pintarTabla(objetos){
    let contador=1 
    objetos.forEach(producto=>{
        let fila = document.createElement('tr')    
        
        fila.innerHTML = `
                        <td><button class ='btn-edit fa-solid fa-cart-plus' color='transparent'data-id=${producto.id}></button></td>
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td><input type='number' class='cantidad' id='${producto.id}' value=${producto.cantidad} ></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.descripcion}</td>
                        <td><input type='number' class='precio' id='${producto.id}' value=${producto.precio}></td>
                        <td><input type='number' class='importe' id='${producto.id}' value=${producto.importe}></td>
                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button></td>                       
                        `
        contador++
        
        tabla.appendChild(fila)
        console.log('TABLA:',tabla)
    });

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
                objetos[i].precio   = parseInt(tabla.children[i].children[6].children[0].value)
                objetos[i].importe  =objetos[i].cantidad*objetos[i].precio
                console.log('objeto actualizado:',i)
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