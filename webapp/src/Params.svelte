<script>
import Temp from './Temp.svelte';
import * as Physics from '../../lib/physics.js';
import {createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

let T = 0;
let dewpoint = 0;
let relativeHumidity;
let absoluteHumidity,humidityRatio;
let P_w,P_s,P_a = Physics.StdAtmosphere;
let h_air,h_dry_air,h_sat_air,h_h2o;

function updateTemp(t) {
    T = +t;
    dewpoint=dewpoint;
}

function updateHumidity(rh) {
    dewpoint = Physics.DewpointFromRH(T, +rh);
    T=T;
}

function updateDewpoint(dp) {
    dewpoint = +dp;
    T=T;
}

$:  relativeHumidity = Physics.RHFromDewpoint(T, dewpoint);
$:  P_s = Physics.SaturationPressure(T);
$:  P_w = Physics.PressureFromDewpoint(T, dewpoint);
$:  humidityRatio = Physics.HumidityRatio(P_w,P_a);
$:  absoluteHumidity = Physics.AbsoluteHumidity(T,P_w,P_a);

$:  h_air = Physics.SpecificEnthalpyAir(T,P_w,P_a);
$:  h_dry_air = Physics.SpecificEnthalpyDryAir(T,P_a);
$:  h_sat_air = Physics.SpecificEnthalpySaturatedAir(T,P_a);
$:  h_h2o = Physics.SpecificEnthalpyH2O(T,P_w,P_a);
$:  dispatch('update',{
        T,dewpoint,
        relativeHumidity,absoluteHumidity,humidityRatio,
        P_w,P_s,P_a,
        h_air,h_dry_air,h_sat_air,h_h2o
    });


export function constantPressure(P_w_fixed,P_s_fixed,P_a_fixed) {
    P_w = P_w_fixed;
    P_s = P_s_fixed;
    P_a = P_a_fixed;
    updateDewpoint(Physics.DewpointFromPressure(T, P_w));
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
            <Temp c={T} on:temp="{e=>updateTemp(e.detail.c)}"/>
        </li>
        <li>
            Dewpoint/Frostpoint<br>
            <Temp c={dewpoint} on:temp={e=>updateDewpoint(e.detail.c)}/><br>
            <input type=number value={relativeHumidity} on:input="{e=>updateHumidity(+e.target.value)}"> % Relative Humidity =<br>
            <input type=number disabled value="{(1e3*absoluteHumidity)}"> g/m^3 Absolute Humidity =<br>
            <input type=number disabled value="{(100*humidityRatio)}"> % Humidity Ratio (mass H<sub>2</sub>O:total airmass)<br>
            <input type=number value="{P_a}"> hPa Atmospheric Pressure<br>
            <input type=number value="{P_s}"> hPa Saturated Pressure H<sub>2</sub>O<br>
            <input type=number value="{P_w}"> hPa Partial Pressure H<sub>2</sub>O<br>
        </li>
        <li>
	        <input value={h_dry_air} on:input type=number> kJ/kg Specific Enthalpy (Dry Air)<br>
	        <input value={h_sat_air} on:input type=number> kJ/kg Specific Enthalpy (Saturated Air)<br>
            <input value={h_h2o} on:input type=number> kJ/kg Specific Enthalpy (H<sub>2</sub>O/Latent)<br>
            <input value={h_air} on:input type=number> kJ/kg Specific Enthalpy<br>
        </li>
    </ul>
</fieldset>
