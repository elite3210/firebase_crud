import {guardarProduct,onGetProduct,deleteProduct,updateProduct} from './firebase.js'

//para guaradr los registo en firebase

let body                = document.getElementsByTagName('body')
const tareaForm         = document.getElementById('tarea-form')
const totalInventario2  = document.getElementById('totalInventario')
const totalPeso2        = document.getElementById('totalPeso')
const btnImprimir       = document.getElementById('btnImprimir')
const tareasContainer   = document.getElementById('tablaContainer')
const btnNuevoProducto  = document.getElementById('btnNuevoProducto')
const cuadroBarcode     = document.getElementById('barcode')


let editStatus=false;
let activaBarCode=false
let id ='';

btnNuevoProducto.addEventListener('click',pintarFormulario)

btnImprimir.addEventListener('click',imprimirBarcode)

tareaForm.addEventListener('submit',enviarDB)


//traer los productos de firebase toda la coleccion productos
const registroProductos = onGetProduct((querySnapshot) =>{
    
    let objetoProducto=[]
    let totalInventario=0
    let totalPeso=0
    tareasContainer.innerHTML='';                           //borra el contenido previo, hacer una funcion limpiar...
    if(querySnapshot){

        querySnapshot.forEach(doc =>{
            
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            objetoProducto.push(objeto)
            totalInventario += objeto.precio*objeto.stock
            totalPeso       += objeto.peso*objeto.stock

            fila.innerHTML = `
                                <td><label class ='barcode fa-solid fa-barcode' data-id='${objeto.id}' value='${objeto.id}' id='${objeto.id}'></label></td>
                                <td>${objeto.activo}</td>
                                <td>${objeto.categoria}</td>
                                <td>${objeto.id}</td>
                                <td>${objeto.nombre}</td>
                                <td>${objeto.stock}</td>
                                <td>${objeto.unidad}</td>
                                <td>${Math.round(objeto.peso*objeto.stock)}</td>
                                <td>${objeto.precio}</td>
                                <td>${Math.round(objeto.precio*objeto.stock)}</td>
                                
                                <td><button class ='btn-delete fa fa-trash' id='' data-id=${objeto.id}></button></td>
                                <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></td>
                            `

            tareasContainer.appendChild(fila);
            
        });

        console.log('totalInventario:',totalInventario)
        totalInventario2.innerHTML= `${Math.round(totalInventario)}`
        totalPeso2.innerHTML= `${Math.round(totalPeso)}`
        console.log('objetoProductos:',objetoProducto)

        //funcionamiento boton eliminar
        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')

        btnDelete.forEach(btn=>{
            btn.addEventListener('click',(e)=>{deleteProduct(e.target.dataset.id)})
        })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        //funcionamiento boton eleditar
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', (e)=>{
                pintarFormulario()
                id=e.target.dataset.id   
                console.log('id es:',id)                                   //se asigna el id para luegp usar en update product
                const producto = objetoProducto.find((producto)=>{return producto.id ===id });
                
                
                console.log('objeto producto solicitado btn edit:',producto)

                tareaForm['imagen'].value           = producto.imagen 
                tareaForm['categoria'].value        = producto.categoria
                tareaForm['codigo'].value           = producto.id
                tareaForm['nombre'].value           = producto.nombre 
                tareaForm['costo'].value            = producto.costo 
                tareaForm['stock'].value            = producto.stock 
                tareaForm['unidad'].value           = producto.unidad
                tareaForm['peso'].value             = producto.peso
                tareaForm['precio'].value           = producto.precio
                tareaForm['activo'].value           = producto.activo 
                tareaForm['description'].value      = producto.descripcion 
                
                document.getElementById(e.target.dataset.id).disabled=false;
                editStatus=true;
                tareaForm['boton-task-save'].innerHTML='Actualizar'
            })
        });

        //generador de barcode 128
        const barcode = tareasContainer.querySelectorAll('.barcode')
        //console.log('lo que devuelve el querySelectorAll(barcode)',barcode)
        barcode.forEach(elem=>{
            elem.addEventListener('click',(e)=>{
                e.preventDefault()
                activaBarCode=true
                let id = e.target.dataset.id

                console.log('barcode en lienzo creado para id:',id)

                //genera codigo de barra en un elemento svg con id barcode
                JsBarcode('#barcode',id, {
                    lineColor: "#000",
                    width: 1.3,
                    height: 30,
                    displayValue: true
                });
            })
        })
    } else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})





