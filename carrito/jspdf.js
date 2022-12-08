var doc = new jsPDF;
        doc.text('Heinz Sport SAC',10,10)
        doc.line(10,10,60,10)
        doc.line(10,11,60,11)
        doc.addPage('a4','l')
       // doc.save('prueba.pdf')

        let arrayObjeto = [
        {
            activo: "undefined",
            categoria: "Piñateria",
            codigo: "undefined",
            precio_anterior: "200",
            descripcion: "Paliglobos desarmables base tra",
            unidad: "Caja",
            color: "Transparente",
            nombre: "Paliglobos desarmables base",
            stock: "2",
            web_site: true,
            imagen: "./carrito/img/paliglobos desarmables base.jpg",
            precio: "180"
        },
        {
            serie: "A54321:0012",
            barcode: "SB0070",
            stock: "780",
            categoria: "Descartables",
            imagen : "./img",
            precio: "13",
            almacen: "Chimpu",
            lote: "A54321",
            descripcion: "Sorbetes clásico surtido",
            unidad: "Planchas",
            size: "22cm",
            activo: "true",
            precio_anterior: "14",
            imagen: "./carrito/img/sorbetes_rayados_clasicos.jpg",
            nombre: "Sorbetes rayados clásico ",
            color: "Surtido",
            codigo: "SB0070",
            web_site: true
        },
        {
            imagen: "./carrito/img/sorbetes_monocolor_clasicos.jpg",
            categoria: "Descartables",
            codigo: "SB0050",
            stock: "20",
            precio: "12.5",
            tienda: "fabrica17",
            nombre: "Sorbete monocolor clasicos",
            color: "Surtido",
            web_site: true,
            activo: "undefined",
            descripcion: "Sorbetes monocolor clásicos",
            precio_anterior: "13",
            modelo: "6009",
            unidad: "Planchas",
            active: true
        },
        {
            tienda: "fabrica17",
            nombre: "Sorbeton recto",
            codigo: "ST0070",
            color: "Surtido",
            active: true,
            web_site: true,
            precio: "32",
            categoria: "Descartables ",
            stock: "110",
            activo: "undefined",
            imagen: "./carrito/img/sorbeton.jpg",
            precio_anterior: "38",
            modelo: "5001",
            descripcion: "Sorbetones corte recto ",
            unidad: "Planchas"
        },
        {
            imagen: "./carrito/img/paliglobos_gruesos40.png",
            precio: "132",
            web_site: true,
            precio_anterior: "142",
            descripcion: "Paliglobos gruesos #40 Trans",
            activo: "undefined",
            active: "",
            nombre: "Paliglobos gruesos #40",
            codigo: "PG0070",
            stock: "90",
            unidad: "Millares",
            color: "Transparente",
            categoria: "Piñateria"
        },
        {
            web_site: true,
            descripcion: "Paliglobos delgados",
            codigo: "PD0070",
            precio_anterior: "42",
            imagen: "./carrito/img/paliglobos_delgados.jpg",
            categoria: "Piñateria",
            unidad: "Millares",
            precio: "39",
            activo: "undefined",
            stock: "100",
            active: "transparente",
            nombre: "Paliglobos delgados",
            color: "Transparente"
        },
        {
            descripcion: "Sorbetes flexibles rayados",
            categoria: "Descartables",
            precio: "31",
            color: "Blanco",
            unidad: "Planchas",
            activo: "undefined",
            modelo: "4005",
            imagen: "./carrito/img/sorbete_flexible_rayado.jpg",
            active: true,
            web_site: true,
            precio_anterior: "32",
            codigo: "SF0010",
            nombre: "Sorbetes flexifles rayados",
            stock: "5"
        },
        {
            nombre: "Polipropileno Virgen Extrusion",
            imagen: "./carrito/img/polipropileno.jpg",
            precio: "",
            categoria: "",
            codigo: "undefined",
            active: "",
            unidad: "",
            activo: "undefined",
            color: "Transparente",
            precio_anterior: "",
            descripcion: "",
            stock: "undefined"
        },
        {
            imagen: "./carrito/img/sorbetes_monocolor_negro.jpg",
            color: "Negro",
            modelo: "3002",
            stock: "102",
            categoria: "Descartables",
            precio_anterior: "13",
            nombre: "Sorbetes monocolor negro",
            codigo: "SB0051",
            active: true,
            precio: "12.5",
            descripcion: "Sorbetes monocolor negro",
            web_site: true,
            unidad: "Planchas",
            activo: "undefined",
            tienda: "fabrica17"
        },
        {
            tienda: "fabrica17",
            active: true,
            precio: "32",
            nombre: "Sorbetes forrados papel",
            imagen: "./carrito/img/sorbetes_forrados_papel.jpg",
            categoria: "Descartables",
            modelo: "7003",
            activo: "undefined",
            stock: "2",
            codigo: "SD0070",
            precio_anterior: "33",
            color: "Blanco",
            descripcion: "Sorbetes Forrados papel",
            web_site: true,
            unidad: "Planchas"
        }
    ]


    

    let sub_producto=arrayObjeto.filter(producto=>producto.color !='Blanco')

    console.log(sub_producto)