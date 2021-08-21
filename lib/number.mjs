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

export function FmtNumber(value, isIntegerOrDecimalPlaces) {
	return {
		value: Number(value),
		decimalPlaces: isIntegerOrDecimalPlaces,
		isInteger: 'boolean' === typeof isIntegerOrDecimalPlaces && isIntegerOrDecimalPlaces,
		valueOf: function () {
			return this.value;
		},
		toString: function () {
			if (this.isInteger) {
				return String(Math.round(this.value));
			} else {
				return this.value.toFixed(this.decimalPlaces);
			}
		},
		[Symbol.toPrimitive]: function (hint) {
			switch (hint) {
			case 'string':
				return this.toString();
			case 'number':
				return this.valueOf();
			case 'default':
			default:
				return this.isInteger ? Math.round(this.valueOf()) : this.valueOf();
			}
		},
		get [Symbol.species]() {
			return Number;
		},
	}
}

//testcases
//FmtNumber(1)+1.5
//FmtNumber(1.5)+''
//FmtNumber(0.4,true)+1
//FmtNumber(0.5,true)+1
//FmtNumber(0.4,true)+''
//FmtNumber(0.5,true)+''
//1.5+FmtNumber(1)
//''+FmtNumber(1.5)
//1+FmtNumber(0.4,true)
//1+FmtNumber(0.5,true)
//''+FmtNumber(0.4,true)
//''+FmtNumber(0.5,true)
