//
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
//

import {
	StdAtmosphere,
	DegreesCtoF,
	DegreesFtoC,
	DegreesCtoK,
	SpecificEnthalpyDryAir,
	SpecificEnthalpyH2O,
	HumidityRatio,
	SaturationPressure,
	SpecificEnthalpyAir,
	DensityAir_H,
	DensityAir,
	DensityDryAir,
	DensityH2O_g,
	AltitudePressureCoeff,
	MolarMassAir,
	MolarMass,
} from '../lib/physics.mjs';

import assert from 'assert';
const eq = assert.strictEqual;

export default function Test() {
	TestCtoF();
	TestFtoC();
	TestCtoK();
	TestDensity();
	TestEnthalpy();
	TestAltitudePressure();
};

function TestCtoF() {
	assert.strictEqual(DegreesCtoF(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesCtoF(0).toFixed(1), '32.0');
	assert.strictEqual(DegreesCtoF(10).toFixed(1), '50.0');
	assert.strictEqual(DegreesCtoF(20).toFixed(1), '68.0');
	assert.strictEqual(DegreesCtoF(30).toFixed(1), '86.0');
}
function TestFtoC() {
	assert.strictEqual(DegreesFtoC(-40).toFixed(1), '-40.0');
	assert.strictEqual(DegreesFtoC(32).toFixed(1), '0.0');
	assert.strictEqual(DegreesFtoC(50).toFixed(1), '10.0');
	assert.strictEqual(DegreesFtoC(68).toFixed(1), '20.0');
	assert.strictEqual(DegreesFtoC(86).toFixed(1), '30.0');
}

function TestCtoK() {
	assert.strictEqual(DegreesCtoK(-273.15).toFixed(1), '0.0');
	assert.strictEqual(DegreesCtoK(-40).toFixed(2), (273.15-40).toFixed(2));
	assert.strictEqual(DegreesCtoK(0).toFixed(2), '273.15');
	assert.strictEqual(DegreesCtoK(40).toFixed(2), (273.15+40).toFixed(2));
}

function TestDensity() {
	eq(DensityDryAir(25,StdAtmosphere).toFixed(2),
	    '1.18');
	eq(DensityAir_H(HumidityRatio(30,StdAtmosphere),25,StdAtmosphere).toFixed(2),
	    '1.17');
	eq( DensityAir_H(HumidityRatio(30,StdAtmosphere),25,StdAtmosphere).toFixed(2),
	    DensityAir(25,30,StdAtmosphere).toFixed(2));
}

// Did not check these values for sure
function TestAltitudePressure() {
	eq(AltitudePressureCoeff(0,25).toFixed(1),'1.0');
	eq(AltitudePressureCoeff(100,25).toFixed(3),'0.989');
	eq(AltitudePressureCoeff(1000,25).toFixed(3),'0.892');
	eq(AltitudePressureCoeff(10000,25).toFixed(3),'0.318');
	eq(MolarMassAir.toFixed(2), MolarMass.Air.toFixed(2));
}

function TestEnthalpy() {
	// SpecificEnthalpyAir saturated at 25 c should be about 76.09 kJ/kg
	//assert.strictEqual(SpecificEnthalpyH2O(0,0,StdAtmosphere)+'',"2501");
	assert.strictEqual(SaturationPressure(25).toFixed(0),"32");
	assert.strictEqual(SpecificEnthalpyAir(25,SaturationPressure(25),StdAtmosphere).toFixed(0),"76");
	assert.strictEqual(SpecificEnthalpyDryAir(25).toFixed(0), "25");
	// hmm which is correct 51 or 61?
	assert.strictEqual(SpecificEnthalpyH2O(25,SaturationPressure(25),StdAtmosphere).toFixed(0), "51");
	assert.strictEqual(
		SpecificEnthalpyH2O(25,SaturationPressure(25),StdAtmosphere).toFixed(0),
		(SpecificEnthalpyAir(25,SaturationPressure(25),StdAtmosphere)-SpecificEnthalpyDryAir(25)).toFixed(0)
	);
}
