const container =document.querySelector('.container')
const btnEjecutar=document.getElementById('btnEjecutar')
const inpNumeroPais=document.getElementById('inpNumeroPais')
let nombre='Elí';
let parametro=nombre;

const datos = [
    { tarifa: 3.6164, dni: '72091168', nombre: 'Angela', horario: 'regular' },
    { tarifa: 3.6857, dni: '71338629', nombre: 'Alexandra', horario: 'regular' },
    { tarifa: 3.700, dni: '71338629', nombre: 'Xiomara', horario: 'regular' },
    { tarifa: 3.3594, dni: '09551196', nombre: 'Rocio', horario: 'regular' },
    { tarifa: 3.10, dni: '70528292', nombre: 'Heinz', horario: 'regular' },
    { tarifa: 3.595, dni: '10216274', nombre: 'Mariela', horario: 'regular' },
    { tarifa: 4.9144, dni: '42231772', nombre: 'Elí', horario: 'regular' },
    { tarifa: 4.9144, dni: '42231772', nombre: 'Alison', horario: 'regular' },
    { tarifa: 3.6857, dni: '48256517', nombre: 'Madeleine', horario: 'regular' },
    { tarifa: 1, dni: '42934967', nombre: 'Giovanna', horario: 'regular' }
  ]

btnEjecutar.addEventListener('click', ()=> fetchData());

function imprimirPantalla(nombre1){
    //console.log('Hola mundo...',nombre1);
    setTimeout(() => {
        //alert(`enviando datos!!!...${nombre} `)
        return nombre1;
    }, 5000);
}

async function esperandoAdatos() {
    const data= await imprimirPantalla(datos);
    console.log('funcion',data)
}

//esperandoAdatos();

const url ="https://restcountries.com/v3.1/all";

async function fetchData() {
    const response= await fetch(url);
    const countries=await response.json();
    countries.forEach((pais,i) => {
        if (i==168) {
            console.log(`Pais:${i}`,pais)
        } else {
            console.log(`Pais:${i} ${pais.name.common}`,pais.startOfWeek)
        }
        
        
    });
}

async function fetchData1() {
    const response= await imprimirPantalla(datos);
    console.log('funcion',response);
}

console.log(1)
fetchData();
fetchData1();
console.log(2)