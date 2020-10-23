#!/usr/bin/env node
// Copyright (C) 2020 Paul Ciarlo <paul.ciarlo@ getMaxListeners.com
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

/**
 * See Arden Buck equation
 * Temperatures in Celsius
 * dewpoint, indoorTemp both optional, if not specified unavailable info set to NaN
 */
const RHCalc = function(outdoorTemp, dewpoint, indoorTemp) {
	if (dewpoint === void 0) dewpoint = NaN;
	if (indoorTemp === void 0) indoorTemp = NaN;
	// calculate saturated vapor pressure
	this.P_s = RHCalc.a * Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
	this.gamma = (dewpoint * RHCalc.b) / (RHCalc.c + dewpoint);
	this.outdoorRH = 100 * Math.exp(this.gamma) /  Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
	// actual vapor pressure
	this.P_a = RHCalc.a * Math.exp(this.gamma);
	this.indoorRH = 100 * Math.exp(this.gamma) /  Math.exp((RHCalc.b - indoorTemp/RHCalc.d) * (indoorTemp / (RHCalc.c + indoorTemp)));
};

RHCalc.a = 6.1121; // hPa
RHCalc.b = 18.678; // Unitless
RHCalc.c = 257.14; // Degrees C
RHCalc.d = 234.5;  // Degrees C
RHCalc.atm = 1013.25; // hPa

const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);

RHCalc.prototype.printResult = function () {
	logger.info(`Saturated pressure: ${this.P_s.toFixed(2)} hPa Partial pressure: ${this.P_a.toFixed(2)} hPa`);
	logger.info(`Calculated outdoor RH ${this.outdoorRH.toFixed(1)}% indoor RH ${this.indoorRH.toFixed(1)}%`);
}

function usage(scriptName) {
	logger.info("Calculate saturated partial pressure of water vapor for temp1,");
	logger.info("actual partial pressure/relative humidity for temp1 at dewpoint [optional], and for temp2 at dewpoint [optional]");
	logger.info("(indoor/outdoor) temperatures.");
	logger.info(`Usage: ${scriptName} [-f|-c] <temp1> [dewpoint [temp2]]`);
	logger.info("-c Temperatures specified in degrees Celsius [default]");
	logger.info("-f Temperatures specified in degrees Fahrenheit");
}

function main(argv) {
	if (argv.length < 3 || argv.length > 6) {
		usage(argv[1]);
		return void 0;
	}
	var i = 2;
	var tempConvert = false;
	if (argv[i] === '-f') {
		tempConvert = true;
		++i;
	} else if (argv[i] === '-c') {
		++i;
	}

	let outdoorTemp = Number.parseFloat(argv[i++]);
	let dewpoint = i < argv.length ? Number.parseFloat(argv[i++]) : NaN;
	let indoorTemp = i < argv.length ? Number.parseFloat(argv[i++]) : NaN;

	if (tempConvert) {
		dewpoint = DegreesFtoC(dewpoint);
		outdoorTemp = DegreesFtoC(outdoorTemp);
		indoorTemp = DegreesFtoC(indoorTemp);
	}
	const c = new RHCalc(outdoorTemp, dewpoint, indoorTemp);
	c.printResult();
	return c;
}

function test() {
	//"-c -0.6 7.8 22.8"
	//Saturated pressure: 10.58 hPa Partial pressure: 5.85 hPa
	//Calculated outdoor RH 55.3% indoor RH 21.1%
	var x = new RHCalc(7.8, -0.6, 22.8);
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.outdoorRH.toFixed(1), '55.3');
	assert.strictEqual(x.indoorRH.toFixed(1), '21.1');
	//"-f 31 46 73"
	//Saturated pressure: 10.57 hPa Partial pressure: 5.87 hPa
	//Calculated outdoor RH 55.6% indoor RH 21.2%
	let dp = DegreesFtoC(31);
	let t_out = DegreesFtoC(46);
	let t_in = DegreesFtoC(73);
	x = new RHCalc(t_out, dp, t_in);
	assert.strictEqual(x.P_s.toFixed(2), '10.57');
	assert.strictEqual(x.P_a.toFixed(2), '5.87');
	assert.strictEqual(x.outdoorRH.toFixed(1), '55.6');
	assert.strictEqual(x.indoorRH.toFixed(1), '21.2');
}

test();
main(process.argv);
