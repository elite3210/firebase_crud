const tabla = document.getElementById('contenedor')
const btnGenerar = document.getElementById('btnGenerar')
const btnActualizar = document.getElementById('btnActualizar')
const mainTable = document.getElementById('mainTable')
const pdfOut = document.getElementById('pdfOut')
const formulario = document.getElementById('formulario')
const miTabla2 = document.getElementById('miTabla2')

btnGenerar.addEventListener('click', pintarTabla);
pdfOut.addEventListener('click', imprimirPDF)



let objetosLS = ''
let editEstado = false
let start = false
pintarFilasVacias()



function pintarTabla(e) {
    e.preventDefault()
    tabla.innerHTML = ''//limpia tabla

    try {
        if (!editEstado) {
            generaSerie()
            pintarFilasLlenas()
            //editEstado=true
        } else {
            tabla.innerHTML = ''
            console.log('dentro del else pintar tabla:')
            // pintarFilasVacias()
            editEstado = false
        }
    } catch (error) {
        console.log(error)
    }
    btnActualizar.addEventListener('click', actualizaTallas)
}

function pintarFilasLlenas() {
    objetosLS.forEach(producto => {
        let fila = document.createElement('tr')
        fila.innerHTML = `
                        <td>${producto.serie}</td><td>${producto.modelo}</td><td>${producto.color}</td><td>${producto.suela}</td><td><input class ="talla1" value="${producto.talla}"></td>                    
                        `
        tabla.appendChild(fila)
    });
}

function generaSerie() {
    let tarjetaSerie = []
    console.log('dentro de funcion generaSerie():')
    let pares = formulario['pares'].value

    let tarjeta = formulario['tarjeta'].value
    let modelo = formulario['modelo'].value
    let color = formulario['color'].value
    let suela = formulario['suela'].value
    let talla = Number(formulario['talla'].value)

    console.log('antes del form:', tarjeta);


    let contador = 1
    let A = [33, 34, 34, 35, 35, 35, 36, 36, 36, 37, 37, 38]
    do {
        let objeto = {}
        objeto.serie = tarjeta + ':' + contador
        objeto.tarjeta = tarjeta
        objeto.modelo = modelo
        objeto.color = color
        objeto.suela = suela
        objeto.talla = A[contador - 1]
        tarjetaSerie.push(objeto)
        contador++
    } while (contador < Number(pares) + 1);

    console.log('obj tarjetaSerie generado primera vez:', tarjetaSerie);

    sincronizarLocalStorage(tarjetaSerie)
    //groupBy(objetosLS)
}



function actualizaTallas(e) {//recoge los datos modificados en talla, crea un array de obj con datos
    e.preventDefault()
    //let inputTallas=''
    let inputTallas = document.querySelectorAll('.talla1')

    let objetosMapeados = objetosLS

    objetosMapeados.forEach((product, i) => {
        product.talla = Number(inputTallas[i].value)
    })




    let agrupadoPorTalla = groupBy(objetosMapeados, 'talla')
    console.log('agrupadoPorTalla:', agrupadoPorTalla)
    pintarTablaCruzada(agrupadoPorTalla)
    tabla.innerHTML = ''
    pintarFilasVacias(e)

    start = true
}

function sincronizarLocalStorage(objetos) {

    localStorage.removeItem('tarjetaSerie');
    localStorage.setItem('tarjetaSerie', JSON.stringify(objetos))
    objetosLS = JSON.parse(localStorage.getItem('tarjetaSerie'))
}




function groupBy(array, property) {
    let result = {}
    for (const obj of array) {
        let key = obj[property]
        if (!result[key]) {
            result[key] = []
        }
        result[key].push(obj)
    }
    return result
}

function groupByProperty(array, property) {
    let result = {}
    for (var i = 0; i < array.length; i++) {
        let key = array[i][property]
        if (!result[key]) {
            result[key] = []
        }
        result[key].push(array[i])
    }
    return result
}

