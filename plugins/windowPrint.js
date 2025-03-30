export function windowPrint(elem){
    let myWindow=window.open('','PRINT','height=600, width=800');
    myWindow.document.write('<html><head><title>' +document.title+ `</title>
        <link rel="stylesheet" href="./modalStyle.css"><!--Bootstrap bs-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://kit.fontawesome.com/434a77214b.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="dataTable.css">`);
    myWindow.document.write('</head><body>');
    //myWindow.document.write('<h1>'+document.title + '</h1>');
    myWindow.document.write(document.getElementById(elem).innerHTML);
    myWindow.document.write('</body></html>');
    
    window.document.close();//necessary for IE>=10
    window.focus(); //necessary for IE>=10*
    window.close();
    //window.print();

}

