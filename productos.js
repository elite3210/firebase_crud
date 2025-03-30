var start = Date.now();
import { guardarProduct, onGetProduct, deleteProduct, updateProduct } from './firebase.js'
import { Datatable } from './dataTable.js';
import { showMessage } from "./src/app/showMessage.js";

const modalBody = document.querySelector('.modal-body');
const modalFooter = document.querySelector('.modal-footer');

let editStatus = false;
let id = '';

//traer los productos de firebase toda la coleccion productos
const registroProductos = onGetProduct((querySnapshot) => {

    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            obj.values.idProducto = doc.id;
            obj.values.pesoCalculado = Math.round(obj.values.peso * obj.values.stock);
            obj.values.importe = Math.round(obj.values.precio * obj.values.stock);
            items.push(obj);
        })};

    const titulo = { ' ': '', CODIGO: 'idProducto', NOMBRE: 'nombre', STOCK: 'stock', UND: 'unidad', PESO: 'pesoCalculado', PRECIO: 'precio', VALOR: 'importe' }
    const dt = new Datatable('#dataTable',
        [
            { id: 'btnEdit', text: 'editar', icon: 'edit',targetModal:'#myModal',action: function () { const elementos = dt.getSelected(); editProduct(elementos) } },
            //{ id: 'btnBarcode', text: 'barcode', icon: 'barcode',targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); pintarBarcode(elementos); } },
            { id: 'dtnDelete', text: 'delete', icon: 'delete', action: function () { const elementos = dt.getSelected(); eliminarProducto(elementos) } },
            { id: 'dtnDuplicar', text: 'clonar', icon: 'content_copy',targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); clonarProduct(elementos) } },
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); createProduct() } },
            { id: 'brnView', text: 'nuevo', icon: 'contract', targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); viewProduct(elementos) } }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable();
});

function createProduct() {
    clearHTML(modalBody);
    clearHTML(modalFooter);
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    //const formModal=document.getElementById('tarea-form');
    const btnSend=document.createElement('button');
    btnSend.setAttribute('id','btn-send');
    btnSend.setAttribute('class','btn btn-primary');
    btnSend.addEventListener('click',enviarDB)
    modalFooter.appendChild(btnSend);           


    editStatus = false;
    btnSend.textContent = 'Guardar'
    //document.getElementById(id).disabled=false;
    //formModal.addEventListener('submit', enviarDB)
};

function editProduct(elementos) {
    clearHTML(modalBody);
    clearHTML(modalFooter);
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    const formModal=document.getElementById('product-form');
    const btnSend=document.createElement('button');
    btnSend.setAttribute('id','btn-send');
    btnSend.setAttribute('class','btn btn-primary');
    btnSend.addEventListener('click',enviarDB);
    btnSend.textContent='Actualizar';
    modalFooter.appendChild(btnSend);           

    editStatus = true;
    id = elementos.id //se asigna el id para luegp usar en update product  
    const producto = elementos.values

    console.log('objeto producto solicitado btnEdit:', producto)

    formModal['imagen'].value = producto.imagen;
    formModal['categoriaPadre'].value = producto.categoriaPadre;
    formModal['categoria'].value = producto.categoria;
    formModal['codigo'].value = producto.idProducto
    formModal['nombre'].value = producto.nombre
    formModal['costo'].value = producto.costo
    formModal['stock'].value = producto.stock
    formModal['unidad'].value = producto.unidad
    formModal['peso'].value = producto.peso
    formModal['precio'].value = producto.precio
    formModal['activo'].value = producto.activo
    formModal['description'].value = producto.descripcion
    
    formModal['pesoBruto'].value = producto.pesoBruto;
    formModal['assignedStock'].value=producto.assignedStock;
    formModal['productToReceive'].value = producto.productToReceive;
    formModal['targetStock'].value=producto.targetStock;
    formModal['imagen'].value = producto.imagen;
    formModal['productType'].value =producto.productType;
    formModal['canBeSold'].checked=producto.canBeSold;
    formModal['canBePurcharsed'].checked=producto.canBePurcharsed;
    formModal['productRoute'].value=producto.productRoute;
    formModal['unspscCategory'].value=producto.unspscCategory;

    if (producto.receta) {//si tiene receta lo pinta
        const receta=JSON.parse(producto.receta)
        const tbody=document.getElementById('receta')
        console.log('receta:',receta)
        let tituloTbody='<tr"><th>N°</th><th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PESO</th></tr>'
        tbody.innerHTML=tituloTbody
        let pesoBruto=0;

        receta.forEach((product,i)=>{
            let tr =document.createElement('tr')
            let html =`
                <td>${i+1}</td>
                <td>${product.id}</td>
                <td>${product.descripcion}</td>
                <td>${product.cantidad}</td>
                <td>${product.pesoConsumido}</td>
                `
            tr.innerHTML=html;
            tbody.appendChild(tr)
            pesoBruto+=product.pesoConsumido
        })
        console.log('pesoBruto caclculado:',pesoBruto)
    }
    
    console.log('medidas:', producto.medidas)
    formModal['medidaX'].value = JSON.parse(producto.medidas).width;
    formModal['medidaY'].value = JSON.parse(producto.medidas).length;
    formModal['medidaZ'].value = JSON.parse(producto.medidas).height;

    
    
    //document.getElementById(id).disabled=false;
};

