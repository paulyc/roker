// Copyright (C) 2021 Paul Ciarlo <paul.ciarlo@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export {TempUnit, DegF, DegC};

function ValueToInteger(value) {
    switch (typeof value) {
    case 'number':
        return Math.round(value);
    case 'string':
        return Number.parseInt(value);
    case 'object':
        //convert from type
        throw new TypeError(`${name}: convert from object not implemented`);
    default:
        throw new TypeError(`${name}: convert from ${typeof value} not implemented`);
    }
}
function ValueToFloat(value) {
    switch (typeof value) {
    case 'number':
        return value;
    case 'string':
        value = Number.parseFloat(value);
        break;
    case 'object':
        //convert from type
        throw new TypeError(`${name}: convert from object not implemented`);
    default:
        throw new TypeError(`${name}: convert from ${typeof value} not implemented`);
    }
}
function MakeIntegerUnit(name, symstr, baseUnitValue){
    return function(value) {

    };
}

function MakeUnit(name, shortName, baseUnitValue) {
    return function(value) {
        return {
            unit: new BaseUnit(name, shortName),
            value: ValueToFloat(value),
            valueOf: function() {
                return this.value;
            },
            [Symbol.toPrimitive]: function (hint) {
                switch (hint) {
                    case 'string':
                        return `${this.valueOf()} ${symstr}`;
                    case 'number':
                    case 'default':
                    default:
                        return this.valueOf();
                }
            },
            get [Symbol.species]() {
                return Number;
            },
            get [Symbol.toStringTag]() {
                return name;
            },
            get unit() {
                return unit;
            },
        };
    }
}

const Kilogram = MakeUnit('kilogram', 'kg');

function ValueBox(value, unit) {
    this.value = value;
    this.unit = unit;
}
ValueBox.prototype.valueOf = function() {
    return this.value;
};
ValueBox.prototype[Symbol.toPrimitive] = function (hint) {
    switch (hint) {
    case 'string':
        return `${this.valueOf()} ${symstr}`;
    case 'number':
    case 'default':
    default:
        return this.valueOf();
    }
};

function BaseUnit(name, shortName, baseUnit) {
    this.name = name;
    this.shortName = shortName;
    this.baseUnit = baseUnit;
}
BaseUnit.prototype.sym = function () {
    return Symbol.for(this.constructor.name);
};
function TempUnit(value) {
    BaseUnit.call(this, value);
}
Object.setPrototypeOf(TempUnit.prototype, BaseUnit.prototype);

function DegF(value) {
    TempUnit.call(this, value);
}
Object.setPrototypeOf(DegF.prototype, TempUnit.prototype);
DegF.prototype.convertTo = function (u) {
    switch (u) {
    case DegC:
        return new DegC(5.0 / 9.0 * (this.val - 32.0));
    default:
        throw new TypeError();
    }
};
DegF.prototype.toString = function () {
    return `${this.value} F`;
};

function DegC(value) {
    TempUnit.call(this, value);
}
Object.setPrototypeOf(DegC.prototype, TempUnit.prototype);
DegC.prototype.convertTo = function (u) {
    switch (u) {
    case DegF:
        return new DegF(this.val * 9.0 / 5.0 + 32.0);
    default:
        throw new TypeError();
    }
};
DegC.prototype.toString = function () {
    return `${this.value} C`;
};
