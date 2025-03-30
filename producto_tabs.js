import {Datatable} from './dataTable.js'
import {renderOrdenManufacture} from './ventas/formularioVenta.js'

//seleccionamos el contenedor de tabs y al recorrer agregamos un evento a cada tab
//cada vez de damos click, vuelve a recorrere todos los tab para remover la clase active
//tambien remueve la clase active de los paneles, despues del recorrido
//le agrega al tab y panels las clase active

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

    let inventarioTotal=Math.round(arrayObjetos.reduce((tot,obj)=>{ return tot+Number(obj['values'].stock*obj['values'].precio)},0))

    array.forEach((element,j)=>{
        let importe=document.getElementById(`title-${j}`)
        let objetosFiltrados=arrayObjetos.filter(fila=>fila['values'].categoriaPadre==element)
        let importeCategoria=objetosFiltrados.reduce((tot,obj)=>tot+Number(obj['values'].importe),0)
        //console.log('h2',importe)
        importe.textContent=`${new Intl.NumberFormat(navigator.languages).format(importeCategoria)}/${inventarioTotal}=${Math.round((importeCategoria/inventarioTotal)*100)}%`;
        
        let titulo= {CODIGO:'idProducto',NOMBRE:'nombre',VALOR:'importe',STOCK:'stock',SEPARADO:'assignedStock',DISPONIBLE:'quantityAvailable',RECIBIR:'productToReceive',COMBINADO:'quantityAvailableAfter',OBJETIVO:'targetStock',REPONER:'stockReplaced'}
        let dt    = new Datatable(`#dataTable-${j}`,[
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal:'#myModal', action: function () { 
                const item = dt.getSelected();
                console.log('item:',item );
                renderOrdenManufacture(item);
             } }
        ]);
                    dt.setData(objetosFiltrados,titulo);
                    dt.makeTable2();
    })
}

function agregaEventoTabs(tabs,panels){//recibe un NodeList con queryselectorALL, en especifico.
    tabs.forEach((tab,i)=>{
        tab.addEventListener('click',(e)=>{
            //console.log('click en:',e.target)
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


