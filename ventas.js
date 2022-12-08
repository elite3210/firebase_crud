import {guardarTask,onGetTasks,deleteTask,traerTask,traeroneProduct,updateProduct,guardarVenta} from './firebase.js'


const btn_ingresar = document.getElementById('boton')
const form=document.getElementById('formulario')
const tabla = document.getElementById('container');
const btn_guardar =document.getElementById('btn-guardar')

let objetos=[]
let indice=0

cargarEventListeners()

function cargarEventListeners(){

btn_ingresar.addEventListener('click',async(e)=>{
    e.preventDefault()

    let id=form['codigo'].value.toUpperCase()        //captura el codigo del formulario, puede ser tambien un barcode
    console.log('id:',id)
    if(id){                                             //comprueba si existe o se ingreso un codigo
        let traerDoc = await traeroneProduct(id);
        console.log('traerDoc:',traerDoc)
        let fila = traerDoc.data()
        console.log('fila:',fila)
        
        objetos.push(fila)
            objetos[indice].id=traerDoc.id
            indice++  
        
        
        console.log('contenido del objeto llamados:',objetos)
        pintarTabla(objetos)
    }else{
        alert('Ingresa un codigo!')
    }
    
})

btn_guardar.addEventListener('click',crearVenta)

}

function pintarTabla(objetos){
    let contador=1 
    let fila = document.createElement('tr')    
    objetos.forEach(producto=>{
        
        fila.innerHTML = `
                        <td>${contador}</td>
                        <td>${producto.id}</td>
                        <td><input type='number' class='cantidad' id='${producto.id}' value=1 ></td>
                        <td>${producto.unidad}</td>
                        <td>${producto.descripcion}</td>
                        <td><input type='number' class='precio' id='${producto.id}' value='${producto.precio}' disabled></td>

                        <td><button class ='btn-delete fa fa-trash' id=''data-id=${producto.id}></button></td>
                        <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent'data-id=${producto.id}></button></td>
                    `
        contador++
        
    });
    tabla.appendChild(fila)
}

let id=''
let nuevo_stock=''
let cantidad_venta=0
function crearVenta(e){
    id=tabla.childNodes[0].childNodes[5].childNodes[0].id
    console.log('id:',id)
    console.log('objetos de contenedor:',objetos)
    cantidad_venta = tabla.childNodes[0].childNodes[5].childNodes[0].value
    let en_almacen=objetos[0].stock
    nuevo_stock=en_almacen-cantidad_venta
    console.log('saldo stock:',nuevo_stock)

    actualizarStock(id,nuevo_stock)
    registrarVenta()
}

function actualizarStock(id,nuevo_stock){

    updateProduct(id,{stock:nuevo_stock
        })
    
}
function registrarVenta(){
    console.log('registrando la venta en la DB')
    //const imagen              = form['imagen']
    let cliente='Heinz'
    let vendedor='Smith'
    let productoVendido=id
    let cantidad=cantidad_venta

    guardarVenta(cliente,vendedor,productoVendido,cantidad)
    console.log('venta registrada')
}