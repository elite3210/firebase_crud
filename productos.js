var start = Date.now();
import {guardarProduct,onGetProduct,deleteProduct,updateProduct} from './firebase.js'
import {Datatable} from './dataTable.js'


//para guaradr los registo en firebase

const tareaForm         = document.getElementById('tarea-form')
const totalInventario2  = document.getElementById('totalInventario')
const totalPeso2        = document.getElementById('totalPeso')
const btnImprimir       = document.getElementById('btnImprimir')
const tareasContainer   = document.getElementById('tablaContainer')
const cuadroBarcode     = document.getElementById('barcode')


let editStatus=false;
let activaBarCode=false
let id ='';
let totalInventario=0
let totalPeso=0;

btnImprimir.addEventListener('click',imprimirBarcode)

tareaForm.addEventListener('submit',enviarDB)


function editarFila(elementos){
    pintarFormularioProductos();//funcion que renderiza el formulario para crear y editar producto
    id=elementos[0].id //se asigna el id para luegp usar en update product  
    const producto = elementos[0].values
    
    console.log('objeto producto solicitado btnEdit:',producto)

    tareaForm['imagen'].value           = producto.imagen 
    tareaForm['categoria'].value        = producto.categoria
    tareaForm['codigo'].value           = producto.idProducto
    tareaForm['nombre'].value           = producto.nombre 
    tareaForm['costo'].value            = producto.costo 
    tareaForm['stock'].value            = producto.stock 
    tareaForm['unidad'].value           = producto.unidad
    tareaForm['peso'].value             = producto.peso
    tareaForm['precio'].value           = producto.precio
    tareaForm['activo'].value           = producto.activo 
    tareaForm['description'].value      = producto.descripcion 
    tareaForm['medidas'].value          = producto.medidas
    tareaForm['pesoBruto'].value        = producto.pesoBruto 
    
    editStatus=true;
    tareaForm['boton-task-save'].innerHTML='Actualizar'
    //document.getElementById(id).disabled=false;
}


function pintarBarcode(elementos){
    
    //e.preventDefault()
    activaBarCode=true
    id=elementos[0].id   

    console.log('barcode en lienzo creado para id:',id)

    //genera codigo de barra en un elemento svg con id barcode
    JsBarcode('#barcode',id, {
        lineColor: "#000",
        width: 1.3,
        height: 30,
        displayValue: true
    });
}

function eliminarProducto(elementos){
    alert(`desea eliminar este producto:${elementos[0].id}? se borrara y no podra recuperarlo`)
    //deleteProduct(elementos[0].id)
};

//traer los productos de firebase toda la coleccion productos
const registroProductos = onGetProduct((querySnapshot) =>{
    const items=[];
    //tareasContainer.innerHTML='';                           //borra el contenido previo, hacer una funcion limpiar...
    if(querySnapshot){
        querySnapshot.forEach(doc =>{
            let obj                 ={};
            obj.id                  =doc.id;
            obj.values              =doc.data();
            obj.values.idProducto   =doc.id;
            obj.values.pesoCalculado=Math.round(obj.values.peso*obj.values.stock);
            obj.values.importe      =Math.round(obj.values.precio*obj.values.stock);
    
            totalInventario         += obj.values.precio*obj.values.stock;
            totalPeso               += obj.values.peso*obj.values.stock;
            items.push(obj);
        });

        totalInventario2.innerHTML= `${Math.round(totalInventario)}`
        totalPeso2.innerHTML= `${Math.round(totalPeso)}`

    } else{tareasContainer.innerHTML='<p>No se trajo los datos de la BD Firebase</p>'}

    //console.log('items:',items);

    const titulo   = {' ':'',CODIGO:'idProducto',NOMBRE:'nombre',STOCK:'stock',UND:'unidad',PESO:'pesoCalculado',PRECIO:'precio',VALOR:'importe'}
    const dt = new Datatable('#dataTable',
        [
            {id:'btnEdit',text:'editar',icon:'edit',action:function(){const elementos=dt.getSelected();editarFila(elementos)}},










            
            {id:'btnBarcode',text:'barcode',icon:'barcode',action:function(){const elementos=dt.getSelected();pintarBarcode(elementos);}},
            {id:'dtnDelete',text:'delete',icon:'delete',action:function(){const elementos=dt.getSelected();eliminarProducto(elementos)}},
            {id:'dtnCrear',text:'nuevo',icon:'post_add',action:function(){const elementos=dt.getSelected();pintarFormularioProductos()}}
        ]
    );
    
    dt.setData(items,titulo);
    dt.makeTable();
})


function pintarFormularioProductos(){
    let formularioProducto = `
            <div class="cajita">
                <label for="categoria" >Categoria:</label>
                <input class="categoria" type="text" id='categoria'>
              
                <label for="nombre" >Nombre :</label>
                <input class="nombre"  type="text" id='nombre'  required>

                <label for="stock" >Stock :</label>
                <input class="stock"  type="number" min = "0" step = "0.001" id='stock'>

                <label for="unidad" >Unidad :</label>
                <input class="unidad"  type="text" id='unidad'>

                <label for="peso" >Peso :</label>
                <input class="codigo"  type="number" min = "0" step = "0.001"  id='peso'>

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

                <label for="medidas" >medidas :</label>
                <input class="codigo"  type="text"  id='medidas'>

                <label for="codigo" >pesoBruto:</label>
                <input class="codigo"  type="text"  id='pesoBruto'>

                <label for="nota" >Nota:</label>
                <input class="nota"  type="text"  id='nota'>

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
    console.log('dentro funcion :',editStatus);
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
        const medidas             = tareaForm['medidas'];
        const pesoBruto           = tareaForm['pesoBruto'];
        //const pesoBruto           = tareaForm['pesoBruto'];
        ;
        
        
        if(!editStatus){
            console.log('!editStatus',editStatus);
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
                            medidas.value,
                            pesoBruto.value,
                            )
            
        }else{
            console.log('entre a else de actualiza');
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
                                descripcion:descripcion.value,
                                medidas:medidas.value,
                                pesoBruto:pesoBruto.value
                            })
            editStatus=false
            tareaForm['boton-task-save'].innerHTML='Crear'
        }
        
        tareaForm.reset()
        tareaForm.innerHTML=''
}




var end = Date.now();
console.log('demoro:',end - start);

