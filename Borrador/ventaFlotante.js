const btnAbrir = document.getElementById('btnAbrir')
//const btnCerrar= document.getElementById('btnCerrar')

btnAbrir.addEventListener('mouseover',abrir)
btnAbrir.addEventListener('mouseout',cerrar)
//btnCerrar.addEventListener('click',cerrar)


function abrir(){
    const ventana = document.getElementById('vent')
    const btnEliminar = document.getElementById('btnEliminar')
    ventana.style.display="block"
    btnEliminar.style.display="block"
}
function cerrar(){
    const ventana = document.getElementById('vent')
    ventana.style.display="none"
    btnEliminar.style.display="none"
}