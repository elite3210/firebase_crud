

class Datatable{

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
        this.headers    = [];
        this.items      = [];
        this.pagination = {total:0,noItemsPerPage:0,noPages:0,actual:0,pointer:0,diff:0,lastPageBeforeDots:0,noButtonsBeforeDots:4};
        this.selected   = [];
        this.numberOfEntries    = 3;
        this.headerButtons      = headerButtons;
    }

    parse(){
        const headers   = [...this.element.querySelector('thead tr').children];
        const trs       = [...this.element.querySelector('tbody').children];
        console.log('headres antes:',headers)
        console.log('headres antes:',trs)

        headers.forEach(th=>{this.headers.push(th.textContent)});

        trs.forEach(tr=>{
            const cells  = [... tr.children];
            //console.log('cells:',cells)
            const item  = {id:this.generateUUID(),values:[]}
            cells.forEach(td=>{
                if (td.children.length>0){
                    const status = td.children[0].getAttribute('class');

                    if (status!=null) {
                        item.values.push(`<span class='$status'></span>`);   
                    }   
                }else{
                    item.values.push(td.textContent);
                }
            })
            this.items.push(item);
        });
        
        console.log('items:',this.items)
    }

    generateUUID(){
        return (Date.now()*Math.floor(Math.random()*10000)).toString();
    }

    makeTable(){
        this.copyItems  = [...this.items];
        this.initPagination(this.items.length,this.numberOfEntries);

        const container = document.createElement('div');
        container.id    = this.element.id;
        this.element.innerHTML='';
        this.element.replaceWith(container);
        this.element    = container;
        this.createHTML();
        this.renderHeaders();
        this.renderRows();
        this.renderPagesButtons();
        this.renderHeaderButtons();
        this.renderSearch();
        this.renderSelectEntries();
    }

    createHTML(){
        this.element.innerHTML=`
        <div class="datatable-container">
        
        <div class="header-tools">
            <div class="search"><input type="text" class="search-input"></div>
            <div class="tools">
                <ul>
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
                    <option value="15"></option>
                    <option value="10"></option>
                    <option value="12"></option>
                </select>
                entries
            </div>
            <div class="pages">
            </div>
        </div>
        
    </div>
        `;
    };

    renderHeaders(){
        this.element.querySelector('thead tr').innerHTML='';

        this.headers.forEach(header=>{
            this.element.querySelector('thead tr').innerHTML += `<th>${header}</th>`
        })
    };

    renderRows(){
        this.element.querySelector('tbody').innerHTML='';

        let icon= 0;
        const {pointer,total}   = this.pagination;
        const limit = this.pagination.actual*this.pagination.noItemsPerPage;

        for (let i = pointer; i < limit; i++) {
            if (i==total) break;

            const {id,values}   = this.copyItems[i];
            const checked   = this.isChecked(id);
            let data    = '';
            data    += `
            <td class="table-checkbox"><input type="checkbox" data-id="${id}" ${checked? "checked":""}></td>
            `;
            values.forEach(cell=>{
                data    += `<td>${cell}</td>`
            })
            this.element.querySelector('tbody').innerHTML+=`<tr>${data}</tr>`;

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

    isChecked(id){
        const items = this.selected;
        let res     = false;
        if (items.length==0){return false};

        items.forEach(item=>{
            if (item.id==id) { res = true}
        });
        return res
    }

    getItem(id){
        const res   = this.items.filter(item=> item.id==id)
        if (res.length==0){return null}
        return res[0];
    }

    removeSelected(id){
        const res = this.selected.filter(item=> item.id!==id);
        this.selected=[...res];
    }

    renderPagesButtons(){
        const pagesContainer = this.element.querySelector('.pages');
        let pages='';

        const buttonsToShow     = this.pagination.noButtonsBeforeDots;
        const actualIndex       = this.pagination.actual;

        let limI    = Math.max(actualIndex - 2,1);
        let limS    = Math.min(actualIndex + 2,this.pagination.noPages);
        const missinButtons = buttonsToShow - (limS-limI);

        if (Math.max(limI-missinButtons,0)) {
            limI= limI-missinButtons;
        } else if(Math.min(limS+missinButtons,this.pagination.noPages)!=this.pagination.noPages) {
            limS    = limS + missinButtons;
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
                this.renderHeaderButtons();
            })
        })
    };

    renderHeaderButtons(){
        let html='';
        const buttonsContainer  = this.element.querySelector('.tools');
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
        this.element.querySelector('search-input').addEventListener('input',e=>{
            const query = e.target.value.trim().toLowerCase();

            if(query == ''){
                this.copyItems=[...this.items];
                this.initPagination(this.copyItems.length,this.numberOfEntries);
                return;
            }
            this.search(e,query)
        })
    };

    renderSelectEntries(){};

    initPagination(total,entries){
        this.pagination.total   = total;
        this.pagination.noItemsPerPage  = entries;
        this.pagination.noPages = Math.ceil(this.pagination.total/this.pagination.noItemsPerPage);
        this.pagination.actual  = 1;
        this.pagination.pointer = 0;
        this.pagination.diff    = this.pagination.noItemsPerPage-(this.pagination.total%this.pagination.noItemsPerPage)
    }

    getIteratedButtons(start,end){
        let res ='';

        for (let i = start; i <= end; i++) {
            if (i==this.pagination.actual) {
                res += `<li><span class ='active'>${i}</span></li>`;
            }else{
                res += `<li><button data-page="${i}">${i}</button></li>`;
            }
            
        }
        return res;
    }

    search(){
        
    }
}

const dt = new Datatable('#dataTable',[{id:'bAdd',text:'agregar',icon:'add_circle',action:function(){console.log('agregar nuevo dato...')}}]);
        dt.parse();
        dt.makeTable();

        