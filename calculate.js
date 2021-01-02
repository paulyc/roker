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
const { Physics: {DegreesFtoC }, RHCalc, logger } = roker;

function usage(scriptName) {
	logger.info(`Usage:\n${scriptName} [-f|-c] [-p <atmosphericPressure>] <-t temp1 [-d dewpoint]|[-r relativeHumidity]> [[-t temp2] [-d dewpoint] [-r relativeHumidity]]`);
	logger.info("Calculates saturation partial pressure of water vapor for temp1, actual partial pressure/relative humidity for temp1 at dewpoint/frostpoint, and for temp2 at equal pressure, or rh2, if provided");
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
	const calc = new RHCalc();
	while (argv.length > 0) {
		let arg = argv.shift();
		if (arg === '-c') {
			tempConvert = false;
		} else if (arg === '-f') {
			tempConvert = true;
		} else if (arg === '-t') {
			calc.addTemp(parseTemp(argv.shift(), tempConvert));
		} else if (arg === '-d') {
			calc.addDewpoint(parseTemp(argv.shift(), tempConvert));
		} else if (arg === '-r') {
			calc.addHumidity(Number.parseFloat(argv.shift()));
		} else if (arg === '-p') {
			calc.setPressure(Number.parseFloat(argv.shift()));
		} else {
			break;
		}
	}

	calc.calculate();
	calc.printResult();
}

function test() {
	roker._test();
}

main(process.argv);
test();
