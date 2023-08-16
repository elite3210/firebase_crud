import {onGetVentas} from './firebase.js'


//traer los socios comerciales clientes de firebase
const ventasContainer = document.getElementById('ventasContainer')

const registroVentas = onGetVentas((ventasSnapShot) =>{
    let objetoVentas=[]
    ventasContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...

    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            objetoVentas.push(objeto)
            let detalle = JSON.parse(objeto.detalleCotizacion)[0]//solo muestra la primera fila del obj, usar method reduce para importe
            console.log('el detalle en JSON',detalle)
//Documento</i></th><th>Empresa</th><th>RUC</th><th>Fecha</th><th>Importe</th><
            fila.innerHTML = `
                                <td><label class ='barcode fa-solid fa-barcode' data-id='${objeto.id}' value='${objeto.id}' id='${objeto.id}'></label>${objeto.id}</td>
                                <td>${objeto.cliente}</td>
                                <td>${objeto.ruc}</td>
                                <td>${objeto.fecha}</td>
                                <td>${objeto.estado}</td>
                                <td>${objeto.vendedor}</td>
                                <td>${detalle.importe}</td>
                                
                                
                                
                                <td><button class ='btn-delete fa fa-trash' id='' data-id=${objeto.id}></button></td>
                                <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></td>
                            `
            ventasContainer.appendChild(fila);
            
        })
    }
});