function pintarTituloTabla(objeto, propiedad) {

    let thead = document.createElement('thead')
    let tr0 = document.createElement('tr')
    /*
        for(var propiedad in objeto){//recorre el objeto orderBy para sacar nombres de las propiedades del primer objeto
            titulos=Object.keys(objeto[propiedad][0])//recorre cada obj y entra en cada propiedad y captura el primer objeto del array y los chanca con los siguiente
        }
    */
    let propiedades = Object.keys(objeto[0][0])
    let tamaños = Object.keys(objeto)
    let titulos = propiedades.concat(tamaños)
    /*
        for (const titulo of titulos){
            if(!(titulo=="talla")){
                let th = document.createElement('th')
                th.textContent=titulo.toUpperCase()
                tr0.appendChild(th)
            }else{
                console.log('tit_else:',titulo)
                for(var propiedad in objeto){
                    let th = document.createElement('th')
                    th.textContent=propiedad
                    tr0.appendChild(th)
                    titulos.push(propiedad)
                }
            }
        }
        thead.appendChild(tr0)*/
}

function pintarTablaCruzadaBeta(objeto, propiedad) {//func procedimiento


    let tbody = document.createElement('tbody')





    let tr1 = document.createElement('tr')
    for (const titulo of titulos) {//crea los titulos y cuando llega a talla dibuja los numero en titulo
        if (!(titulo == "talla")) {

            let td = document.createElement('td')
            td.textContent = objeto['33'][0][titulo]

            tr1.appendChild(td)

        } else {
            console.log('tit_else:', titulo)
            for (var propiedad in objeto) {

                let td = document.createElement('td')
                thead.appendChild(tr0)
                td.textContent = objeto[propiedad].length

                tr1.appendChild(td)
            }
        }
    }

    //let tr = document.createElement('tr')
    //let tr2 = document.createElement('tr')

    //thead.appendChild(tr0)
    tbody.appendChild(tr1)

    miTabla2.appendChild(thead)
    miTabla2.appendChild(tbody)
}


function pintarFilasVacias() {
    let objetos
    if (start) { objetos = []; start = false }

    let filasVacias = 12
    for (let i = 0; i < filasVacias; i++) {
        let fila = document.createElement('tr')

        fila.innerHTML = ` 
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><input></td> 
                            `
        //al borrar el tag input del td no funcionara la funcion presente, averiguar
        tabla.appendChild(fila)
    }
}

let grupoTarjetas = []


function pintarTablaCruzada(objeto, propiedad) {//func procedimiento

    let thead = document.createElement('thead')
    let tbody = document.createElement('tbody')
    let titulos
    let tarjeta = {}
    if (!start) {//se ejecuta esto la primera vez, ya que crea los titulos de la tabla.
        for (var propiedad in objeto) {//recorre el objeto orderBy para sacar nombres de las propiedades para el titulo tabla
            titulos = Object.keys(objeto[propiedad][0])
        }

        let tr0 = document.createElement('tr')
        let tr1 = document.createElement('tr')

        for (const titulo of titulos) {//crea los titulos y cuando llega a talla dibuja los numero en titulo

            if (!(titulo == "talla")) {//ejecuta los campo que no son talla
                let th = document.createElement('th')
                let td = document.createElement('td')
                th.textContent = titulo.toUpperCase()
                td.textContent = objeto['33'][0][titulo]
                console.log('tit_if:', td.textContent)
                tr0.appendChild(th)
                tr1.appendChild(td)
                tarjeta[titulo] = objeto['33'][0][titulo]


            } else {
                console.log('tit_else:', titulo)
                for (var propiedad in objeto) {
                    let th = document.createElement('th')
                    let td = document.createElement('td')

                    th.textContent = propiedad
                    tr0.appendChild(th)
                    td.textContent = objeto[propiedad].length

                    tr1.appendChild(td)
                    tarjeta[propiedad] = objeto[propiedad].length
                }
            }

        } grupoTarjetas.push(tarjeta)

        console.log('contenido de tarjeta:', grupoTarjetas)
        tr0.removeChild(tr0.firstChild)
        tr1.removeChild(tr1.firstChild)

        start = true
        thead.appendChild(tr0)
        tbody.appendChild(tr1)
        miTabla2.appendChild(thead)
        miTabla2.appendChild(tbody)
    } else {
        for (var propiedad in objeto) {//recorre el objeto orderBy para sacar nombres de las propiedades para el titulo tabla
            titulos = Object.keys(objeto[propiedad][0])
        }

        let tr1 = document.createElement('tr')
        for (const titulo of titulos) {//crea los titulos y cuando llega a talla dibuja los numero en titulo
            if (!(titulo == "talla")) {//ejecuta los campo que no son talla
                let td = document.createElement('td')

                td.textContent = objeto['33'][0][titulo]
                console.log('tit_if:', td.textContent)
                tr1.appendChild(td)
                tarjeta[titulo] = objeto['33'][0][titulo]
            } else {
                console.log('tit_else:', titulo)
                for (var propiedad in objeto) {
                    let td = document.createElement('td')

                    td.textContent = objeto[propiedad].length
                    tr1.appendChild(td)
                    tarjeta[propiedad] = objeto[propiedad].length
                }
            }
        } grupoTarjetas.push(tarjeta)

        tr1.removeChild(tr1.firstChild)
        //thead.appendChild(tr0)
        tbody.appendChild(tr1)
        //miTabla2.appendChild(thead)
        miTabla2.appendChild(tbody)
    }
    console.log('grupo tarjetas:', grupoTarjetas)
}