function pintarFormulario(){
    let formularioProducto = `
            <div class="cajita">
                <label for="categoria" >Categoria:</label>
                <input class="categoria" type="text" id='categoria'>
              
                <label for="nombre" >Nombre :</label>
                <input class="nombre"  type="text" id='nombre'  required>

                <label for="stock" >Stock :</label>
                <input class="stock"  type="number" min = "0" step = "0.01" id='stock'>

                <label for="unidad" >Unidad :</label>
                <input class="unidad"  type="text" id='unidad'>

                <label for="peso" >Peso :</label>
                <input class="codigo"  type="number" min = "0" step = "0.01"  id='peso'>

                <label for="precio" >Precio :</label>
                <input class="precio"  type="number"  min = "0" step = "0.1" id='precio'>

                <label for="description">Descripcion:</label>
                <input type="text" id="description">

                <label for="activo" >Activo :</label>
                <input class="codigo"  type="number"  id='activo'>

                <label for="costo" >costo :</label>
                <input class="costo"  type="number" min = "0" step = "0.1"   id='costo'>

                <label for="imagen" >Imagen :</label>
                <input class="imagen"  type="text" id='imagen'>

                <label for="codigo" >codigo :</label>
                <input class="codigo"  type="text"  id='codigo'>
              </div>

              <div id="container-btn" class="container-btn">
                <button id="boton-task-save" class="boton"><i class="fa-solid fa-floppy-disk"></i></button> 
            </div>
              `
              tareaForm.innerHTML=formularioProducto
}

function generaPDF(elementoParaConvertir){
    console.log('generando pdf en tag:',elementoParaConvertir)
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
        /*
        navigator.share({
            title:'probando esta nueva API',
            text:'Desde Heinz Sport SAC',
            url:'./cotizacion.pdf'
        })
    */
}

function borrarBarcode(){
    cuadroBarcode.innerHTML=''
}

function imprimirBarcode(e){
    
        console.log('dentro del evento clik btnImprimir')
        e.preventDefault()
        if(activaBarCode){
            generaPDF(cuadroBarcode)
            activaBarCode=false
        }else{
            console.log('deber elegir un producto primero..')
        }
        setTimeout(borrarBarcode, 1000);
}

function enviarDB(e){
    
        e.preventDefault()
        const imagen              = tareaForm['imagen'];
        const categoria           = tareaForm['categoria'];
        const codigo              = tareaForm['codigo'];
        const nombre              = tareaForm['nombre'];
        const costo               = tareaForm['costo'];
        const stock               = tareaForm['stock'];
        const unidad              = tareaForm['unidad'];
        const peso                = tareaForm['peso'];
        const precio              = tareaForm['precio'];
        const activo              = tareaForm['activo'];
        const descripcion         = tareaForm['description'];
        ;
        
        
        if(!editStatus){
            guardarProduct( codigo.value,
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
                            )
            
        }else{console.log('entre a else de actualiza');
        console.log('id en else:',id);
            updateProduct(id,{  imagen:imagen.value,
                                categoria:categoria.value,
                                nombre:nombre.value,
                                costo:costo.value,
                                stock:stock.value,
                                unidad:unidad.value,
                                peso:peso.value,
                                precio:precio.value,
                                activo:activo.value,
                                descripcion:descripcion.value
                            })
            editStatus=false
            tareaForm['boton-task-save'].innerHTML='Crear'
        }
        
        tareaForm.reset()
        tareaForm.innerHTML=''
    
}
