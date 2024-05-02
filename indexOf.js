let oracion="pienso durante el día en ti, de noche no se vivir, creo que moriria chiquilla mía"

console.log('posicion[]:',oracion.indexOf('ti'));
console.log('posicion[]:',oracion.length);
console.log('posicion[]:',oracion.indexOf('creo'));
console.log('posicion[]:',oracion.indexOf('dia'));
console.log('posicion[]:',typeof(oracion));

var indices = [];
//var array = ['a', 'b', 'a', 'c', 'a', 'd'];
var element = 'a';
var idx = oracion.indexOf(element);
while (idx != -1) {
  indices.push(idx);
  idx = oracion.indexOf(element, idx + 1);
}

console.log('posiciones de letra a:',indices);
// [0, 2, 4]

//oracion.indexOf(searchElement[, fromIndex])


function updateVegetablesCollection (veggies, veggie) {
    if (veggies.indexOf(veggie) === -1) {
        veggies+=` ${veggie}`;
        console.log('La nueva colección de vegetales es: ' + veggies);
    } else if (veggies.indexOf(veggie) > -1) {
        console.log(veggie + ' ya existe en la colección de verduras.');
    }
}

var veggies = ['patata', 'tomate', 'chiles', 'pimientoverde'];
console.log('veggies:',veggies);
updateVegetablesCollection(oracion, 'idea'); 
updateVegetablesCollection(oracion, 'chiquilla'); 
// La nueva colección de verduras es : patata, tomate, chiles, pimientoverde, espinaca
//console.log('veggies:',veggies);
updateVegetablesCollection(oracion, 'chiquilla');  
updateVegetablesCollection(oracion, 'espinaca'); 

// La espinaca ya existe en la colección de verduras.


//indexOf() vs Search():

var str = "friends say Hello";

var substr = "Hello";		
var index = str.indexOf(substr);
if(index!=-1)
	document.write(substr + "[indexOF()] found at " + index + " position.<br>");
else
	document.write(substr + "[indexOF()] does not exist in the " + str + ".<br>");

var substr = "Hello";		
var index = str.search(substr);
if(index!=-1)
	document.write(substr + "[Search()] found at " + index + " position.<br>");
else
	document.write(substr + "[Search()] does not exist in the " + str + ".<br>");

substr = "Hi";
index = str.indexOf(substr);		
if(index!=-1)
	document.write(substr + "[indexOF()] found at " + index + " position.<br>");
else
	document.write(substr + "[indexOF()] does not exist in the " + str + ".<br>");

substr = "Hi";
index = str.search(substr);		
if(index!=-1)
	document.write(substr + "[Search()] found at " + index + " position.<br>");
else
	document.write(substr + "[Search()] does not exist in the " + str + ".<br>");