export class Datatable {
    element;
    headers;
    items;
    footer;
    copyItems;
    selected;
    pagination;
    numberOfEntries;
    headerButtons;
    filaSeleccionada;

    constructor(selector, headerButtons) {
        this.element = document.querySelector(selector);
        this.headers = '';//titulo de la tabla
        this.footer = '';
        this.items = [];
        this.pagination = { total: 0, noItemsPerPage: 0, noPages: 0, actual: 0, pointer: 0, diff: 0, lastPageBeforeDots: 0, noButtonsBeforeDots: 4 };
        this.selected = [];
        this.numberOfEntries = 25;
        this.headerButtons = headerButtons;
        let filaSeleccionada = null;
    }

    parse() {//este metodo lee una tabla en html y extrae sus datos
        const headers = [...this.element.querySelector('thead tr').children];
        const trs = [...this.element.querySelector('tbody').children];
        //console.log('headers antes:',headers)
        //console.log('Trs antes:',trs)

        headers.forEach(th => { this.headers.push(th.textContent) });

        trs.forEach(tr => {
            const cells = [...tr.children];
            //console.log('cells:',cells)
            const item = { id: this.generateUUID(), values: [] }
            cells.forEach(td => {
                if (td.children.length > 0) {
                    const status = td.children[0].getAttribute('class');

                    if (status != null) {
                        item.values.push(`<span class='${status}'></span>`);
                    }
                } else {
                    item.values.push(td.textContent);
                }
            })
            this.items.push(item);
        });

        console.log('items de la funcion parse():', this.items)
    };

    generateUUID() {//genera un id para cada fila de una cada en html que no tiene id, de una base si tiene y no es necesario
        return (Date.now() * Math.floor(Math.random() * 10000)).toString();
    };

    makeTable() {//renderiza la tabla original
        console.log('dentro de maketable...')
        this.copyItems = [...this.items];
        this.initPagination(this.items.length, this.numberOfEntries);

        const container = document.createElement('div');
        container.id = this.element.id;
        this.element.innerHTML = '';
        this.element.replaceWith(container);//reemplaza tabla con esta capa
        this.element = container;
        this.createHTML();
        this.renderHeaders();
        this.eventoClickFila()
        this.renderRows();
        this.renderPagesButtons();
        this.renderHeaderButtons();
        this.renderSearch();
        this.renderSelectEntries();
    };

    renderTable() {//makeTable() sin herramientas, simple para motrar datos que no sera manipulada
        console.log('se esta renderizando la tabla sin herramientas...')
        this.copyItems = [...this.items];
        this.initPagination(this.items.length, this.numberOfEntries);

        const container = document.createElement('div');
        container.id = this.element.id;
        this.element.innerHTML = '';
        this.element.replaceWith(container);//reemplaza tabla con esta capa
        this.element = container;
        this.crearHTML();
        this.renderHeaders();
        this.renderFilas();
        this.renderFooters();

        //this.renderFooter();//implementar
        //this.renderPagesButtons();
        //this.renderSearch();
        //this.renderSelectEntries();
    };

    makeTable2() {//makeTable() sin input check resalda fila selecionada
        console.log('dentro de maketable...Items',this.items)
        this.copyItems = [...this.items];
        this.initPagination(this.items.length, this.numberOfEntries);

        const container = document.createElement('div');
        container.id = this.element.id;//AQUI LE PASA EL VALOR de ID de #DATATABLE
        this.element.innerHTML = '';
        this.element.replaceWith(container);//reemplaza tabla con esta capa
        this.element = container;
        this.createHTML();
        this.renderHeaders();
        this.eventoClickFila()
        this.renderRows2();
        this.renderPagesButtons2();
        this.renderHeaderButtons();
        this.renderSearch2();
        this.renderSelectEntries2();
    };

