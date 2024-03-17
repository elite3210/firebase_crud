import {Datatable} from './dataTable.js'

//const url = window.location.href;
const url = new URL(window.location.href); // se crea el objeto URL, el cual almacena toda la URL
const params = url.searchParams; //se almacenan todos los parámetros en una variable
const id = params.get("id"); // se utiliza el método GET para captar el valor del parámetro nombre
//const edad = params.get("edad"); // se utiliza el método GET para captar el valor del parámetro edad
console.log('el id del contacto es:',id); // se muestra en consola el valor "Juan"
//console.log(edad); // se muestra en consola el valor "25"
console.log('url:',url)

const form=document.getElementById('formularioClientes')
const linkVentas=document.getElementById('ventas')
linkVentas.addEventListener('click',()=>{
    window.location=`./ventas.html?id=${id}`
})
let contactosLS=JSON.parse(localStorage.getItem('Contactos'))
let ventasLS=JSON.parse(localStorage.getItem('Ventas'))
//console.log('contactosLS:',contactosLS)
let obj =contactosLS.filter((fila)=>{return fila.id==id})
let objVentas =ventasLS.filter((fila)=>{return fila['values'].ruc==id})
console.log('objVentas:',objVentas)

    form['razonSocial'].value       = obj[0]['values'].razonSocial; 
    form['ruc'].value               = obj[0]['values'].ruc;                  
    form['inicioActividad'].value   = obj[0]['values'].inicioActividad;           
    form['nombresContacto'].value   = obj[0]['values'].nombresContacto;           
    form['apellidosContacto'].value = obj[0]['values'].apellidosContacto;         
    form['email'].value             = obj[0]['values'].email;                     
    form['dni'].value               = obj[0]['values'].dni;                       
    form['cargo'].value             = obj[0]['values'].cargo;                     
    form['telefono'].value          = obj[0]['values'].telefono;
    form['direccion'].value         = obj[0]['values'].direccion;                 
    form['distrito'].value          = obj[0]['values'].distrito;                  
    form['provincia'].value         = obj[0]['values'].provincia;                 
    form['departamento'].value      = obj[0]['values'].departamento;              
    form['ubicacion'].value         = obj[0]['values'].ubicacion;                 
    form['nota'].value              = obj[0]['values'].nota;
    
    
    const titulo = { ' ': '', DOC: 'numero', FECHA: 'fecha', Estado: 'estado', IMPORTE: 'importeTotal' }
                const dt = new Datatable('#dataTable',
                    [
                        {
                            id: 'btnEdit', text: 'editar', icon: 'contract',
                            action: function () {
                                const elementos = dt.getSelected();
                                console.log('mostrando documento formato PC...', elementos);
                                pintarDocumento(elementos)
                            }
                        },
                        {
                            id: 'btnDocument', text: 'doc', icon: 'document_scanner',
                            action: function () {
                                const elementos = dt.getSelected();
                                pintarDocumento(elementos);
                                console.log('mostrando documento Formato Ticket...', elementos);
                            }
                        }
                    ]
                );
 
                dt.setData(objVentas,titulo);
                dt.makeTable();