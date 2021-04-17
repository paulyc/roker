<script>
import Temp from './Temp.svelte';
import Humidity from './Humidity.svelte';
import * as Physics from '../../lib/physics.js';
import {createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

let T = 0;
let P_s=Physics.SaturationPressure(T);
let P_a=Physics.StdAtmosphere;
let P_w=Physics.PressureFromDewpoint(T,0);
let humidity;
let h_air,h_dry_air,h_sat_air,h_h2o;

$:  h_air = Physics.SpecificEnthalpyAir(T,P_w,P_a);
$:  h_dry_air = Physics.SpecificEnthalpyDryAir(T,P_a);
$:  h_sat_air = Physics.SpecificEnthalpySaturatedAir(T,P_a);
$:  h_h2o = Physics.SpecificEnthalpyH2O(T,P_w,P_a);
$:  dispatch('update',{
        T,
        P_w,P_s,P_a,
        h_air,h_dry_air,h_sat_air,h_h2o
    });

function updateTemp(evt) {
    T = +evt.detail.c;
}

export function constantPressure(P_w_fixed) {
    humidity.constantPressure(P_w_fixed);
}

</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            Temperature<br>
            <Temp c={T} on:temp="{updateTemp}"/>
        </li>
        <li>
            Humidity<br>
            <Humidity bind:this={humidity} tempC={T} bind:P_w />
        </li>
        <li>
	        <input value={h_dry_air} on:input type=number> kJ/kg Specific Enthalpy (Dry Air)<br>
	        <input value={h_sat_air} on:input type=number> kJ/kg Specific Enthalpy (Saturated Air)<br>
            <input value={h_h2o} on:input type=number> kJ/kg Specific Enthalpy (H<sub>2</sub>O/Latent)<br>
            <input value={h_air} on:input type=number> kJ/kg Specific Enthalpy<br>
        </li>
    </ul>
</fieldset>
