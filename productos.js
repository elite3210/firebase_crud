import {guardarProduct,onGetProduct,deleteProduct,traeroneProduct,updateProduct} from './firebase.js'



//para guaradr los registo en firebase
const tareaForm = document.getElementById('tarea-form')
let editStatus=false;
let id ='';

tareaForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const imagen              = tareaForm['imagen'];
    const categoria           = tareaForm['categoria'];
    const codigo              = tareaForm['codigo'];
    const nombre              = tareaForm['nombre'];
    const costo              = tareaForm['costo'];
    const stock               = tareaForm['stock'];
    const unidad              = tareaForm['unidad'];
    const precio_anterior     = tareaForm['precio_anterior'];
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
                        precio_anterior.value,
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
                            precio_anterior:precio_anterior.value,
                            precio:precio.value,
                            activo:activo.value,
                            descripcion:descripcion.value
                        })
        editStatus=false
        tareaForm['boton-task-save'].innerHTML='Crear'
    }
    
    tareaForm.reset()
})

//traer los productos de firebase
const tareasContainer = document.getElementById('tareas-container')

const registroProductos = onGetProduct((querySnapshot) =>{
    let objetoProducto=[]
    tareasContainer.innerHTML='';                           //borra el contenido previo, hacer una funcion limpiar...
    if(querySnapshot){

        querySnapshot.forEach(doc =>{
            
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            objetoProducto.push(objeto)

            fila.innerHTML = `
                                <td>${objeto.categoria}</td>
                                <td>${objeto.id}</td>
                                <td>${objeto.nombre}</td>
                                <td>${objeto.stock}</td>
                                <td>${objeto.unidad}</td>
                                <td>${objeto.precio_anterior}</td>
                                <td><input type='number' class='celda' id='${objeto.id}' value='${objeto.precio}' disabled></td>
                                <td>${objeto.descripcion}</td>
                                <td>${objeto.activo}</td>
                                
                                <td><button class ='btn-delete fa fa-trash' id=''data-id=${objeto.id}></button></td>
                                <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent'data-id=${objeto.id}></button></td>
                            `
                  
            tareasContainer.appendChild(fila);
        });
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
                tareaForm['precio_anterior'].value  = producto.precio_anterior
                tareaForm['precio'].value           = producto.precio
                tareaForm['activo'].value           = producto.activo 
                tareaForm['description'].value      = producto.descripcion 
                
                document.getElementById(e.target.dataset.id).disabled=false;
                editStatus=true;
                tareaForm['boton-task-save'].innerHTML='Actualizar'
            })
        });
             
    } else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})

