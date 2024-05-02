class CalculatorModel {
    constructor() {
        this.currentString = '';
        this.currentValue = null;
        this.pendingValue = null;
        this.operation = null;
        this.equal = true;
    }

    pressNumber(number) {
        if (this.currentValue === null) {
            this.currentValue = number;
            this.currentString = String(number);

        } else {
            // Si ya hay un valor, se asume que el usuario ingresará una nueva operación o continuará ingresando números
            if (this.operation === null) {
                this.currentValue = this.currentValue * 10 + number;
                this.currentString = String(number); //al numero en memoria se multiplica por 10 para convertirlo en decena y sumar la unidad asi se convierte un numero de mas cifras Asumiendo una calculadora básica sin punto decimal
            } else {
                if (this.pendingValue === null) {
                    this.pendingValue = number;
                    this.currentString = String(number);
                } else {
                    this.pendingValue = this.pendingValue * 10 + number;
                    this.currentString = String(number);
                }
            }
        }
    }

    pressOperation(operation) {
        if (this.operation !== null && this.pendingValue !== null) {
            this.calculate();
        }
        this.operation = operation;
    }

    calculate() {
        if (this.pendingValue === null) {
            return;
        }
        if (this.operation === '+') {
            this.currentValue += this.pendingValue;
            this.currentString += String('+');
        } else if (this.operation === '-') {
            this.currentValue -= this.pendingValue;
            //this.currentString += String('-');
        } else if (this.operation === '*') {
            this.currentValue *= this.pendingValue;
           //this.currentString += String('*');
        } else if (this.operation === '/') {
            this.currentValue /= this.pendingValue;
            //this.currentString += String('/');
        } else if (this.operation === '^') {
            this.currentValue = Math.pow(this.currentValue, this.pendingValue);
            //this.currentString += String('^');
        } else if (this.operation === '%') {
            this.currentValue *= this.pendingValue/100;
            //this.currentString += String('%');
        }

        this.pendingValue = null; // Resetear el valor pendiente
        this.operation = null; // Resetear la operación
        this.currentString= ''; // Resetear la operación
    }

    getCurrentValue() {
        if (this.operation !== null) {
            return this.pendingValue;
        } else {
            return this.currentValue;
        }
    }

    getCurrentString() {
        return this.currentString;
    }

    reset() {
        this.currentValue = null;
        this.pendingValue = null;
        this.operation = null;
        this.currentString= '';
    }
}

class CalculatorView {
    constructor() {
        this.display = document.getElementById('display');
        this.displayBottom = document.getElementById('displayBottom');
        this.key0 = document.getElementById('key0');
        this.key1 = document.getElementById('key1');
        this.key2 = document.getElementById('key2');
        this.key3 = document.getElementById('key3');
        this.key4 = document.getElementById('key4');
        this.key5 = document.getElementById('key5');
        this.key6 = document.getElementById('key6');
        this.key7 = document.getElementById('key7');
        this.key8 = document.getElementById('key8');
        this.key9 = document.getElementById('key9');
        this.keyPlus = document.getElementById('keyPlus');
        this.keyMinus = document.getElementById('keyMinus');
        this.keyEqual = document.getElementById('keyEqual');
        this.keyClear = document.getElementById('keyClear');
        this.keyMultiply = document.getElementById('keyMultiply');
        this.keyDivide = document.getElementById('keyDivide');
        this.keyPower = document.getElementById('keyPower');
        this.keyPercentage = document.getElementById('keyPercentage');
    }

    bindPressNumber(handler) {
        this.key0.addEventListener('click', () => {
            handler(0);
        });

        this.key1.addEventListener('click', () => {
            handler(1);
        });

        this.key2.addEventListener('click', () => {
            handler(2);
        });

        this.key3.addEventListener('click', () => {
            handler(3);
        });

        this.key4.addEventListener('click', () => {
            handler(4);
        });

        this.key5.addEventListener('click', () => {
            handler(5);
        });

        this.key6.addEventListener('click', () => {
            handler(6);
        });

        this.key7.addEventListener('click', () => {
            handler(7);
        });

        this.key8.addEventListener('click', () => {
            handler(8);
        });

        this.key9.addEventListener('click', () => {
            handler(9);
        });
    }

