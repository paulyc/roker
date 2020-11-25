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
const logger = require('./logger');

const {
	StdAtmosphere,
	ardenBuckParam,
	gammaFromDewpoint,
	gammaFromRH,
	PressureFromDewpoint,
	DewpointFromPressure,
	DegreesCtoF,
	DegreesFtoC,
} = require('./physics');

const RHCalc = function(temp, atm) {
	this.temp1 = temp;
	this.atm = atm || StdAtmosphere; // can't very well be zero, according to the 2nd law of thermodynamics, or this program couldn't exist!
	this.dewpoint = NaN;
	this.temp2 = NaN;
	this.RH_1 = NaN;
	this.RH_2 = NaN;
	this.P_a = NaN;
	this.P_a_2 = NaN;
	this.P_s = NaN;

	if (temp > 0) {
		this.a = 6.1121; // hPa
		this.b = 18.678; // Unitless
		this.c = 257.14; // Degrees C
		this.d = 234.5;  // Degrees C
	} else {
		this.a = 6.1115; // hPa
		this.b = 23.036; // Unitless
		this.c = 279.82; // Degrees C
		this.d = 333.7;  // Degrees C
	}
};

function _test() {
    RHCalc._test();
}

module.exports = {
    _test,
    RHCalc,
};

/*
 * Calculate pressure/RH at dewpoint (frostpoint) and temp2, both optional temps in C
 * if not specified, unavailable outputs set to NaN
 */
RHCalc.prototype.calculate = function (dewpoint, temp2, rh2) {
	if ('number' === typeof dewpoint) this.dewpoint = dewpoint;
	if ('number' === typeof temp2) this.temp2 = temp2;
	if ('number' === typeof rh2) this.RH_2 = rh2;

	// calculate saturation vapor pressure
	this.atmCorrection = this.atm / StdAtmosphere;
	this.P_s = this.atmCorrection * this.a * ardenBuckParam(this.temp1, this);
	this.gamma = gammaFromDewpoint(this.dewpoint, this);
	// actual vapor pressure
	this.P_a = this.atmCorrection * PressureFromDewpoint(this.dewpoint, this);
	this.RH_1 = 100.0 * Math.exp(this.gamma) / ardenBuckParam(this.temp1, this);
	if (this.RH_2) {
		this.P_a_2 = this.atmCorrection * this.a * Math.exp(gammaFromRH(this.temp2, this.RH_2, this));
	} else {
		this.RH_2 = 100.0 * Math.exp(this.gamma) / ardenBuckParam(this.temp2, this);
	}
};

RHCalc.prototype.calculateFromRH = function (rh, temp2, rh2) {
	if ('number' === typeof rh) this.RH_1 = rh;
	if ('number' === typeof temp2) this.temp2 = temp2;
	if ('number' === typeof rh2) this.RH_2 = rh2;

	// calculate saturation vapor pressure
	this.atmCorrection = this.atm / StdAtmosphere;
	this.P_s = this.atmCorrection * this.a * ardenBuckParam(this.temp1, this);
	this.gamma = gammaFromRH(this.temp1, this.RH_1, this);
	// actual vapor pressure
	this.P_a = this.P_s*this.RH_1/100.0;
	//this.P_a = this.atmCorrection * this.a * Math.exp(this.gamma);
	this.dewpoint = DewpointFromPressure(this.P_a, this);
	//this.dewpoint = this.c * this.gamma / (this.b - this.gamma);
	this.P_a = this.atmCorrection * this.a * Math.exp(this.gamma);
	if (this.RH_2) {
		this.P_a_2 = this.atmCorrection * this.a * Math.exp(gammaFromRH(this.temp2, this.RH_2, this));
	} else {
		this.RH_2 = 100.0 * Math.exp(gammaFromDewpoint(this.dewpoint, this)) / ardenBuckParam(this.temp2, this);
	}
};

RHCalc.prototype.printResult = function () {
	logger.info(`
Temp 1 = [${this.temp1.toFixed(1)} C / ${DegreesCtoF(this.temp1).toFixed(1)} F]
Dewpoint/Frostpoint = [${this.dewpoint.toFixed(1)} C / ${DegreesCtoF(this.dewpoint).toFixed(1)} F]
Saturation pressure = [${this.P_s.toFixed(2)} hPa]
Partial pressure at temp1 = [${this.P_a.toFixed(2)} hPa]
RH at temp 1 = [${this.RH_1.toFixed(1)}%]
Temp 2 = [${this.temp2.toFixed(1)} C / ${DegreesCtoF(this.temp2).toFixed(1)} F]
Partial pressure at temp2 = [${this.P_a_2.toFixed(2)} hPa]
RH at temp 2 = [${this.RH_2.toFixed(1)}%]
`);
};

RHCalc._test = function () {
    //"-c 7.8 -0.6 22.8"
	//Saturation pressure = [10.58 hPa] Partial pressure at dewpoint/frostpoint = [5.85 hPa]
	//Calculated RH at temp 1 = [55.3%] RH at temp 2 = [21.1%]
	let dp = -0.6;
	let t_out = 7.8;
	let t_in = 22.8;
	var x = new RHCalc(7.8)
	x.calculate(dp, t_in);
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.RH_1.toFixed(1), '55.3');
	assert.strictEqual(x.RH_2.toFixed(1), '21.1');

	//-r 55.3 7.8 22.8
	// unsure if correct
	let rh = 55.3;
	t_out = 7.8;
	t_in = 22.8;
	x = new RHCalc(t_out);
	x.calculateFromRH(rh, t_in);
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.dewpoint.toFixed(1), '-0.6');
	assert.strictEqual(x.RH_2.toFixed(1), '21.1');

	//"-f 46 31 73"
	//Saturation pressure = [10.57 hPa] Partial pressure at dewpoint/frostpoint = [5.87 hPa]
	//Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	dp = DegreesFtoC(31);
	t_out = DegreesFtoC(46);
	t_in = DegreesFtoC(73);
	x = new RHCalc(t_out);
	x.calculate(dp, t_in);
	assert.strictEqual(x.P_s.toFixed(2), '10.57');
	assert.strictEqual(x.P_a.toFixed(2), '5.87');
	assert.strictEqual(x.RH_1.toFixed(1), '55.6');
	assert.strictEqual(x.RH_2.toFixed(1), '21.2');

	// might not be quite exactly accurate but good enough
	//"-p 900 -f 46 31 73"
	// Saturation pressure = [9.39 hPa] Partial pressure at dewpoint/frostpoint = [5.21 hPa]
	// Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	let atm = 900;
	x = new RHCalc(t_out, atm);
	x.calculate(dp, t_in);
	assert.strictEqual(x.P_s.toFixed(2), '9.39');
	assert.strictEqual(x.P_a.toFixed(2), '5.21');
	assert.strictEqual(x.RH_1.toFixed(1), '55.6');
	assert.strictEqual(x.RH_2.toFixed(1), '21.2');
}
