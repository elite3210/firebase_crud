var start = Date.now();
import { guardarProduct, onGetProduct, deleteProduct, updateProduct } from './firebase.js'
import { Datatable } from './dataTable.js'


//para guaradr los registo en firebase

const tareaForm = document.getElementById('tarea-form')
const totalInventario2 = document.getElementById('totalInventario')
const totalPeso2 = document.getElementById('totalPeso')
const btnImprimir = document.getElementById('btnImprimir')
const tareasContainer = document.getElementById('tablaContainer')
const cuadroBarcode = document.getElementById('barcode')


let editStatus = false;
let activaBarCode = false
let id = '';
let totalInventario = 0
let totalPeso = 0;

btnImprimir.addEventListener('click', imprimirBarcode)

tareaForm.addEventListener('submit', enviarDB)

//traer los productos de firebase toda la coleccion productos
const registroProductos = onGetProduct((querySnapshot) => {
    totalInventario = 0
    totalPeso = 0;
    const items = [];
    //tareasContainer.innerHTML='';                           //borra el contenido previo, hacer una funcion limpiar...
    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            obj.values.idProducto = doc.id;
            obj.values.pesoCalculado = Math.round(obj.values.peso * obj.values.stock);
            obj.values.importe = Math.round(obj.values.precio * obj.values.stock);

            totalInventario += obj.values.precio * obj.values.stock;
            totalPeso += obj.values.peso * obj.values.stock;
            items.push(obj);
        });

        totalInventario2.innerHTML = `${Math.round(totalInventario)}`
        totalPeso2.innerHTML = `${Math.round(totalPeso)}`

    } else { tareasContainer.innerHTML = '<p>No se trajo los datos de la BD Firebase</p>' }

    //console.log('items:',items);

    const titulo = { ' ': '', CODIGO: 'idProducto', NOMBRE: 'nombre', STOCK: 'stock', UND: 'unidad', PESO: 'pesoCalculado', MEDIDA: 'medidas', PRECIO: 'precio', VALOR: 'importe' }
    const dt = new Datatable('#dataTable',
        [
            { id: 'btnEdit', text: 'editar', icon: 'edit', action: function () { const elementos = dt.getSelected(); editarFila(elementos) } },
            { id: 'btnBarcode', text: 'barcode', icon: 'barcode', action: function () { const elementos = dt.getSelected(); pintarBarcode(elementos); } },
            { id: 'dtnDelete', text: 'delete', icon: 'delete', action: function () { const elementos = dt.getSelected(); eliminarProducto(elementos) } },
            { id: 'dtnDuplicar', text: 'clonar', icon: 'content_copy', action: function () { const elementos = dt.getSelected(); clonarFila(elementos) } },
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', action: function () { const elementos = dt.getSelected(); pintarFormularioProductos() } }
        ]
    );


    dt.setData(items, titulo);
    dt.makeTable();
})

function editarFila(elementos) {
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    editStatus = true;
    id = elementos.id //se asigna el id para luegp usar en update product  
    const producto = elementos.values

    console.log('objeto producto solicitado btnEdit:', producto)

    tareaForm['imagen'].value = producto.imagen
    tareaForm['categoriaPadre'].value = producto.categoriaPadre;
    tareaForm['categoria'].value = producto.categoria
    tareaForm['codigo'].value = producto.idProducto
    tareaForm['nombre'].value = producto.nombre
    tareaForm['costo'].value = producto.costo
    tareaForm['stock'].value = producto.stock
    tareaForm['unidad'].value = producto.unidad
    tareaForm['peso'].value = producto.peso
    tareaForm['precio'].value = producto.precio
    tareaForm['activo'].value = producto.activo
    tareaForm['description'].value = producto.descripcion
    
    tareaForm['pesoBruto'].value = producto.pesoBruto;
    tareaForm['assignedStock'].value=producto.assignedStock;
    tareaForm['targetStock'].value=producto.targetStock;

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
    tareaForm['medidaX'].value = JSON.parse(producto.medidas).width;
    tareaForm['medidaY'].value = JSON.parse(producto.medidas).length;
    tareaForm['medidaZ'].value = JSON.parse(producto.medidas).height;

    
    tareaForm['boton-task-save'].innerHTML = 'Actualizar'
    //document.getElementById(id).disabled=false;
}


