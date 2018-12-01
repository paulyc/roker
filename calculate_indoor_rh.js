#!/usr/bin/env node
/** 
  * Copyright (C) 2018 Paul Ciarlo <paul.ciarlo@gmail.com>
  * Licensed under the terms of the MIT License; see LICENSE file.
  *
  * Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and
  * (indoor/outdoor) temperatures.
  */
const console = require('console');
const assert = require('assert');
const logger = new console.Console(process.stdout);

/**
 * See Arden Buck equation
 */
const RHCalc = function(dewpoint, outdoorTemp, indoorTemp, degreesInF) {
	if (degreesInF) {
		dewpoint = RHCalc.DegreesFtoC(dewpoint);
		outdoorTemp = RHCalc.DegreesFtoC(outdoorTemp);
		indoorTemp = RHCalc.DegreesFtoC(indoorTemp);
	}
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

RHCalc.DegreesFtoC = function (f) {
	return 5.0 / 9.0 * (f - 32.0);
}

RHCalc.prototype.printResult = function () {
        logger.info(`Saturated pressure: ${this.P_s.toFixed(2)} hPa Partial pressure: ${this.P_a.toFixed(2)} hPa`);
        logger.info(`Calculated outdoor RH ${this.outdoorRH.toFixed(1)}% indoor RH ${this.indoorRH.toFixed(1)}%`);
}

function usage(scriptName) {
	logger.info("Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and");
	logger.info("(indoor/outdoor) temperatures.");
	logger.info(`Usage: ${scriptName} [-f|-c] <outdoorDewpoint> <outdoorTemp> <indoorTemp>`);
	logger.info("-f Temperatures specified in degrees Fahrenheit");
	logger.info("-c Temperatures specified in degrees Celsius [default]");
}

function main(argv) {
	if (argv.length < 5 || argv.length > 6) {
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
	const dewpoint = Number.parseFloat(argv[i++]);
	const outdoorTemp = Number.parseFloat(argv[i++]);
	const indoorTemp = Number.parseFloat(argv[i++]);

	const c = new RHCalc(dewpoint, outdoorTemp, indoorTemp, tempConvert);
	c.printResult();
	return c;
}

function test() {
	//"-c -0.6 7.8 22.8"
	//Saturated pressure: 10.58 hPa Partial pressure: 5.85 hPa
	//Calculated outdoor RH 55.3% indoor RH 21.1%
	var x = new RHCalc(-0.6, 7.8, 22.8);
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_a.toFixed(2), '5.85');
	assert.strictEqual(x.outdoorRH.toFixed(1), '55.3');
	assert.strictEqual(x.indoorRH.toFixed(1), '21.1');
	//"-f 31 46 73"
	//Saturated pressure: 10.57 hPa Partial pressure: 5.87 hPa
	//Calculated outdoor RH 55.6% indoor RH 21.2%
	x = new RHCalc(31, 46, 73, true);
	assert.strictEqual(x.P_s.toFixed(2), '10.57');
	assert.strictEqual(x.P_a.toFixed(2), '5.87');
	assert.strictEqual(x.outdoorRH.toFixed(1), '55.6');
	assert.strictEqual(x.indoorRH.toFixed(1), '21.2');
}

test();
main(process.argv);
