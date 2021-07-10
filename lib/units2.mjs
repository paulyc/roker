function identity(){return this.value;}
function massunit(unit,value){
	if ('object' === typeof value) {
		value=unit.fromBaseValue(+value);
	}
	return {
		get [Symbol.toStringTag]() {
			return unit.name;
		},
		[Symbol.toPrimitive](hint) {
			switch(hint){
			case 'number':
				return this.valueOf();
			case 'default':
			default:

			case 'string':
				return this.toString();
			}
		},
		toString(){
			return value + ' ' + unit.name;
		},
		unit,
		value,
		baseunit: kilogram,
		valueOf() {
			return unit.toBaseValue(value);
		},
	};
}

export function kilogram(value){
	return massunit(kilogram,value);
}
kilogram.toBaseValue   = x=>x;
kilogram.fromBaseValue = x=>x;

export function gram(value){

	return massunit(gram,value);
}
gram.toBaseValue   = x=>x/1000;
gram.fromBaseValue = x=>x*1000;
