import {guardarProduct,onGetProduct,deleteProduct,traeroneProduct,updateProduct} from './firebase.js'




//para guaradr los registo en firebase
const tareaForm = document.getElementById('tarea-form')
let editStatus=false;
let id ='';

tareaForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  
  const categoria         = tareaForm['pro-categoria'];
  const codigo            = tareaForm['pro-codigo'];
  const descripcion       = tareaForm['pro-description'];
  let active              = true;

  if(!editStatus){
        guardarProduct(categoria.value,codigo.value,descripcion.value,active)
    }else{
        updateProduct(id,{categoria:categoria.value,codigo:codigo.value,descripcion:descripcion.value})
        editStatus=false
    }

  tareaForm.reset()
})

//traer los productos de firebase
const tareasContainer = document.getElementById('tareas-container')


const registroProductos = onGetProduct((querySnapshot) =>{
    
    if(querySnapshot){
        console.log('estoy dentro del if de registrotrabajadores')
        let html = "";
        let contador =0;
   
        querySnapshot.forEach(doc =>{
            
            const fila = doc.data()
            html += `<tr><td>${fila.categoria}</td>
                        <td>${fila.codigo}</td>
                        <td>${fila.descripcion}</td>
                        <td>${fila.active}</td>
                        <td><button class ='btn-delete' data-id=${doc.id}>del</button></td>
                        <td><button class ='btn-edit' data-id=${doc.id}>edit</button></td>
                    </tr>`
            
            contador += 1
            //horas += ((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))/(1000*60*60)
            
        });
        console.timeEnd('tiempo consulta')
        console.log('# REgistros:',contador)
        //console.log('Importe:',horas*3.125)
    
        tareasContainer.innerHTML =html;

        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')
            btnDelete.forEach(btn=>{
                btn.addEventListener('click',(e)=>{deleteProduct(e.target.dataset.id)})
            })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', async (e)=>{
               id=e.target.dataset.id
                //console.log(e.target.dataset.id);
                
                const doc = await traeroneProduct(e.target.dataset.id);
                let producto=doc.data()
                
                console.log(producto)
                tareaForm['pro-categoria'].value    =producto.categoria;
                tareaForm['pro-codigo'].value       =producto.codigo;
                tareaForm['pro-description'].value  =producto.descripcion;

                editStatus=true;
                tareaForm['boton-task-save'].innerHTML='Actualizar'
                })
        });
             
    } else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})






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
/*
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
/*
let objetos= [
    {
        "paystatus": false,
        "salida": "2022-11-20T21:05",
        "title": "2022-11-20T09:05",
        "description": "Elí",
        "dia": "Domingo",
        "dias":3
    },
    {
        "description": "Elí",
        "title": "2022-11-20T08:17",
        "paystatus": false,
        "salida": "2022-11-20T20:53",
        "dia": "Domingo",
        "dias":3
    },
    {
        "description": "Elí",
        "title": "2022-11-18T08:22",
        "salida": "2022-11-18T20:23",
        "paystatus": false,
        "dia": "Viernes",
        "dias":3
    },
    {
        "salida": "2022-11-16T22:21",
        "description": "Elí",
        "paystatus": false,
        "title": "2022-11-16T08:11",
        
        "dia": "Miercoles",
        "dias":3
    }
]

let salario = {Domingo:7,Lunes:1,Martes:2,Miercoles:3,Jueves:4,Viernes:5,Sabado:6}
let dia='Domingo'
let feria = dia;
console.log('extraer valor de objeto:',objetos[1].dias*salario.dia)

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
  */