//funcion agrupa por talla

function agruparPorTalla(productos, propiedadAgrupacion) {
    // Crear un objeto para almacenar los resultados
    const resultado = productos.reduce((acc, producto) => {
        const talla = producto[propiedadAgrupacion];

        // Si la talla aún no existe en el acumulador, la inicializamos
        if (!acc[talla]) {
            acc[talla] = 1;
        } else {
            acc[talla]++;
        }
        return acc;
    }, {});

    // Obtener las propiedades comunes de todos los productos
    const propiedadesComunes = Object.keys(productos[0]).filter(prop => prop !== (propiedadAgrupacion && 'serie'));

    // Crear el objeto final con las propiedades comunes y las tallas
    const objetoFinal = propiedadesComunes.reduce((acc, prop) => {
        acc[prop] = productos[0][prop];
        return acc;
    }, resultado);
    localStorage.removeItem('tarjeta');
    localStorage.setItem('tarjeta', JSON.stringify(objetoFinal))
    // Convertir el resultado a un array
    return [objetoFinal];
}

// Ejemplo de uso:
const productos = [
    {"serie":"50121:1","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":34},
    {"serie":"50121:2","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":34},
    {"serie":"50121:3","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":34},
    {"serie":"50121:4","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":35},
    {"serie":"50121:5","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":35},
    {"serie":"50121:6","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":35},
    {"serie":"50121:7","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":36},
    {"serie":"50121:8","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":36},
    {"serie":"50121:9","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":36},
    {"serie":"50121:10","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":37},
    {"serie":"50121:11","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":37},
    {"serie":"50121:12","tarjeta":"50121","modelo":"5052","color":"Marron","suela":"Mariposa","talla":37}
]

const resultado = agruparPorTalla(productos, 'talla');
console.log(resultado);



class TablaDinamica {
    constructor(data) {
        this.data = data;
        this.tabla = document.createElement('table');
    }

