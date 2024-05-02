//selectores

const form = document.getElementById('transaccionForm')
const btnGenerarReporte = document.getElementById('btnGenerarReporte');



// Definir una clase para representar las transacciones
class Transaccion {
    constructor(tipo, monto) {
        this.tipo = tipo; // Ingreso o Egreso
        this.monto = monto;
        this.fecha = new Date();
    }
}

// Definir una clase para manejar el estado de cuenta
class EstadoCuenta {
    constructor(saldoInicial) {
        this.saldoInicial = saldoInicial;
        this.saldoActual = 0;
        this.transacciones = [];
    }

    // Método para agregar una transacción al estado de cuenta
    agregarTransaccion(transaccion) {
        this.transacciones.push(transaccion);
        if (transaccion.tipo === 'Ingreso') {
            this.saldoActual += Number(transaccion.monto);
            const inpSaldoActual = document.getElementById('saldoFinalValor');
            inpSaldoActual.textContent = this.saldoActual
        } else if (transaccion.tipo === 'Egreso') {
            this.saldoActual -= Number(transaccion.monto);
            const inpSaldoActual = document.getElementById('saldoFinalValor');
            inpSaldoActual.textContent = this.saldoActual
        }
        console.log('transaccion:', this.transacciones);
    }

    // Método para generar un reporte al final del mes
    generarReporte() {
        const saldoFinal = this.saldoActual;
        console.log('Reporte de Estado de Cuenta:');
        console.log('Saldo Inicial:', this.saldoInicial);
        console.log('Saldo Inicial:', this.transacciones);
        console.log('Saldo Final:', this.saldoActual);

    }
}

// Crear una instancia de EstadoCuenta con un saldo inicial
/*
const cuenta = new EstadoCuenta(1000);
// Ejemplo de uso: registrar algunas transacciones
const ingreso1 = new Transaccion('Ingreso', 500);
const egreso1 = new Transaccion('Egreso', 200);
const ingreso2 = new Transaccion('Ingreso', 800);
cuenta.agregarTransaccion(ingreso1);
cuenta.agregarTransaccion(egreso1);
cuenta.agregarTransaccion(ingreso2);
*/

//listeners

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('tipoTransaccion', form['tipoTransaccion'].value)
    console.log('montoTransaccion', form['montoTransaccion'].value)
    let transaccion1 = new Transaccion(form['tipoTransaccion'].value, form['montoTransaccion'].value)
    console.log('transaccion1', transaccion1)
    
    let cuenta = new EstadoCuenta(900)
    cuenta.agregarTransaccion(transaccion1)
})



btnGenerarReporte.addEventListener('click', () => {
    cuenta = new EstadoCuenta(900)
    cuenta.generarReporte();
})

//cuenta.generarReporte();
// Generar el reporte al final del mes
