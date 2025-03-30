export function translateDate(fecha = Date.now()) {
    
    let date = new Date(fecha + 'T12:00:00Z')
    
    
    if (date.getMonth() < 9 && date.getDate() < 10) {
        //console.log('...date if:',date);
        return `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
    } else if (date.getMonth() < 9 && date.getDate() >= 10) {
        //console.log('...date if1:',date);
        return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
    } else if (date.getMonth() >= 9 && date.getDate() < 10) {
        //console.log('...date if2:',date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`;
    } else {
        date = new Date(fecha)
        date.toLocaleDateString()
        console.log('...date else:',date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
};

//let date = new Date(fecha + 'T12:00:00Z')
