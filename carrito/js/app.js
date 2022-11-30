//variables

const carrito           = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarrito     = document.querySelector('#vaciar-carrito')
const listaCursos       = document.querySelector('#lista-cursos')
let totalCarrito        = document.querySelector('#total-carrito')
let contadorProductos   = document.querySelector('.count-product')
let articulosCarrito    = []

cargarEventListeners()

function cargarEventListeners(){
    listaCursos.addEventListener('click',agregarCurso);
    //elimina cursos del carrito
    carrito.addEventListener('click',eliminarCurso)
    //muestra los cursos del localStorage
    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito=JSON.parse(localStorage.getItem('carrito')) || []; 
        pintarCarrito()}
    )
    //vaciando carrito
    vaciarCarrito.addEventListener('click',(e)=>{
        e.preventDefault
        articulosCarrito=[]
        pintarCarrito()
    })
}

//Funciones
function eliminarCurso(e){
    //const cursoId=e.target.classList('.borrar-curso')
    console.log(e.target.classList)
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id')
        //elimina del arreglo el curso con el id seleccionado
        articulosCarrito=articulosCarrito.filter(curso=>curso.id !== cursoId)
        console.log(articulosCarrito)
        pintarCarrito()
    }
}

function agregarCurso(e){
    e.preventDefault()
    if(e.target.classList.contains('agregar-carrito')){
    const cursoSelecionado=e.target.parentElement.parentElement
    
    leerDatosCurso(cursoSelecionado)
    }
}

//extrae el contenido html del card target o curso
function leerDatosCurso(curso){
    //console.log(curso)
    //creando un objeto con los datos del curso
    const infoCurso ={imagen:curso.querySelector('img').src,titulo:curso.querySelector('h4').textContent,precio:curso.querySelector('.precio span').textContent,id:curso.querySelector('a').getAttribute('data-id'),cantidad:1}
    //console.log(infoCurso)
    console.log(articulosCarrito)
    //revisa si el curso ya existe
    const existe =articulosCarrito.some(curso=>curso.id===infoCurso.id)
    console.log('el curso ya existe previamente:'+existe)

    if(existe){
        //actualizamos cantidad
        const cursos=articulosCarrito.map((curso)=>{
            if(curso.id===infoCurso.id){
                curso.cantidad +=1
                return curso    //retorna el objeto actualizado
            }else{
                return curso    //retorno el restante de objetos que no son duplicados
            }
        })
    }else{
    //agregando objetos al arreglo de carrito
    articulosCarrito=[...articulosCarrito,infoCurso]
    }
    pintarCarrito()
}

//pintar el carrito de compras
function pintarCarrito(){
    //limpiar html del anterior array desactualizado
    limpiarCarrito()
    let totalizador=0
    let contador=0
    articulosCarrito.forEach((curso)=>{
        const fila =document.createElement('tr')
        fila.innerHTML=`
                        <td><img src='${curso.imagen}' width='100'></td>
                        <td>${curso.titulo}</td>
                        <td>${curso.precio}</td>
                        <td>${curso.cantidad}</td>
                        <td><a class='borrar-curso' data-id='${curso.id}'>X</a></td>
                        `;
        //agregando al tbody
        contenedorCarrito.appendChild(fila);
        totalizador += curso.precio*curso.cantidad
        contador    += 1
    })
    totalCarrito.textContent    = totalizador
    contadorProductos.textContent = contador
    sincronizarStorage()
}

// agregar carrito de compras al Localstorage
function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito))
}

function limpiarCarrito(){
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML=''
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}