    createHTML() {//crea la estructura basica orginal
        this.element.innerHTML = `
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

    createHTML2() {//crea la estructura basica html generado por javascript
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

        this.element.innerHTML = `
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

    crearHTML() {//crea la estructura basica para renderTable() simple
        /*
        const div = document.createElement('div')
        div.setAttribute('class','datatable-container')

        const thead = document.createElement('thead')
        const tr    = document.createElement('tr')
        thead.appendChild(tr)

        const tbody = document.createElement('tbody')
        
        const tfoot = document.createElement('tfoot')
        const trfoot    = document.createElement('tr')
        const th=document.createElement('th')
        trfoot.appendChild(th)
        tfoot.appendChild(trfoot)
        



        const tabla = document.createElement('table')
        tabla.setAttribute('id','dataTable')
        tabla.setAttribute('class','dataTable')
        tabla.appendChild(thead)
        tabla.appendChild(tbody)
        tabla.appendChild(tfoot)
        div.appendChild(tabla)

        this.element.appendChild(div)
        */

        this.element.innerHTML = `
        <div class="datatable-container">
            <table id="dataTable" class="datatable">
                <thead>
                    <tr><th></th><th>Status</th><th>Name</th><th>Positios</th><th>Office</th><th>Age</th><th>Date</th></tr>
                </thead>
                
                <tbody>
                </tbody>
                <tfoot>
                    <tr><th></th><th>Status</th><th>Name</th><th>Positios</th><th>Office</th><th>Age</th><th>Date</th></tr>
                </tfoot>
            </table>
        </div>
        `;


    };

    renderHeaders() {//renderiza los titulos del thead o la tabla

        /*
        this.headers.forEach(header=>{
            this.element.querySelector('thead tr').innerHTML += `<th>${header}</th>`
        })
        */

        this.element.querySelector('thead tr').innerHTML = '';//limpia el thead, los html

        Object.keys(this.headers).forEach(header => {
            this.element.querySelector('thead tr').innerHTML += `<th>${header}</th>`
        })

    };

    renderRows() {//dibuja las filas
        
            this.element.querySelector('tbody').innerHTML='';//limpia el tbody
            //this.element.querySelector('tbody').addEventListener('click',()=>this.eventoClickFila())
            let icon= 0;
            const {pointer,total}   = this.pagination;//pointer pagina donde se queda
            const limit = this.pagination.actual*this.pagination.noItemsPerPage;
    
            for (let i = pointer; i < limit; i++) {
                if (i==total) break;
                const {id,values}   = this.copyItems[i];
                const checked   = this.isChecked(id);
                let data    = '';
                //creado la primero columna de cada fila , es input check
                data    += `
                <td class="table-checkbox"><input type="checkbox" class ="datatable-checkbox" data-id="${id}" ${checked ? "checked":""}></td>
                `;
    
                if (Array.isArray(values)) {//si los values es un array hace esto
                    
                    values.forEach(cell=>{
                        data    += `<td>${cell}</td>`
                    })
                //se crea las demas columnas en cada fila
                } else {//si los values vienen en un objeto hace esto
                    for (let j = 1; j < Object.values(this.headers).length; j++) {//captura la cantidad de titulos,  para crear esa cantidad de columnas, ignora el primeeo por no querer un check
                        
                        for (const key in values) {//crea tantas columnas como titulo se tenga
                            if (Object.values(this.headers)[j]==key) {
                                data += `<td>${values[key]}</td>`;//agrega las columnas en una fila
                            }
                        }
                    }

                    this.element.querySelector('tbody').innerHTML+=`<tr data-id=${id}>${data}</tr>`;//cada columnas se mete en una fila y este en la tbody
                    
                    //listener para el checkbox recorriendo todas filas
                    document.querySelectorAll('.table-checkbox').forEach(checkbox=>{
                        checkbox.addEventListener('click',e=>{
                            const element   = e.target;
                            const id    = element.getAttribute('data-id');
    
                            if (element.checked) {
                                this.renderHeaderButtons();
                                const item  = this.getItem(id);
                                this.selected.push(item)
                                
                            }else{
                                this.removeSelected(id);
                                //mejorar si se hace check a dos fila apareden los button y si a uno de ellos se hace check false, entonces se quedan sin herramientas button
                                //deberia borra cuando no haya nigun checked
                                const buttonsContainer  = this.element.querySelector('.header-buttons-container');//seleccionada todos sin condicion, deberia la rednerizacion ser condicionada a cada tipo de sleccion
                                buttonsContainer.innerHTML=''; //esto borra los headerButtons cuando se des-selecciona la fila.
                                document.querySelector('.filaSeleccionada').classList.remove('filaSeleccionada')//borra la clase filla seleccionada para quitar los estilos que corresponden a este
                            }
                            console.log('id: ',this.selected)
                            
                        })
                    })
    
                    //listener para cada fila
                    
                }
            }
            //this.eventoClickFila(id)
        /*
        this.element.querySelector('tbody').innerHTML = '';

        let icon = 0;
        const { pointer, total } = this.pagination;//pointer pagina donde se queda
        const limit = this.pagination.actual * this.pagination.noItemsPerPage;

        for (let i = pointer; i < limit; i++) {
            if (i == total) break;

            const { id, values } = this.copyItems[i];
            const checked = this.isChecked(id);
            let data = '';
            data += `
            <td class="table-checkbox"><input type="checkbox" class ="datatable-checkbox" data-id="${id}" ${checked ? "checked" : ""}></td>
            `;

            if (Array.isArray(values)) {//si los values es un array hace esto

                values.forEach(cell => {
                    data += `<td>${cell}</td>`
                })

            } else {//si los values vienen en un objeto hace esto
                for (let j = 1; j < Object.values(this.headers).length; j++) {

                    for (const key in values) {//crea tantas columnas como titulo se tenga
                        if (Object.values(this.headers)[j] == key) {
                            data += `<td>${values[key]}</td>`;
                        }
                    }
                }

                this.element.querySelector('tbody').innerHTML += `<tr data-id="${id}" data-order=${i}>${data}</tr>`;

                //listener para el checkbox
                document.querySelectorAll('.table-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('click', e => {
                        const element = e.target;
                        const id = element.getAttribute('data-id');

                        if (element.checked) {
                            this.renderHeaderButtons();
                            const item = this.getItem(id);
                            this.selected.push(item);
                        } else {
                            this.removeSelected(id);
                            const buttonsContainer = this.element.querySelector('.header-buttons-container');
                            //buttonsContainer.innerHTML=''; //esto borra los headerButtons cuando se des-selecciona la fila.
                        }
                        console.log('id: ', this.selected)
                    })
                })

                //listener para cada fila
                //this.eventoClickFila(id)
            }
        }
        */
    };

    renderFilas() {//renderiza las filas
        this.element.querySelector('tbody').innerHTML = '';
        let id = '';
        let icon = 0;
        const { pointer, total } = this.pagination;//pointer pagina donde se queda
        //const limit = this.pagination.actual*this.pagination.noItemsPerPage;
        const limit = this.copyItems.length;


        for (let i = pointer; i < limit; i++) {
            if (i == total) break;
            const {id,values} = this.copyItems[i];
            const checked = this.isChecked(id);
            let data = '';


            if (Array.isArray(values)) {//si los values es un array hace esto
                values.forEach(cell => {
                    data += `<td>${cell}</td>`
                })

            } else {//si los values vienen en un objeto hace esto
                for (let j = 0; j < Object.values(this.headers).length; j++) {
                    for (const key in values) {
                        if (Object.values(this.headers)[j] == key) {
                            data += `<td>${values[key]}</td>`;
                        }
                    }
                }
            }
            this.element.querySelector('tbody').innerHTML += `<tr data-id="${id}">${data}</tr>`;
            //this.element.querySelector('tbody').addEventListener('click',this.eventoClickFila)
        }
        //this.eventoClickFila2(id)
    };

    renderRows2() {//dibuja las filas
        this.element.querySelector('tbody').innerHTML = '';
        let id = '';
        let icon = 0;
        const { pointer, total } = this.pagination;//pointer pagina donde se queda
        const limit = this.pagination.actual * this.pagination.noItemsPerPage;

        for (let i = pointer; i < limit; i++) {
            if (i == total) break;

            id = this.copyItems[i].id;
            const values = this.copyItems[i].values;
            const checked = this.isChecked2(id);
            let data = '';
            /*
            data += `
            <td class="table-checkbox"><input type="checkbox" class ="datatable-checkbox" data-id="${id}" ${checked ? "checked" : ""}></td>
            `;
            */
            if (Array.isArray(values)) {//si los values es un array hace esto

                values.forEach(cell => {
                    data += `<td>${cell}</td>`
                })

            } else {//si los values vienen en un objeto hace esto empieza en j=1 si se va dejar la primera columna para un input checked
                for (let j = 0; j < Object.values(this.headers).length; j++) {
                    for (const key in values) {//crea tantas columnas como titulo se tenga
                        if (Object.values(this.headers)[j] == key) {//si el valor del titulo coincide con valor de array de datos se agregara a la fila o tabla
                            //if (values[key]!=undefined) {//se intenta rellenar con ceros cuando no hay datos
                                data += `<td>${values[key]}</td>`;
                            //} else {
                                //data += `<td>${0}</td>`;
                            //}
                            
                        }
                    }
                }

                this.element.querySelector('tbody').innerHTML += `<tr data-id="${id}" data-order=${i}>${data}</tr>`;
                //this.element.querySelector('tbody').addEventListener('click',this.eventoClickFila)
                //listener para el checkbox
                document.querySelectorAll('.table-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('click', e => {
                        const element = e.target;
                        const id = element.getAttribute('data-id');

                        if (element.checked) {
                            this.renderHeaderButtons();
                            const item = this.getItem(id);
                            this.selected.push(item);
                        } else {
                            this.removeSelected(id);
                            const buttonsContainer = this.element.querySelector('.header-buttons-container');
                            //buttonsContainer.innerHTML=''; //esto borra los headerButtons cuando se des-selecciona la fila.
                        }
                        console.log('id: ', this.selected)
                    })
                })
            }
            //listener para cada fila
        }
        //this.eventoClickFila2(id)
    };
    
    eventoClickFila() {//pinta la fila si se hace click
        /*
        const filas = document.querySelectorAll('tbody tr');

        filas.forEach(fila=>{          
            fila.addEventListener('click',(e)=>{
                let dataId = e.target.parentElement.getAttribute('data-id')
                //console.log('position:',position+1)
                const item = this.getItem(dataId);
                if (document.querySelector('.filaSeleccionada')) {
                    document.querySelector('.filaSeleccionada').classList.remove('filaSeleccionada')
                    fila.classList.add('filaSeleccionada');//la ultima fila selecionada queda marcada.
                } else {
                    fila.classList.add('filaSeleccionada');
                }
                console.log('id:',item)
            })
        })
        
        */
        const table = document.getElementById('dataTable');
        table.addEventListener('click',(e)=>{
            const fila = e.target.closest('tr');//es una expresión que busca el ancestro más cercano del elemento e.target que coincida con el selector CSS tr. 
            console.log('e.target.closest(tr):',fila);
            
            const id   = fila.getAttribute('data-id');
            this.selected = [];
            // Verificar si se hizo clic en una fila del tbody
            if (fila && fila.parentNode.tagName==='TBODY') {
                if (this.filaSeleccionada===fila) {//ya existe una fila seleccionada
                    //si se hace click en la misma fila quitar selececcion
                    fila.classList.remove('filaSeleccionada');
                    this.filaSeleccionada=null;
                    this.removeSelected(id);
                } else {
                    // Quitar la selección de la fila anterior
                    if (this.filaSeleccionada) {
                        this.filaSeleccionada.classList.remove('filaSeleccionada');
                    }
                    //al seleccionar nueva fila (primera vez) o no seleccionada
                    fila.classList.add('filaSeleccionada');
                    const item  = this.getItem(id);
                    this.selected.push(item)
                    this.filaSeleccionada=fila;
                }

            }

            console.log('this.selected:',this.selected);
        })
        
    };

    eventoClickFila2(id) {//pinta la fila si se hace click

        const table = document.getElementById('dataTable');
        let filaSeleccionada = null;
        table.addEventListener('click',(e)=>{
            const fila = e.target.closest('tr');
            // Verificar si se hizo clic en una fila del tbody
            if (fila && fila.parentNode.tagName==='tbody') {
                if (filaSeleccionada===fila) {//ya existe una fila seleccionada
                    //si se hace click en la misma fila quitar selececcion
                    fila.classList.remove('filaSeleccionada');
                    filaSeleccionada=null;
                } else {
                    // Quitar la selección de la fila anterior
                    if (filaSeleccionada) {
                        filaSeleccionada.classList.remove('filaSeleccionada');
                    }
                    //al seleccionar nueva fila o no seleccionada
                    fila.classList.add('filaSeleccionada');
                    filaSeleccionada=fila;
                }

            }
        })
        console.log('id:',id)
        /*

        const filas = document.querySelectorAll('tbody tr');
        filas.forEach((fila,i)=> {
            fila.addEventListener('click', (e) => {
                this.selected = []
                let dataId = e.target.parentElement.getAttribute('data-id')
                const item = this.getItem(dataId);
                this.selected.push(item);//por alguna razon me funcionan los botones cuando ejecuto este metodo, averiguar
                if (document.querySelector('.filaSeleccionada')) {
                    
                    document.querySelector('.filaSeleccionada').classList.remove('filaSeleccionada')
                    fila.classList.add('filaSeleccionada')
                    //this.renderHeaderButtons(); //con o sin este codigo tambien funciona

                } else {
                    console.log('no habia ninguna .filaselecionada...y lo agrego');
                    fila.classList.add('filaSeleccionada')
                }
                //console.log('id:', dataId)
                console.log('id: ', item)
            })
        })
        //console.log('id:',id)
        */
    };

    renderFooters() {//renderiza los titulos del tfoot auditoria se beria verificar si la columna es typeOf == numer, se suma y renderiza en tfoot
        this.element.querySelector('tfoot tr').innerHTML = '';
        //console.log('tfoot:', this.element.querySelector('tfoot tr'))
        Object.values(this.footer).forEach(footer => {
            //console.log('tfoot:', this.element.querySelector('footer', footer))
            this.element.querySelector('tfoot tr').innerHTML += `<th>${footer}</th>`
        })

    };

    isChecked(id) {//valida si existe ese elemnto previamente
        const items = this.selected;
        let res = false;
        if (items.length == 0) { return false };

        items.forEach(item => {
            if (item.id == id) { res = true }
        });
        return res
    };

    isChecked2(id) {//valida si existe ese elemnto previamente
        const items = this.selected;
        let res = false;
        if (items.length == 0) { return false };

        items.forEach(item => {
            if (item.id == id) { res = true }
        });
        return true;
    };

    getItem(id) {//tomar parametro un id y devuelve la coincidencia un obj     
        const res = this.items.filter(item => item.id == id)
        if (res.length == 0) { return null }
        //console.log('getitem:res',res);
        return res[0];
    };

    removeSelected(id) {//si deseleccionamos retira el elemento del arreglo
        const res = this.selected.filter(item => item.id !== id);
        this.selected = [...res];
        //console.log('remove this.selected',this.selected);
    };

    renderPagesButtons() {//dibuja los botones de paginacion
        const pagesContainer = this.element.querySelector('.pages');//hace referencia a clase pages del create HTML
        let pages = '';

        const buttonsToShow = this.pagination.noButtonsBeforeDots;//numero de botones a mostrar
        const actualIndex = this.pagination.actual;//indice o pagina actual

        let limI = Math.max(actualIndex - 2, 1);//calcula la pagina inferior
        let limS = Math.min(actualIndex + 2, this.pagination.noPages);//si me conviene mostrar mas de dos elementos o mostrar la ultima pagina, si estoy cerca no tiene sentido mostrar mas botones
        const missinButtons = buttonsToShow - (limS - limI);//cuantos botones me hacen falta para llegar al inicio o final

        if (Math.max(limI - missinButtons, 0)) {//se necesita saber botones de adelante y detraz
            limI = limI - missinButtons;
        } else if (Math.min(limS + missinButtons, this.pagination.noPages) != this.pagination.noPages) {
            limS = limS + missinButtons;//muestra siempre que hace falta mostrar botones
        }

        if (limS < (this.pagination.noPages - 2)) {
            pages += this.getIteratedButtons(limI, limS);
            pages += '<li>...</li>';
            pages += this.getIteratedButtons(this.pagination.noPages - 1, this.pagination.noPages)
        } else {
            pages += this.getIteratedButtons(limI, this.pagination.noPages);
        }

        pagesContainer.innerHTML = `<ul>${pages}</ul>`;
        //selecciona todos los botones de paginas y agrega un event listener
        this.element.querySelectorAll('.pages li button').forEach(button => {
            button.addEventListener('click', e => {
                this.pagination.actual = parseInt(e.target.getAttribute('data-page'));
                this.pagination.pointer = (this.pagination.actual * this.pagination.noItemsPerPage) - this.pagination.noItemsPerPage;
                this.renderRows();
                this.renderPagesButtons();
            })
        })
    };

    renderPagesButtons2() {//dibuja los botones de paginacion
        const pagesContainer = this.element.querySelector('.pages');//hace referencia a clase pages
        let pages = '';

        const buttonsToShow = this.pagination.noButtonsBeforeDots;//numero de botones a mostrar
        const actualIndex = this.pagination.actual;//indice actual

        let limI = Math.max(actualIndex - 2, 1);//calcula la pagina inferior
        let limS = Math.min(actualIndex + 2, this.pagination.noPages);//si me conviene mostrar mas de dos elementos o mostrar la ultima pagina, si estoy cerca no tiene sentido mostrar mas botones
        const missinButtons = buttonsToShow - (limS - limI);//cuantos botones me hacen falta para llegar al inicio o final

        if (Math.max(limI - missinButtons, 0)) {//se necesita saber botones de adelante y detraz
            limI = limI - missinButtons;
        } else if (Math.min(limS + missinButtons, this.pagination.noPages) != this.pagination.noPages) {
            limS = limS + missinButtons;//muestra siempre que hace falta mostrar botones
        }

        if (limS < (this.pagination.noPages - 2)) {
            pages += this.getIteratedButtons(limI, limS);
            pages += '<li class="page-item">...</li>';
            pages += this.getIteratedButtons(this.pagination.noPages - 1, this.pagination.noPages)
        } else {
            pages += this.getIteratedButtons(limI, this.pagination.noPages);
        }

        pagesContainer.innerHTML = `<ul class="pagination">${pages}</ul>`;

        this.element.querySelectorAll('.pages li button').forEach(button => {
            button.addEventListener('click', e => {
                this.pagination.actual = parseInt(e.target.getAttribute('data-page'));
                this.pagination.pointer = (this.pagination.actual * this.pagination.noItemsPerPage) - this.pagination.noItemsPerPage;
                this.renderRows2();
                this.renderPagesButtons2();
            })
        })
    };

    renderHeaderButtons() {
        let html='';
        const buttonsContainer  = this.element.querySelector('.header-buttons-container');
        const headerButtons     =this.headerButtons;//recibe parametros de array de objetos inluye funcion

        headerButtons.forEach(button=>{//recorre el header tools con el icono recibido en array para pintarlo
            html    += `<li><button id = "${button.id}" data-bs-toggle="modal" data-bs-target="${button.targetModal}"><span class="material-symbols-outlined">${button.icon}</span></button></li>`
        });
        //<span class="material-symbols-outlined">barcode</span>
        buttonsContainer.innerHTML=html;
        headerButtons.forEach(button=>{
            document.querySelector('#'+button.id).addEventListener('click',button.action)
        })


        /*
        let html = '';
        const buttonsContainer = this.element.querySelector('.header-buttons-container');
        const headerButtons = this.headerButtons;//recibe parametros de array de objetos inluye funcion

        headerButtons.forEach(button => {//pinta el header tools con el icono recibido en array
            html += `<li><button type="button" data-bs-toggle="${button.dataBsToggle}" data-bs-target="${button.dataBsTarget}" id = "${button.id}"><span class="material-symbols-outlined">${button.icon}</span></button></li>`
        });
        //<span class="material-symbols-outlined">barcode</span>
        buttonsContainer.innerHTML = html;
        headerButtons.forEach(button => {
            document.querySelector('#' + button.id).addEventListener('click', button.action)//este codigo selecciona el boton un el id y le agrea un lisener click que agrega la ejecucion de una funcion
        })
        */
    };

    renderSearch() {//vuelve a renderizar la tabla con un nuevos array Obj retornado por funcion search()
        this.element.querySelector('.search-input').addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            this.search(query);
            this.initPagination(this.copyItems.length, this.numberOfEntries);
            this.renderRows();
            this.renderPagesButtons();
        });
    };

    renderSearch2() {//vuelve a renderizar la tabla con un nuevos array Obj retornado por funcion search()
        this.element.querySelector('.search-input').addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            this.search(query);//filtra los item que coinciden con el query y coloca en copy items
            this.initPagination(this.copyItems.length, this.numberOfEntries);
            this.renderRows2();
            this.renderPagesButtons2();
        });
    };

    search(query) {
        //si no hay palabra alguna escrita, devuelve los mismos items
        if (query === '') {//si es un string vacio devuelve todos los items
            return this.copyItems = [...this.items];
        }
        //filtramos todos los elemntos que contengan el query
        //se itera por cada values, que esta en un objeto, se extrae los value con Object
        //luego aplicamos include para evaluar si hay el exto que se va escribiendo y mandar a some para ser filtrado 
        const lowerQuery = query.toLowerCase();
        this.copyItems = this.items.filter(item =>Object.values(item.values).some(value => 
                String(value).toLowerCase().includes(lowerQuery)
            )
        );
    }
    

    renderSelectEntries() {//dibuja los elementos que haya seleccionado previamente, escrito por un seguidor del autor en youube
        const select = this.element.querySelector("#n-entries");

        const html = [10, 25, 50, 100].reduce((acc, item) => {
            return (acc += `<option value="${item}" ${this.numberOfEntries === item ? "selected" : ""}>${item}</option>`);
        }, ""
        );

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

    renderSelectEntries2() {//dibuja los elementos que haya seleccionado previamente, escrito por un seguidor del autor en youube
        const select = this.element.querySelector("#n-entries");

        const html = [10, 25, 50, 100].reduce((acc, item) => {
            return (acc += `<option value="${item}" ${this.numberOfEntries === item ? "selected" : ""}>${item}</option>`);
        }, ""
        );

        select.innerHTML = html;

        this.element.querySelector("#n-entries").addEventListener("change", (e) => {
            const numberOfEntries = parseInt(e.target.value);
            this.numberOfEntries = numberOfEntries;

            this.initPagination(
                this.copyItems.length,
                this.numberOfEntries
            );
            this.renderRows2();
            this.renderPagesButtons2();
            this.renderSearch2();
        });
    };

    initPagination(total, entries) {//validacion de paginas
        this.pagination.total = total;
        this.pagination.noItemsPerPage = entries;
        this.pagination.noPages = Math.ceil(this.pagination.total / this.pagination.noItemsPerPage);
        this.pagination.actual = 1;
        this.pagination.pointer = 0;
        this.pagination.diff = this.pagination.noItemsPerPage - (this.pagination.total % this.pagination.noItemsPerPage)
    };

    getIteratedButtons(start, end) {//dibuja los botones concecutivos
        let res = '';

        for (let i = start; i <= end; i++) {
            if (i == this.pagination.actual) {//si estamos en la misma pagina no quiero que muestre un boton donde dar click, sino solamente un placeholder que muestre pagina actual
                res += `<li><span class = "active" >${i}</span></li>`;
            } else {
                res += `<li><button data-page="${i}">${i}</button></li>`;//dibuja un boton y que hacen ref a la pag a mostrar
            }
        }
        //console.log('res botones pagina:',res);
        return res;
    };

    getSelected() {
        return this.selected[0];
    };

    setData(data, titulo) {
        this.headers = titulo;
        this.items = data;
    };

    setDatos(data, titulo, totals) {//pone los titulos en la cabecera y en pie de la tabla, con items en tbody

        this.headers = titulo;
        this.items = data;
        this.footer = totals;
    };
    //this.add() falta implementar este metodo, sirve para adicionar una fila que no viene desde la base de datos, se agrega en frontend
};
