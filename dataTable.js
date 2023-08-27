

export class Datatable{

    element;
    headers;
    items;
    copyItems;
    selected;
    pagination;
    numberOfEntries;
    headerButtons;

    constructor(selector,headerButtons){
        this.element    = document.querySelector(selector);
        this.headers    = '';
        this.items      = [];
        this.pagination = {total:0,noItemsPerPage:0,noPages:0,actual:0,pointer:0,diff:0,lastPageBeforeDots:0,noButtonsBeforeDots:4};
        this.selected   = [];
        this.numberOfEntries    = 7;
        this.headerButtons      = headerButtons;
    }

    parse(){
        const headers   = [...this.element.querySelector('thead tr').children];
        const trs       = [...this.element.querySelector('tbody').children];
        console.log('headers antes:',headers)
        console.log('Ters antes:',trs)

        headers.forEach(th=>{this.headers.push(th.textContent)});

        trs.forEach(tr=>{
            const cells  = [... tr.children];
            //console.log('cells:',cells)
            const item  = {id:this.generateUUID(),values:[]}
            cells.forEach(td=>{
                if (td.children.length>0){
                    const status = td.children[0].getAttribute('class');

                    if (status!=null) {
                        item.values.push(`<span class='${status}'></span>`);   
                    }   
                }else{
                    item.values.push(td.textContent);
                }
            })
            this.items.push(item);
        });
        
        console.log('items de la funcion parse():',this.items)
    };

    generateUUID(){
        return (Date.now()*Math.floor(Math.random()*10000)).toString();
    };

    makeTable(){//renderiza la tabla
        console.log('dentro de maketable...')
        this.copyItems  = [...this.items];
        this.initPagination(this.items.length,this.numberOfEntries);

        const container = document.createElement('div');
        container.id    = this.element.id;
        this.element.innerHTML='';
        this.element.replaceWith(container);//reemplaza tabla con esta capa
        this.element    = container;
        this.createHTML();
        this.renderHeaders();
        this.renderRows();
        this.renderPagesButtons();
        this.renderHeaderButtons();
        this.renderSearch();
        this.renderSelectEntries();
    };

    createHTML(){//crea la estructura basica
        /*
        const div = document.createElement('div')
        div.setAttribute('class','datatable-container')

        const divHeaderTools = document.createElement('div')
        divHeaderTools.setAttribute('class','header-tools')

        const divSearch = document.createElement('div')
        divSearch.setAttribute('class','search')

        const divTools = document.createElement('div')
        divTools.setAttribute('class','tools')

        const inputSearch = document.createElement('input')
        inputSearch.setAttribute('type','text')
        inputSearch.setAttribute('class','search-input')
        divSearch.appendChild(inputSearch)

        const ulHeadersButtonsContainer = document.createElement('ul')
        ulHeadersButtonsContainer.setAttribute('class','header-buttons-container')
        divTools.appendChild(ulHeadersButtonsContainer)

        divHeaderTools.appendChild(divSearch)
        divHeaderTools.appendChild(divTools)


        const thead = document.createElement('thead')
        const tr    = document.createElement('tr')
        thead.appendChild(tr)
        const tabla = document.querySelector('.dataTable')
        tabla.appendChild(thead)

        */

        this.element.innerHTML=`
        <div class="datatable-container">
        
        <div class="header-tools">
            <div class="search"><input type="text" class="search-input"></div>
            <div class="tools">
                <ul class="header-buttons-container">
                </ul>
            </div>
        </div>
        
        <table id="dataTable" class="datatable">
            
            <thead>
                <tr><th></th><th>Status</th><th>Name</th><th>Positios</th><th>Office</th><th>Age</th><th>Date</th></tr>
            </thead>
            
            <tbody>
            </tbody>
        </table>
        
        <div class="footer-tools">
            <div class="list-items">
                show
                <select name="n-entries" id="n-entries" class="n-entries">
                    <option value="15">5</option>
                    <option value="10">10</option>
                    <option value="12">15</option>
                </select>
                entries
            </div>
            <div class="pages">
            </div>
        </div>
        
    </div>
        `;
    };
    
