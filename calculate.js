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
const { RHCalc, logger, _test } = require('./lib');

function usage(scriptName) {
	logger.info(`Usage:\n${scriptName} [-f|-c] [-p <atmosphericPressure>] <[-t] temp1 [[-d]|-r <dewpointOrRelativeHumidity>]> [[-t] temp2 [[-d]|-r <dewpointOrRelativeHumidity>]]`);
	logger.info("Calculates saturation partial pressure of water vapor for temp1, actual partial pressure/relative humidity for temp1 at dewpoint/frostpoint, and for temp2 at equal pressure, or rh2, if provided");
	logger.info("-h Show this help");
	logger.info("-c Temperatures specified in degrees Celsius [default]");
	logger.info("-f Temperatures specified in degrees Fahrenheit");
	logger.info("-k Temperatures specified in Kelvin");
	logger.info("-p Atmospheric pressure in hPa [default = 1013.25]");
	logger.info("-r Relative humidity in % at temp1 [calculate dewpoint]");
	logger.info("-d Dewpoint [calculate relative humidity]");
}

function main(argv) {
	const nodeExecutable = argv.shift();
	const script = argv.shift();

	if (argv.length == 0 || argv[0] === '-h') {
		return usage(script);
	}
	const calc = new RHCalc();
	while (argv.length > 0) {
		let arg = argv.shift();
		if (arg === '-c' || arg === '-f' || arg === '-k') {
			calc.setTempUnits(arg[1]);
		} else if (arg === '-p') {
			calc.setPressure(argv.shift());
		} else if (arg === '-t') {
			calc.addTemp(argv.shift());
		} else if (arg === '-d') {
			calc.addDewpoint(argv.shift());
		} else if (arg === '-r') {
			calc.addHumidity(argv.shift());
		} else {
			calc.addParam(arg);
		}
	}

	calc.calculate();
	calc.printResult();
}

function test() {
	_test();
}

main(process.argv);
test();
