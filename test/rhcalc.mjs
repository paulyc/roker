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

import RHCalc from '../lib/rhcalc.mjs';
import assert from 'assert';

export default function Test() {
    //"-c 7.8 -0.6 22.8"
	//Saturation pressure = [10.58 hPa] Partial pressure at dewpoint/frostpoint = [5.85 hPa]
	//Calculated RH at temp 1 = [55.3%] RH at temp 2 = [21.1%]
	let dp = -0.6;
	let t_out = 7.8;
	let t_in = 22.8;
	let calc = new RHCalc();
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	let x = calc.outputs[0];
	let y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_w.toFixed(2), '5.85');
	assert.strictEqual(x.rh.toFixed(1), '55.3');
	assert.strictEqual(y.rh.toFixed(1), '21.1');

	//-r 55.3 7.8 22.8
	// unsure if correct
	let rh = 55.3;
	t_out = 7.8;
	t_in = 22.8;
	calc = new RHCalc();
	calc.addTemp(t_out);
	calc.addHumidity(rh);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.58');
	assert.strictEqual(x.P_w.toFixed(2), '5.85');
	assert.strictEqual(y.P_w.toFixed(2), '5.85');
	assert.strictEqual(x.dp.toFixed(1), '-0.6');
	assert.strictEqual(y.rh.toFixed(1), '21.1');

	//"-f 46 31 73"
	//Saturation pressure = [10.57 hPa] Partial pressure at dewpoint/frostpoint = [5.87 hPa]
	//Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	dp = 31;
	t_out = 46;
	t_in = 73;
	calc = new RHCalc();
	calc.setTempUnits('F');
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '10.57');
	assert.strictEqual(x.P_w.toFixed(2), '5.87');
	assert.strictEqual(x.rh.toFixed(1), '55.6');
	assert.strictEqual(y.rh.toFixed(1), '21.2');

	// might not be quite exactly accurate but good enough
	//"-p 900 -f 46 31 73"
	// Saturation pressure = [9.39 hPa] Partial pressure at dewpoint/frostpoint = [5.21 hPa]
	// Calculated RH at temp 1 = [55.6%] RH at temp 2 = [21.2%]
	let atm = 900;
	calc = new RHCalc();
	calc.setTempUnits('F');
	calc.setPressure(atm);
	calc.addTemp(t_out);
	calc.addDewpoint(dp);
	calc.addTemp(t_in);
	calc.calculate();
	x = calc.outputs[0];
	y = calc.outputs[1];
	assert.strictEqual(x.P_s.toFixed(2), '9.39');
	assert.strictEqual(x.P_w.toFixed(2), '5.21');
	assert.strictEqual(x.rh.toFixed(1), '55.6');
	assert.strictEqual(y.rh.toFixed(1), '21.2');

	calc = new RHCalc();
	calc.addTemp(25);
	calc.calculate();
};
