function incrementProgress() {
    const progressBar = document.getElementById('progressBar');
    let width = parseInt(progressBar.style.width, 10) || 0;  // Añadido || 0 para manejar el caso inicial

    if (width < 100) {
        width += 10;  // Incrementamos el progreso en 10%
        progressBar.style.width = width + '%';  // Actualizamos el ancho de la barra
        progressBar.textContent = width + '%';  // Actualizamos el texto de la barra
    }
}
