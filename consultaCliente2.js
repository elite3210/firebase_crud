import {onGetSocios} from './firebase.js'
import {onGetVentas} from './firebase.js'
import {Datatable} from './dataTable.js'

console.log('inicio de la carga de pagina.. consultacliente2')
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')

const registroSocios = onGetSocios((sociosSnapShot) =>{
    //console.log('traido de firebase:',registroSocios)
    sociosContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...
    let objetos=[];
    if(sociosSnapShot){
        sociosSnapShot.forEach(doc =>{
            let objeto      = doc.data();
            objeto.id       = doc.id;
            objetos.push(objeto);

            let fila = document.createElement('div')
            fila.setAttribute('class','fila')
            fila.setAttribute('id',doc.id)
            
            fila.innerHTML = `  <div class="filaIzquierda">
                                    <div>
                                        <h6>${objeto.razonSocial}</h6>
                                    </div>
                                    <div class="rucTexto">
                                        <h6>${objeto.id}</h6>
                                    </div>
                                    <div  class="rucTexto">
                                        <h6>${objeto.telefono}</h6>
                                    </div>
                                </div>

                                <div class ="filaDerecha">
                                    <div>
                                        <h6><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></h6>
                                    </div>
                                    <div>
                                        <h6><span>S/</span>${objeto.saldo}</h6>
                                    </div>
                                    <div>
                                        <h6>${objeto.departamento}</h6>
                                    </div>
                                </div>
                                `
            sociosContainer.appendChild(fila);
            fila.addEventListener('click',()=>{
                let id=fila.getAttribute('id');
                console.log('el id es:',id)
                const registroVentas = onGetVentas((ventasSnapShot) =>{
                    let items =[]
                    if(ventasSnapShot){
                        ventasSnapShot.forEach(doc =>{
                            //Dando formato a los datos traidos de firebase para acomodar a <Datatable>
                            let obj ={};
                            obj.id=doc.id
                            obj.values=doc.data()
                            items.push(obj)
                        })
                    }  
                
                    
                
                    console.log('consulta ventas traido de FB :',items)
                
                    items.sort((a, b) => b.values.numero - a.values.numero);//metodo para ordenar por numero de documento, en array de objetos, seleccionar del objeto el atributo a ordenar, repetir en a y b
                    
                    let itemsFiltrado = items.filter((venta)=>{return venta['values'].ruc==id})
                    console.log('consulta ventasFiltradas traido de FB :',itemsFiltrado)
                    const titulo   = {' ':'',DOC:'numero',FECHA:'fecha',Estado:'estado',IMPORTE:'importeTotal'}
                    
                    const dt = new Datatable('#dataTable',
                    [
                        {id:'btnEdit',text:'editar',icon:'contract',
                        action:function(){
                            const elementos=dt.getSelected();
                            console.log('mostrando documento formato PC...',elementos); 
                            pintarDocumento(elementos)
                        }},
                        {id:'btnDocument',text:'doc',icon:'document_scanner',
                        action:function(){
                            const elementos=dt.getSelected(); 
                            pintarDocumento(elementos);
                            console.log('mostrando documento Formato Ticket...',elementos);
                        }}
                                        ]
                    );
                    
                    dt.setData(itemsFiltrado,titulo);
                    dt.makeTable();
                });
                
            })
        })

    }
    console.log('clientes traidos de firebase convertido:',objetos)
});



