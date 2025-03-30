import { createCategory, onGetCategory,updateCategory } from './firebase.js'
import { Datatable } from './dataTable.js';

let primerDato=true;
let categoryListOld='';
let categoryIdOld='';

const registroCategory = await onGetCategory((sociosSnapShot) => {
    let items = [];
    if (sociosSnapShot) {
        primerDato=false;
        console.log('sociosSnapShot',sociosSnapShot);
        sociosSnapShot.forEach((doc, i) => {
            let obj = {};
            obj['values'] = doc.data();
            categoryListOld=obj['values']['categoryList']
            
            obj['values']['categoryList'].forEach((cat,i)=>{
                let obj2={};
                obj2['values']={};
                obj2.id = i;
                obj2['values'].categoryType = doc.id;
                obj2['values'].categoryCode = cat.categoryCode;
                obj2['values'].categoryName = cat.categoryName;
                items.push(obj2);
            });           
        });
    };
    renderTableSocios(items);
});

class Producto {
    constructor(categoryType, categoryList) {
        this.categoryType = categoryType;
        this.categoryList = categoryList;
        this.now = new Date(Date.now());
        this.created = this.now.getTime();
    }
}

class IProducto {

    addProduct(producto) {
        /*
        const productList = document.getElementById('category-list');
        const element = document.createElement('div');

        element.innerHTML = `
        <div class="card text-center mb-4">
            <div class="card-body">
                <strong>categoryType:</strong>${producto.categoryType}
                <strong>categoryCode:</strong>${producto.categoryList[0].categoryCode}
                <strong>categoryName:</strong>${producto.categoryList[0].categoryName}
                <strong>created:</strong>${producto.created}
                <a href class="btn btn-danger" name="delete">Delete</a>
            </div>
        </div>
        `
        productList.appendChild(element)
*/
        createCategory(producto.categoryType, producto.categoryList, producto.created);
    };

    updateProduct(producto){
        console.log('editando categorya...',categoryListOld,producto.categoryList[0]);
        categoryListOld.push(producto.categoryList[0]);

        updateCategory(producto.categoryType, {categoryList:categoryListOld});//updateNumeracion('Cotizacion', { ultimoNumero: nuevoNumero })
    }

    resetForm() {
        document.getElementById('product-form').reset()
    };

    deleteProduct(element) {
        if (element.name === 'delete') {
            console.log(element.parentElement.parentElement.parentElement.remove())
            this.showMessage('el producto fue elimino', 'info')
        }
    };

    showMessage(message, cssClass) {
        const div = document.createElement('div')
        div.className = `alert alert-${cssClass} mt-1`;
        div.appendChild(document.createTextNode(message));
        //show dom
        const container = document.querySelector('.container');
        const app = document.querySelector('#App');
        container.insertBefore(div, app)
        setTimeout(() => { document.querySelector('.alert').remove() }, 1000)
    };
};

//DOM Events...

document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const categoryType = document.getElementById('categoryType').value;
    const categoryCode = document.getElementById('categoryCode').value;
    const categoryName = document.getElementById('categoryName').value;
    const categoryList = [{ categoryCode: categoryCode, categoryName: categoryName }];


    let producto = new Producto(categoryType, categoryList)
    let ui = new IProducto()

    if (categoryType === '' || nameCategory === '' || categoryCode === '' || categoryName === '') {
        return ui.showMessage('completar el formulario', 'danger')
    }
    if (primerDato) {
        ui.addProduct(producto)
    } else {
        ui.updateProduct(producto)
    }
    
    ui.resetForm()
    console.log(producto)
    ui.showMessage('Producto agregado satisfactoriamente', 'success')

})

document.getElementById('category-list').addEventListener('click', function (e) {
    e.preventDefault()
    const ui = new IProducto;
    ui.deleteProduct(e.target)
})

function renderTableSocios(items) {
    console.log('entrando a render table SOCIOS...')
    //clearHTML(sociosContainer);

    const titulo = {TIPO: 'categoryType', CODIGO: 'categoryCode', NOMBRE: 'categoryName'}
    const dt = new Datatable('#dataTable',
        [
            {
                id: 'btnEdit', text: 'editar', icon: 'note_add', targetModal: '#myModal',
                action: function () {
                    //const elementos = dt.getSelected();
                    //console.log('mostrando documento formato PC...', elementos);
                    createPartner();
                }
            },
            {
                id: 'btnDocument', text: 'doc', icon: 'document_scanner', targetModal: '#myModal',
                action: function () {
                    const elementos = dt.getSelected();
                    viewDocument(elementos);
                    console.log('mostrando documento Formato Ticket...', elementos);
                }
            }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable2();
};

