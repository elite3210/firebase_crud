//script de mantenimiento de la base de datos, aumentar campos, eliminar, etc. usar con responsabilidad

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