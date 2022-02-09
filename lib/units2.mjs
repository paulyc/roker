
export function x(val){
	const obj=this instanceof x?this:Object.create(x.prototype);
	obj.val=val;
	return obj;
}

export function kilogram(value){
	return new baseunit('mass',kilogram,value);
}
kilogram.valueToBase   = x=>x;
kilogram.valueFromBase = x=>x;

export function gram(value){
	return new baseunit('mass',gram,value);
}
gram.valueToBase   = x=>x/1000;
gram.valueFromBase = x=>x*1000;

function baseunit(quantityMeasured,unit,value){
	this.quantityMeasured = quantityMeasured;
	this.unit=unit;
	this.value=value instanceof baseunit ? unit.valueFromBase(+value) : value;
}
baseunit.prototype = {
	constructor: baseunit,
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
