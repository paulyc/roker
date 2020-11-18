// Copyright (C) 2020 Paul Ciarlo <paul.ciarlo@gmail.com>
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

const assert = require('assert');

/**
 * See Arden Buck equation, accurate in range -80 to 50 C
 * https://en.wikipedia.org/wiki/Arden_Buck_equation
 * Temperatures in Celsius
 */
const StdAtmosphere = 1013.25; // hPa
const ardenBuckParam = (t, params) => Math.exp((params.b - t/params.d)*(t/(params.c+t)));
const gammaFromDewpoint = (dewpoint, params) => (dewpoint * params.b) / (params.c + dewpoint);
// rh = 100.0 * exp(gamma) / ardenBuckParam(temp)
// aBP(temp) * rh/100.0 = exp(gamma)
// gamma = ln(aBP(temp)*rh/100))
const gammaFromRH = (t, rh, params) => Math.log(ardenBuckParam(t, params) * rh/100.0);
const PressureFromDewpoint = (dewpoint, params) => params.a * Math.exp(gammaFromDewpoint(dewpoint, params));
const DewpointFromPressure = (pressure, params) => params.c*Math.log(pressure/params.a)/(params.b - Math.log(pressure/params.a));//dp=c*ln(pressure/a))/(b-ln(pressure/a))
const DegreesCtoF = c => c * 9.0 / 5.0 + 32.0;
const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);

function _test() {
	assert.strictEqual(DegreesCtoF(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesCtoF(0).toFixed(1), '32.0');
	assert.strictEqual(DegreesCtoF(10).toFixed(1), '50.0');
	assert.strictEqual(DegreesCtoF(20).toFixed(1), '68.0');
	assert.strictEqual(DegreesCtoF(30).toFixed(1), '86.0');

	assert.strictEqual(DegreesFtoC(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesFtoC(32).toFixed(1), '0.0');
	assert.strictEqual(DegreesFtoC(50).toFixed(1), '10.0');
	assert.strictEqual(DegreesFtoC(68).toFixed(1), '20.0');
    assert.strictEqual(DegreesFtoC(86).toFixed(1), '30.0');
}

module.exports = {
    _test,
    StdAtmosphere,
    DegreesCtoF,
    DegreesFtoC,
    DewpointFromPressure,
    PressureFromDewpoint,
    gammaFromRH,
    gammaFromDewpoint,
    ardenBuckParam,
};

