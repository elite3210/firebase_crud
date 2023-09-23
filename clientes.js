import {guardarSocios} from './firebase.js'

//para guardar los registo en firebase
const clientesForm = document.getElementById('formularioClientes')
/*
const date = new Date();
let mes=date.getMonth()<9? `0${date.getMonth()+1}`:`${date.getMonth()+1}`;
let dia = (date.getDate()<10)? `0${date.getDate()}`:`${date.getDate()}`
const fechaRegistro = `${date.getFullYear()}/${mes}/${dia} : ${date}`;
let entrada='Fri Sep 22 2023 10:45:48 GMT-0500'

console.log('Fecha formato:',fechaRegistro)
console.log('metodo date:',new Date('9/9/2023'),new Date('9/9/2023').getDate(),new Date('9/9/2023').getMonth(),new Date('9/9/2023').getFullYear())
*/

let editStatus=false;
let id ='';

clientesForm.addEventListener('submit',(e)=>{
e.preventDefault()
    const razonSocial               = clientesForm['razonSocial'];          //1
    const ruc                       = clientesForm['ruc'];                  //2
    const inicioActividad           = clientesForm['inicioActividad'];      //3
    const nombresContacto           = clientesForm['nombresContacto'];      //4
    const apellidosContacto         = clientesForm['apellidosContacto'];    //5
    const email                     = clientesForm['email'];                //6
    const dni                       = clientesForm['dni'];                  //7
    const cargo                     = clientesForm['cargo'];                //8
    const telefono                  = clientesForm['telefono'];             //9
    const calle                     = clientesForm['calle'];                //10
    const distrito                  = clientesForm['distrito'];             //11
    const provincia                 = clientesForm['provincia'];            //12
    const departamento              = clientesForm['departamento'];         //13
    const ubicacion                 = clientesForm['ubicacion'];            //14
    const nota                      = clientesForm['nota'];                 //15
    ;
    
    
    
        guardarSocios(
            ruc.value,
            razonSocial.value,
            inicioActividad.value,
            nombresContacto.value,
            apellidosContacto.value,
            email.value,
            dni.value,
            cargo.value,
            telefono.value,
            calle.value,
            distrito.value,
            provincia.value,
            departamento.value,
            ubicacion.value,
            nota.value,
            )
    

    clientesForm['boton'].innerHTML='Crear'
    
    clientesForm.reset()
})