    bindPressOperation(handler) {
        this.keyPlus.addEventListener('click', () => {
            handler('+');
        });

        this.keyMinus.addEventListener('click', () => {
            handler('-');
        });

        this.keyMultiply.addEventListener('click', () => {
            handler('*');
        });

        this.keyDivide.addEventListener('click', () => {
            handler('/');
        });

        this.keyPower.addEventListener('click', () => {
            handler('^');
        });

        this.keyPercentage.addEventListener('click', () => {
            handler('%');
        });
    }

    bindCalculate(handler) {
        this.keyEqual.addEventListener('click', () => {
            handler();
        });
    }

    bindReset(handler) {
        this.keyClear.addEventListener('click', () => {
            handler();
        });
    }

    updateDisplay(value) {
        this.display.value += String(value);
    }
    updateDisplayBottom(value) {
        this.displayBottom.value = value;
    }
}

/*
class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindPressNumber(this.handlePressNumber);
        this.view.bindPressOperation(this.handlePressOperation);
        this.view.bindCalculate(this.handleCalculate);

        this.updateDisplay();
    }

    handlePressNumber = (number) => {
        this.model.pressNumber(number);
        this.updateDisplay();
    }

    handlePressOperation = (operation) => {
        this.model.pressOperation(operation);
    }

    handleCalculate = () => {
        this.model.calculate();
        this.updateDisplay();
    }

    updateDisplay() {
        this.view.updateDisplay(this.model.getCurrentValue());
    }
}
*/

class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindPressNumber(this.handlePressNumber);
        this.view.bindPressOperation(this.handlePressOperation);
        this.view.bindCalculate(this.handleCalculate);
        this.view.bindReset(this.handleReset); // Si decides añadir un botón de reset

        this.updateDisplay();
        this.updateDisplayBottom();
    }

    handlePressNumber = (number) => {
        this.model.pressNumber(number);
        this.updateDisplay();
    }

    handlePressOperation = (operation) => {
        this.model.pressOperation(operation);
    }

    handleCalculate = () => {
        this.model.calculate();
        this.updateDisplayBottom();
    }

    handleReset = () => {
        this.model.reset();
        this.updateDisplay();
        this.updateDisplayBottom();
    }

    updateDisplay() {
        this.view.updateDisplay(this.model.getCurrentString() ?? 0); // Mostrar 0 si no hay valor
    }
    updateDisplayBottom() {
        this.view.updateDisplayBottom(this.model.getCurrentValue() ?? ''); // Mostrar 0 si no hay valor
    }
}

/*
class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindPressNumber(this.handlePressNumber);//recibe una funcion como argumento
        this.view.bindPressOperation(this.handlePressOperation);
        this.view.bindCalculate(this.handleCalculate);

        this.updateDisplay();
    }

    handlePressNumber = (number) => {
        this.model.pressNumber(number);
        this.updateDisplay();  // Actualiza la pantalla cada vez que se presiona un número
    }

    handlePressOperation = (operation) => {
        this.model.pressOperation(operation);
        this.updateDisplayOperation();  // Actualización específica para mostrar que la operación está en curso
    }

    handleCalculate = () => {
        this.model.calculate();
        this.updateDisplay();  // Muestra el resultado final
    }

    updateDisplay() {
        this.view.updateDisplay(this.model.getCurrentValue() ?? 0); // Mostrar 0 si no hay valor
    }

    updateDisplayOperation() {
        // Muestra 0 o el valor pendiente para indicar que la operación está en espera de un segundo número
        this.view.updateDisplay(this.model.pendingValue ?? this.model.currentValue ?? 0);
    }
}
*/

const model = new CalculatorModel();
const view = new CalculatorView();
const controller = new CalculatorController(model, view);
