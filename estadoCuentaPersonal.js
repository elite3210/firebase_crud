import {diario2023Ref} from './firebase.js'
import {getDocs,query} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {Datatable} from './dataTable.js'

let items=[];


const queryDiario      = await getDocs(query(diario2023Ref));

async function datosFirestore(){
    console.log('queryDiario trajo de FB:',queryDiario)

    queryDiario.forEach(doc => {
        const obj       ={}
        obj.id          =doc.id
        obj.values      =doc.data()
        items.push(obj)
    });
}
datosFirestore()
console.log('Datos FireBase en obj:',items)

function detallarTransaccion(arrayObj){
    let detalle=[];

    arrayObj.forEach(asiento=>{
        const {id,values}=asiento;//de cada linea de transacciones creamos dos variables id y values que se extraera de cada transaccion asiento
        let detalleTransaccion     = JSON.parse(values['detalle']);// de JSON a un array de objetos 
        //console.log('detalleTransaccion:',detalleTransaccion)
        
        detalleTransaccion.forEach(linea=>{
            let obj ={}
            obj.id=id
            obj.values={...values,...linea}
            obj.values.saldo=obj.values.debe-obj.values.haber
            delete obj.values['detalle']
            detalle.push(obj)
        });
          
    })
    return detalle;//retorna: {id:"aAxUt6RdEdO0dYTH9Kp0"},values:{anexo:"72091168",cuenta:"41110",debe:50,fecha:"26/08/2023",glosa:"reconocimiento de boleta pago",haber:0,importe:50,numero:1}
}




function groupBy(items){
    let grupos = []
    let elementosUnicos=[]
    let itemsAgrupado=[] 

    for (const fila of items) {//extraemos los valores de las cuentas en toda las filas, objetivo por fila inclusive si se repite
        grupos.push(fila['values'].cuenta)
    }

    for (let i = 0; i < grupos.length; i++) {//reducimos las categorias a elementos unicos
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

    let contador=1;
    for (const valor of elementosUnicos) {
        let producto={}
        let debe=0;
        let haber=0;

        for (const fila of items) {//agregando los importe de cada categoria del obj values
            if (fila['values'].cuenta==valor) {
                debe     += fila['values'].debe;
                haber    += fila['values'].haber;
            }
        }
        producto.id=contador;
        producto.values={};

        producto.values.cuenta=valor;
        producto.values.debe = Math.round(debe);
        producto.values.haber = Math.round(haber);

        itemsAgrupado.push(producto);
        contador++;
    }
    return itemsAgrupado;//return: queda asi ejemplo: {"id": 2,"values": {"cuenta": "41110","debe": 30113,"haber": 30113}}
}

const detalleTransacciones=detallarTransaccion(items);
const libroMayor=groupBy(detalleTransacciones);
console.log('detalleTransacciones:',detalleTransacciones)

const cuentaAngela = detalleTransacciones.filter(linea=>{return (linea.values.anexo=='72091168' && linea.values.cuenta=='41110')})
console.log('cuentaAngela:',cuentaAngela)

//detallarTransaccion(items), libro diario
console.log('detalle transacciones Diario:',detalleTransacciones)
console.log('detalle transacciones Mayor:',groupBy(detalleTransacciones))

const titulo   = {' ':'',ASIENTO:'numero',FECHA:'fecha',GLOSA:'glosa',CUENTA:'cuenta',DEBE:'debe',HABER:'haber'}

const dt = new Datatable('#dataTable',
[
    {id:'bedit',text:'editar',icon:'edit',action:function(){const elemntos=dt.getSelected(); console.log('editar datos...',elemntos);  }},
    {id:'bDelete',text:'eliminar',icon:'delete',action:function(){const elemntos=dt.getSelected(); console.log('eliminar datos...',elemntos);  }}
]
);

dt.setData(detalleTransacciones,titulo);
dt.makeTable();

const libroMayor41110 = detalleTransacciones.filter((linea)=>{return (linea.values.cuenta=='41110')})
const titulo0   = {ASIENTO:'numero',FECHA:'fecha',GLOSA:'glosa',DEBE:'debe',HABER:'haber'}
const dt0 = new Datatable('#dataTable0',[]);

dt0.setData(libroMayor41110,titulo0);
dt0.renderTable();

//balance de comprobacion
const titulo2   = {CUENTA:'cuenta',DEBE:'debe',HABER:'haber'}

const dt2 = new Datatable('#dataTable2',[]);

dt2.setData(libroMayor,titulo2);
dt2.renderTable();

//detallarTransaccion(items), ccuenta corriente persona

const titulo3   = {FECHA:'fecha',GLOSA:'glosa',CUENTA:'cuenta',DEBE:'debe',HABER:'haber'}
const titulofoot   = {FECHA:'TOTAL',GLOSA:'',CUENTA:'',DEBE:250,HABER:250}

const dt3 = new Datatable('#dataTable3',[]);

dt3.setDatos(cuentaAngela,titulo3,titulofoot);
dt3.renderTable();

