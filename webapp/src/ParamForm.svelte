<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
import PressureConvert from './Pressure.svelte';
import * as Physics from '../../lib/physics.js';

console.log(JSON.stringify(Physics));
let tempC=0;
let dewpoint=0;
let rh;
let P_w;
let P_s;
let P_a = Physics.StdAtmosphere;
let h;
let h_a;
let h_w;
let h_s;

function updateTemp(evt) {
    tempC = evt.target.value;
    P_s = Physics.SaturationPressure(tempC);
    if ('number'===typeof dewpoint) {
        P_w = Physics.PressureFromDewpoint(tempC, dewpoint);
    } else if ('number'===typeof rh) {
        P_w = Physics.PressureFromRH(tempC, rh);
    }
}

function updateHumidity() {
    if ('number'===typeof dewpoint) {
        P_w = Physics.PressureFromDewpoint(tempC, dewpoint);
    } else if ('number'===typeof rh) {
        P_w = Physics.PressureFromRH(tempC, rh);
    }
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
            <TempConvert bind:c={tempC} on:input on:input="{updateTemp}"/>
        </li>
        <li>
            Humidity<br>
            <HumidityConvert {dewpoint} bind:tempC={tempC} {P_a} bind:P_w="{P_w}" P_s="{P_s}" on:input="{updateHumidity}"/>
        </li>
        <!--li>
            Pressure<br>
            <PressureConvert bind:P_w="{P_w}" bind:P_s="{P_s}" bind:P_a="{P_a}" on:input="{updatePressure}"/>
        </li-->
        <li>
            Enthalpy<br>
            <EnthalpyConvert bind:h="{h}" bind:h_w="{h_w}" bind:h_a="{h_a}" bind:h_s="{h_s}" on:input="{updateEnthalpy}"/>
        </li>
    </ul>
</fieldset>
