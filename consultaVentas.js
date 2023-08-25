import {onGetVentas} from './firebase.js'


//traer los socios comerciales clientes de firebase
const ventasContainer = document.getElementById('ventasContainer')

const registroVentas = onGetVentas((ventasSnapShot) =>{
    let objetoVentas=[]
    let ventasTotal=0
    ventasContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...

    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            
            let detalle=JSON.parse(objeto.detalleCotizacion)
            let importeTotal = detalle.reduce((total,obj)=>{return total+obj.importe},0)
            console.log('el detalle en JSON importe:',importeTotal)
            ventasTotal +=importeTotal
            objeto.importe=importeTotal
            objetoVentas.push(objeto)

            fila.innerHTML = `
                                <td><label class ='barcode fa-solid fa-barcode' data-id='${objeto.id}' value='${objeto.id}' id='${objeto.id}'></label>${objeto.id}</td>
                                <td>${objeto.cliente}</td>
                                <td>${objeto.ruc}</td>
                                <td>${objeto.fecha}</td>
                                <td>${objeto.estado}</td>
                                <td>${objeto.vendedor}</td>
                                <td>${objeto.importe.toFixed(2)}</td>
                            `
            ventasContainer.appendChild(fila);
            
        })
        let cldImporte = document.getElementById('cldImporte')
        cldImporte.textContent=ventasTotal.toFixed(2)
    }
});