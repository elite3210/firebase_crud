import {onGetSocios} from './firebase.js'

console.log('inicio de la carga de pagina..')
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')

const registroSocios = onGetSocios((sociosSnapShot) =>{
    console.log('traido de firebase:',registroSocios)
    let objetoSocios=[]
    sociosContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...

    if(sociosSnapShot){
        sociosSnapShot.forEach(doc =>{
            
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            objetoSocios.push(objeto)

            fila.innerHTML = `
                                <td><label class ='barcode fa-solid fa-barcode' data-id='${objeto.id}' value='${objeto.id}' id='${objeto.id}'></label></td>
                                <td>${objeto.razonSocial}</td>
                                <td>${objeto.id}</td>
                                <td>${objeto.inicioActividad}</td>
                                <td>${objeto.nombresContacto}</td>
                                <td>${objeto.telefono}</td>
                                
                                <td>${objeto.distrito}</td>
                                <td>${objeto.provincia}</td>
                                <td>${objeto.departamento}</td>
                                
                                <td><button class ='btn-delete fa fa-trash' id='' data-id=${objeto.id}></button></td>
                                <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></td>
                            `
            sociosContainer.appendChild(fila);
            
        })
    }
});