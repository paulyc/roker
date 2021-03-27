//
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
//

const {
	DegreesCtoF,
	DegreesFtoC,
	SpecificEnthalpyDryAir,
	SpecificEnthalpyH2O,
	HumidityRatio,
	SpecificEnthalpyAir,
} = require('../lib/physics');
const assert = require('assert');

function Test() {
	TestCtoF();
	TestFtoC();
	TestEnthalpy();
};

module.exports = Test;

function TestCtoF() {
	assert.strictEqual(DegreesCtoF(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesCtoF(0).toFixed(1), '32.0');
	assert.strictEqual(DegreesCtoF(10).toFixed(1), '50.0');
	assert.strictEqual(DegreesCtoF(20).toFixed(1), '68.0');
	assert.strictEqual(DegreesCtoF(30).toFixed(1), '86.0');
}
function TestFtoC() {
	assert.strictEqual(DegreesFtoC(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesFtoC(32).toFixed(1), '0.0');
	assert.strictEqual(DegreesFtoC(50).toFixed(1), '10.0');
	assert.strictEqual(DegreesFtoC(68).toFixed(1), '20.0');
	assert.strictEqual(DegreesFtoC(86).toFixed(1), '30.0');
}

function TestEnthalpy() {
	// SpecificEnthalpyAir saturated at 25 c should be about 76.09 kJ/kg
}
