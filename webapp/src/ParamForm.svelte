<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
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
    tempC = evt.target ? evt.target.value : evt.detail.c;
    P_s = Physics.SaturationPressure(tempC);
    updateEnthalpy();
}

function updateHumidity(e) {
    if (e.detail.dewpoint !== void 0) {
        P_w = Physics.PressureFromDewpoint(tempC, dewpoint);
        rh = Physics.RHFromDewpoint(tempC, dewpoint);
    } else if (e.detail.rh !== void 0) {
        P_w = Physics.PressureFromRH(tempC, rh);
        dewpoint = Physics.DewpointFromRH(tempC, rh);
    }
    updateEnthalpy();
}

function updateEnthalpy() {
    P_w = Physics.PressureFromDewpoint(tempC,dewpoint);
    h = Physics.SpecificEnthalpyAir(tempC, P_w, P_a);
    h_a = Physics.SpecificEnthalpyDryAir(tempC, P_a);
    h_s = Physics.SpecificEnthalpySaturatedAir(tempC, P_a);
    h_w = Physics.SpecificEnthalpyH2O(tempC, P_w, P_a);
}

</script>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            Temperature<br>
            <TempConvert bind:c={tempC} on:input on:update="{updateTemp}"/>
        </li>
        <li>
            Humidity<br>
            <HumidityConvert bind:dewpoint={dewpoint} bind:tempC={tempC} {P_a} bind:rh={rh} bind:P_w="{P_w}" P_s="{P_s}" on:update="{updateHumidity}"/>
        </li>
        <!--li>
            Pressure<br>
            <PressureConvert bind:P_w="{P_w}" bind:P_s="{P_s}" bind:P_a="{P_a}" on:input="{updatePressure}"/>
        </li-->
        <li>
            Enthalpy<br>
            <EnthalpyConvert h="{h}" h_w="{h_w}" h_a="{h_a}" h_s="{h_s}" on:input="{updateEnthalpy}"/>
        </li>
    </ul>
</fieldset>
