class Transaccion {
    constructor(fecha, descripcion, monto, tipo) {
        this.fecha          = fecha;
        this.descripcion    = descripcion;
        this.monto          = monto;
        this.tipo           = tipo; // "Ingreso" o "Egreso"
    }
}

class EstadoCuenta {
    constructor() {
        this.transacciones = [];
    }

    agregarTransaccion(transaccion) {
        this.transacciones.push(transaccion);
    }

    calcularSaldoMensual() {
        let saldo = 0;
        for (const t of this.transacciones) {
            if (t.tipo === "Ingreso") {
                saldo += t.monto;
            } else {
                saldo -= t.monto;
            }
        }
        return saldo;
    }

    mostrarTransacciones() {
        for (const t of this.transacciones) {
            console.log(`Fecha: ${t.fecha}, Descripción: ${t.descripcion}, Monto: ${t.monto}, Tipo: ${t.tipo}`);
        }
    }
}

// Ejemplo de uso
const miEstadoCuenta = new EstadoCuenta();
const transaccion1 = new Transaccion("2024-04-01", "Salario", 3000, "Ingreso");
const transaccion2 = new Transaccion("2024-04-15", "Alquiler", 1000, "Egreso");

miEstadoCuenta.agregarTransaccion(transaccion1);
miEstadoCuenta.agregarTransaccion(transaccion2);

console.log("Estado de Cuenta:");
miEstadoCuenta.mostrarTransacciones();
console.log(`Saldo Mensual: $${miEstadoCuenta.calcularSaldoMensual()}`);
