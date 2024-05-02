
class Transaccion {
    constructor(tipoMovimiento, monto) {
        this.tipo = tipoMovimiento;
        this.monto = monto;
        this.fecha = new Date();
    }
}


class EstadoCuenta {
    constructor() {
        this.saldoInicial = 0;
        this.transacciones = []
    }

    agregarTransaccion() {
        const tipoMovimiento = document.getElementById('tipoMovimiento').value;
        const monto = parseFloat(document.getElementById('monto').value);

        if (isNaN(monto) || monto <= 0) {
            alert('Ingresa un monto válido mayor que cero.');
            return;
        }

        const transaccion=new Transaccion(tipoMovimiento,monto)

        this.transacciones.push(transaccion);
        this.actualizarEstadoCuenta();
    }

    actualizarEstadoCuenta() {
        let saldo = this.saldoInicial;
        const estadoCuenta = document.getElementById('estadoCuenta');
        estadoCuenta.innerHTML = '';

        const saldoInicialHTML = `<p>Saldo Inicial: $${this.saldoInicial.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoInicialHTML;

        this.transacciones.forEach((movimiento, index) => {
            if (movimiento.tipo === 'ingreso') {
                saldo += movimiento.monto;
            } else if (movimiento.tipo === 'egreso') {
                saldo -= movimiento.monto;
            }

            const movimientoHTML = `<p>${this.pintarFecha()} Movimiento ${index + 1}: ${movimiento.tipo.toUpperCase()} - $${movimiento.monto.toFixed(2)}</p>`;
            estadoCuenta.innerHTML += movimientoHTML;
        });

        const saldoFinalHTML = `<p>Saldo Final: $${saldo.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoFinalHTML;
    }

    pintarFecha() {
        let date = new Date(Date.now())
        if (date.getMonth()<10 && date.getDate()<10 ) {
            let fecha=`0${date.getDate()}/0${date.getMonth() +1}/${date.getFullYear()}`
            
            return fecha;
        } else {
            let fecha = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`;
            return fecha;
        }
        
    }
}

const estadoCuenta = new EstadoCuenta();

