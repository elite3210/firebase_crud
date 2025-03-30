import { Datatable } from './dataTable.js';

const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdm9kc2JzaXhoYWZtdmJnbm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3OTE4MTgsImV4cCI6MjAzMTM2NzgxOH0.28VEyrM61MEaoo8l-EXV4PV4xvJ9nNs-ukybNAypVmY';
const supabaseUrl='https://iivodsbsixhafmvbgnnm.supabase.co';
const _supabase = supabase.createClient(supabaseUrl,supabaseKey);
console.log(_supabase);

const form_tblContact=document.getElementById('form_tblContact');
const btnSend=document.getElementById('btnSend');

let items=[];

console.log(btnSend);
btnSend.addEventListener('click',set_tblContact);


async function set_tblContact(e){
    e.preventDefault()
    btnSend.innerText='Guardando...';
    const res = await _supabase.from("tblContact").insert({
                conNames:form_tblContact['conNames'].value,
                conSurnames:form_tblContact['conSurnames'].value,
                conDNI:form_tblContact['conDNI'].value,
                conMovil:form_tblContact['conMovil'].value,     
                conWhatsapp:form_tblContact['conWhatsapp'].value,
                conEmail:form_tblContact['conEmail'].value,      
                conBirth:form_tblContact['conBirth'].value
    })

    if (res) {
        alert('Contacto agregado con exito')
        btnSend.innerText='Guardar';
        btnSend.setAttribute('disabled',false);
        document.querySelector('#myModal').style.display='none';
        form_tblContact['conNames'].value='';
        form_tblContact['conSurnames'].value='';
        form_tblContact['conDNI'].value='';
        form_tblContact['conMovil'].value='';     
        form_tblContact['conWhatsapp'].value='';
        form_tblContact['conEmail'].value='';      
        form_tblContact['conBirth'].value='';
    } else {
        alert('Contacto no agregado con exito');
        btnSend.innerText='Guardar';
        btnSend.setAttribute('disabled',false);
    }
};

const get_tblContact= async()=>{
    const res = await _supabase.from("tblContact").select("*");
    
    if (res) {
        res['data'].forEach(obj => {
            let objeto ={};
            objeto.id =obj.idContact;
            objeto.values =obj;
            objeto.values.btnEdit='<button data-bs-toggle="modal" data-bs-target="#myModal">Edit</button>';
            items.push(objeto);
        });
    } else {
        console.log('no se trajo datos...');
    }

    console.log('items:',items);
    const titulo = { NOMBRES: 'conNames', APELLIDOS: 'conSurnames', DNI: 'conDNI', NACIMIENTOS:'conBirth', EMAIL: 'conEmail',EDITAR:'btnEdit'}
    const dt = new Datatable('#dataTable',[]);
    dt.setData(items, titulo);
    dt.makeTable2();
    
};

get_tblContact();






