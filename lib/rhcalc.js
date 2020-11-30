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
	PressureFromDewpoint,
	DewpointFromPressure,
	RHFromDewpoint,
	PressureFromRH,
	DewpointFromRH,
	SaturationPressure,
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
	if (temp2 === void 0) temp2 = NaN;
	if (rh2 === void 0) rh2 = NaN;
	this.dewpoint = dewpoint;
	this.temp2 = temp2;
	this.RH_2 = rh2;

	// calculate saturation vapor pressure
	this.atmCorrection = this.atm / StdAtmosphere;
	this.P_s = this.atmCorrection * SaturationPressure(this.temp1);
	// actual vapor pressure
	this.P_a = this.atmCorrection * PressureFromDewpoint(this.temp1, this.dewpoint);
	this.RH_1 = RHFromDewpoint(this.temp1, this.dewpoint);
	if (!Number.isNaN(this.RH_2)) {
		this.P_a_2 = this.atmCorrection * PressureFromRH(this.temp2, this.RH_2);
	} else {
		this.P_a_2 = this.P_a;
		this.RH_2 = RHFromDewpoint(this.temp2, this.dewpoint);
	}
};

RHCalc.prototype.calculateFromRH = function (rh, temp2, rh2) {
	if (temp2 === void 0) temp2 = NaN;
	if (rh2 === void 0) rh2 = NaN;
	this.RH_1 = rh;
	this.temp2 = temp2;
	this.RH_2 = rh2;

	// calculate saturation vapor pressure
	this.atmCorrection = this.atm / StdAtmosphere;
	this.P_s = SaturationPressure(this.temp1);
	// actual vapor pressure
	//this.P_a = this.P_s * this.RH_1/100.0;
	this.P_a = this.atmCorrection * PressureFromRH(this.temp1, this.RH_1);
	this.dewpoint = DewpointFromPressure(this.temp1, this.P_a);
	//this.dewpoint = this.c * this.gamma / (this.b - this.gamma);
	if (!Number.isNaN(this.RH_2)) {
		this.P_a_2 = this.atmCorrection * PressureFromRH(this.temp2, this.RH_2);
	} else {
		this.P_a_2 = this.P_a;
		this.RH_2 = RHFromDewpoint(this.temp2, this.dewpoint);
	}
};

RHCalc.prototype.printResult = function () {
	let output =
`
Temp 1 = [${this.temp1.toFixed(1)} C / ${DegreesCtoF(this.temp1).toFixed(1)} F]
Dewpoint/Frostpoint = [${this.dewpoint.toFixed(1)} C / ${DegreesCtoF(this.dewpoint).toFixed(1)} F]
Saturation pressure = [${this.P_s.toFixed(2)} hPa]
Partial pressure at temp1 = [${this.P_a.toFixed(2)} hPa]
RH at temp 1 = [${this.RH_1.toFixed(1)}%]
`;
	if (!Number.isNaN(this.temp2)) {
		output +=
`Temp 2 = [${this.temp2.toFixed(1)} C / ${DegreesCtoF(this.temp2).toFixed(1)} F]
Partial pressure at temp2 = [${this.P_a_2.toFixed(2)} hPa]
RH at temp 2 = [${this.RH_2.toFixed(1)}%]
`;
	}
	logger.info(output);
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
