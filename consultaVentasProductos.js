import {onGetVentas} from './firebase.js'
import {Datatable} from './dataTable.js'

const ctx=document.getElementById('myChart');
const ctx2=document.getElementById('myChart2');
const li        = document.querySelectorAll('.li')
const bloque    = document.querySelectorAll('.bloque')
const indicador    = document.querySelector('.indicador')

//event click a 
    //todos los .li quitar la clase activo
    //todos.bloque quitar clase activo
    // .li con la posicion le añadimos la calse activo
    //.bloque con la posicion le añadimos la clase activo

li.forEach((cadaLi,i)=>{
    li[i].addEventListener('click',()=>{

        li.forEach((cadaLi,j)=>{//Recorrer todos los .li
            li[j].classList.remove('activo')//Quitando la clase activo a cada li
            bloque[j].classList.remove('activo')//Quitando la clase activo a cada bloque
        })

        li[i].classList.add('activo')
        bloque[i].classList.add('activo')
        indicador.style.left=`calc(calc(100%/5)*${i})`
    })
})

//traer los socios comerciales clientes de firebase


const registroVentas = onGetVentas((ventasSnapShot) =>{
    let items =[] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
    let items2 =[] //formato {id:123456, values{prop1:1, prop2:2, ...}}cada fila debe tener ese formato
    let itemsAgrupado=[]
    let itemsAgrupado2=[]
    let grupos=[]//de esto filtraremos para titulos
    let grupos2=[]//de esto filtraremos para titulos

    console.log('ventasSnapShot:',ventasSnapShot);
    if(ventasSnapShot){
        ventasSnapShot.forEach(doc =>{
            let documento=doc.data()
            let producto2={}
            producto2.id=doc.id
            producto2.values=documento
            items2.push(producto2)
            let detalle=JSON.parse(documento.detalleCotizacion)
            

            for (const fila of detalle) {
                let producto ={}
                producto.id             =doc.id
                producto.values         =fila
                producto.values.fecha   =documento.fecha
                producto.values.numero  =documento.numero
                producto.values.cliente =documento.cliente
                items.push(producto)
                grupos.push(documento.cliente)
                grupos2.push(fila.id)
                //console.log('Fila:',producto);  
            }
        })
    }
    console.log('items2:',items2); 
    
    let elementosUnicos=[];
    let elementosUnicos2=[];
    
    for (let i = 0; i < grupos.length; i++) {//reducimos a elemtos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos.length; j++) {
            if (grupos[i]== elementosUnicos[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){
            elementosUnicos.push(grupos[i]);
        }
    }

    for (let i = 0; i < grupos2.length; i++) {//reducimos a elemtos unicos
        let esDuplicado=false;
        for (let j = 0; j < elementosUnicos2.length; j++) {
            if (grupos2[i]== elementosUnicos2[j]) {
                esDuplicado=true;
                break;
            };
        }

        if(!esDuplicado){
            elementosUnicos2.push(grupos2[i]);
        }
    }


    let contador=1;
    for (const cod of elementosUnicos) {
        let producto={}
        let cantidad=0;
        let costo=0;
        let importe=0;
        let margen=0;

        for (const fila of items) {
            if (fila['values'].cliente==cod) {
                cantidad    += fila['values'].cantidad;
                costo       += fila['values'].costo*fila['values'].cantidad;
                importe     += fila['values'].importe;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.cliente=cod;
        producto.values.cantidad = cantidad;
        producto.values.costo = costo;
        producto.values.importe = Math.round(importe);
        producto.values.margen = Math.round(margen);
        itemsAgrupado.push(producto);
        contador++;
    }

    let contador2=1;
    for (const cod of elementosUnicos2) {
        let producto={}
        let cantidad=0;
        let costo=0;
        let importe=0;
        let margen=0;

        for (const fila of items) {
            if (fila['values'].id==cod) {
                cantidad    += fila['values'].cantidad;
                costo       += fila['values'].costo*fila['values'].cantidad;
                importe     += fila['values'].importe;
                margen      += fila['values'].importe - fila['values'].costo*fila['values'].cantidad;
            }
        }
        producto.id=contador;
        producto.values={};
        producto.values.codigo=cod;
        producto.values.cantidad = cantidad;
        producto.values.costo = costo;
        producto.values.importe = importe;
        producto.values.margen = Math.round(margen);
        itemsAgrupado2.push(producto);
        contador2++;
    }
    
    //const titulo   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',CODIGO:'codigo',NOMBRE:'nombre',CANTIDAD:'cantidad',IMPORTE:'importe',COSTO:'costo'}
    const titulo   = {' ':'',CLIENTE:'cliente',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
    const dt = new Datatable('#dataTable',[
                                            {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
                                            {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
                                        ]);
    
    dt.setData(itemsAgrupado,titulo);
    dt.makeTable();

    //const titulo   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',CODIGO:'codigo',NOMBRE:'nombre',CANTIDAD:'cantidad',IMPORTE:'importe',COSTO:'costo'}
    const titulo2   = {' ':'',CODIGO:'codigo',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
    const dt2 = new Datatable('#dataTable2',[
                                            {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
                                            {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
                                        ]);
    
    dt2.setData(itemsAgrupado2,titulo2);
    dt2.makeTable();

        const titulo3   = {' ':'',FECHA:'fecha',DOCUMENTO:'numero',RUC:'ruc',NOMBRE:'cliente',IMPORTE:'importeTotal',PAGO:'tipoPago'}
        //const titulo   = {' ':'',CLIENTE:'cliente',CANTIDAD:'cantidad',COSTO:'costo',IMPORTE:'importe',MARGEN:'margen'}
        const dt3 = new Datatable('#dataTable3',[
                                                {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
                                                {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
                                            ]);
        
        dt3.setData(items2,titulo3);
        dt3.makeTable();




    //console.log('itemsAgrupado:',itemsAgrupado);
    const colorFondo    = ['rgba(255,99,132,0.2)','rgba(54,162,235,0.2)','rgba(255,206,86,0.2)','rgba(75,192,192,0.2)','rgba(153,102,255,0.2)','rgba(255,159,64,0.2)']
    const colorBorde    = ['rgba(255,99,132,1)','rgba(54,162,235,1)','rgba(255,206,86,1)','rgba(75,192,192,1)','rgba(153,102,255,1)','rgba(255,159,64,1)']

    console.log('map:',itemsAgrupado.map(row => row.values.codigo));
    console.log('map:',itemsAgrupado.map(row => row.values.importe));
    console.log('map2:',itemsAgrupado2.map(row => row.values.codigo));
    console.log('map2:',itemsAgrupado2.map(row => row.values.importe));
    const myChart = new Chart(ctx,{
                                    type:'bar',
                                    data:{
                                        labels:itemsAgrupado.map(row => row.values.cliente),
                                        datasets:[{label:'S/',data:itemsAgrupado.map(row => row.values.importe),backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]
                                    },
                                    plugins:{legend:{display:false}}
                                }
                            )
    const myChart2 = new Chart(ctx2,{type:'bar',data:{labels:itemsAgrupado2.map(row => row.values.codigo),datasets:[{label:'S/',data:itemsAgrupado2.map(row => row.values.importe),backgroundColor:colorFondo,borderColor:colorBorde,borderWidth:2}]}})
});

//itemsAgrupado.map(row => row.values.importe)