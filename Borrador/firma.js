//selector de elemnto y contexto

const mainCanvas = document.getElementById('main-canvas');
const favColor = document.getElementById('favColor');
const favGrosor = document.getElementById('favNumber');
const btnSave = document.getElementById('save');
const btnPrint = document.getElementById('print');
const btnClear = document.getElementById('btnClear');

btnSave.addEventListener('click', guardarImagen)
btnPrint.addEventListener('click', imprimirImagen)
btnClear.addEventListener('click', clearCanvas)

mainCanvas.addEventListener('mousedown', dibujarLinea);
mainCanvas.addEventListener('touchstart', dibujarLineaTouch);
mainCanvas.addEventListener('mouseup', mouseUp);

const ctx = mainCanvas.getContext('2d');
let initialX;
let initialY;

function dibujarLinea(e) {
    initialX = e.offsetX;
    initialY = e.offsetY;
    console.log('(x,y):',initialX,initialY);
    dibujarPunto(initialX, initialY);
    mainCanvas.addEventListener('mousemove', mouseMoving)
    //mainCanvas.addEventListener('touchmove', touchMoving)
};

function dibujarLineaTouch(e) {
    initialX = e.targetTouches[0].pageX+54;
    initialY = e.targetTouches[0].pageY-321;
    console.log('(X,Y):',initialX,initialY);
    dibujarPuntoTouch(initialX, initialY);
    //mainCanvas.addEventListener('mousemove', mouseMoving)
    mainCanvas.addEventListener('touchmove', touchMoving)
};

function dibujarPunto(cursorX, cursorY) {
    ctx.beginPath();//permite incicar un nuevo trazo de dibujo
    ctx.moveTo(initialX, initialY);//movemos las cordenadas  a las iniciales a initialX, Y
    ctx.lineWidth = favGrosor.value;//grosor de la linea del pincel
    ctx.strokeStyle = favColor.value;//color de la linea
    ctx.lineCap = "round";//forma del prinmcel nivel de bordes
    ctx.lineJoin = "round";//forma de pincel a nivel de terminacion
    ctx.lineTo(cursorX, cursorY);//mover el trazo a la posicion que estoy recibiendo al llamar a la funcion, desde initail x,y hasta curso x,y
    ctx.stroke();//para dibujarPunto el trazo se llama a esta funcion
    initialX = cursorX;//a medida que vayamos moviendo el mouse se actualizas las coordenadas
    initialY = cursorY;
};

function dibujarPuntoTouch(cursorX, cursorY) {
    ctx.beginPath();//permite incicar un nuevo trazo de dibujo
    ctx.moveTo(initialX, initialY);//movemos las cordenadas  a las iniciales a initialX, Y
    ctx.lineWidth = favGrosor.value;//grosor de la linea del pincel
    ctx.strokeStyle = favColor.value;//color de la linea
    ctx.lineCap = "round";//forma del prinmcel nivel de bordes
    ctx.lineJoin = "round";//forma de pincel a nivel de terminacion
    ctx.lineTo(cursorX, cursorY);//mover el trazo a la posicion que estoy recibiendo al llamar a la funcion, desde initail x,y hasta curso x,y
    ctx.stroke();//para dibujarPunto el trazo se llama a esta funcion
    initialX = cursorX;//a medida que vayamos moviendo el mouse se actualizas las coordenadas
    initialY = cursorY;
};

function mouseMoving(e) {
    dibujarPunto(e.offsetX, e.offsetY);
}

function touchMoving(e) {
    e.preventDefault()
    dibujarPuntoTouch(Math.round(e.targetTouches[0].pageX+54),Math.round(e.targetTouches[0].pageY-321));
}

function mouseUp(e) {
    mainCanvas.removeEventListener('mousemove', mouseMoving)
    //mainCanvas.removeEventListener('touchmove', mouseMoving)
}

function guardarImagen() {//se guarda la imagen del camvas en .png
    let imagen = mainCanvas.toDataURL();
    let link = document.createElement('a');
    link.href = imagen;
    link.download = "firma";
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    //window.location.href=imagen;
}

function imprimirImagen() {//imprime todo el body
    console.log('dentrod de imprimir...')

    //let body = document.getElementById('body').innerHTML;
    //let data = document.getElementById('main-container').innerHTML;
    //document.getElementById('body').innerHTML=data;
    //alert(data);
    window.print();
    //document.getElementById('body').innerHTML=body;
}

function clearCanvas() {
    ctx.fillStyle='white';
    ctx.fillRect(0,0,500,500);
    console.log('limpiando canvas...')
}