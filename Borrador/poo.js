class Persona{
    constructor(name,edad){
        this.nombre= name;
        //this.apellido= lastName;
        this.edad = edad;
        
    }
    presentarse(){
        return `Hola mi nombre ${this.nombre} y tengo ${this.edad} años`
    }
}

const persona1 = new Persona('Angela',26)
const persona2 = new Persona('Rocio',50)

console.log(persona1.presentarse())
console.log(persona2.presentarse())


class Tabla{
    constructor(array,padreHTML){
        

    }
}