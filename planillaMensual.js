import {boletaPagoRef} from './firebase.js'
import { getDocs, query, where} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { Datatable } from './dataTable.js';


let mesReporte = document.getElementById('mesReporte');
let btnConsulta = document.getElementById('btnConsulta');
let btnConsultaTotal = document.getElementById('btnConsultaTotal');
//const queryBoletaPago  = await getDocs(query(boletaPagoRef,where("payStatus", "==", false)));
const queryBoletaPago  = await getDocs(query(boletaPagoRef));
datosFirebase(queryBoletaPago)

const tarifaJornada = [
    { tarifa: 3.6164, 'dni': '72091168', 'nombre': 'Angela', horario: 'regular' },
    { tarifa: 3.6857, 'dni': '71338629', 'nombre': 'Alexandra', horario: 'regular' },
    { tarifa: 3.700, 'dni': '71338629', 'nombre': 'Xiomara', horario: 'regular' },
    { tarifa: 3.3594, 'dni': '09551196', 'nombre': 'Rocio', horario: 'regular' },
    { tarifa: 3.10, 'dni': '70528292', 'nombre': 'Heinz', horario: 'regular' },
    { tarifa: 3.595, 'dni': '10216274', 'nombre': 'Mariela', horario: 'regular' },
    { tarifa: 4.9144, 'dni': '42231772', 'nombre': 'Elí', horario: 'regular' },
    { tarifa: 4.9144, 'dni': '42231772', 'nombre': 'Alison', horario: 'regular' },
    { tarifa: 3.6857, 'dni': '48256517', 'nombre': 'Madeleine', horario: 'regular' },
    { tarifa: 4.063, 'dni': '80400965', 'nombre': 'Oswaldo', horario: 'regular' },
    { tarifa: 1, 'dni': '42934967', 'nombre': 'Giovanna', horario: 'regular' }
  ]

btnConsulta.addEventListener('click',()=>renderDatatable(JSON.parse(localStorage.getItem('jornadaDatos'))));
btnConsultaTotal.addEventListener('click',()=>console.log('mensual:',orderByMes(JSON.parse(localStorage.getItem('jornadaDatos')))));

async function datosFirebase(jornadaTrabajoLS){//trae los datos de firebase y los guarda en LocalStorage
    console.log('query que se trajo de Firebase_:',jornadaTrabajoLS)
    const nombreMes =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']
    let items =[];

    jornadaTrabajoLS.forEach((doc) => {
        const objeto    =doc.data();
        let detalle     =JSON.parse(objeto.horasTrabajadas);
        detalle.forEach((obj) =>{
            let date                =new Date(`${obj['values'].title}:00Z`);
            obj['values'].mes       =nombreMes[date.getMonth()];
            obj['values'].importe   =obj['values'].importe?obj['values'].importe:obj['values'].tiempo*3.616;
            obj['values'].ano       =date.getFullYear();
            obj['values'].ano_mes   =date.getMonth()<9 ? `${date.getFullYear()}-0${date.getMonth()+1}`:`${date.getFullYear()}-${date.getMonth()+1}`;
            items.push(obj);
        });
    })
    sincronizarLocalStorage(items);
    console.log('items[]:',items);    
};

function renderDatatable(array){
    //filtra por año y mes segun se seleciona
    let planillaMensual=array.filter((jornada)=>jornada['values'].ano_mes==mesReporte.value);
    //console.log('planillaMensual',planillaMensual);
    let importeMensual=planillaMensual.reduce((total, obj) => total + obj['values'].importe, 0)
    const titulo        ={AÑO:'ano',MES:'mes',NOMBRE: 'description', DIA:'nombreDia', HORAS: 'hora', IMPORTE: 'importe'}
    const tituloFoot    ={TOTAL:'MES',' ':' ',' ':' ',' ':' ',IMPORTE:importeMensual.toFixed(2)};
    const toolsHeader   =[
        {
        id: 'btnNew',text: 'nuevo', icon: 'overview', targetModal:'#myModal', action: function () {const item = dt.getSelected();crearBoleta(item);}
        }
    ]

    const dt = new Datatable('#dataTable',toolsHeader);
    dt.setDatos(planillaMensual,titulo,tituloFoot);
    dt.renderTable();
};

function sincronizarLocalStorage(objetos) {//recibe nuevos datos lo guarda en LS y lo trae en memoria
    localStorage.removeItem('jornadaDatos');
    localStorage.setItem('jornadaDatos', JSON.stringify(objetos))
    //objetosLS= JSON.parse(localStorage.getItem('jornadaDatos'))
};

function orderByMes(arrayObj) {
    let itemsMes=[];
     
    const anio=[2025,2024,2023,2022];
    anio.forEach((anio)=>{
        const nombreMes =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
        let colaborador =['Angela','Alexandra','Xiomara','Rocio','Heinz','Mariela','Elí','Alison','Alison','Madeleine','Oswaldo','Alison'];
        let objeto={};
        objeto['id']=anio
        objeto['values']={};
        colaborador.forEach(()=>{
            const acumuladorColaborador=0;
            
        })
        nombreMes.forEach((mes)=>{
            let acumulador=0;
            arrayObj.forEach(obj => {
                if(obj['values'].ano==anio && obj['values'].mes==mes){
                    acumulador+=obj['values'].importe;
                }
            });
            objeto['values'][mes]=acumulador;
        });
        itemsMes.push(objeto)
    })
    return itemsMes;
};