import {traerConsulta, datos2} from './firebase.js'

/*export const traerConsulta = async (nombre)=>{
    //const q = await query(panillaRef, where("description", "==", nombre));
    const querySnapshot = await getDocs(query(panillaRef, where("description", "==", nombre)));*/
    
    //querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());})
      //console.log(doc.data());})
  //}
  /*let nombre = 'Angela'
  traerConsulta(nombre)

  console.log(datos2)*/

 const lista2 = {
    "salida": "2022-11-04T17:55",
    "title": "2022-11-04T09:35",
    "description": "Angela"
}


  const objetc = {a:1,b:3,c:4}
  const lista =[]
  for (const i in datos2) {
        //const element = datos2[fila];
    lista.push(`${[datos2[i]]}`)
  }
console.log(lista)

const tabla = document.createElement('table')
  const fila = document.createElement('tr')
  const columna = document.createElement('td')
  columna.innerText='hola mundo'
  fila.appendChild(columna)
tabla.appendChild(fila)
document.body.append(tabla)


let datos= [
    ['Eli', 'elite3210@gmail.com','2022/11/13T08:10'],
    ['Mike', 'mike@gmail.com','2022-11-04T17:55'],
    ['John', 'john@example.com'],
    ['Mike', 'mike@gmail.com'],
    ['John', 'john@example.com'],
    ['Mike', 'mike@gmail.com'],
    ['John', 'john@example.com'],
    ['Mike', 'mike@gmail.com']
]




new gridjs.Grid({ 
    width: '100%',
    sort: true,
    search: true,
    pagination: {
    limit: 3,
    enable: true,
    //summary:false,
    },columns: ['Name', 'Email','Salida'],
    data: [lista]
}).render(document.getElementById('table'));

