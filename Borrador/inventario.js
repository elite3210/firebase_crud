const barCode = document.getElementById('barcode')
barCode.addEventListener('keypress',(e)=>{
    
    if(e.key==='Enter'){
        e.preventDefault()
        console.log('presionaste la tecla Enter, y te encuentras dentro del buble if')
        let codigoBarras=barCode.value
        console.log('el texto que escribiste es: ',codigoBarras)
        barCode.select()

    }

})