    renderHeaders(){//renderiza los titulos del thead
        
        /*
        this.headers.forEach(header=>{
            this.element.querySelector('thead tr').innerHTML += `<th>${header}</th>`
        })
        */

        this.element.querySelector('thead tr').innerHTML='';

        Object.keys(this.headers).forEach(header=>{
            this.element.querySelector('thead tr').innerHTML += `<th>${header}</th>`
        })
    };

    renderRows(){//dibuja las filas
        this.element.querySelector('tbody').innerHTML='';

        let icon= 0;
        const {pointer,total}   = this.pagination;//pointer pagina donde se queda
        const limit = this.pagination.actual*this.pagination.noItemsPerPage;

        for (let i = pointer; i < limit; i++) {
            if (i==total) break;

            const {id,values}   = this.copyItems[i];
            const checked   = this.isChecked(id);
            let data    = '';
            data    += `
            <td class="table-checkbox"><input type="checkbox" class ="datatable-checkbox" data-id="${id}" ${checked? "checked":""}></td>
            `;

            if (Array.isArray(values)) {//si los values es un array hace esto
                
                values.forEach(cell=>{
                    data    += `<td>${cell}</td>`
                })

            } else {//si los value vienen en un objeto hace esto
                for (let j = 1; j < Object.values(this.headers).length; j++) {
                    
                    for (const key in values) {
                        if (Object.values(this.headers)[j]==key) {
                            data += `<td>${values[key]}</td>`;
                        }
                        
                    }
                }
            }

            this.element.querySelector('tbody').innerHTML+=`<tr>${data}</tr>`;
            //listener para el checkbox
            document.querySelectorAll('.table-checkbox').forEach(checkbox=>{
                checkbox.addEventListener('click',e=>{
                    const element   = e.target;
                    const id    = element.getAttribute('data-id');

                    if (element.checked) {
                        const item  = this.getItem(id);
                        this.selected.push(item)
                    }else{
                        this.removeSelected(id);
                    }
                    console.log('id-.',this.selected)
                })
            })
        }
    };

    isChecked(id){//valida si esiste ese elemnto previamente
        const items = this.selected;
        let res     = false;
        if (items.length==0){return false};

        items.forEach(item=>{
            if (item.id==id) { res = true}
        });
        return res
    };

    getItem(id){//tomar parametro un id y devuelve la coincidencia un obj
        const res   = this.items.filter(item=> item.id==id)
        if (res.length==0){return null}
        return res[0];
    };

    removeSelected(id){//si deseleccionamos retira el elemento del arreglo
        const res = this.selected.filter(item=> item.id!==id);
        this.selected=[...res];
    };

    renderPagesButtons(){//dibuja los botones de paginacion
        const pagesContainer = this.element.querySelector('.pages');//hace referencia a clase pages
        let pages='';

        const buttonsToShow     = this.pagination.noButtonsBeforeDots;//numero de botones a mostrar
        const actualIndex       = this.pagination.actual;//indice actual

        let limI    = Math.max(actualIndex - 2,1);//calcula la pagina inferior
        let limS    = Math.min(actualIndex + 2,this.pagination.noPages);//si me conviene mostrar mas de dos elementos o mostrar la ultima pagina, si estoy cerca no tiene sentido mostrar mas botones
        const missinButtons = buttonsToShow - (limS-limI);//cuantos botones me hacen falta para llegar al inicio o final

        if (Math.max(limI-missinButtons,0)) {//se necesita saber botones de adelante y detraz
            limI= limI-missinButtons;
        } else if(Math.min(limS+missinButtons,this.pagination.noPages)!=this.pagination.noPages) {
            limS    = limS + missinButtons;//muestra siempre que hace falta mostrar botones
        }

        if (limS<(this.pagination.noPages-2)) {
            pages   += this.getIteratedButtons(limI,limS);
            pages   += '<li>...</li>';
            pages   += this.getIteratedButtons(this.pagination.noPages-1,this.pagination.noPages)
        }else{
            pages   += this.getIteratedButtons(limI,this.pagination.noPages);
        }

        pagesContainer.innerHTML    = `<ul>${pages}</ul>`;

        this.element.querySelectorAll('.pages li button').forEach(button=>{
            button.addEventListener('click',e=>{
                this.pagination.actual  = parseInt(e.target.getAttribute('data-page'));
                this.pagination.pointer = (this.pagination.actual*this.pagination.noItemsPerPage)-this.pagination.noItemsPerPage;
                this.renderRows();
                this.renderPagesButtons();
            })
        })
    };

