
export function x(val){
	const obj=this instanceof x?this:Object.create(x.prototype);
	obj.val=val;
	return obj;
}

export function kilogram(value){
	return new massunit(kilogram,value);
}
kilogram.valueToBase   = x=>x;
kilogram.valueFromBase = x=>x;

export function gram(value){
	return new massunit(gram,value);
}
gram.valueToBase   = x=>x/1000;
gram.valueFromBase = x=>x*1000;

function massunit(unit,value){
	this.unit=unit;
	this.value=value instanceof massunit ? unit.valueFromBase(+value) : value;
}
massunit.prototype = {
	constructor: massunit,
	get [Symbol.toStringTag]() {
		return this.unit.name;
	},
	[Symbol.toPrimitive](hint) {
		switch(hint){
		case 'number':
			return this.valueOf();
		case 'string':
		case 'default':
		default:
			return this.toString();
		}
	},
	toString(){
		return this.value + ' ' + this.unit.name;
	},
	baseunit: kilogram,
	valueOf() {
		return this.unit.valueToBase(this.value);
	},
};
