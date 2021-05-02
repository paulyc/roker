

function Operator(op) {
    this.op = op;
}
Operator.prototype.execute = function(lhs,rhs) {};
function Add() {
    Operator.call(this, '+');
}
Object.setPrototypeOf(Add.prototype, Operator.prototype);
function Subtract() {
    Operator.call(this, '-');
}
Object.setPrototypeOf(Subtract.prototype, Operator.prototype);
function Multiply() {
    Operator.call(this, '*');
}
Object.setPrototypeOf(Multiply.prototype, Operator.prototype);
function Divide() {
    Operator.call(this, '/');
}
Object.setPrototypeOf(Divide.prototype, Operator.prototype);
function Unit(symbol, exponent, def) {
    this.symbol = 'symbol' === typeof symbol ? symbol : Symbol.for(symbol);
    this.exponent = exponent ?? 0;
}
