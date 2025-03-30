export function htmlToImage(selector) {
    html2canvas(document.querySelector(selector)).then(function (canvas) {
        // Convertir el canvas a una imagen en formato PNG
        let img = canvas.toDataURL('image/png');

        // Crear un enlace para descargar la imagen
        let link = document.createElement('a');
        link.href = img;
        link.download = 'captura.png';
        link.click();
    });
}