<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
import * as Physics from '../../lib/physics.js';

console.log(JSON.stringify(Physics));
let tempC;
let P_w;
let P_s;
let P_a;
let rh;
function update(e) {
}


</script>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            <label for=temp1>Temperature</label>
            <TempConvert bind:c="{tempC}" on:input="{update}"/>
        </li>
        <li>
            <label for=humid1>Humidity</label>
            <HumidityConvert bind:relativeHumidity={rh} on:input="{update}"/>
        </li>
        <li>
            <label for=enthalpy1>Enthalpy</label>
            <EnthalpyConvert on:input="{update}"/>
        </li>
    </ul>
</fieldset>