function clonarProduct(elementos) {
    clearHTML(modalBody);
    clearHTML(modalFooter);
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    const formModal=document.getElementById('product-form');
    const btnSend=document.createElement('button');
    btnSend.setAttribute('id','btn-send');
    btnSend.setAttribute('class','btn btn-primary');
    btnSend.addEventListener('click',enviarDB)
    modalFooter.appendChild(btnSend);           

    id = elementos.id //se asigna el id para luegp usar en update product  
    const producto = elementos.values

    console.log('objeto producto solicitado btnEdit:', producto)

    formModal['imagen'].value = producto.imagen;
    formModal['categoriaPadre'].value = producto.categoriaPadre;
    formModal['categoria'].value = producto.categoria
    formModal['codigo'].value = producto.idProducto
    formModal['nombre'].value = producto.nombre
    formModal['costo'].value = producto.costo
    formModal['stock'].value = producto.stock
    formModal['unidad'].value = producto.unidad
    formModal['peso'].value = producto.peso
    formModal['precio'].value = producto.precio
    formModal['activo'].value = producto.activo
    formModal['description'].value = producto.descripcion
    console.log('medidas:', producto.medidas)
    formModal['medidaX'].value = JSON.parse(producto.medidas).width;
    formModal['medidaY'].value = JSON.parse(producto.medidas).length;
    formModal['medidaZ'].value = JSON.parse(producto.medidas).height;
    formModal['pesoBruto'].value = producto.pesoBruto

    editStatus = false;
    btnSend.textContent = 'Clonar'
    //document.getElementById(id).disabled=false;
    //formModal.addEventListener('submit', enviarDB)
};

