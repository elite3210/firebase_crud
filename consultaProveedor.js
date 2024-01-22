import {onGetProveedor} from './firebase.js'

console.log('inicio de la carga de pagina..')
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')

let objetoSocios=[]
let objetoSocios2=[]
const registroSocios = onGetProveedor((sociosSnapShot) =>{
    //console.log('traido de firebase:',registroSocios)
    sociosContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...

    if(sociosSnapShot){
        sociosSnapShot.forEach(doc =>{
            let borrador={}
            let fila = document.createElement('tr')
            const objeto  = doc.data()
            objeto.id     = doc.id
            objetoSocios.push(objeto)
            borrador.ruc=objeto.id;
            borrador.razonSocial=objeto.razonSocial;
            objetoSocios2.push(borrador)

            fila.innerHTML = `
                                <td>${objeto.razonSocial}</td>
                                <td>${objeto.id}</td>
                                <td>${objeto.contacto}</td>
                                <td>${objeto.telefono}</td>

                                <td><button class ='btn-delete fa fa-trash' id='' data-id=${objeto.id}></button></td>
                                <td><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></td>
                            `
            sociosContainer.appendChild(fila);
            
        })
        console.log('traido de firebase convertido:',objetoSocios2)
    }
});
