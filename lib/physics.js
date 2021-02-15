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

/**
 * See Arden Buck equation, accurate in range -80 to 50 C
 * https://en.wikipedia.org/wiki/Arden_Buck_equation
 * Temperatures in Celsius
 */
const StdAtmosphere = 1013.25; // hPa
const ABParams = {
	a: t => t > 0 ? 6.1121 : 6.1115,
	b: t => t > 0 ? 18.678 : 23.036,
	c: t => t > 0 ? 257.14 : 279.82,
	d: t => t > 0 ? 234.5 : 333.7,
};
const ardenBuckConstant = t => Math.exp((ABParams.b(t) - t/ABParams.d(t))*(t/(ABParams.c(t)+t)));
const gammaFromDewpoint = (t, dp) => (dp * ABParams.b(t)) / (ABParams.c(t) + dp);
// rh = 100.0 * exp(gamma) / ardenBuckParam(temp)
// aBP(temp) * rh/100.0 = exp(gamma)
// gamma = ln(aBP(temp)*rh/100))
const gammaFromRH = (t, rh) => Math.log(ardenBuckConstant(t) * rh/100.0);

const PressureFromDewpoint = (t, dp) => ABParams.a(t) * Math.exp(gammaFromDewpoint(t, dp));
const DewpointFromPressure = (t, p) => ABParams.c(t)*Math.log(p/ABParams.a(t))/(ABParams.b(t) - Math.log(p/ABParams.a(t)));//dp=c*ln(pressure/a))/(b-ln(pressure/a))

const RHFromDewpoint = (t, dp) => 100.0 * Math.exp(gammaFromDewpoint(t, dp)) / ardenBuckConstant(t, dp);
const PressureFromRH = (t, rh) => ABParams.a(t) * Math.exp(gammaFromRH(t, rh));
const DewpointFromRH = (t, rh) => DewpointFromPressure(t, PressureFromRH(t, rh));
const SaturationPressure = t => ABParams.a(t) * ardenBuckConstant(t);

const DegreesCtoF = c => c * 9.0 / 5.0 + 32.0;
const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);
const DegreesCtoK = c => c + 273.15;
const DegreesKtoC = k => k - 273.15;

module.exports = {
    StdAtmosphere,
    ABParams,
    ardenBuckConstant,
    gammaFromDewpoint,
    gammaFromRH,
    PressureFromDewpoint,
    DewpointFromPressure,
    RHFromDewpoint,
    PressureFromRH,
    DewpointFromRH,
    SaturationPressure,
    DegreesCtoF,
    DegreesFtoC,
    DegreesCtoK,
    DegreesKtoC,
};

