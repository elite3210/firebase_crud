//Variables y selectores:
const formulario=document.querySelector('#agregar-gasto');
const gastoListado=document.querySelector('#gastos ul');

//Eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)
    formulario.addEventListener('submit',agregarGasto)
    
}

//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto=Number(presupuesto);
        this.restante=Number(presupuesto);
        this.gastos=[];
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos,gasto]
        this.calcularRestante();
        console.log(this.gastos);
    };

    calcularRestante(){
        const gastado =this.gastos.reduce((total,gasto)=>{return total+gasto.cantidad},0)
        this.restante=this.presupuesto-gastado;
        console.log(this.restante);
    };
}

class IPresupuesto{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;
        console.log(cantidad)
        document.querySelector('#total').textContent=presupuesto;
        document.querySelector('#restante').textContent=restante;
    };

    imprimirAlerta(mensaje,tipo){
        const divMensaje=document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        if (tipo==='error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent=mensaje;
        //insertar en el html
        document.querySelector('.primary').insertBefore(divMensaje,formulario);

        //Quitar el html:
        setTimeout(()=>{divMensaje.remove()},2000)
    };

    agregarGastoListado(gastos){
        //iterar sobre los gastos
        this.limpiarListado();
        gastos.forEach(gasto=>{
            
            const {cantidad,nombre,id}=gasto;
            //agregar un li
            const nuevoGasto=document.createElement('li');
            nuevoGasto.className='list-group-item d-flex justify-content-between aling-items-center';
            //nuevoGasto.setAttribute('data-id',id);
            nuevoGasto.dataset.id=id;
            console.log(nuevoGasto)

            //agregar el gasto al html
            nuevoGasto.innerHTML=`${nombre} <span class="primary">${cantidad}</span>`;
            
            

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borr960ar-gasto');
            btnBorrar.textContent='Borrar';
            nuevoGasto.appendChild(btnBorrar)
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        })
    };

    limpiarListado(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    };

    actualizarRestante(restante){
        document.querySelector('#restante').textContent=restante;
    };

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante}=presupuestoObj;
        const restanteDiv=document.querySelector('.restante');

        //Comprobar el 25%
        if ((presupuesto/4)>restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-danger');
            console.log('ya gastaste mas del 25%')
        } else if ((presupuesto/2)>restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
            console.log('ya gastaste mas del 50%');
        }
    }

}

//Instanciar

const ui=new IPresupuesto()
let presupuesto;


//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario =prompt('Cual es tu presupuesto');
    
    if (presupuestoUsuario==='' || presupuestoUsuario===null || isNaN(presupuestoUsuario) || presupuestoUsuario<=0 ) {
        window.location.reload()
        //alert('ingresar un presupuesto valido...')
    }
    presupuesto=new Presupuesto(presupuestoUsuario)
    //console.log(presupuesto)
    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e) {
    e.preventDefault();
    //leer datos de formulario:
    const nombre=document.querySelector('#gasto').value;
    const cantidad=Number(document.querySelector('#cantidad').value);

    //validar:
    if (nombre==='' || cantidad==='') {
        ui.imprimirAlerta('ambos campos son obligatorios.','error')
        return;
        
    } else if (cantidad<=0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida.','error');
        return;
    }
    
    //generar on objeto de tipo object literal hansmenor (contrario al destructury)
    const gasto ={nombre,cantidad,id:Date.now()}
    
    presupuesto.nuevoGasto(gasto);
    //mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente.')
    //agregar gasto a listado:
    const {gastos,restante}=presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    //reinicia el formulario
    formulario.reset();
    
}