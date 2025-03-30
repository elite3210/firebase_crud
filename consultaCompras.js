import { db } from './firebase.js'
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { Datatable } from './dataTable.js'
import { formularioVenta, renderBuyForm } from './ventas/formularioVenta.js'
import { newDocument } from './ventas/newOrder.js'
import { showMessage } from "./src/app/showMessage.js";


const onGetCompras = (callback) => onSnapshot(collection(db, 'Compras'), callback)

//traer los socios comerciales clientes de firebase

const nombreMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
const registroCompras = onGetCompras((comprasSnapShot) => {
    let items = []
    let comprasTotal = 0
    console.log('comprasSnapShot:', comprasSnapShot);

    if (comprasSnapShot) {
        comprasSnapShot.forEach(doc => {
            let obj = {};
            obj.id = doc.id
            obj.values = doc.data()
            obj.values.mes = nombreMes[new Date(obj.values.tiempo).getMonth()];
            let date = new Date(obj.values.tiempo);
            obj.values.fechaRegistro = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            //console.log('obj.values:',obj.values);

            let detalle = JSON.parse(obj['values'].detalleCompra)
            let importeTotal = detalle.reduce((total, obj) => { return total + obj.importe }, 0)
            comprasTotal += importeTotal

            obj['values'].importe = Math.round(importeTotal)
            //obj['values'].id=obj.values.numero
            items.push(obj)
        })
    }

    console.log(' consulta venta :', items)

    items.sort((a, b) => b.values.nuevoNumero - a.values.nuevoNumero);//metodo para ordenar array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b


    const titulo = { ' ': '', DOCUMENTO: 'nuevoNumero', PROVEEDOR: 'proveedor', RUC: 'ruc', FECHA: 'fecha', REGISTRO: 'fechaRegistro', FACTURA: 'documento', IMPORTE: 'importe' }

    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnNew', text: 'nuevo', icon: 'note_add', targetModal: '#myModal', action: function () {
                    const item = dt.getSelected();
                    const typeOperation='OrdenCompra';
                    newDocument(typeOperation);
                }
            },
            {
                id: 'btnEdit', text: 'editar', icon: 'contract', targetModal: '#myModal',
                action: function () {
                    const item = dt.getSelected();
                    console.log('mostrando documento formato PC...', item);
                    renderBuyForm(item);
                }
            },
            {
                id: 'btnEdit', text: 'editar', icon: 'edit',
                action: function () {
                    const elementos = dt.getSelected();
                    console.log('editar datos...', elementos);
                }
            },
            { id: 'btnDelete', text: 'eliminar', icon: 'delete', action: function () { const elemntos = dt.getSelected(); console.log('eliminar datos...', elemntos); } }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable();

});

function pintarDocumento(arrayObjeto) {//crea una ventana modal con los datos de la venta el detalle
    console.log(' consulta venta arrayObjeto :', arrayObjeto)
    const flotante = document.getElementById('myModal');
    flotante.innerHTML = formularioVenta

    //const btn_imprimir = document.getElementById('btn-imprimir')
    //btn_imprimir.addEventListener('click', generaPDF)

    cotizacion.textContent = arrayObjeto['values'].nuevoNumero
    //vendedor.textContent = arrayObjeto['values'].vendedor
    ruc.textContent = arrayObjeto['values'].ruc
    cliente.textContent = arrayObjeto['values'].proveedor
    fecha.textContent = new Date(`${arrayObjeto['values'].fecha}T12:00:00Z`).toLocaleDateString()
    //tipoPago.value = arrayObjeto['values'].tipoPago
    //metodoCobro.value = arrayObjeto['values'].metodoCobro
    //celdaSubTotal.textContent = arrayObjeto['values'].subTotal
    //descuento.textContent = arrayObjeto['values'].descuento
    //celda_total.textContent = arrayObjeto['values'].importeTotal
    //fechaEnvio.textContent = arrayObjeto['values'].fechaEnvio

    //let traerDoc = await traerUnSocio(arrayObjeto['values'].transportedBy);
    //let fila = traerDoc.data()                                  //.data() metodo para mostrar solo los datos del producto
    //empresaEnvio.textContent = fila.razonSocial;
    //addressTransportedBy.textContent = fila.telefono;

    let objetos = JSON.parse(arrayObjeto['values'].detalleCompra)
    let contador = 1;
    objetos.forEach(producto => {
        let fila = document.createElement('tr')

        fila.innerHTML = `
                          <td>${contador}</td>
                          <td>${producto.id}</td>
                          <td>${producto.cantidad}</td>
                          <td>${producto.unidad}</td>
                          <td>${producto.nombre}</td>
                          <td>${producto.precio}</td>
                          <td>${producto.importe.toFixed(2)}</td>                       
                          `
        contador++
        const tabla = document.getElementById('table');
        tabla.appendChild(fila)
    });

};

//renderOrderForm(arrayObjeto)

async function generaPDF() {
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion = document.getElementById('documentoPDF'); // <-- Aquí puedes elegir cualquier elemento del DOM
    let id_cotizacion = document.getElementById('cotizacion').value

    await html2pdf()
        .set({
            margin: 5,
            filename: `PV${id_cotizacion}`,
            //se borro image jpg, averiguar codigo origina en github del cdn html2pdf form['cliente'].value
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

}

