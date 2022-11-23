import {guardarTask,onGetTasks,deleteTask,traerTask,traerConsulta2,traerConsulta} from './firebase.js'

const datos = [{nombre:'Angela',sexo:'femenino',edad:25},{nombre:'Cuzco',sexo:'Masculino',edad:43},{nombre:'Heinz',sexo:'Masculino',edad:16},{nombre:'Xiomara',sexo:'femenino',edad:18},{nombre:'Mariela',sexo:'femenino',edad:45}]

console.log('hola mundo')

/*
const getDatos=()=>{
    return new Promise((resolve,reject)=>{setTimeout(()=>{resolve(datos)},10000)})

 }

//console.log(getDatos())

getDatos().then((datos)=>console.log('getdatos promise:',datos))

const getDatos2 = ()=>{
    setTimeout(()=>{console.log('getDatos2',datos)},8000)
}
console.log('----ejecutara funcion getdatos2-------')

async function main(){
    await getDatos2();
}

//console.log(main())

setTimeout(()=>{console.log('me ejecute despue de 3s')},3000)

let pulso=setInterval(()=>{
    console.log(new Date().toLocaleTimeString())
},1000)

setTimeout(()=>{
    clearInterval(pulso)
},20000)

*/

/*---------------------------------------------------------------------
*/
let entrada ='2022-11-14T10:07'
let salida='2022-11-14T13:05'

		

const nombreDia     = (entrada)=>{const nombreDia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];return nombreDia[new Date(entrada).getDay()]}

const lapsoMiliseg   = (entrada,salida)=>{return (new Date(salida).getTime())-(new Date(entrada).getTime())}    //calculamos los milisegundos transcurridos por diferencia

const lapsoHoras    = (entrada,salida)=>{return lapsoMiliseg(entrada,salida)/(1000*60*60)}                  //los milisegundos lo convertimos a horas

const minutosEnteros= (entrada,salida)=>{return (Math.round(lapsoHoras(entrada,salida)*(60))%(60))}         //la hora lo convertimos a minutos x60 y sacamos su modulo o residuo de minutos

const horasEnteras  = (entrada,salida)=>{return (lapsoMiliseg(entrada,salida)-lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)}

const horasDecimales = (entrada,salida)=>{return horasEnteras(entrada,salida) + Math.trunc((lapsoMiliseg(entrada,salida)%(1000*60*60))/(1000*60*60)*100)/100}

const horas= (entrada,salida)=>{return horasEnteras(entrada,salida) +':'+minutosEnteros(entrada,salida)}

console.log('nombre dia:',nombreDia (entrada))

console.log('lapso horas:',lapsoHoras(entrada,salida))

console.log('horas enteras:',horasEnteras(entrada,salida))

console.log('minutos enteros:',minutosEnteros(entrada,salida))
console.log('horas decimales:',horasDecimales(entrada,salida))
console.log('entero horas:',horas(entrada,salida))



function operar(dividendo,divisor){

    let Dd=dividendo/divisor
    let r = dividendo%divisor

    console.log('div 10 partido 3 :',Dd)
    console.log('div 10 partido 3 residuo:',r)
    console.log('div 10 partido 3 entera trunc():',Math.trunc(Dd))
    console.log('div 10 partido 3 decimales:',r/divisor)
    console.log('div 10 partido 3 parte entera:',Dd-r/divisor)
}

operar(10,3)

/*--------------------------------------*---------------------------------------------------------- */

let objetos= [
    {
        "paystatus": false,
        "salida": "2022-11-20T21:05",
        "title": "2022-11-20T09:05",
        "description": "Elí",
        "dia": "Domingo"
    },
    {
        "description": "Elí",
        "title": "2022-11-20T08:17",
        "paystatus": false,
        "salida": "2022-11-20T20:53",
        "dia": "Domingo"
    },
    {
        "description": "Elí",
        "title": "2022-11-18T08:22",
        "salida": "2022-11-18T20:23",
        "paystatus": false,
        "dia": "Viernes"
    },
    {
        "salida": "2022-11-16T22:21",
        "description": "Elí",
        "paystatus": false,
        "title": "2022-11-16T08:11",
        
        "dia": "Miercoles"
    }
]

for(let i in objetos){
    objetos[i]['entrada']=objetos[i].title;
    objetos[i]['horas']=horas(objetos[i].title,objetos[i].salida);
    

}



for(let i in objetos){
    delete objetos[i].description;
    delete objetos[i].paystatus;
    delete objetos[i].title;
}

console.log('eliminado:',objetos)
new gridjs.Grid({ 
  
    data:objetos
    
  }).render(document.getElementById('table'));