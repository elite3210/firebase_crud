import {queryProduccion} from './firebase.js'


//traer los registros de produccion de firebase
const produccionContainer = document.getElementById('produccionContainer')

console.log('queryProduccion trajo:',queryProduccion)

let resetaSorbetes =[{codigo:"SB0070"},
                    {peso:0.68},
                    {matPeletizado:0.28},
                    {matVirgen:0.40},
                    {fundas:0.025}, 
                    {bolsaPlancha:1},
                    {pigmentos:0.40}
                ]

let pesoTotal=0
let cantidadTotal=0

queryProduccion.forEach((doc) => {

    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    let fila        = document.createElement('tr')
    const objeto    = doc.data()
    objeto.id       = doc.id
    let detalle     = JSON.parse(objeto.detalleProduccion)[0]//solo muestra la primera fila del obj, usar method reduce para importe
    
    pesoTotal   +=detalle.importe
    cantidadTotal   +=detalle.cantidad
    
    fila.innerHTML  = `
                    <td><label class ='barcode fa-solid fa-barcode' data-id='${objeto.id}' value='${objeto.id}' id='${objeto.id}'></label></td>
                    <td>${objeto.fecha}</td>
                    <td>${detalle.id}</td>
                    <td>${detalle.nombre}</td>
                    <td>${detalle.cantidad}</td>
                    <td>${detalle.unidad}</td>
                    <td>${Math.round(detalle.importe)}</td>
                                
                    <td><button class ='btn-delete fa fa-trash' id='' data-id=${objeto.id}></button></td>
                    <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></td>
                    `
    produccionContainer.appendChild(fila);
});

document.getElementById('cantidadTotal').textContent=cantidadTotal;
document.getElementById('pesoTotal').textContent=pesoTotal;

console.log('peso y Cantidad:',pesoTotal,cantidadTotal)