    renderHeaderButtons(){
        let html='';
        const buttonsContainer  = this.element.querySelector('.header-buttons-container');
        const headerButtons     =this.headerButtons;

        headerButtons.forEach(button=>{
            html    += `<li><button id = "${button.id}"><i class="material-icons">${button.icon}</i></button></li>`
        });

        buttonsContainer.innerHTML=html;
        headerButtons.forEach(button=>{
            document.querySelector('#'+button.id).addEventListener('click',button.action)
        })
    };

    renderSearch(){
        this.element.querySelector('.search-input').addEventListener('input',(e)=>{
            const query = e.target.value.trim().toLowerCase();
            

            if(query == ''){
                this.copyItems=[...this.items];
                this.initPagination(this.copyItems.length,this.numberOfEntries);
                this.renderRows();
                this.renderPagesButtons();
                return;
            }
            this.search(query);
           // console.log('else copyItems:',this.copyItems)
            this.initPagination(this.copyItems.length,this.numberOfEntries);
            this.renderRows();
            this.renderPagesButtons();
        });
    };

    renderSelectEntries(){//dibuja los elementos que haya seleccionado previamente, escrito por un seguidor del autor en youube
        const select = this.element.querySelector("#n-entries");

        const html = [5, 10, 15].reduce((acc, item) => {
            return (acc += `<option value="${item}" ${
                this.numberOfEntries === item ? "selected" : ""
            }>${item}</option>`);
        }, "");

        select.innerHTML = html;

        this.element.querySelector("#n-entries").addEventListener("change", (e) => {
                const numberOfEntries = parseInt(e.target.value);
                this.numberOfEntries = numberOfEntries;

                this.initPagination(
                    this.copyItems.length,
                    this.numberOfEntries
                );
                this.renderRows();
                this.renderPagesButtons();
                this.renderSearch();
            });
    };

    initPagination(total,entries){//validacion de paginas
        this.pagination.total   = total;
        this.pagination.noItemsPerPage  = entries;
        this.pagination.noPages = Math.ceil(this.pagination.total/this.pagination.noItemsPerPage);
        this.pagination.actual  = 1;
        this.pagination.pointer = 0;
        this.pagination.diff    = this.pagination.noItemsPerPage-(this.pagination.total%this.pagination.noItemsPerPage)
    }

    getIteratedButtons(start,end){//dibuja los botones concecutivos
        let res ='';

        for (let i = start; i <= end; i++){
            if (i==this.pagination.actual) {//si estamos en la misma pagina no quiero que muestre un boton donde dar click, sino solamente un placeholder que muestre pagina actual
                res += `<li><span class = "active" >${i}</span></li>`;
            }else{
                res += `<li><button data-page="${i}">${i}</button></li>`;//dibuja un boton y que hacen ref a la pag a mostrar
            }
        }
        return res;
    }

    search(query){
        let res =[];

        this.copyItems=[...this.items];
        for(let i =0; i<this.copyItems.length;i++){
            const{id,values}=this.copyItems[i];
            const row = Object.values(values);
            
/*
            for(const key in row) {
                const cell= row[key];
                if (cell.toLowerCase().indexOf(query)>=0){
                    res.push(this.copyItems[i]);
                    break;
                }
            }*/
            
            for (let j = 0; j < row.length; j++) {
                const cell= row[j];
                console.log('de row su cel:',cell)
                if (cell.toLowerCase().indexOf(query)>=0){
                    res.push(this.copyItems[i]);
                    break;
                }
                
            }
        }
        this.copyItems  = [...res];
    }

    getSelected(){
        return this.selected;
    }

    setData(data,titulo){

        this.headers=titulo;
        this.items = data;
    };
}


/*ejemplo para instanciar un objeto de la clase datatable
const dt = new Datatable('#dataTable',
                        [
                            {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
                            {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
                        ]);


        dt.setData(data);
        dt.makeTable();
*/
/*
console.log('hola mundo...') 
        const dt = new Datatable('#dataTable',
                        [
                            {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
                            {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
                        ]);


        dt.parse();
        dt.makeTable();*/