<script>
import Temp from './Temp.svelte';
import Humidity from './Humidity.svelte';
import * as Physics from '../../lib/physics.js';
import {createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

let T = 25;
let P_s=Physics.SaturationPressure(T);
let P_a=Physics.StdAtmosphere;
let P_w=Physics.PressureFromDewpoint(T,0);
let humidity;
let h_air,h_dry_air,h_sat_air,h_h2o;
let density,O2pressure,O2volratio,O2massratio,O2absolute;


$:  h_air = Physics.SpecificEnthalpyAir(T,P_w,P_a);
$:  h_dry_air = Physics.SpecificEnthalpyDryAir(T,P_a);
$:  h_sat_air = Physics.SpecificEnthalpySaturatedAir(T,P_a);
$:  h_h2o = Physics.SpecificEnthalpyH2O(T,P_w,P_a);

$: density=Physics.DensityAir(T,P_w,P_a);
$: O2pressure=Physics.PartialPressure('O2',P_w,P_a);
$: O2volratio = Physics.VolumeRatio('O2',P_w,P_a);
$: O2massratio=Physics.MassRatio('O2',T,P_w,P_a);
$: O2absolute=Physics.AbsoluteMass('O2',T,P_w,P_a);

$:  dispatch('update',{
        T,
        P_w,P_s,P_a,
        h_air,h_dry_air,h_sat_air,h_h2o,
        density,O2pressure,O2volratio,O2massratio,O2absolute
    });

function updateTemp(evt) {
    T = evt.detail.c;
}

export function fixedPressure(P_w_fixed) {
    humidity.updatePartialPressure(P_w_fixed);
}

</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
    <legend>params</legend>
    <Temp c={T} on:temp="{updateTemp}"><legend>Temperature</legend></Temp>
    <Humidity bind:this={humidity} tempC={T} bind:P_w bind:P_a />
    <fieldset>
        <legend>Enthalpy</legend>
        <details>
            <label><input value={h_dry_air} on:input type=number step=0.01> kJ/kg Specific Enthalpy (Dry Air)</label>
            <label><input value={h_sat_air} on:input type=number step=0.01> kJ/kg Specific Enthalpy (Saturated Air)</label>
            <label><input value={h_h2o} on:input type=number step=0.01> kJ/kg Specific Enthalpy (H<sub>2</sub>O/Latent)</label>
            <label><input value={h_air} on:input type=number step=0.01> kJ/kg Specific Enthalpy</label>
        </details>
    </fieldset>
    <fieldset>
        <legend>Pressure/Density</legend>
        <details>
            <label><input type=number step=0.01 value={density}>Air Density (kg/m<sup>3</sup>)</label>
            <label><input type=number step=0.01 value={O2pressure}>hPa Partial Pressure O<sub>2</sub></label>
            <label><input type=number step=0.01 value={1000*O2absolute}>g/m<sup>3</sup> Absolute Density O<sub>2</sub></label>
            <label><input type=number step=0.01 value={100*O2volratio}>% O<sub>2</sub> (Volume)</label>
            <label><input type=number step=0.01 value={100*O2massratio}>% O<sub>2</sub> (Mass)</label>
        </details>
    </fieldset>
</fieldset>
