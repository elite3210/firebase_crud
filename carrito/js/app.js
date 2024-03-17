import { onGetProduct } from './firebase2.js'

//variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const listaCursos = document.querySelector('#lista-cursos')
let totalCarrito = document.querySelector('#total-carrito')
let contadorProductos = document.querySelector('.count-product')
let botonIncremento = document.querySelector('btnIncrementar')
let articulosCarrito = []


cargarEventListeners()

function cargarEventListeners() {
    listaCursos.addEventListener('click', agregarCurso);

    //gestiona los botones en el carrito
    carrito.addEventListener('click', (e) => { clickCarrito(e) })

    //muestra los cursos del localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        pintarCarrito()
    }
    )
}

//Funciones

//trae los productos de la DB en un array de objetos
const objetosProductos = onGetProduct((objetos) => {

    var productos = []
    let contador = 0
    objetos.forEach((product) => {

        productos.push(product.data())
        productos[contador].id = product.id
        contador++
    });
    //utiliza un array metodo para filtrar los que no deben estar en la web
    let productosWeb = productos.filter((producto) => producto.activo == '1');

    //console.log('array de objeto productosWeb:',productosWeb)
    //console.log('array de objeto productos:',productos)
    //return productos
    pintarCatalogo(productosWeb)
})


//pinta el catalogo en pagina web
function pintarCatalogo(productos) {

    let contador = 0  //cuenta los articulos del carrito solo no por tipo

    productos.forEach((producto) => {
        var card = document.createElement('div')
        card.setAttribute('class', 'col');

        card.innerHTML += `<div class="card">
                            <img src="${producto.imagen}" class="img-fluid card-img-top">
                            <div class="card-body">
                                <div class="info-card">
                                    <h4 class="h5 card-title" >${producto.nombre}</h4>
                                    <label class="h6 card-subtitle">Stock: </label><h4>${producto.stock}</h4>
                                    <p>${producto.unidad}</p>
                                    <img src="./img/estrellas.png">
                                    <p class="precio">${producto.precio_anterior}<span class="u-pull-right ">${producto.precio}</span></p>
                                    <a href="#" class="btn btn-primary input agregar-carrito" data-id="${producto.id}">Agregar Al Carrito</a>
                                </div>
                            </div>
                            </div>
                        `;
        //agregando al tbody
        listaCursos.appendChild(card);
        contador += 1
    })
}

//gestiona los eventos del carrito
function clickCarrito(e) {
    e.preventDefault()

    //click en icono tacho eliminar item
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id')
        //elimina del arreglo el curso con el id seleccionado
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)
        console.log(articulosCarrito)
        pintarCarrito()
    }


    //click en input pa
    if (e.target.classList.contains('input-filed')) {
        //actualizamos cantidad
        let ID = e.target.getAttribute('data-id')

        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === ID) {
                curso.cantidad += 50
                return curso    //retorna el objeto actualizado
            } else {
                return curso    //retorno el restante de objetos que no son duplicados
            }
        })
        pintarCarrito()
    }
    //incrementa cantidad de un item si hay click en boton inremento
    if (e.target.classList.contains('button_inc')) {
        console.log('diste clik en incrementar:')

        let ID = e.target.getAttribute('data-id')

        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === ID) {
                curso.cantidad += 1
                return curso    //retorna el objeto actualizado
            } else {
                return curso    //retorno el restante de objetos que no son duplicados
            }
        })
        pintarCarrito()
    }

    if (e.target.classList.contains('button_dec')) {
        console.log('clik en decrementar:')
        let ID = e.target.getAttribute('data-id')

        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === ID) {
                curso.cantidad -= 1
                return curso    //retorna el objeto actualizado
            } else {
                return curso    //retorno el restante de objetos que no son duplicados
            }
        })
        pintarCarrito()

    }

    if (e.target.classList.contains('vaciar-carrito')) {
        e.preventDefault
        articulosCarrito = []
        pintarCarrito()
    }

    if (e.target.classList.contains('continuar-carrito')) {

        location.href = 'procesar_pedido.html'
    }
}

function agregarCurso(e) {
    e.preventDefault()
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSelecionado = e.target.parentElement.parentElement

        leerDatosCurso(cursoSelecionado)
    }
}


//extrae el contenido html del card target o curso
function leerDatosCurso(curso) {
    //console.log(curso)
    //creando un objeto con los datos del curso
    const infoCurso = { imagen: curso.querySelector('img').src, titulo: curso.querySelector('h4').textContent, precio: curso.querySelector('.precio span').textContent, id: curso.querySelector('a').getAttribute('data-id'), cantidad: 1 }
    //console.log(infoCurso)
    console.log(articulosCarrito)
    //revisa si el curso ya existe
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    console.log('el curso ya existe previamente:' + existe)

    if (existe) {
        //actualizamos cantidad
        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad += 1
                return curso    //retorna el objeto actualizado
            } else {
                return curso    //retorno el restante de objetos que no son duplicados
            }
        })
    } else {
        //agregando objetos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso]
    }
    pintarCarrito()
}

//pintar el carrito de compras
function pintarCarrito() {
    //limpiar html del anterior array desactualizado
    limpiarCarrito()
    let totalizador = 0           //acumula el valor total del carrito
    let contador = 0  //cuenta los tipos de articulos del carrito
    articulosCarrito.forEach((curso) => {
        const fila = document.createElement('tr')
        fila.innerHTML = `<td><i data-id='${curso.id}' class='borrar-curso fa fa-trash'></i></td>
                        <td><img src='${curso.imagen}' width='100'></td>
                        <td>${curso.titulo}</td>
                        <td>${curso.precio}</td>
                        <td class='box2'>
                            <!--<label for='name'>Males:</label>-->
                            <div class='dec tnDecrementar' data-id='${curso.id}'>&#8722</div>
                            <input type='text' class ='input-filed' name='qty' value='${curso.cantidad}' data-id='${curso.id}'>
                            <div class ='inc bntIncrementar' data-id='${curso.id}'>+</div>
                        </td>
                        `;
        //agregando al tbody
        contenedorCarrito.appendChild(fila);
        totalizador += curso.precio * curso.cantidad
        contador += 1
    })
    totalCarrito.textContent = totalizador
    contadorProductos.textContent = contador
    sincronizarStorage()
}

// agregar carrito de compras al Localstorage 
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

function limpiarCarrito() {
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML=''
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}
