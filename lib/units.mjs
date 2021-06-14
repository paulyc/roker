

function Operator(op) {
    this.op = op;
}
function NoOp() {
    Operator.call(this, 'nop');
}
Object.setPrototypeOf(NoOp.prototype, Operator.prototype);
function BinaryOperator(op) {
    Operator.call(this, op);
}
BinaryOperator.prototype = Object.assign(
    Object.create(Operator.prototype), {
    constructor: BinaryOperator,
});
BinaryOperator.prototype.execute = function(lhs,rhs) {};
function Add() {
    Operator.call(this, '+');
}
Object.setPrototypeOf(Add.prototype, BinaryOperator.prototype);
function Subtract() {
    Operator.call(this, '-');
}
Object.setPrototypeOf(Subtract.prototype, BinaryOperator.prototype);
function Multiply() {
    Operator.call(this, '*');
}
Object.setPrototypeOf(Multiply.prototype, BinaryOperator.prototype);
function Divide() {
    Operator.call(this, '/');
}
Object.setPrototypeOf(Divide.prototype, BinaryOperator.prototype);
function Unit(symbol, exponent, def) {
    this.symbol = 'symbol' === typeof symbol ? symbol : Symbol.for(symbol);
    this.exponent = exponent ?? 0;
}

function BaseUnits() {}
function SIBaseUnits() {

}

SIBaseUnits.prototype = Object.assign(
    Object.create(BaseUnits.prototype), {
    constructor: SIBaseUnits,
    mass: new Unit('kg', 1000, NoOp),
    length: new Unit('m', 1, NoOp),
});