function pintarDocumento(arrayObjeto){//crea una ventana modal con los datos de la venta el detalle
                        
    const flotante = document.getElementById('flotante');
    flotante.innerHTML=`
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flotante2">Modal</button>
    <div class="modal modal-lg" id="flotante2">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">::DETALLE PEDIDO::</h5>
</div>
<div class="modal-body" id="flotante2">

    <section id="documentoPDF">

    <div class="grupo1">
        <div class="logo">
            <img src="./imagenes/heinz_sport_sac_logo.png" width="250" >
            </div>
        <div class="contacto">
            <h1 class="h6">www.heinzsport.com <i class="fa-solid fa-globe"></i></h1>
            <h1 class="h6">info@heinzsport.com <i class="fa-regular fa-envelope"></i></h1>
            <h1 class="h6">+51 962833765<i class="fa-brands fa-whatsapp"></i></h1>
        </div>
        <div class="cajita2">
            <h3 class="h6" id="ruc2">RUC: 20605216715</h3>
            <h3 class="h6">PEDIDO VENTA</h3>
            <h3 class="h6" id="cotizacion"></h3>
        </div>
    </div>

<form class="form" id="formulario">
<div class="cajita1">
    <div class="input-group">    
    <label for="ruc">CODIGO :</label>
    <h1 class='form-control celda ruc' type="text" id="ruc"  list="datoClientes" required placeholder="Ingresar RUC o DNI"></h1>
    </div>

    <div class="input-group"> 
    <label for="cliente">CLIENTE :</label>
    <h1  class='form-control celda cliente' type="text" id="cliente" placeholder="Razon Social o Nombre"></h1>
    </div>

    <div class="input-group"> 
    <label for="vendedor">VENDEDOR:</label>
    <h1  class='form-control celda vendedor' type="text" id="vendedor" placeholder="Nombre del Vendedor"></h1>
    </div>       
</div>

    <div class="cajita4">
        <div class="input-group">
            <label for="fecha">Fecha:</label>
            <h3 class="form-control celda" id="fecha"></h3>
        </div>
        <div class="input-group">
            <label for="tipoPago">Pago:</label>
            <h3 class="form-control celda" type="text" id="tipoPago"></h3>
        </div>
        <div class="input-group">
            <label for="metodoCobro">Cobro:</label>
            <h3 class="form-control celda" type="text" id="metodoCobro"></h3>
        </div>
    </div>
</form>

    <table id='table' class="tabla">  
        <thead class="tituloTabla">
            <tr><th>Item</th><th>Codigo</th><th>Cantidad</th><th>Unidad</th><th>Descripcion</th><th>Precio</th><th>Importe</th></tr>
        </thead>

        <tbody id="container"></tbody>
        
        <tfoot class="button-content">
        <tr><th>Sub_Total (S/)</th><th></th><th><h1 id="celdaSubTotal"  class="h6"></h1></th><th>Descuento (S/)</th><th><h1 id="descuento"  class="h6"></h1></th><th>Total (S/)</th><th><h1 id="celda_total"  class="h3"></h1></th></tr>
        </tfoot>
    </table>
    <br>
    <br>
    </section>



    </div>
    <div class="modal-footer">
    <button id="btn-imprimir" class="btn btn-primary">Imprimir</button>
      <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
    </div>
  </div>
</div>
</div>

`
const btn_imprimir = document.getElementById('btn-imprimir')
btn_imprimir.addEventListener('click', generaPDF)
    cotizacion.textContent    =arrayObjeto[0]['values'].numero
    vendedor.textContent      =arrayObjeto[0]['values'].vendedor
    ruc.textContent           =arrayObjeto[0]['values'].ruc
    cliente.textContent       =arrayObjeto[0]['values'].cliente
    fecha.textContent         =new Date(arrayObjeto[0]['values'].fecha).toLocaleDateString()
    tipoPago.textContent            =arrayObjeto[0]['values'].tipoPago
    metodoCobro.textContent         =arrayObjeto[0]['values'].metodoCobro
    celdaSubTotal.textContent =arrayObjeto[0]['values'].subTotal               
    descuento.textContent     =arrayObjeto[0]['values'].descuento  
    celda_total.textContent   =arrayObjeto[0]['values'].importeTotal

    let objetos         =JSON.parse(arrayObjeto[0]['values'].detalleCotizacion)
    let contador        =1;
    objetos.forEach(producto=>{
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
        const tabla             = document.getElementById('table');
        tabla.appendChild(fila)
    });
    
}

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


