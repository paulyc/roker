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
	DegreesKtoC,
	DegreesCtoK,
} = require('./physics');

function Point(t, dp, rh) {
	this.t = t;
	this.dp = dp;
	this.rh = rh;
	this.P_s = NaN;
	this.P_a = NaN;
}
Point.prototype.dup = function () {
	const p = new Point(this.t, this.dp, this.rh);
	p.P_s = this.P_s;
	p.P_a = this.P_a;
	return p;
}
function RHCalc() {
	this.pressure = StdAtmosphere;
	this.inputs = [];
	this.outputs = [];
	this.tempUnits = 'C';
}

Object.assign(RHCalc.prototype, {
	lastInput() {
		return this.inputs.length > 0 ? this.inputs[this.inputs.length - 1] : null;
	},
	lastOutput() {
		return this.outputs.length > 0 ? this.outputs[this.outputs.length - 1] : null;
	},
	addTemp(t) { // Unit Degrees Celsius, Fahrenheit, or Kelvin
		t = this.parseTemp(t);
		this.inputs.push(new Point(t, NaN, NaN));
	},
	addDewpoint(dp) { // Unit Degrees Celsius, Fahrenheit, or Kelvin
		dp = this.parseTemp(dp);
		const p = this.lastInput();
		if (p === null) {
			this.inputs.push(new Point(NaN, dp, NaN));
		} else if (Number.isNaN(p.dp)) {
			p.dp = dp;
		} else {
			this.inputs.push(new Point(p.t, dp, NaN));
		}
	},
	addHumidity(rh) { // Unit 1/100
		rh = Number.parseFloat(rh);
		const p = this.lastInput();
		if (p === null) {
			this.inputs.push(new Point(NaN, NaN, rh));
		} else if (Number.isNaN(p.rh)) {
			p.rh = rh;
		} else {
			this.inputs.push(new Point(p.t, NaN, p.rh));
		}
	},
	addParam(p) {
		const last = this.lastInput();
		if (last === null || !Number.isNaN(last.dp)) {
			this.addTemp(p);
		} else {
			this.addDewpoint(p);
		}
	},
	setPressure(p) { // Unit hPa (mbar)
		this.pressure = Number.parseFloat(p);
	},
	setTempUnits(tu) {
		if ('string' === typeof tu && (tu.toUpperCase() === 'F' || tu.toUpperCase() === 'K')) {
			this.tempUnits = tu.toUpperCase();
		} else {
			this.tempUnits = 'C';
		}
	},
	parseTemp(s) {
		switch (typeof s) {
		case 'number':
			break;
		case 'string':
		switch (s[s.length-1]) {
			case 'c':
			case 'C':
				return Number.parseFloat(s);
			case 'f':
			case 'F':
				return DegreesFtoC(Number.parseFloat(s));
			case 'k':
			case 'K':
				return DegreesKtoC(Number.parseFloat(s));
			default:
				s = Number.parseFloat(s);
		}
		break;
		default:
			return NaN;
		}
		return this.tempUnits === 'F' ? DegreesFtoC(s) : s;
	},
	calculate() {
		let atmCorrection = this.pressure / StdAtmosphere;
		for (let point of this.inputs) {
			point = point.dup();
			// calculate saturation vapor pressure
			if (!Number.isNaN(point.t)) {
				// have temp
				if (Number.isNaN(point.P_s)) {
					point.P_s = atmCorrection * SaturationPressure(point.t);
				}
				if (!Number.isNaN(point.dp)) {
					// have dewpoint
					point.P_a = PressureFromDewpoint(point.t, point.dp);
					point.rh = RHFromDewpoint(point.t, point.dp);
				} else if (!Number.isNaN(point.rh)) {
					// have rh
					point.P_a = PressureFromRH(point.t, point.rh);
					point.dp = DewpointFromPressure(point.t, point.P_a);
				} else {
					// no dewpoint or rh, calculate from last partial pressure
					const last = this.lastOutput();
					if (last !== null && !Number.isNaN(last.P_a)) {
						point.P_a = last.P_a;
						point.dp = DewpointFromPressure(point.t, point.P_a);
						point.rh = RHFromDewpoint(point.t, point.dp);
					}
				}
			} else {
				// no temp but maybe a different dewpoint or rh
				const last = this.lastOutput();
				if (last !== null && !Number.isNaN(last.t)) {
					point.t = last.t;
					point.P_s = last.P_s;
					if (!Number.isNaN(point.dp)) {
						// have dewpoint
						point.P_a = PressureFromDewpoint(point.t, point.dp);
						point.rh = RHFromDewpoint(point.t, point.dp);
					} else if (!Number.isNaN(point.rh)) {
						// have rh
						point.P_a = PressureFromRH(point.t, point.rh);
						point.dp = DewpointFromPressure(point.t, point.P_a);
					}
				}
			}
			this.outputs.push(point);
		}
	},
	printResult() {
		let i = 1;
		for (const point of this.outputs) {
			let output_s =
`
At Temp ${i++} = [${point.t.toFixed(1)} C / ${DegreesCtoF(point.t).toFixed(1)} F]
Dewpoint/Frostpoint = [${point.dp.toFixed(1)} C / ${DegreesCtoF(point.dp).toFixed(1)} F]
Saturation pressure = [${point.P_s.toFixed(2)} hPa]
Partial pressure = [${point.P_a.toFixed(2)} hPa]
RH = [${point.rh.toFixed(1)}%]
`;
			logger.info(output_s);
		}
	}
});

module.exports = RHCalc;

/*
 * Calculate pressure/RH at dewpoint (frostpoint) and temp2, both optional temps in C
 * if not specified, unavailable outputs set to NaN
 */


RHCalc._test = function () {
    //"-c 7.8 -0.6 22.8"
	//Saturation pressure = [10.58 hPa] Partial pressure at dewpoint/frostpoint = [5.85 hPa]
	//Calculated RH at temp 1 = [55.3%] RH at temp 2 = [21.1%]
	let dp = -0.6;
	let t_out = 7.8;
	let t_in = 22.8;
	let calc = new RHCalc();
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	let x = calc.outputs[0];
	let y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.rh.toFixed(1), '55.3');
	assert.strictEqual(y.rh.toFixed(1), '21.1');

	//-r 55.3 7.8 22.8
	// unsure if correct
	let rh = 55.3;
	t_out = 7.8;
	t_in = 22.8;
	calc = new RHCalc();
	calc.addTemp(t_out);
	calc.addHumidity(rh);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(y.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.dp.toFixed(1), '-0.6');
	assert.strictEqual(y.rh.toFixed(1), '21.1');

	//"-f 46 31 73"
	//Saturation pressure = [10.57 hPa] Partial pressure at dewpoint/frostpoint = [5.87 hPa]
	//Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	dp = 31;
	t_out = 46;
	t_in = 73;
	calc = new RHCalc();
	calc.setTempUnits('F');
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.57');
	assert.strictEqual(x.P_a.toFixed(2), '5.87');
	assert.strictEqual(x.rh.toFixed(1), '55.6');
	assert.strictEqual(y.rh.toFixed(1), '21.2');

	// might not be quite exactly accurate but good enough
	//"-p 900 -f 46 31 73"
	// Saturation pressure = [9.39 hPa] Partial pressure at dewpoint/frostpoint = [5.21 hPa]
	// Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	let atm = 900;
	calc = new RHCalc();
	calc.setPressure(atm);
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '9.39');
	assert.strictEqual(x.P_a.toFixed(2), '5.21');
	assert.strictEqual(x.rh.toFixed(1), '55.6');
	assert.strictEqual(y.rh.toFixed(1), '21.2');
}
