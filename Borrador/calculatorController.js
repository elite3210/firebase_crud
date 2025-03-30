class CalculatorModel {
    constructor() {
        this.toggle = true;
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
            //console.log('this.currentString:',this.currentString);
            //console.log('this.currentValue:',this.currentValue);
        } else {
            // Si ya hay un valor, se asume que el usuario ingresará una nueva operación o continuará ingresando números
            if (this.operation === null) {
                this.currentValue = this.currentValue * 10 + number;
                this.currentString += String(number); //al numero en memoria se multiplica por 10 para convertirlo en decena y sumar la unidad asi se convierte un numero de mas cifras Asumiendo una calculadora básica sin punto decimal
                //console.log('this.currentString:',this.currentString);
                //console.log('this.currentValue:',this.currentValue);
            } else {
                if (this.pendingValue === null) {
                    this.pendingValue = number;
                    this.currentString += String(number);
                    //console.log('this.currentString:',this.currentString);
                    //console.log('this.currentValue:',this.currentValue);
                } else {
                    this.pendingValue = this.pendingValue * 10 + number;
                    this.currentString += String(number);
                    //console.log('this.currentString:',this.currentString);
                    //console.log('this.currentValue:',this.currentValue);
                }
            }
        }
    }
    

    pressOperation(operation) {
        if (this.operation !== null && this.pendingValue !== null) {//si hay un operador y un valor adicional realiza calculo
            this.calculate();
        }
        this.operation = operation;
        this.currentString += operation;
        //console.log('*pressO this.currentString:',this.currentString);
        //console.log('*pressO this.currentValue:',this.currentValue);
    }

    calculate() {
        if (this.pendingValue === null) {
            console.log('this.pendingValue === null...return');
            return;
        }
        /*
        if (this.operation === '+') {
            this.currentValue += this.pendingValue;
        } else if (this.operation === '-') {
            this.currentValue -= this.pendingValue;           
        } else if (this.operation === '*') {
            this.currentValue *= this.pendingValue;
        } else if (this.operation === '/') {
            this.currentValue /= this.pendingValue;           
        } else if (this.operation === '^') {
            this.currentValue = Math.pow(this.currentValue, this.pendingValue);           
        } else if (this.operation === '%') {
            this.currentValue *= this.pendingValue/100;           
        }
        */
        

        switch (this.operation) {
            case '+': this.currentValue += this.pendingValue; break;     
            case '-': this.currentValue -= this.pendingValue; break;     
            case '*': this.currentValue *= this.pendingValue; break;     
            case '/': this.currentValue /= this.pendingValue; break;     
            case '^': this.currentValue = Math.pow(this.currentValue, this.pendingValue); break;     
            case '%': this.currentValue = this.currentValue *= this.pendingValue/100; break;     
            default: break;
        }

        this.pendingValue = null; // Resetear el valor pendiente
        this.operation = null; // Resetear la operación
        //this.currentString= String(this.currentValue); // Resetear la operación
        //console.log('keyPress =');
    }

    getCurrentValue() {
        if (this.operation !== null && this.toggle) {//si se presionó una tecla de operacion
            return this.pendingValue;
        } else if (this.operation === null && !(this.toggle)) {//si se presionó una tecla de operacion
            this.toggle=true;
            console.log('se presiono tecla igual....');
            this.currentString=String(this.currentValue);
            console.log('this.currentString:',this.currentString);
            return this.currentString;

        } else {//si aun no se presiono tecla operacion
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
};

class CalculatorView {
    constructor() {
        this.display        = document.getElementById('display');
        this.displayBottom  = document.getElementById('displayBottom');
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
        this.keyPlus        = document.getElementById('keyPlus');
        this.keyMinus       = document.getElementById('keyMinus');
        this.keyEqual       = document.getElementById('keyEqual');
        this.keyClear       = document.getElementById('keyClear');
        this.keyMultiply    = document.getElementById('keyMultiply');
        this.keyDivide      = document.getElementById('keyDivide');
        this.keyPower       = document.getElementById('keyPower');
        this.keyPercentage  = document.getElementById('keyPercentage');
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

    updateDisplayTop(value) {
        this.display.value = String(value);
    }

    updateDisplayBottom(value) {
        this.displayBottom.value = value;
    }
};

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
        this.view.bindCalculate(this.handleDisplay);
        this.view.bindReset(this.handleReset); // Si decides añadir un botón de reset

        this.updateDisplayTop();
        this.updateDisplayBottom();
    }

    handlePressNumber = (number) => {
        this.model.pressNumber(number);
        this.updateDisplayTop();
        this.handleCalculate();
        this.updateDisplayBottom();
    }

    handlePressOperation = (operation) => {
        this.model.pressOperation(operation);
        this.updateDisplayTop();
    }

    handleCalculate = () => {
        this.model.calculate();
        
        //console.log('presionaste =');
    }

    handleDisplay = () => {
        this.view.updateDisplayTop(this.model.getCurrentValue() ?? 0); // Mostrar 0 si no hay valor
        this.view.updateDisplayBottom('' ?? ''); // Mostrar 0 si no hay valor
        this.model.toggle=false;
        //this.model.calculate();
        //this.currentString=String(this.currentValue);
        console.log('presionaste =');
        console.log('this.model.toggle',this.model.toggle);
    }

    handleReset = () => {
        this.model.reset();
        this.updateDisplayTop();
        this.updateDisplayBottom();
    }

    updateDisplayTop() {
        this.view.updateDisplayTop(this.model.getCurrentString() ?? ''); // Mostrar 0 si no hay valor
    }

    updateDisplay2() {
        this.view.updateDisplayTop(this.model.getCurrentValue() ?? 0); // Mostrar 0 si no hay valor
    }

    updateDisplayBottom() {
        this.view.updateDisplayBottom(this.model.getCurrentValue() ?? ''); // Mostrar 0 si no hay valor
    }
};

const model = new CalculatorModel();
const view = new CalculatorView();
const controller = new CalculatorController(model, view);
