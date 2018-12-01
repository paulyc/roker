#!/usr/bin/env node
/** Copyright (C) 2019 Paul Ciarlo <paul.ciarlo@gmail.com>
  * MIT License, see LICENSE file.
  *
  * Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and
  * (indoor/outdoor) temperatures.
  */
const console = require('console');
const logger = new console.Console(process.stdout);

function DegreesFtoC(f) {
	return 5.0 / 9.0 * (f - 32.0);
}

function usage() {
	logger.info("Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and");
	logger.info("(indoor/outdoor) temperatures with optional atmospheric pressure correction.");
	logger.info("Usage: %s [-f|-c] <outdoorDewpoint> <outdoorTemp> <indoorTemp>", process.argv[1]);
	logger.info("-f Temperatures specified in degrees Fahrenheit");
	logger.info("-c Temperatures specified in degrees Celsius");
}

/**
 * temperatures in degrees Celsius
 * see Arden Buck equation
 */
const RHCalc = function(dewpoint, outdoorTemp, indoorTemp) {
	// calculate saturated vapor pressure
        const P_s = RHCalc.a * Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
        const gamma = (dewpoint * RHCalc.b) / (RHCalc.c + dewpoint);
        const outdoorRH = 100 * Math.exp(gamma) /  Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
	// actual vapor pressure
        const P_a = RHCalc.a * Math.exp(gamma);
        logger.info(`Saturated pressure: ${P_s.toFixed(2)} hPa Partial pressure: ${P_a.toFixed(2)} hPa`);
        const indoorRH = 100 * Math.exp(gamma) /  Math.exp((RHCalc.b - indoorTemp/RHCalc.d) * (indoorTemp / (RHCalc.c + indoorTemp)));
        logger.info(`Calculated outdoor RH ${outdoorRH.toFixed(1)}% indoor RH ${indoorRH.toFixed(1)}%`);
}; 

RHCalc.a = 6.1121; // hPa
RHCalc.b = 18.678; // Unitless
RHCalc.c = 257.14; // Degrees C
RHCalc.d = 234.5;  // Degrees C
RHCalc.atm = 1013.25; // hPa

function main() {
	if (process.argv.length < 5 || process.argv.length > 6) {
		usage();
		return;
	}
	var i = 2;
	var tempConvert = (x) => x;
	if (process.argv[i] === '-f') {
		tempConvert = DegreesFtoC;
		++i;
	} else if (process.argv[i] === '-c') {
		++i;
	}
	const dewpoint = tempConvert(Number.parseFloat(process.argv[i++]));
	const outdoorTemp = tempConvert(Number.parseFloat(process.argv[i++]));
	const indoorTemp = tempConvert(Number.parseFloat(process.argv[i++]));

	RHCalc(dewpoint, outdoorTemp, indoorTemp);
}

function test() {
	//"-c -0.6 7.8 22.8"
	//Saturated pressure: 10.58 hPa Partial pressure: 5.85 hPa
	//Calculated outdoor RH 55.3% indoor RH 21.2%
	//"-f 31 46 73"
	//Saturated pressure: 10.57 hPa Partial pressure: 5.87 hPa
	//Calculated outdoor RH 55.6% indoor RH 21.9%
}

main();
