#!/usr/bin/env node
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

/**
  * Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and
  * (indoor/outdoor) temperatures.
  */
const console = require('console');
const assert = require('assert');
const logger = new console.Console(process.stdout);

const StdAtmosphere = 1013.25; // hPa
/**
 * See Arden Buck equation, accurate in range -80 to 50 C
 * https://en.wikipedia.org/wiki/Arden_Buck_equation
 * Temperatures in Celsius
 */

const RHCalc = function(temp, atm) {
	this.temp1 = temp;
	this.atm = atm || StdAtmosphere; // can't very well be zero, according to the 2nd law of thermodynamics, or this program couldn't exist!
	this.dewpoint = NaN;
	this.temp2 = NaN;

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

/*
 * Calculate pressure/RH at dewpoint (frostpoint) and temp2, both optional temps in C
 * if not specified, unavailable outputs set to NaN
 */
RHCalc.prototype.calculate = function (dewpoint, temp2) {
	if (dewpoint === void 0) dewpoint = NaN;
	this.dewpoint = dewpoint;
	if (temp2 === void 0) temp2 = NaN;
	this.temp2 = temp2;

	// calculate saturation vapor pressure
	this.atmCorrection = this.atm / 1013.25;
	this.P_s = this.atmCorrection * this.a * Math.exp((this.b - this.temp1/this.d) * (this.temp1 / (this.c + this.temp1)));
	this.gamma = (this.dewpoint * this.b) / (this.c + this.dewpoint);
	this.RH_1 = 100.0 * Math.exp(this.gamma) / Math.exp((this.b - this.temp1/this.d) * (this.temp1 / (this.c + this.temp1)));
	// actual vapor pressure
	this.P_a = this.atmCorrection * this.a * Math.exp(this.gamma);
	this.RH_2 = 100.0 * Math.exp(this.gamma) / Math.exp((this.b - this.temp2/this.d) * (this.temp2 / (this.c + this.temp2)));
};

const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);

RHCalc.prototype.printResult = function () {
	logger.info(`Saturation pressure = [${this.P_s.toFixed(2)} hPa] Partial pressure at dewpoint/frostpoint = [${this.P_a.toFixed(2)} hPa]`);
	logger.info(`Calculated RH at temp 1 = [${this.RH_1.toFixed(1)}%] RH at temp 2 = [${this.RH_2.toFixed(1)}%]`);
}

function usage(scriptName) {
	logger.info(`Usage: ${scriptName} [-f|-c] [-p <atmosphericPressure>] <temp1> [dewpoint [temp2]]`);
	logger.info("Calculates saturation partial pressure of water vapor for temp1, ");
	logger.info("actual partial pressure/relative humidity for temp1 at dewpoint (frostpoint) [optional], ");
	logger.info("and for temp2 at equal pressure [optional]");
	logger.info("-c Temperatures specified in degrees Celsius [default]");
	logger.info("-f Temperatures specified in degrees Fahrenheit");
	logger.info("-p Atmospheric pressure in hPa [default = 1013.25]");
}

function main(argv) {
	const nodeExecutable = argv.shift();
	const script = argv.shift();
	if (argv.length == 0 || argv[0] === '-h') {
		usage(script);
		return void 0;
	}
	let tempConvert = false;
	let atm = StdAtmosphere;
	while (argv.length > 0) {
		if (argv[0] === '-f') {
			tempConvert = true;
			argv.shift();
		} else if (argv[0] === '-c') {
			argv.shift();
		} else if (argv[0] === '-p') {
			argv.shift();
			atm = Number.parseFloat(argv.shift());
		} else {
			break;
		}
	}

	// the Zen of JS, anything not specced just becomes NaN and propagates to the unknown outputs
	let outdoorTemp = Number.parseFloat(argv.shift());
	let dewpoint = Number.parseFloat(argv.shift());
	let indoorTemp = Number.parseFloat(argv.shift());

	if (tempConvert) {
		dewpoint = DegreesFtoC(dewpoint);
		outdoorTemp = DegreesFtoC(outdoorTemp);
		indoorTemp = DegreesFtoC(indoorTemp);
	}

	const c = new RHCalc(outdoorTemp, atm);
	c.calculate(dewpoint, indoorTemp);
	c.printResult();
	return c;
}

function test() {
	//"-c 7.8 -0.6 22.8"
	//Saturation pressure = [10.58 hPa] Partial pressure at dewpoint/frostpoint = [5.85 hPa]
	//Calculated RH at temp 1 = [55.3%] RH at temp 2 = [21.1%]
	var x = new RHCalc(7.8)
	x.calculate(-0.6, 22.8);
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.RH_1.toFixed(1), '55.3');
	assert.strictEqual(x.RH_2.toFixed(1), '21.1');

	//"-f 46 31 73"
	//Saturation pressure = [10.57 hPa] Partial pressure at dewpoint/frostpoint = [5.87 hPa]
	//Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	let dp = DegreesFtoC(31);
	let t_out = DegreesFtoC(46);
	let t_in = DegreesFtoC(73);
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

test();
main(process.argv);