function viewProduct(elementos) {
    clearHTML(modalBody);
    clearHTML(modalFooter);
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    const formModal=document.getElementById('product-form');
    id = elementos.id //se asigna el id para luegp usar en update product  
    const producto = elementos.values

    console.log('objeto producto solicitado btnEdit:', producto,formModal);
    pintarBarcode(elementos);
    agregarImg(elementos);
    formModal['nombre'].value = producto.nombre
    formModal['codigo'].value = producto.idProducto
    formModal['categoriaPadre'].value = producto.categoriaPadre;
    formModal['categoria'].value = producto.categoria;
    formModal['precio'].value = producto.precio;
    formModal['costo'].value = producto.costo
    formModal['unidad'].value = producto.unidad
    formModal['activo'].value = producto.activo
    formModal['stock'].value = producto.stock
    formModal['assignedStock'].value = producto.assignedStock
    formModal['targetStock'].value = producto.targetStock
    formModal['productToReceive'].value = producto.productToReceive;
    formModal['peso'].value = producto.peso
    formModal['pesoBruto'].value = producto.pesoBruto
    formModal['nota'].value = producto.notaProducto ? producto.notaProducto: ''; //let accessAllowed = (age > 18) ? true : false;
    formModal['description'].value = producto.descripcion;
    formModal['imagen'].value = producto.imagen;
    formModal['productType'].value =producto.productType;
    formModal['canBeSold'].checked=producto.canBeSold;
    formModal['canBePurcharsed'].checked=producto.canBePurcharsed;
    formModal['productRoute'].value=producto.productRoute;
    formModal['unspscCategory'].value=producto.unspscCategory;
    formModal['medidaX'].value = JSON.parse(producto.medidas).width ? JSON.parse(producto.medidas).width: '';
    formModal['medidaY'].value = JSON.parse(producto.medidas).length ? JSON.parse(producto.medidas).length: '';
    formModal['medidaZ'].value = JSON.parse(producto.medidas).height ? JSON.parse(producto.medidas).height: '';

    function agregarImg(elementos) {
        const producto = elementos.values
        const imagen = producto.imagen;
        const contenedor = document.getElementById("imgContainer");
        contenedor.insertAdjacentHTML("beforeend",`<img src=carrito/${imagen} alt=${imagen} style="width:200px;">`);
    };

    
    //editStatus = false;
    //formModal['boton-task-save'].innerHTML = 'Clonar'
    //document.getElementById(id).disabled=false;
};

