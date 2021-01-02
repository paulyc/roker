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

function Point(t, dp, rh) {
	this.t = t;
	this.dp = dp;
	this.rh = rh;
	this.P_s = NaN;
	this.P_a = NaN;
}
function RHCalc(p) {
	this.pressure = StdAtmosphere;
	this.inputs = [];
	this.outputs = [];
}

Object.assign(RHCalc.prototype, {
	addTemp(t) { // Unit Degrees Celsius
		this.inputs.push(new Point(t, NaN, NaN));
	},
	addDewpoint(dp) { // Unit Degrees Celsius
		const p = this.inputs[this.inputs.length-1];
		if (Number.isNaN(p.dp)) {
			p.dp = dp;
		} else {
			this.inputs.push(new Point(p.t, dp, NaN));
		}
	},
	addHumidity(rh) { // Unit 1/100
		const p = this.inputs[this.inputs.length-1];
		if (Number.isNaN(p.rh)) {
			p.rh = rh;
		} else {
			this.inputs.push(new Point(p.t, NaN, p.rh));
		}
	},
	setPressure(p) { // Unit hPa (mbar)
		this.pressure = p;
	},
	calculate() {
		let point = null;
		while ((point = this.inputs.shift()) !== void 0) {
			// calculate saturation vapor pressure
			let atmCorrection = this.pressure / StdAtmosphere;
			point.P_s = atmCorrection * SaturationPressure(point.t);
			if (Number.isNaN(point.rh)) {
				if (Number.isNaN(point.dp)) {
					if (this.outputs.length > 0) {
						// calculate rh at this temp with same dewpoint as last
						point.P_a = this.outputs[this.outputs.length-1].P_a;
						point.dp = DewpointFromPressure(point.t, point.P_a);
					}
				} else {
					point.P_a = PressureFromDewpoint(point.t, point.dp);
				}
				point.rh = 100.0 * point.P_a / point.P_s;
			} else if (Number.isNaN(point.dp)) {
				if (!Number.isNaN(point.rh)) {
					point.dp = DewpointFromRH(point.t, point.rh);
					point.P_a = PressureFromRH(point.t, point.rh);
				} else if (this.outputs.length > 0) {
					point.dp = this.outputs[this.outputs.length-1].dp;
					point.P_a = PressureFromDewpoint(point.t, point.dp);
					point.rh = 100.0 * point.P_a / point.P_s;
				}
			}

			this.outputs.push(point);
		}
	},
	printResult() {
		let point = null;
		for (let i = 1; (point = this.outputs.shift()) !== void 0; ++i) {
			let output =
`
At Temp ${i} = [${point.t.toFixed(1)} C / ${DegreesCtoF(point.t).toFixed(1)} F]
Dewpoint/Frostpoint = [${point.dp.toFixed(1)} C / ${DegreesCtoF(point.dp).toFixed(1)} F]
Saturation pressure = [${point.P_s.toFixed(2)} hPa]
Partial pressure = [${point.P_a.toFixed(2)} hPa]
RH = [${point.rh.toFixed(1)}%]
`;
			logger.info(output);
		}
	}
});

module.exports = RHCalc;

/*
 * Calculate pressure/RH at dewpoint (frostpoint) and temp2, both optional temps in C
 * if not specified, unavailable outputs set to NaN
 */


RHCalc._test = function () {
	return;
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
