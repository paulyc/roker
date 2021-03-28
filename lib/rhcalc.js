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
	SpecificEnthalpyAir,
	SpecificEnthalpyDryAir,
	SpecificEnthalpySaturatedAir,
	LatentHeat,
} = require('./physics');

function Point(t, dp, rh, P_w, P_s) {
	this.t = t;
	this.dp = dp;
	this.rh = rh;
	this.P_w = P_w;
	this.P_s = P_s;
}

Point.prototype.dup = function () {
	return new Point(this.t, this.dp, this.rh, this.P_w, this.P_s);
};

function RHCalc() {
	this.pressure = StdAtmosphere;
	this.inputs = [];
	this.outputs = [];
	this.tempUnits = 'C';
}

module.exports = RHCalc;

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
			this.inputs.push(new Point(p.t, NaN, NaN));
		}
	},
	addParam(p) {
		if ('string' === typeof p && p.endsWith('%')) {
			this.addHumidity(p);
		} else {
			const last = this.lastInput();
			if (last !== null && (Number.isNaN(last.dp) && Number.isNaN(last.rh))) {
				this.addDewpoint(p);
			} else {
				this.addTemp(p);
			}
		}
	},
	setPressure(p) { // Unit hPa (mbar)
		if ('string' === typeof p) p = Number.parseFloat(p);
		this.pressure = p;
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
	// should be a point function!
	calculateFromTemperature(point, atmCorrection) {
		// have temp
		if (!point.P_s) {
			point.P_s = atmCorrection * SaturationPressure(point.t);
		}
		if (!Number.isNaN(point.dp)) {
			// have dewpoint
			point.P_w = atmCorrection * PressureFromDewpoint(point.t, point.dp);
			point.rh = RHFromDewpoint(point.t, point.dp);
		} else if (!Number.isNaN(point.rh)) {
			// have rh
			point.P_w = atmCorrection * PressureFromRH(point.t, point.rh);
			point.dp = DewpointFromPressure(point.t, point.P_w);
		} else {
			// no dewpoint or rh, calculate from last partial pressure
			const last = this.lastOutput();
			if (last !== null && last.P_w !== void 0) {
				point.dp = DewpointFromPressure(point.t, last.P_w * StdAtmosphere / this.pressure);
				point.P_w = atmCorrection * PressureFromDewpoint(point.t, point.dp);
				point.rh = RHFromDewpoint(point.t, point.dp);
			}
		}
	},
	calculate() {
		let atmCorrection = this.pressure / StdAtmosphere;
		for (let point of this.inputs) {
			point = point.dup();
			// calculate saturation vapor pressure
			if (!Number.isNaN(point.t)) {
				this.calculateFromTemperature(point, atmCorrection);
			} else {
				// no temp but maybe a different dewpoint or rh
				const last = this.lastOutput();
				if (last !== null && !Number.isNaN(last.t)) {
					point.t = last.t;
					point.P_s = atmCorrection * SaturationPressure(point.t);
					if (!Number.isNaN(point.dp)) {
						// have dewpoint
						point.rh = RHFromDewpoint(point.t, point.dp);
						point.P_w = atmCorrection * PressureFromDewpoint(point.t, point.dp);
					} else if (!Number.isNaN(point.rh)) {
						// have rh
						point.dp = DewpointFromRH(point.t, point.rh);
						point.P_w = atmCorrection * PressureFromDewpoint(point.t, point.dp);
					}
				}
			}
			this.outputs.push(point);
		}
	},
	printResult() {
		let i = 1;
		for (const point of this.outputs) {
			let enthalpy_dry = SpecificEnthalpyAir(point.t, 0, this.pressure);
			let enthalpy_sat = SpecificEnthalpyAir(point.t, point.P_s, this.pressure);
			let enthalpy = SpecificEnthalpyAir(point.t, point.P_w, this.pressure);
			let latent_heat = LatentHeat(point.t, point.P_w, this.pressure);
			let output_s =
`
At Temp ${i++} = [${point.t.toFixed(1)} C / ${DegreesCtoF(point.t).toFixed(1)} F]
Dewpoint/Frostpoint = [${point.dp.toFixed(1)} C / ${DegreesCtoF(point.dp).toFixed(1)} F]
RH = [${point.rh.toFixed(1)}%]
Saturation pressure = [${point.P_s.toFixed(2)} hPa]
Partial pressure = [${point.P_w?.toFixed(2)} hPa]
Specific Enthalpy (Dry) = [${enthalpy_dry.toFixed(2)} kJ/kg]
Specific Enthalpy (Saturation) = [${enthalpy_sat.toFixed(2)} kJ/kg]
Specific Enthalpy = [${enthalpy?.toFixed(2)} kJ/kg]
Latent Heat = [${latent_heat?.toFixed(2)} kJ/kg]
`;
			logger.info(output_s);
		}
	}
});