function pintarFormularioProductos() {
    //creando elementos html para meterlo al modal
    const formContainer=document.createElement('div');
    formContainer.setAttribute('class','container');
    modalBody.appendChild(formContainer);
   
    let formularioProducto = `
        <section id="documentoPDF">
            <!--Tabs-->
            <div class=" container contenedorClientes">

        
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">GENERAL</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="atributos-tab" data-bs-toggle="tab" data-bs-target="#atributos-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">ATRIBUTOS</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="ventas-tab" data-bs-toggle="tab" data-bs-target="#ventas-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">VENTAS</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="compras-tab" data-bs-toggle="tab" data-bs-target="#compras-tab-pane"
                    type="button" role="tab" aria-controls="compras-tab-pane" aria-selected="false" >COMPRAS</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="inventario-tab" data-bs-toggle="tab" data-bs-target="#inventario-tab-pane"
                    type="button" role="tab" aria-controls="inventario-tab-pane" aria-selected="false">INVENTARIO</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="contabilidad-tab" data-bs-toggle="tab" data-bs-target="#contabilidad-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">CONTABILIDAD</button>
                </li>
            </ul>

            <form class="form" id="product-form">
            <div class="tab-content" id="myTabContent">

            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                <br>
                <div>
                <svg id="barcode" class="barCode-container"></svg>
                <div id="imgContainer"></div>
                </div>

                <div class="input-group">
                    <label class="input-group-text" for="codigo" >Codigo :</label>
                    <input class='form-control' type="text" id='codigo' required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="nombre" >Nombre :</label>
                    <input class='form-control' type="text" id='nombre'  required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="description">Descripcion:</label>
                    <input class='form-control' type="text" id="description" required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="categoriaPadre" >Categoria Padre:</label>
                    <input class='form-control' type="text" id='categoriaPadre' required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="categoria" >Categoria:</label>
                    <input class='form-control' type="text" id='categoria' required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="precio" >Precio :</label>
                    <input class='form-control celda inicio' type="number"  min = "0" step = "0.1" id='precio' required>
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="costo" >Costo Unitario :</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.1"   id='costo' required>
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="unidad" >Unidad :</label>
                    <input class='form-control  telefono' type="text" id='unidad' required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="imagen" >Ruta Imagen:</label>
                    <input class='form-control' type="text"  id="imagen">
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="productType" >Product Type:</label>
                    <input class='form-control' type="text"  id='productType'>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="codigo" >Invoicing Policy:</label>
                    <input class='form-control' type="text"  id='invoicingPolicy'>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="customerTaxes" >Customer Taxes:</label>
                    <input class='form-control' type="text"  id='customerTaxes'>
                </div>
            </div>

            <div class="tab-pane fade" id="atributos-tab-pane" role="tabpanel" aria-labelledby="atributos-tab" tabindex="0">
                <br>
                <div class="input-group">
                    <label class="input-group-text" for="activo" >Activo :</label>
                    <input class='form-control celda cliente' type="number"  id='activo'>  
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="apellidosContacto">Apellidos :</label>
                    <input class='form-control celda cliente' type="text" id="apellidosContacto">
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="email">Correo:</label>
                    <input class='form-control celda correo' type="email" id="email">
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="dni">DNI :</label>
                    <input class='form-control dni' type="number" id="dni">
                </div>
                <div class="input-group">
                    <label class="input-group-text" class='celda cargo' for="cargo">Cargo :</label>
                    <input class='form-control cargo' type="text" id="cargo">
                </div>
                <div class="input-group">
                    <label class="input-group-text" class='telefono' for="cargo">Telefono :</label>
                    <input class='form-control celda telefono' type="tel" id="telefono">
                </div>
            </div>

            <div class="tab-pane fade" id="ventas-tab-pane" role="tabpanel" aria-labelledby="ventas-tab" tabindex="0">
                <div class="input-group">
                    <label class='input-group-text' for="optionalProducts">Optional Products:</label>
                    <input class='form-control celda cliente' type="text" id="optionalProducts"></div>
                <div class="input-group">
                    <label class='input-group-text' for="distrito">Accesory Products:</label>
                    <input class='form-control celda distrito' type="text" id="distrito"></div>
                <div class="input-group">
                    <label class='input-group-text' for="provincia">Alternative Product:</label>
                    <input class='form-control cargo' type="text" id="provincia"></div>
                <div class="input-group">
                    <label class='input-group-text celda telefono' for="departamento">Website:</label>
                    <input class='form-control  telefono' type="text" id="departamento"></div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="departamento">Categories:</label>
                    <input class='form-control  telefono' type="text" id="ubicacion"></div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="clienteRank">Out of Stock:</label>
                    <input class='form-control  telefono' type="number" id="clienteRank"></div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="proveedorRank">Show Available Qty:</label>
                    <input class='form-control  telefono' type="number" id="proveedorRank"></div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="vendidoPor">Available in POS:</label>
                    <input class='form-control  telefono' type="number" id="vendidoPor"></div>
                <div class="input-group">
                    <label class='input-group-text nota' for="nota">Anotacion:</label>
                    <textarea class='form-control  nota' cols="30" type="text" id="nota" required></textarea>
                </div>
            </div>
            <div class="tab-pane fade" id="compras-tab-pane" role="tabpanel" aria-labelledby="compras-tab" tabindex="0">
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="vendidoPor">HS Code:</label>
                    <input class='form-control  telefono' type="number" id="vendidoPor">
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="purchaseUoM">Purchase UoM:</label>
                    <input class='form-control  telefono' type="number" id="purchaseUoM">
                </div>

                <div class="input-group">
                    <table>
                    <thead>
                        <tr>
                        <th>Metrial</th><th>Cantidad</th>
                        
                        </tr>
                    </thead>

                    </table>
                </div>
            </div>

            <div class="tab-pane fade" id="inventario-tab-pane" role="tabpanel" aria-labelledby="inventario-tab" tabindex="0">
                <div class="input-group">
                    <label class='input-group-text nota' for="stock" >Stock:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001" id='stock' required> 
                </div>
                <div class="input-group">
                    <label class='input-group-text nota' for="assignedStock" >Stock Asignado:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001" id='assignedStock' required>
                </div>
                <div class="input-group">
                    <label class='input-group-text nota' for="targetStock" >Stock Objetivo:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001" id='targetStock' required>
                </div>
                <div class="input-group">
                    <label class='input-group-text nota' for="productToReceive">Product to Recive:</label>
                    <input class='form-control  telefono' type="number" id="productToReceive">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="productRoute">Routes:</label>
                    <input class='form-control celda cliente' type="text" id="productRoute"></div>
                <div class="input-group">
                    <label for="canBeSold">Pueder ser vendido</label><input type="checkbox" id="canBeSold"  required>
                </div>
                <div class="input-group">
                    <label for="canBePurcharsed">Puede ser Comprado</label><input type="checkbox" id="canBePurcharsed" required>
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="provincia">Responsible:</label>
                    <input class='form-control cargo' type="text" id="provincia">
                </div>
                <div class="input-group">
                    <label class='input-group-text celda telefono' for="peso" >Peso :</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001"  id='peso' required>   
                </div>
                <div class="input-group">
                    <label class='input-group-text celda telefono' for="peso" >Peso Bruto:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001"  id='pesoBruto' required>   
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="medidaX" >Ancho:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001"  id='medidaX' required> 
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="medidaY" >Largo:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001" id='medidaY' required>  
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="medidaZ" >Altura:</label>
                    <input class='form-control  telefono' type="number" min = "0" step = "0.001" id='medidaZ' required> 
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="clienteRank">Manuf. Lead Time:</label>
                    <input class='form-control  telefono' type="number" id="clienteRank">
                </div>
                <div class="input-group">
                    <label class='input-group-text ubicacion' for="proveedorRank">Costumer Lead Time:</label>
                    <input class='form-control  telefono' type="number" id="proveedorRank">
                </div>
            </div>
            <div class="tab-pane fade" id="contabilidad-tab-pane" role="tabpanel" aria-labelledby="contabilidad-tab" tabindex="0">
                <div class="input-group">
                    <label class='input-group-text' for="income-Account">Income Account:</label>
                    <input class='form-control cargo' type="text" id="income-Account">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="income-Account">Commodity Code:</label>
                    <input class='form-control cargo' type="text" id="income-Account">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="income-Account">Country of Origen:</label>
                    <input class='form-control cargo' type="text" id="income-Account">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="unspscCategory">UNSPSC Category:</label>
                    <input class='form-control cargo' type="text" id="unspscCategory">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="income-Account">Expense Account:</label>
                    <input class='form-control cargo' type="text" id="income-Account">
                </div>
                <div class="input-group">
                    <label class='input-group-text' for="income-Account">Price Difference Account:</label>
                    <input class='form-control cargo' type="text" id="income-Account">
                </div>
            </div>

        </form>

        </div>
        </section>
    `

    //const formProduct =document.getElementById('')
    formContainer.innerHTML = formularioProducto;
};

