<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import PressureConvert from './Pressure.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
import * as Physics from '../../lib/physics.js';
let c;
let f;
let k;

	function setFromC(value) {
		c = +value;
        k = c + 273.15;
		f = +(32 + (9 / 5 * c)).toFixed(1);
	}

	function setFromF(value) {
		f = +value;
		c =+(5 / 9 * (f - 32)).toFixed(1);
        k = c + 273.15;
	}

    function setFromK(value) {
        k = +value;
        c = k - 273.15;
		f = +(32 + (9 / 5 * c)).toFixed(1);
	}
console.log(JSON.stringify(Physics));
let tempC;
let P_w = Physics.default.SaturationPressure(tempC);
let P_a = Physics.default.StdAtmosphere;
let relativeHumidity;
	 let absoluteHumidity;
     let humidityRatio;

	function setFromRH(value) {
		relativeHumidity = +value;
	}

	function setFromAH(value) {
		absoluteHumidity = +value;
	}

    function setFromH(value) {
		humidityRatio = +value;
	}
</script>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            <label for=temp1>Temperature</label>
            <TempConvert bind:tempC={c}/>
        </li>
        <li>
            <label for=humid1>Humidity</label>
            <HumidityConvert/>
        </li>
        <li>
            <label for=press1>Pressure
            <PressureConvert {tempC}/></label>
        </li>
        <li>
            <label for=enthalpy1>Enthalpy
            <EnthalpyConvert {tempC} {P_w} {P_a}/></label>
        </li>
    </ul>
</fieldset>
