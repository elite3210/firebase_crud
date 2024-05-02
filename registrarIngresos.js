import {jornadaRef,deleteTask,updateTask,guardarBoletaPago,traerUnNumeracion,updateNumeracion,guardarTransaccionesLaboral} from './firebase.js'
import {getDocs,query,where} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

//no se donde poner lo que sigue abajo{:}

eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded',getNumeroEgreso)
    //formulario.addEventListener('submit',agregarGasto)   
};

async function getNumeroEgreso() {
    const numeroEgreso  =document.getElementById('numero');
    const fecha  =document.getElementById('fecha');
    let numeroEgresoDB  = await traerUnNumeracion('Egreso');
    let dato            = numeroEgresoDB.data();
    numeroEgreso.value  =Number(dato.ultimoNumero)+1;
    fecha.value  =getFechaActual();
    console.log('fecha',getFechaActual())
}

function getFechaActual() {
    const date = new Date();
    const [month, day, year] = [date.getMonth(),date.getDate(),date.getFullYear()];
    if (month<10) {
        return `${year}-0${month+1}-${day}`;
    } else {
        return `${year}-${month+1}-${day}`;
    }
    
}

class Producto{
    constructor(numeroEgreso,fecha,name,importe,dniColaborador){
        this.numeroEgreso   =numeroEgreso;
        this.fecha          =fecha;
        this.name           =name;
        this.importe          =importe;
        this.dniColaborador =dniColaborador;
    }
}

class IProducto{

    addProduct(producto){
        const productList=document.getElementById('product-list')
        const element = document.createElement('div');
        const creado=new Date().toLocaleDateString('en-US')+' '+new Date().toLocaleTimeString();
        const tipoTransaccion='debe'
        const importeHaber='';
        
        element.innerHTML=`
        <div class="card text-center mb-4">
            <div class="card-body">
                <strong>Numero:</strong>${producto.numeroEgreso}
                <strong>DNI:</strong>${producto.dniColaborador}
                <strong>Fecha:</strong>${producto.fecha}
                <strong>Descripcion:</strong>${producto.name}
                <strong>Monto:</strong>${producto.importe}
                <a href class="btn btn-danger" name="delete">Delete</a>
            </div>
        </div>
        `
        productList.appendChild(element)

        guardarTransaccionesLaboral(producto.fecha,producto.dniColaborador,producto.numeroEgreso,creado,producto.name,tipoTransaccion,producto.importe,importeHaber);
        updateNumeracion('Egreso',{ultimoNumero:producto.numeroEgreso})
        console.log('se registro un reconocimiento por:',producto.importe,producto.numeroEgreso)
    };

    resetForm(){
        document.getElementById('product-form').reset()
    };

    deleteProduct(element){
        if (element.name==='delete') {
            console.log(element.parentElement.parentElement.parentElement.remove())
            this.showMessage('el producto fue elimino','info')
        }
    };

    showMessage(message,cssClass){
        const div=document.createElement('div')
        div.className=`alert alert-${cssClass} mt-1`;
        div.appendChild(document.createTextNode(message));
        //show dom
        const container = document.querySelector('.container');
        const app = document.querySelector('#App');
        container.insertBefore(div,app)
        setTimeout(()=>{document.querySelector('.alert').remove()},2500)
    };
}

//DOM Events...



document.getElementById('product-form').addEventListener('submit',function(e) {
    e.preventDefault()
    const numeroEgreso  = document.getElementById('numero').value;
    const fecha         = document.getElementById('fecha').value;
    const name          = `EG N°${numeroEgreso} ${document.getElementById('name').value}`;
    const importe         = Number(document.getElementById('price').value);
    const dniColaborador= document.getElementById('dniColaborador').value;
    
    
    let producto        = new Producto(numeroEgreso,fecha,name,importe,dniColaborador)
    let ui              = new IProducto()

    if (numeroEgreso==='' || name==='' || importe ==='' || dniColaborador==='' || fecha==='') {
        return ui.showMessage('completar el formulario','danger')
    }
    ui.addProduct(producto)
    ui.resetForm()
    ui.showMessage('Producto agregado satisfactoriamente','success')
    let celdaNumero=document.getElementById('numero')
    celdaNumero.value=Number(numeroEgreso)+1;
    console.log(producto)
    
})

document.getElementById('product-list').addEventListener('click',function(e){
    e.preventDefault()
    const ui = new IProducto;
    ui.deleteProduct(e.target)
    
})

