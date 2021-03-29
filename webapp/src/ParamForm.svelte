<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
import PressureConvert from './Pressure.svelte';
import * as Physics from '../../lib/physics.js';

console.log(JSON.stringify(Physics));
let tempC;
let dewpoint
let P_w;
let P_s;
let P_a;
let h;
let h_a;
let h_w;
let h_s;

function updateTemp() {

}

function updateHumidity() {

}

function updatePressure() {

}

function updateEnthalpy() {

}

</script>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            Temperature<br>
            <TempConvert bind:c="{tempC}" on:input="{updateTemp}"/>
        </li>
        <li>
            Humidity<br>
            <HumidityConvert bind:dewpoint="{dewpoint}" on:input="{updateHumidity}"/>
        </li>
        <li>
            Pressure<br>
            <PressureConvert bind:P_w="{P_w}" bind:P_s="{P_s}" bind:P_a="{P_a}" on:input="{updatePressure}"/>
        </li>
        <li>
            Enthalpy<br>
            <EnthalpyConvert bind:h="{h}" bind:h_w="{h_w}" bind:h_a="{h_a}" bind:h_s="{h_s}" on:input="{updateEnthalpy}"/>
        </li>
    </ul>
</fieldset>
