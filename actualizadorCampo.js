import {onGetProveedor,guardarSocios} from './firebase.js'

console.log('inicio de la carga de pagina..')

const registroSocios = onGetProveedor((sociosSnapShot) => {

    let items = [];
    if (sociosSnapShot) {
        sociosSnapShot.forEach(doc => {
            let obj={};
            obj.id = doc.id;
            obj.values = doc.data();
            items.push(obj);
        })
        //console.log('itemsClientes',items)
    }else{console.log('no se trajeron datos...')};
    /*
    items.forEach((obj)=>{
        guardarSocios(
            obj.id,
            obj['values'].razonSocial,
            obj['values'].inicioActividad,
            obj['values'].nombresContacto,
            '',
            obj['values'].email,
            '',
            '',
            obj['values'].telefono,
            obj['values'].direccion,
            obj['values'].distrito,
            obj['values'].provincia,
            obj['values'].departamento,
            obj['values'].ubicacion,
            '',
            obj.id,
            obj['values'].clienteRank,
            obj['values'].proveedorRank,
            obj['values'].saldo,
        );
        
        //updateProveedor(item.id,{clienteRank:0,proveedorRank:1,vendidoPor:'',nombresContacto:item['values'].contacto,ubicacion:'',provincia:'',departamento:'',distrito:'',email:'',inicioActividad:'',idImpuestos:item.id});
        console.log('actualizando:',obj.id)
    })
*/
});


/*

    //no se donde poner lo que sigue abajo{:}

    eventListener();

    function eventListener() {
        document.addEventListener('DOMContentLoaded', getNumeroEgreso)
        //formulario.addEventListener('submit',agregarGasto)   
    };


    class Producto {
        constructor(numeroEgreso, fecha, name, price, dniColaborador) {
            this.numeroEgreso = numeroEgreso;
            this.fecha = fecha;
            this.name = name;
            this.price = price;
            this.dniColaborador = dniColaborador;
        }
    }

    class IProducto {

        addProduct(producto) {
            const productList = document.getElementById('product-list')
            const element = document.createElement('div');
            const creado = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString();
            const tipoTransaccion = 'haber'
            const importeDebe = '';

            element.innerHTML = `
        <div class="card text-center mb-4">
            <div class="card-body">
                <strong>Numero:</strong>${producto.numeroEgreso}
                <strong>DNI:</strong>${producto.dniColaborador}
                <strong>Fecha:</strong>${producto.fecha}
                <strong>Descripcion:</strong>${producto.name}
                <strong>Monto:</strong>${producto.price}
                <a href class="btn btn-danger" name="delete">Delete</a>
            </div>
        </div>
        `
            productList.appendChild(element)

            guardarTransaccionesLaboral(producto.fecha, producto.dniColaborador, producto.numeroEgreso, creado, producto.name, tipoTransaccion, importeDebe, producto.price);
            updateNumeracion('Egreso', { ultimoNumero: producto.numeroEgreso })
            console.log('se registro un pago por:', producto.price, producto.numeroEgreso)
        };

        resetForm() {
            document.getElementById('product-form').reset()
        };

        deleteProduct(element) {
            if (element.name === 'delete') {
                console.log(element.parentElement.parentElement.parentElement.remove())
                this.showMessage('el producto fue elimino', 'info')
            }
        };

        showMessage(message, cssClass) {
            const div = document.createElement('div')
            div.className = `alert alert-${cssClass} mt-1`;
            div.appendChild(document.createTextNode(message));
            //show dom
            const container = document.querySelector('.container');
            const app = document.querySelector('#App');
            container.insertBefore(div, app)
            setTimeout(() => { document.querySelector('.alert').remove() }, 1500)
        };
    }

    //DOM Events...



    document.getElementById('product-form').addEventListener('submit', function (e) {
        const numeroEgreso = document.getElementById('numero').value;
        const fecha = document.getElementById('fecha').value;
        const name = `EG N°${numeroEgreso} ${document.getElementById('name').value}`;
        const price = Number(document.getElementById('price').value);
        const dniColaborador = document.getElementById('dniColaborador').value;


        let producto = new Producto(numeroEgreso, fecha, name, price, dniColaborador)
        let ui = new IProducto()

        if (numeroEgreso === '' || name === '' || price === '' || dniColaborador === '' || fecha === '') {
            return ui.showMessage('completar el formulario', 'danger')
        }
        ui.addProduct(producto)
        ui.resetForm()
        ui.showMessage('Producto agregado satisfactoriamente', 'success')
        let celdaNumero = document.getElementById('numero')
        celdaNumero.value = Number(numeroEgreso) + 1;
        console.log(producto)
        e.preventDefault()
    })

    document.getElementById('product-list').addEventListener('click', function (e) {
        const ui = new IProducto;
        ui.deleteProduct(e.target)
        e.preventDefault()
    })
*/