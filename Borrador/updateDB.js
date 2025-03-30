import {queryProductos , updateProduct } from '../firebase.js'

const btn_check =document.querySelectorAll('input')
console.log('btn_check:',btn_check)
btn_check.forEach(input => {
    //console.log('btn_check.checked:',input.checked)
    input.addEventListener('click',()=>console.log('btn_check.checked:',input.checked))
});



//actualiza un at'r3ributo de la tabla o collection productos, cambiado typo o agregando un nuevo

/*
const productos=[];
const querySnapshotProducts = queryProductos;

querySnapshotProducts.forEach(async (doc) => {
    const objeto = {};
    objeto['id'] = doc.id;
    objeto['values'] = doc.data();
    await updateProduct(doc.id,{
        //costo:Number(objeto['values'].costo),
        //peso:Number(objeto['values'].peso),
        //precio:Number(objeto['values'].precio),
        //precio_anterior:Number(objeto['values'].precio_anterior),
        //stock:Number(objeto['values'].stock),
        //targetStock:Number(objeto['values'].targetStock),
        productType:'storable',
        canBeSold:true,
        canBePurcharsed:false,
        productRoute:'manufacture',
        unspscCategory:'codigoSunat'
    })
    productos.push(objeto);
});
console.log('querySnapshotProducts:',productos);
*/