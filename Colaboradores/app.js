class MovimientoFinanciero {
    constructor(inicial) {
        this.saldoInicial = inicial;
        this.movimientos = [];
    }

    registrarMovimiento(tipo, monto) {
        if (isNaN(monto) || monto <= 0) {
            alert('Ingresa un monto válido mayor que cero.');
            return;
        }

        if (tipo === 'ingreso') {
            this.saldoInicial += monto;
        } else if (tipo === 'egreso') {
            if (monto > this.saldoInicial) {
                alert('No puedes retirar más dinero del que tienes.');
                return;
            }
            this.saldoInicial -= monto;
        }

        const movimiento = {
            tipo: tipo,
            monto: monto
        };

        this.movimientos.push(movimiento);
        this.actualizarEstadoCuenta();
    }

    actualizarEstadoCuenta() {
        const estadoCuenta = document.getElementById('estadoCuenta');
        estadoCuenta.innerHTML = '';

        const saldoFinal = this.saldoInicial;
        const saldoInicialHTML = `<p>Saldo Inicial: S/${this.saldoInicial.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoInicialHTML;

        this.movimientos.forEach((movimiento, index) => {
            const movimientoHTML = `<p>Movimiento ${index + 1}: ${movimiento.tipo.toUpperCase()} - S/${movimiento.monto.toFixed(2)}</p>`;
            estadoCuenta.innerHTML += movimientoHTML;
        });

        const saldoFinalHTML = `<p>Saldo Final: S/${saldoFinal.toFixed(2)}</p>`;
        estadoCuenta.innerHTML += saldoFinalHTML;
    }
}




const movimientoFinanciero = new MovimientoFinanciero();

document.getElementById('registrarBtn').addEventListener('click', () => {
    const tipoMovimiento = document.getElementById('tipoMovimiento').value;
    const monto = parseFloat(document.getElementById('monto').value);

    movimientoFinanciero.registrarMovimiento(tipoMovimiento, monto);
});