function pintarBarcode(elementos) {

    const btnPrintBarcode=document.createElement('button');
    btnPrintBarcode.setAttribute('id','btnImprimir');
    btnPrintBarcode.setAttribute('class','btn btn-primary');
    btnPrintBarcode.addEventListener('click',imprimirBarcode);
    btnPrintBarcode.textContent='Print Barcode'

    modalFooter.appendChild(btnPrintBarcode)
    let idBarcode = elementos.id;

    //genera codigo de barra en un elemento svg con id barcode
    JsBarcode('#barcode',idBarcode, {
        lineColor: "#000",
        width: 1.3,
        height: 30,
        displayValue: true
    });
};

function eliminarProducto(elementos) {
    alert(`desea eliminar este producto:${elementos[0].id}? se borrara y no podra recuperarlo`)
    //deleteProduct(elementos[0].id)
};

function imprimirBarcode() {
    const cuadroBarcode = document.getElementById('barcode')
    console.log('cuadroBarcode:',cuadroBarcode)
    // <-- Aquí puedes elegir cualquier elemento del DOM
    html2pdf()
        .set({
            margin: 0.05,
            filename: 'barcode',
            //se borro image jpg, averiguar codigo origina en github del cdn html2pdf
            html2canvas: {
                scale: 3, // A mayor escala, mejores gráficos, pero más peso
                letterRendering: true,
            },
            jsPDF: {
                unit: "mm",
                format: [25, 35],
                orientation: 'landscape' // landscape('l') o portrait('p')
            }
        })
        .from(cuadroBarcode)
        .save()
        .catch(err => console.log(err));
};

