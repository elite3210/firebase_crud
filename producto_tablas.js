import {onGetProduct} from './firebase.js'
import {renderTabs} from './producto_tabs.js'

//traer los productos de firebase toda la coleccion productos
const registroProductos = onGetProduct((querySnapshot) =>{
    const items     =[];

    if(querySnapshot){
        querySnapshot.forEach(doc =>{
            let obj                 ={};
            obj.id                  =doc.id;
            obj.values              =doc.data();
            obj.values.idProducto   =doc.id;
            obj.values.importe   =Math.round(obj['values'].stock*obj['values'].precio)
            items.push(obj);
        });
    }else{console.log('no se trajeron datos...')}

    renderTabs('tabs-container',items)
    
})