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

const math = require('mathjs');

 /**
  * Calculate indoor/outdoor relative humidity from (outdoor) dewpoint and
  * (indoor/outdoor) temperatures.
  */

const Constants = {
    a: math.unit('6.1121 hPa'),
    b: math.unit('18.678'), // unitless
    c: math.unit('257.14 degC'),
    d: math.unit('234.5 degC'),
    atm: math.unit('1013.25 hPa'),
};

/*
RHCalc.a * Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
	this.gamma = (dewpoint * RHCalc.b) / (RHCalc.c + dewpoint);
	this.outdoorRH = 100 * Math.exp(this.gamma) /  Math.exp((RHCalc.b - outdoorTemp/RHCalc.d) * (outdoorTemp / (RHCalc.c + outdoorTemp)));
	// actual vapor pressure
	this.P_a = RHCalc.a * Math.exp(this.gamma);
	this.indoorRH = 100 * Math.exp(this.gamma) /  Math.exp((RHCalc.b - indoorTemp/RHCalc.d) * (indoorTemp / (RHCalc.c + indoorTemp)));
*/
const SaturatedVaporPressureAtTemp = temp => math.multiply(
    Constants.a,
    math.exp(
        math.multiply(
            Constants.b - math.divide(temp, Constants.d),
            math.divide(temp, math.add(Constants.c, temp))
        )
    )
);

const Gamma = dewpoint => math.divide(math.multiply(Constants.b, dewpoint), math.add(Constants.c, dewpoint));
const VaporPressureAtDewpoint = dewpoint => math.multiply(Constants.a, math.exp(Gamma(dewpoint)));

const RelativeHumidityAtTempAndDewpoint = (temp, dewpoint) =>  math.divide(
    math.exp(Gamma(dewpoint)),
    math.exp(
        math.multiply(
            math.subtract(Constants.b, math.divide(temp, Constants.d)),
            math.divide(temp, math.add(Constants.c, temp))
        )
    )
);

const RHConvert = (indoorTemp, outdoorTemp, dewpoint) => {
    const result = {
        indoorTemp: math.unit(indoorTemp),
        outdoorTemp: math.unit(outdoorTemp),
        dewpoint: math.unit(dewpoint),
    };
    result.saturatedVaporPressure = SaturatedVaporPressureAtTemp(result.outdoorTemp);
    result.actualVaporPressure = VaporPressureAtDewpoint(result.dewpoint);
    result.indoorRelativeHumidity = RelativeHumidityAtTempAndDewpoint(result.indoorTemp, result.dewpoint);
    result.outdoorRelativeHumidity = RelativeHumidityAtTempAndDewpoint(result.outdoorTemp, result.dewpoint);
    return result;
};

module.exports = RHConvert;
