import { Datatable } from './dataTable.js'
import { renderOrdenManufacture } from './ventas/formularioVenta.js'

//seleccionamos el contenedor de tabs y al recorrer agregamos un evento a cada tab
//cada vez de damos click, vuelve a recorrere todos los tab para remover la clase active
//tambien remueve la clase active de los paneles, despues del recorrido
//le agrega al tab y panels las clase active

export function renderTabs(tabs_container, arrayObjetos,categoria) {
    const arrayCategorias = eliminarDuplicados(arrayObjetos,categoria)
    console.log('arrayCategorias:',arrayCategorias);
    
    renderTabsItem(arrayCategorias,tabs_container)

    agregaEventoTabs();

    let inventarioTotal = Math.round(arrayObjetos.reduce((tot, obj) => { return tot + Number(obj['values'].stock * obj['values'].precio) }, 0))

    arrayCategorias.forEach((elementTab, j) => {
        let importe = document.getElementById(`title-${j}`)
        let objetosFiltrados = arrayObjetos.filter(fila => fila['values'][categoria] == elementTab)
        let importeCategoria = objetosFiltrados.reduce((tot, obj) => tot + Number(obj['values'].importe), 0)
        
        importe.textContent = `${new Intl.NumberFormat(navigator.languages).format(importeCategoria)}/${inventarioTotal}=${Math.round((importeCategoria / inventarioTotal) * 100)}%`;

        let titulo = { CODIGO: 'idProducto', NOMBRE: 'nombre', VALOR: 'importe', STOCK: 'stock', SEPARADO: 'assignedStock', DISPONIBLE: 'quantityAvailable', RECIBIR: 'productToReceive', COMBINADO: 'quantityAvailableAfter', OBJETIVO: 'targetStock', REPONER: 'stockReplaced' }
        let dt = new Datatable(`#dataTable-${j}`, [
            {
                id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () {
                    const item = dt.getSelected();
                    console.log('item:', item);
                    renderOrdenManufacture(item);
                }
            }
        ]);
        dt.setData(objetosFiltrados, titulo);
        dt.makeTable2();
    })
}

function agregaEventoTabs() {//recibe un NodeList con queryselectorALL, en especifico.
    const tabsX = document.querySelectorAll(".tabs li");
    const panelsX = document.querySelectorAll(".panels div");

    tabsX.forEach((tab, i) => {
        tab.addEventListener('click', (e) => {
            //console.log('click en:',e.target)
            panelsX.forEach((panel, j) => {//recorre todos los tabs y panels para apagarlo
                panel.classList.remove('active');
                tabsX[j].classList.remove('active');
            });
            //enciende los tabs y panels donde se dio click
            tabsX[i].classList.add('active');
            panelsX[i].classList.add('active');
        });
    });
}

function renderTabsItem(array,tabs_container) {    
    const tabContainer = tabs_container.querySelector('.tabs')
    const panelContainer = tabs_container.querySelector('.panels');    

    array.forEach((categoria, i) => {
        const li = document.createElement('li')
        li.textContent = categoria;
        const h2 = document.createElement('h2')
        h2.textContent = categoria;
        
        const div = document.createElement('div')
        const table = document.createElement('table')
        table.setAttribute('id', `dataTable-${i}`)
        div.appendChild(table);
        div.appendChild(h2);


        if (i == 0) {
            li.setAttribute('class', 'tabs-item active');
            div.setAttribute('class', 'panels-item active');
            h2.setAttribute('id', `title-${i}`)

        } else {
            li.setAttribute('class', 'tabs-item')
            div.setAttribute('class', 'panels-item')
            h2.setAttribute('id', `title-${i}`)
        }
        tabContainer.appendChild(li)
        panelContainer.appendChild(div)
    })
}

function eliminarDuplicados(arrayObjetos, clave) {//recibe una lista de categoria duplicadas y reduce a unicos
    let grupos = []//para separar el atributo a reducir meses repetidos
    let elementosUnicos = []//elementos unicos o meses unicos

    for (const fila of arrayObjetos) {//extraemos los valores de la categoria mes en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'][clave])
    }

    for (let i = 0; i < grupos.length; i++) {//reducimos los meses a elementos unicos
        let esDuplicado = false;
        for (let j = 0; j < elementosUnicos.length; j++) {//recorre toda la lista de elemntos unicos por cada fila de grupos
            if (grupos[i] == elementosUnicos[j]) {
                esDuplicado = true;
                break;
            };
        }

        if (!esDuplicado) {//solo agrega los que no aparecen en elemento unicos
            elementosUnicos.push(grupos[i]);
        }
    }
    return elementosUnicos;
}



