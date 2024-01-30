import {onGetSocios} from './firebase.js'

console.log('inicio de la carga de pagina..')
//traer los socios comerciales clientes de firebase
const sociosContainer = document.getElementById('sociosContainer')

let objetoSocios=[]
let objetos=[]
let objetoSocios2=[]
const registroSocios = onGetSocios((sociosSnapShot) =>{
    //console.log('traido de firebase:',registroSocios)
    sociosContainer.innerHTML='';  //borra el contenido previo, hacer una funcion limpiar...

    if(sociosSnapShot){
        sociosSnapShot.forEach(doc =>{
            let borrador={}
            let fila = document.createElement('div')
            fila.setAttribute('class','fila')
            let objeto  = doc.data()
            objeto.id     = doc.id
            objetoSocios.push(objeto)
            objetos.push(objeto)
            borrador.ruc=objeto.id;
            borrador.razonSocial=objeto.razonSocial;
            objetoSocios2.push(borrador)

            fila.innerHTML = `  <div class="filaIzquierda">
                                    <div>
                                        <h1>${objeto.razonSocial}</h1>
                                    </div>
                                    <div class="rucTexto">
                                        <h4>${objeto.id}</h4>
                                    </div>
                                    <div  class="rucTexto">
                                        <h4>${objeto.telefono}</h4>
                                    </div>
                                </div>

                                <div class ="filaDerecha">
                                    <div>
                                        <h3><button class ='btn-edit fa-solid fa-pen-to-square' color='transparent' data-id=${objeto.id}></button></h3>
                                    </div>
                                    <div>
                                        <h3><span>S/</span>${objeto.saldo}</h3>
                                    </div>
                                    <div>
                                        <h3>${objeto.departamento}</h3>
                                    </div>
                                </div>
                                `
            sociosContainer.appendChild(fila);
            
        })
        console.log('traido de firebase convertido:',objetos)
    }
});
