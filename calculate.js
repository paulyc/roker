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
const roker = require('./lib');
const { Physics: { StdAtmosphere, DegreesFtoC }, RHCalc, logger } = roker;

function usage(scriptName) {
	logger.info(`Usage: ${scriptName} [-f|-c] [-p <atmosphericPressure>] <temp1 [dewpoint [temp2 [rh2]]]>|<-r <relativeHumidity> temp1 [temp2 [rh2]]>`);
	logger.info("Calculates saturation partial pressure of water vapor for temp1, ");
	logger.info("actual partial pressure/relative humidity for temp1 at dewpoint (frostpoint) [optional], ");
	logger.info("and for temp2 at equal pressure [optional]");
	logger.info("-h Show this help");
	logger.info("-c Temperatures specified in degrees Celsius [default]");
	logger.info("-f Temperatures specified in degrees Fahrenheit");
	logger.info("-p Atmospheric pressure in hPa [default = 1013.25]");
	logger.info("-r Relative humidity in % at temp1 [calculate dewpoint]");
	logger.info("-d Dewpoint [calculate relative humidity]");
}

function parseTemp(s, convertFromF) {
	if ('string' !== typeof s) return NaN;
	switch (s[s.length-1]) {
		case 'c':
		case 'C':
			return Number.parseFloat(s);
		case 'f':
		case 'F':
			return DegreesFtoC(Number.parseFloat(s));
		default:
			return convertFromF ? DegreesFtoC(Number.parseFloat(s)) : Number.parseFloat(s);
	}
}

function main(argv) {
	const nodeExecutable = argv.shift();
	const script = argv.shift();
	if (argv.length == 0 || argv[0] === '-h') {
		return usage(script);
	}
	let tempConvert = false;
	let atm = StdAtmosphere;
	let rh = Number.NaN;
	while (argv.length > 0) {
		if (argv[0] === '-f') {
			tempConvert = true;
			argv.shift();
		} else if (argv[0] === '-c') {
			argv.shift();
		} else if (argv[0] === '-p') {
			argv.shift();
			atm = Number.parseFloat(argv.shift());
		} else if (argv[0] === '-r') {
			argv.shift();
			rh = Number.parseFloat(argv.shift());
		} else {
			break;
		}
	}

	// the Zen of JS, anything not specced just becomes NaN and propagates to the unknown outputs
	const temp1 = parseTemp(argv.shift(), tempConvert);
	const dewpoint = Number.isNaN(rh) ? parseTemp(argv.shift(), tempConvert) : NaN;
	const temp2 = parseTemp(argv.shift(), tempConvert);
	const rh2 = Number.parseFloat(argv.shift());

	const c = new RHCalc(temp1, atm);

	if (!rh) {
		c.calculate(dewpoint, temp2, rh2);
	} else {
		c.calculateFromRH(rh, temp2, rh2);
	}
	c.printResult();
	return c;
}

function test() {
	roker._test();
}

main(process.argv);
test();