function clonarFila(elementos) {
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    id = elementos.id //se asigna el id para luegp usar en update product  
    const producto = elementos.values

    console.log('objeto producto solicitado btnEdit:', producto)

    tareaForm['imagen'].value = producto.imagen
    tareaForm['categoriaPadre'].value = producto.categoriaPadre;
    tareaForm['categoria'].value = producto.categoria
    tareaForm['codigo'].value = producto.idProducto
    tareaForm['nombre'].value = producto.nombre
    tareaForm['costo'].value = producto.costo
    tareaForm['stock'].value = producto.stock
    tareaForm['unidad'].value = producto.unidad
    tareaForm['peso'].value = producto.peso
    tareaForm['precio'].value = producto.precio
    tareaForm['activo'].value = producto.activo
    tareaForm['description'].value = producto.descripcion
    console.log('medidas:', producto.medidas)
    tareaForm['medidaX'].value = JSON.parse(producto.medidas).width;
    tareaForm['medidaY'].value = JSON.parse(producto.medidas).length;
    tareaForm['medidaZ'].value = JSON.parse(producto.medidas).height;
    tareaForm['pesoBruto'].value = producto.pesoBruto

    editStatus = false;
    tareaForm['boton-task-save'].innerHTML = 'Clonar'
    //document.getElementById(id).disabled=false;
}

function pintarFormularioProductos() {
    let formularioProducto = `
        <div class="container">
            <div class="input-group"> 
                <label for="codigo" >Codigo :</label>
                <input class="form-control"   type="text"  id='codigo'>
            </div>
            <div class="input-group">
                <label for="categoriaPadre" >Categoria Padre:</label>
                <input class="form-control" type="text" id='categoriaPadre'>
            </div>
            <div class="input-group">    
                <label for="categoria" >Categoria:</label>
                <input class="form-control" type="text" id='categoria'>
                </div>
                <div class="input-group"> 
                <label for="nombre" >Nombre :</label>
                <input class="form-control"   type="text" id='nombre'  required>
                </div>

                <div class="input-group"> 
                <label for="stock" >Stock :</label>
                <input class="form-control"  type="number" min = "0" step = "0.001" id='stock'>
                </div>

                <div class="input-group"> 
                <label for="assignedStock" >Stock Asignado:</label>
                <input class="form-control"  type="number" min = "0" step = "0.001" id='assignedStock'>
                </div>

                <div class="input-group"> 
                <label for="targetStock" >Stock Objetivo:</label>
                <input class="form-control"  type="number" min = "0" step = "0.001" id='targetStock'>
                </div>
                
                <div class="input-group"> 
                <label for="unidad" >Unidad :</label>
                <input class="form-control"   type="text" id='unidad'>
                </div>
                <div class="input-group"> 
                <label for="peso" >Peso :</label>
                <input class="form-control"   type="number" min = "0" step = "0.001"  id='peso'>
                </div>
                <div class="input-group"> 
                <label for="precio" >Precio :</label>
                <input class="form-control"   type="number"  min = "0" step = "0.1" id='precio'>
                </div>
                <div class="input-group"> 
                <label for="description">Descripcion:</label>
                <input class="form-control" type="text" id="description">
                </div>
                <div class="input-group"> 
                <label for="activo" >Activo :</label>
                <input class="form-control"   type="number"  id='activo'>
                </div>
                <div class="input-group"> 
                <label for="costo" >Costo :</label>
                <input class="form-control"  type="number" min = "0" step = "0.1"   id='costo'>
                </div>
                <div class="input-group"> 
                <label for="imagen" >Imagen :</label>
                <input class="form-control"   type="text" id='imagen'>
                </div>

                <div class="input-group"> 
                <label for="medidaX" >Ancho:</label>
                <input class="form-control"   type="text"  id='medidaX'>
                </div>
                <div class="input-group"> 
                <label for="medidaY" >Largo:</label>
                <input class="form-control"   type="text"  id='medidaY'>
                </div>
                <div class="input-group"> 
                <label for="medidaZ" >Altura:</label>
                <input class="form-control"   type="text"  id='medidaZ'>
                </div>
                <div class="input-group"> 
                <label for="pesoBruto" >Peso Bruto:</label>
                <input class="form-control"   type="text"  id='pesoBruto'>
                </div>
                <div class="input-group"> 
                <label for="nota" >Nota:</label>
                <textarea name='nota' class="form-control" type="text"  id='nota'></textarea>
                </div>
              

              <div id="container-btn" >
                <button id="boton-task-save" class="btn btn-primary">Actualizar</button> 
                </div>
                <div class="table-responsive">
                <table class="table table-hover">
                    <tbody id="receta">
                    </tbody>
                </table> 
                </div>       
        </div>
                `
    tareaForm.innerHTML = formularioProducto
}

