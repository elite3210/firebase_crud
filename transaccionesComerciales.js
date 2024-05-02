/*

class Persona{
    constructor(nombre,nacimiento){
        this.nombrePersona=nombre;
        this.nacimientoPersona=nacimiento;
    };

    calcularEdad(){
        return ` ${this.nacimientoPersona} y tiene una edad de: ${Math.round((new Date(Date.now())- new Date(this.nacimientoPersona))/31557600000)}`
    }
}

class Alumno extends Persona{
    constructor(nombre,nacimiento,matricula){
        super(nombre,nacimiento);
        this.matriculaAlumno=matricula;
    }

    mostrardatosAlumno(){
        console.log(super.calcularEdad);
    }
}


class Profesor extends Persona{
    constructor(nombre,nacimiento){
        super(nombre,nacimiento);
    }

    set sDepartamento(valor){
        this._departamento=valor;
    }

    get gDepartamento(){
        return this.Departamento;
    }

    mostarInformacion(){
        console.log('*',`Profesor Persona: ${super.calcularEdad()} y el departamento es:${this.Departamento} `);
    }

}


let profesor1 = new Profesor('Angela Mendoza','1996-10-20');
profesor1.sDepartamento='CONTABILIDAD';
profesor1.mostarInformacion()
console.log('get:',profesor1.gDepartamento);



//const persona1 = new Persona('Jose Luis','1981-09-03');

//console.log('su edad hast ahora es:',persona1.nombrePersona,persona1.calcularEdad())

//persona1.nombrePersona='Eli Mandujano'
//console.log('su edad hast ahora es:',persona1.nombrePersona,persona1.calcularEdad())

//const alumno1 = new Alumno('Jose Luis','1981-09-03','42231772');

//console.log('su edad hasta ahora es:',alumno1.calcularEdad(), alumno1.matriculaAlumno)
*/


class Model {
    constructor(a, b) {
        this._a = a;
        this._b = b;
    }
    add() {
        return this._a + this._b;
    }
    sub() {
        return this._a - this._b;
    }
}

class View {
    constructor() {
        this._pantalla=document.querySelector('.pantalla');
        this._btn6 = document.querySelector('.btn6');
        this._btn9 = document.querySelector('.btn9');
        this._btnAdd = document.querySelector('.btnAdd');
        this._btnSub = document.querySelector('.btnSub');
        this._btnRes = document.querySelector('.btnRes');
    }
    setValueDisplay(a) {
        console.log('dentro de la vista');
        this._pantalla.value = '';
        this._pantalla.value = this._pantalla.value+a;
    }

    getValuePantalla(){
        return Number(this._pantalla.value);
        //this._pantalla.value = '';
    }
}

class Controller {
    constructor() {
        this.myModel = new Model(0,0);
        this.myView = new View();
    }

    renderController() {
        this.myView.setValueDisplay(this.myModel.add())
    }

}


let array =[];
let operador='';

let vista1 = new View();
vista1._btn6.addEventListener('click',()=>{
    vista1.setValueDisplay(6)
});
vista1._btn9.addEventListener('click',()=>{
    vista1.setValueDisplay(9)
});
vista1._btnAdd.addEventListener('click',()=>{
    operador='add';
    array.push(vista1.getValuePantalla());
});
vista1._btnSub.addEventListener('click',()=>{
    operador='sub';
    array.push(vista1.getValuePantalla());
});
vista1._btnRes.addEventListener('click',()=>{
    if (operador=='add') {
        let model1=new Model(array[0],array[1])
    vista1.setValueDisplay(model1.add())
    } else {
        let model1=new Model(array[0],array[1])
    vista1.setValueDisplay(model1.sub())
    }
    
});



let controller1 = new Controller();
controller1.renderController();


