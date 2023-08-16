const tabla = document.getElementById('contenedor')
const btnGenerar = document.getElementById('btnGenerar')
const btnActualizar = document.getElementById('btnActualizar')
const mainTable = document.getElementById('mainTable')
const pdfOut = document.getElementById('pdfOut')
const formulario=document.getElementById('formulario')

btnGenerar.addEventListener('click',pintarFilas);
pdfOut.addEventListener('click',imprimirPDF)

function imprimirPDF(e){
    e.preventDefault()

    html2pdf()
            .set({
                margin: 0.25,
                filename: 'pdfElito',
                //se borro image jpg, averiguar codigo origina en github del cdn html2pdf
                html2canvas: {
                    scale: 5, // A mayor escala, mejores gráficos, pero más peso
                    letterRendering: true,
                },
                jsPDF: {
                    unit: "mm",
                    format: 'a5',
                    orientation: 'landscape' // landscape o portrait
                }
            })
            .from(mainTable)
            .save()
            .catch(err => console.log(err));

    /*
    try {
        var doc             =new jsPDF('p','pt','letter')
        var margin          =20;
        var scale           = (doc.internal.pageSize.width-margin*2)/document.body.clientWidth;
        var scale_mobile    = (doc.internal.pageSize.width-margin*2)/document.body.getBoundingClientRect();
        
        //checking
        if (/Android|webOS|iPhone|iPad|/i.test(navigator.userAgent)) {
            //mobile
            doc.html(mainTable,{x:margin,y:margin,html2canvas:{sacale:scale_mobile},
                callback:function(doc){
                    doc.output('dataurlnewwindow',{filename:'pdfElito.pdf'});
                }
            })
        } else {
            //pc
            doc.html(mainTable,{x:margin,y:margin,html2canvas:{sacale:scale},
                callback:function(doc){
                    doc.output('dataurlnewwindow',{filename:'pdfElito.pdf'});
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
    */
}

let objetosLS =''
let editEstado = false

function pintarFilas(e){
    let tarjetaSerie =[]
    tabla.innerHTML=''
    e.preventDefault()
    try {
        if (!editEstado) {
            generaSerie(tarjetaSerie)
            console.log('dentro de funcion pintarFilas()')
    
            objetosLS.forEach(producto=>{
        
                let fila = document.createElement('tr')    
                fila.innerHTML = `
                                <td>${producto.serie}</td><td>${producto.modelo}</td><td>${producto.color}</td><td>${producto.suela}</td><td><input class ="talla" value="${producto.talla}"></td>                    
                                `
                tabla.appendChild(fila)
            });
            editEstado=true
        } else {
            tabla.innerHTML=''
            console.log('dentro del')
            objetosLS.forEach(producto=>{
                
                fila = document.createElement('tr')    
                fila.innerHTML = `
                                <td>${producto.serie}</td><td>${producto.modelo}</td><td>${producto.color}</td><td>${producto.suela}</td><td><input class ="talla" value="${producto.talla}"></td>                    
                                `
                tabla.appendChild(fila)
            });
        }
        
    } catch (error) {
        console.log(error)
    }
    btnActualizar.addEventListener('click',actualizaTallas)
    
}

function generaSerie(tarjetaSerie){
    console.log('dentro de funcion generaSerie():')
    let pares = formulario['pares'].value
    let serie = formulario['serie'].value
    let modelo = formulario['modelo'].value
    let color = formulario['color'].value
    let suela = formulario['suela'].value
    let talla = formulario['talla'].value

    console.log('antes del form:',serie);
    let contador=1
    
    do {
        let objeto = {}
        objeto.serie=serie+':'+contador
        objeto.modelo=modelo
        objeto.color=color
        objeto.suela=suela
        objeto.talla=talla
        tarjetaSerie.push(objeto)
        contador++
        
    } while (contador<Number(pares)+1);
    console.log('objeto generado:',tarjetaSerie)
    sincronizarLocalStorage(tarjetaSerie)
    
}

function actualizaTallas(e){
    e.preventDefault()
    //let inputTallas=''
    let inputTallas = document.querySelectorAll('.talla')

    console.log(inputTallas)

    let objetosLSModificado=objetosLS.map((product,i)=>{
        product.talla = inputTallas[i].value  
    })

    console.log('tarjetaSerie modificado:',objetosLS)
    sincronizarLocalStorage(objetosLSModificado)
}

function sincronizarLocalStorage(objetos){
    
    localStorage.removeItem('tarjetaSerie');
    localStorage.setItem('tarjetaSerie',JSON.stringify(objetos))
    objetosLS=JSON.parse(localStorage.getItem('tarjetaSerie'))
}




