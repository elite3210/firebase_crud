class MovimientoFinanciero {
    constructor() {
        this.saldoInicial = 0;
        this.movimientos = [];
    }

    registrarMovimiento(tipo, monto) {
        if (isNaN(monto) || monto <= 0) {
            alert('Ingresa un monto válido mayor que cero.');
            return;
        }

        const movimiento = {
            tipo: tipo,
            monto: monto
        };

        this.movimientos.push(movimiento);
        this.actualizarEstadoCuenta();
    }

    actualizarEstadoCuenta() {
        let saldo = this.saldoInicial;
        const estadoCuenta = document.getElementById('estadoCuenta');
        estadoCuenta.innerHTML = '';

        const saldoInicialHTML = `<p>Saldo Inicial: $${this.saldoInicial.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoInicialHTML;

        this.movimientos.forEach((movimiento, index) => {
            if (movimiento.tipo === 'ingreso') {
                saldo += movimiento.monto;
            } else if (movimiento.tipo === 'egreso') {
                saldo -= movimiento.monto;
            }

            const movimientoHTML = `<p>Movimiento ${index + 1}: ${movimiento.tipo.toUpperCase()} - $${movimiento.monto.toFixed(2)}</p>`;
            estadoCuenta.innerHTML += movimientoHTML;
        });

        const saldoFinalHTML = `<p>Saldo Final: $${saldo.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoFinalHTML;
    }
}

const movimientoFinanciero = new MovimientoFinanciero();

function registrarMovimiento() {
    const tipoMovimiento = document.getElementById('tipoMovimiento').value;
    const monto = parseFloat(document.getElementById('monto').value);

    movimientoFinanciero.registrarMovimiento(tipoMovimiento, monto);
}