export async function htmlToPDF(selector, fileName = `PV${cotizacion.textContent}_${Math.round(celda_total.textContent)}`) {
    console.log('generando pdf...')//crear pdf a partir del lenguaje y no de html
    const areaImpresion = document.querySelector(selector); // <-- Aquí puedes elegir cualquier elemento del DOM

    await html2pdf()
        .set({
            margin: 5,
            filename: fileName,
            //se borro image jpg, averiguar codigo origina en github del cdn html2pdf form['cliente'].value
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
        .from(areaImpresion)
        .save()
        .catch(err => console.log(err));
};
