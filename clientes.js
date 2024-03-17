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
    const razonSocial               = clientesForm['razonSocial'].value;          //1
    const ruc                       = clientesForm['ruc'].value;                  //2
    const inicioActividad           = clientesForm['inicioActividad'].value;      //3
    const nombresContacto           = clientesForm['nombresContacto'].value;      //4
    const apellidosContacto         = clientesForm['apellidosContacto'].value;    //5
    const email                     = clientesForm['email'].value;                //6
    const dni                       = clientesForm['dni'].value;                  //7
    const cargo                     = clientesForm['cargo'].value;                //8
    const telefono                  = clientesForm['telefono'].value;             //9
    const direccion                 = clientesForm['direccion'].value;                //10
    const distrito                  = clientesForm['distrito'].value;             //11
    const provincia                 = clientesForm['provincia'].value;            //12
    const departamento              = clientesForm['departamento'].value;         //13
    const ubicacion                 = clientesForm['ubicacion'].value;            //14
    const nota                      = clientesForm['nota'].value;                 //15
    const idImpuesto                = clientesForm['ruc'].value;                  //16
    const clienteRank               = 0;                                          //17
    const proveedorRank             = 0;                                          //18
    const saldo                     = 0;                                          //19
    ;
    
    
        guardarSocios(
            ruc,
            razonSocial,
            inicioActividad,
            nombresContacto,
            apellidosContacto,
            email,
            dni,
            cargo,
            telefono,
            direccion,
            distrito,
            provincia,
            departamento,
            ubicacion,
            nota,
            idImpuesto,
            clienteRank,
            proveedorRank,
            saldo
            )
    

    clientesForm['boton'].innerHTML='Crear'
    alert('SOCIO guarado',razonSocial)
    clientesForm.reset()
})