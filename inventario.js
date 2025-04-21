import {onGetProduct} from './firebase.js'
import {renderTabs} from './tabsPanels.js'

//seleccionar elemento donde renderiza los tabs
const tabsContainer=document.getElementById('tabs-container')

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
            obj.values.productToReceive   =obj['values'].productToReceive?obj['values'].productToReceive:0;
            obj.values.quantityAvailable=Math.round(obj['values'].stock)-obj['values'].assignedStock
            obj.values.quantityAvailableAfter=Number(obj.values.quantityAvailable)+Number(obj.values.productToReceive);
            if (obj['values'].targetStock==0) {
                obj.values.stockReplaced=0;
            } else {
                obj.values.stockReplaced=Math.round(obj['values'].targetStock)-Number(obj.values.quantityAvailableAfter);
            }
            items.push(obj);
        });
    }else{console.log('no se trajeron datos...')}

    //debe estar dentro del querysnapshot para renderizar con cada cambio
    renderTabs(tabsContainer,items,'categoriaPadre')
    
})