    crearCabecera() {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        // Obtener todas las claves posibles
        const todasLasClaves = new Set();
        this.data.forEach(obj => {
            Object.keys(obj).forEach(key => {
                if (key!=='serie') {
                    
                    todasLasClaves.add(key)
                }
            });
        });

        // Crear los encabezados de columna
        todasLasClaves.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            tr.appendChild(th);
        });

        // Agregar la columna "Total"
        const thTotal = document.createElement('th');
        thTotal.textContent = "Total";
        tr.appendChild(thTotal);

        thead.appendChild(tr);
        this.tabla.appendChild(thead);
    }

    crearCuerpo() {
        const tbody = document.createElement('tbody');

        this.data.forEach(obj => {
            const tr = document.createElement('tr');

            // Crear las celdas para cada clave y llenarlo
            for (let i = 0; i < this.tabla.rows[0].cells.length; i++) {
                if (this.tabla.rows[0].cells[i].textContent!=='serie') {
                    const key = this.tabla.rows[0].cells[i].textContent;
                const td = document.createElement('td');
                let value = obj[key];
                td.textContent = value || "";
                tr.appendChild(td);
                }
                


                
            }

            tbody.appendChild(tr);
        });
        console.log('tbody', tbody);

        // Agregar el cuerpo a la tabla
        this.tabla.appendChild(tbody);
    }

    calcularTotalGeneral() {
        const filas = this.tabla.querySelectorAll('tbody tr');
        let totalGeneral = 0;

        filas.forEach(fila => {
            let filaTotal = 0;
            for (let i = 0; i < fila.cells.length - 1; i++) { // Iterar hasta la penúltima celda
                let valor;
                let key=this.tabla.rows[0].cells[i].textContent;
                //console.log('isNAN', valor, isNaN(valor));
                // Convertir el valor de la talla si es necesario
                //key.startsWith('talla')
                console.log('key.startsWith',key.startsWith('talla'));
                
                if (key.startsWith('talla')) {
                    valor = Number(fila.cells[i].textContent); // Función para convertir la talla
                    filaTotal += Number(valor);
                } else {
                    valor = fila.cells[i].textContent;
                }

                //if (!isNaN(valor) && Number(valor)<100) {
                //    filaTotal += Number(valor);
                //}
            }
            const tdTotal = fila.cells[fila.cells.length - 1];
            tdTotal.textContent = filaTotal;
            totalGeneral += filaTotal;
        });

        const tfoot = document.createElement('tfoot')
        const trFoot = document.createElement('tr')
        const tdFoot = document.createElement('td')
        tdFoot.textContent = totalGeneral
        trFoot.appendChild(tdFoot)
        tfoot.appendChild(trFoot)
        this.tabla.appendChild(tfoot)
    }

    generarTabla() {
        this.crearCabecera();
        this.crearCuerpo();
        this.calcularTotalGeneral();
        return this.tabla;
    }
}

// Ejemplo de uso
const datos = [
    { "talla34": 2, "talla35": 3, "talla36": 3, "talla37": 2, "talla38": 1, "serie": "50126:1", "tarjeta": "50126", "modelo": "6053", "color": "Negro", "suela": "Tabita" },
    { "talla33": 1, "talla34": 2, "talla35": 3, "talla36": 3, "talla37": 2, "talla38": 1, "serie": "50124:1", "tarjeta": "50124", "modelo": "7053", "color": "Vino", "suela": "Elena" },
    { "talla34": 3, "talla35": 3, "talla36": 3, "talla37": 3, "serie": "50121:1", "tarjeta": "50121", "modelo": "5052", "color": "Marron", "suela": "Mariposa" }
];
const tablaD = new TablaDinamica(datos);
// Aplicar la clase "total-column" a la última columna
const totalColumns = document.querySelectorAll('table th:last-child, table td:last-child');
totalColumns.forEach(column => column.classList.add('total-column'));

document.body.appendChild(tablaD.generarTabla());

function imprimirPDF(e) {
    e.preventDefault()

    html2pdf()
        .set({
            margin: 0.25,
            filename: 'pdfElito',
            //se borro image jpg, averiguar codigo origina en github del cdn html2pdf
            html2canvas: {
                scale: 5, // A mayor escala, mejores gráficos, pero más peso
                letterRendering: true,
            },
            jsPDF: {
                unit: "mm",
                format: 'a5',
                orientation: 'landscape' // landscape o portrait
            }
        })
        .from(mainTable)
        .save()
        .catch(err => console.log(err));

    /*
    try {
        var doc             =new jsPDF('p','pt','letter')
        var margin          =20;
        var scale           = (doc.internal.pageSize.width-margin*2)/document.body.clientWidth;
        var scale_mobile    = (doc.internal.pageSize.width-margin*2)/document.body.getBoundingClientRect();
        
        //checking
        if (/Android|webOS|iPhone|iPad|/i.test(navigator.userAgent)) {
            //mobile
            doc.html(mainTable,{x:margin,y:margin,html2canvas:{sacale:scale_mobile},
                callback:function(doc){
                    doc.output('dataurlnewwindow',{filename:'pdfElito.pdf'});
                }
            })
        } else {
            //pc
            doc.html(mainTable,{x:margin,y:margin,html2canvas:{sacale:scale},
                callback:function(doc){
                    doc.output('dataurlnewwindow',{filename:'pdfElito.pdf'});
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
    */
}
