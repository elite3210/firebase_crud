import {Datatable} from './dataTable.js'

//seleccionamos el contenedor de tabs y al recorrer agregamos un evento a cada tab
//cada vez de damos click, vuelve a recorrere todos los tab para remover la clase active
//tambien remueve la clase active de los paneles, despues del recorrido
//le agrega al tab y panels las clase active

const categorias=['Descartables', 'Cucharitas', 'Embalaje', 'Aditivo', 'Aditivos', 'Piñateria', 'Especial', 'Paliglobos', 'Material', 'Picador', 'Sorbetes', 'Forrados', 'Flexibles', 'Polipapel', 'Sorbeton', 'Sorbeton ']

export function renderTabs(element,arrayObjetos) {
    const array=eliminarDuplicados(arrayObjetos,'categoriaPadre')
    const tabs_container=document.getElementById(element);
    
    const tabs  =document.createElement('div')
                tabs.setAttribute('class','tabs');
    const panels=document.createElement('div')
                panels.setAttribute('class','panels');

    tabs_container.appendChild(tabs)
    tabs_container.appendChild(panels)

    //const tabs=document.querySelector(".tabs");
    //const panels=document.querySelector(".panels");
    array.forEach((element,i)=>{
        const li =document.createElement('li')
        const div =document.createElement('div')
        const table =document.createElement('table')
        const h2 =document.createElement('h2')
        //h2.textContent=element;
        
        table.setAttribute('id',`dataTable-${i}`)
        div.appendChild(h2);
        div.appendChild(table);
        li.textContent=element;

        if (i==0) {
            li.setAttribute('class','tabs-item active');
            div.setAttribute('class','panels-item active');
            h2.setAttribute('id',`title-${i}`)
        }else{
            li.setAttribute('class','tabs-item')
            div.setAttribute('class','panels-item')
            h2.setAttribute('id',`title-${i}`)
        }

        tabs.appendChild(li)
        panels.appendChild(div)
    })

    const tabsX=document.querySelectorAll(".tabs li");
    const panelsX=document.querySelectorAll(".panels div");

    agregaEventoTabs(tabsX,panelsX);

    array.forEach((element,j)=>{
        let importe=document.getElementById(`title-${j}`)
        let objetosFiltrados=arrayObjetos.filter(fila=>fila['values'].categoriaPadre==element)
        //console.log('h2',importe)
        importe.textContent=new Intl.NumberFormat(navigator.languages).format(objetosFiltrados.reduce((tot,obj)=>tot+Number(obj['values'].importe),0));
        let titulo= {' ':'',CODIGO:'idProducto',NOMBRE:'nombre',STOCK:'stock',UND:'unidad',PRECIO:'precio',VALOR:'importe'}
        let dt    = new Datatable(`#dataTable-${j}`,[]);
                    dt.setData(objetosFiltrados,titulo);
                    dt.makeTable();
    })
}

function agregaEventoTabs(tabs,panels){//recibe un NodeList con queryselectorALL, en especifico.
    tabs.forEach((tab,i)=>{
        tab.addEventListener('click',(e)=>{
            console.log('click en:',e.target)
            panels.forEach((panel,j) => {
                panel.classList.remove('active');   
                tabs[j].classList.remove('active');
            });
            tabs[i].classList.add('active');
            panels[i].classList.add('active');
        });
    });
}

function renderTabsItem(array,tabs,panels){
    array.forEach((element,i)=>{
        const li =document.createElement('li')
        const div =document.createElement('div')
        const table =document.createElement('table')
        const h2 =document.createElement('h2')
        h2.textContent=element;
        
        table.setAttribute('id','dataTable')
        div.appendChild(h2);
        div.appendChild(table);
        li.textContent=element;

        
        if (i==0) {
            li.setAttribute('class','tabs-item active');
            div.setAttribute('class','panels-item active');
            
        }else{
            li.setAttribute('class','tabs-item')
            div.setAttribute('class','panels-item')
        }
        

        tabs.appendChild(li)
        panels.appendChild(div)
        
    })
}

function eliminarDuplicados(arrayObjetos,clave){//recibe una lista de categoria duplicadas y reduce a unicos
    let grupos = []//para separar el atributo a reducir meses repetidos
    let elementosUnicos=[]//elementos unicos o meses unicos

    for (const fila of arrayObjetos) {//extraemos los valores de la categoria mes en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'][clave])
    }

    for (let i = 0; i < grupos.length; i++) {//reducimos los meses a elementos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos.length; j++) {//recorre toda la lista de elemntos unicos por cada fila de grupos
            if (grupos[i]== elementosUnicos[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){//solo agrega los que no aparecen en elemento unicos
            elementosUnicos.push(grupos[i]);
        }
    }
    return elementosUnicos;
}


//renderTabs('tabs-container',categorias)