function pintarBarcode(elementos) {

    //e.preventDefault()
    activaBarCode = true
    id = elementos.id

    console.log('barcode en lienzo creado para id:', id)

    //genera codigo de barra en un elemento svg con id barcode
    JsBarcode('#barcode', id, {
        lineColor: "#000",
        width: 1.3,
        height: 30,
        displayValue: true
    });
}

function eliminarProducto(elementos) {
    alert(`desea eliminar este producto:${elementos[0].id}? se borrara y no podra recuperarlo`)
    //deleteProduct(elementos[0].id)
};

function generaPDF(elementoParaConvertir) {
    console.log('generando pdf en tag:', elementoParaConvertir)
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
        .from(elementoParaConvertir)
        .save()
        .catch(err => console.log(err));
}

function borrarBarcode() {
    cuadroBarcode.innerHTML = ''
}

function imprimirBarcode(e) {

    console.log('dentro del evento clik btnImprimir')
    e.preventDefault()
    if (activaBarCode) {
        generaPDF(cuadroBarcode)
        activaBarCode = false
    } else {
        console.log('deber elegir un producto primero..')
    }
    setTimeout(borrarBarcode, 1000);
}

function enviarDB(e) {
    console.log('dentro funcion enviarBD:', editStatus);
    e.preventDefault()
    const imagen = tareaForm['imagen'];
    const categoriaPadre = tareaForm['categoriaPadre'];
    const categoria = tareaForm['categoria'];
    const codigo = tareaForm['codigo'];
    const nombre = tareaForm['nombre'];
    const costo = tareaForm['costo'];
    const stock = tareaForm['stock'];
    const assignedStock = tareaForm['assignedStock'];
    const targetStock = tareaForm['targetStock'];
    const unidad = tareaForm['unidad'];
    const peso = tareaForm['peso'];
    const precio = tareaForm['precio'];
    const activo = tareaForm['activo'];
    const descripcion = tareaForm['description'];
    const medidas = `{"width":${tareaForm['medidaX'].value},"length":${tareaForm['medidaY'].value},"height":${tareaForm['medidaZ'].value}}`;
    console.log('medidas stringify:', medidas)
    const pesoBruto = tareaForm['pesoBruto'];
    //const pesoBruto           = tareaForm['pesoBruto'];
    ;


    if (!editStatus) {
        console.log(' se guarada y no actualizara !editStatus', editStatus);
        guardarProduct(codigo.value,
            categoriaPadre.value,
            categoria.value,
            nombre.value,
            costo.value,
            stock.value,
            unidad.value,
            peso.value,
            precio.value,
            activo.value,
            descripcion.value,
            imagen.value,
            medidas,
            pesoBruto.value,
            assignedStock.value,
            targetStock.value
        )

    } else {
        console.log('entre a else de actualiza');
        console.log('id en else:', id);
        updateProduct(id, {
            imagen: imagen.value,
            categoria: categoriaPadre.value,
            categoria: categoria.value,
            nombre: nombre.value,
            costo: costo.value,
            stock: stock.value,
            unidad: unidad.value,
            peso: peso.value,
            precio: precio.value,
            activo: activo.value,
            descripcion: descripcion.value,
            medidas: medidas,
            pesoBruto: pesoBruto.value,
            assignedStock:assignedStock.value,
            targetStock:targetStock.value
        })
        editStatus = false
        tareaForm['boton-task-save'].innerHTML = 'Crear'
    }

    tareaForm.reset()
    tareaForm.innerHTML = ''
}


var end = Date.now();
console.log('demoro:', end - start);