function enviarDB(e) {
    e.preventDefault()
    console.log('dentro funcion enviarBD:', editStatus);
    const formModal=document.getElementById('product-form');
    const btnSend=document.getElementById('btn-send');
    const codigo = formModal['codigo'].value;
    const categoriaPadre = formModal['categoriaPadre'].value;
    const categoria = formModal['categoria'].value;
    const nombre = formModal['nombre'].value;
    const descripcion = formModal['description'].value;
    const costo = formModal['costo'].value;
    const stock = formModal['stock'].value;
    const assignedStock = formModal['assignedStock'].value;
    const targetStock = formModal['targetStock'].value;
    const productToReceive =formModal['productToReceive'].value;
    const unidad = formModal['unidad'].value;
    const imagen        = formModal['imagen'].value;
    const peso = formModal['peso'].value;
    const precio = formModal['precio'].value;
    const activo = formModal['activo'].value;
    const medidas = `{"width":${formModal['medidaX'].value},"length":${formModal['medidaY'].value},"height":${formModal['medidaZ'].value}}`;
    const pesoBruto = formModal['pesoBruto'].value;
    const notaProducto           = formModal['nota'].value;
    const productType           = formModal['productType'].value;
    const canBeSold         = formModal['canBeSold'].checked;
    const canBePurcharsed          = formModal['canBePurcharsed'].checked;
    const productRoute           = formModal['productRoute'].value;
    const unspscCategory          = formModal['unspscCategory'].value;
    console.log('Formulario Producto:', formModal,codigo,categoriaPadre,categoria,nombre,costo,stock,unidad,peso,precio,activo,descripcion,imagen,medidas,pesoBruto,assignedStock,targetStock)

    if (!editStatus) {
        console.log('se guaradá y no actualizara !editStatus');
            
        guardarProduct(
            codigo,
            categoriaPadre,
            categoria,
            nombre,
            costo,
            stock,
            unidad,
            peso,
            precio,
            activo,
            descripcion,
            imagen,
            medidas,
            pesoBruto,
            assignedStock,
            targetStock
        );

        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        modal.hide()
        showMessage(`Se creo y guardó un nuevo producto:${codigo}`,'success')
    } else {
        console.log('entre a else de actualizar id:', id);
        updateProduct(id, {
            imagen: imagen,
            categoriaPadre: categoriaPadre,
            categoria: categoria,
            nombre: nombre,
            costo: costo,
            stock: stock,
            unidad: unidad,
            peso: peso,
            precio: precio,
            activo: activo,
            descripcion: descripcion,
            medidas: medidas,
            pesoBruto: pesoBruto,
            assignedStock:assignedStock,
            targetStock:targetStock,
            productToReceive:productToReceive,
            notaProducto:notaProducto,
            productType:productType,
            canBeSold:canBeSold,
            canBePurcharsed:canBePurcharsed,
            productRoute:productRoute,
            unspscCategory:unspscCategory
                })
        editStatus = false
        btnSend.value = 'Crear';
        //cerrar modal y mostrar mensaje de operacion realizada        
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        modal.hide()
        showMessage(`Se edito con exito el producto:${id}`,'success')
    };

    formModal.reset()
    formModal.innerHTML = ''
};

function clearHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    }
};

var end = Date.now();
console.log('demoro:', end - start);

