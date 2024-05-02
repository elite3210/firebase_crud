import {onGetProduct} from './firebase.js'
import {renderTabs} from './producto_tabs.js'

//traer los productos de firebase toda la coleccion productos
const tabsContainer=document.getElementById('tabs-container')
const registroProductos = onGetProduct((querySnapshot) =>{
    tabsContainer.innerHTML=''
    const items     =[];

    if(querySnapshot){
        querySnapshot.forEach(doc =>{
            let obj                 ={};
            obj.id                  =doc.id;
            obj.values              =doc.data();
            obj.values.idProducto   =doc.id;
            obj.values.importe   =Math.round(obj['values'].stock*obj['values'].precio)
            obj.values.quantityAvailable=Math.round(obj['values'].stock)-obj['values'].assignedStock
            if (obj['values'].targetStock==0) {
                obj.values.stockReplaced=0;
            } else {
                obj.values.stockReplaced=Math.round(obj['values'].targetStock)-obj['values'].quantityAvailable
            }
            
            items.push(obj);
        });
    }else{console.log('no se trajeron datos...')}

    renderTabs('tabs-container',items)
    
})

/* 
//el codigo de abajo sirve para agregar mas campos a la tabla porductos, por el metodo de actualizar tabla:
const registroProductos = onGetProduct((querySnapshot) =>{

    if(querySnapshot){
        querySnapshot.forEach(doc =>{
            let id                  =doc.id;
            let assignedStock       =0;
            let targetStock         =0;
            let productToReceive    =0;
            updateProduct(id,{assignedStock: assignedStock,targetStock:targetStock,productToReceive:productToReceive})
            console.log('se actualizo el producto:',id)
        })};    
})
*/
