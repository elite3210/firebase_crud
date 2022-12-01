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
    carrito.addEventListener('click',(e)=>{
        if(true){
            eliminarCurso(e)
        }else{
            agregarCurso(e)
        }
    })
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
    e.preventDefault()
    //const cursoId=e.target.classList('.borrar-curso')
    console.log(e.target.classList)
    if(e.target.classList.contains('borrar-curso')  || e.target.classList.contains('mas')  || e.target.classList.contains('menos')){
        const cursoId = e.target.getAttribute('data-id')
        //elimina del arreglo el curso con el id seleccionado
        articulosCarrito=articulosCarrito.filter(curso=>curso.id !== cursoId)
        console.log(articulosCarrito)
        pintarCarrito()
    }
}

function agregarCurso(e){
    e.preventDefault()
    if(e.target.classList.contains('agregar-carrito')  || e.target.classList.contains('mas') ){
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
        fila.innerHTML=`<td><i data-id='${curso.id}' class='borrar-curso fa fa-trash'></i></td>
                        <td><img src='${curso.imagen}' width='100'></td>
                        <td>${curso.titulo}</td>
                        <td>${curso.precio}</td>
                        <td class='box'>
                        <!--<label for='name'>Males:</label>-->
                        <div class='dec button_dec' data-id='${curso.id}'>&#8722</div>
                        <input type='text' class ='input-filed' name='qty' value='${curso.cantidad}' data-id='${curso.id}'>
                        <div class ='inc button_inc' data-id='${curso.id}'>+</div></td>
                        
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