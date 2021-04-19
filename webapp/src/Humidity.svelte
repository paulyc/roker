<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.js';
	import Temp from './Temp.svelte';

	let dispatch = createEventDispatcher();

	//dewpoint
	export let tempC;
	export let dewpointC=0;
	export let P_a = Physics.StdAtmosphere;
	export let P_w;
	let P_s;
	let relativeHumidity;
	let absoluteHumidity;
    let humidityRatio;

	$: relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
	$: P_s = Physics.SaturationPressure(tempC);
	$: P_w = Physics.PressureFromDewpoint(tempC, dewpointC);
	$: absoluteHumidity = Physics.AbsoluteHumidity(tempC, P_w, P_a);
	$: humidityRatio = Physics.HumidityRatio(P_w, P_a);

	function updateRH(evt) {
		relativeHumidity = evt.target.value;
		dewpointC = Physics.DewpointFromRH(tempC, relativeHumidity);
		P_w = Physics.PressureFromRH(tempC, relativeHumidity);
		dispatch('update', {P_w});
	}
	function updateDewpoint(evt) {
		dewpointC = evt.detail.c;
		dispatch('update', {P_w});
	}
	function updateAtmosphericPressure(evt) {
		P_a = evt.target.value;
		dispatch('update',{P_a});
	}
	export function fixedPressure(P) {
		P_w = P;
		dewpointC = Physics.DewpointFromPressure(tempC, P_w);
	}
</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
	<legend>Humidity</legend>
	<Temp bind:c={dewpointC} on:temp={updateDewpoint} id=tempctl><legend>Dewpoint/Frostpoint</legend></Temp>
	<label><input step=0.1 type=number value={relativeHumidity} on:input="{updateRH}"> % Relative Humidity</label>
	<details><fieldset>
		<label><input step=0.0001 type=number value="{(1e3*absoluteHumidity)}"> g/m<sup>3</sup> Absolute Humidity</label>
		<label><input step=0.0001 type=number value="{(100*humidityRatio)}"> % Humidity Ratio (mass H<sub>2</sub>O:total airmass)</label>
		<label><input step=0.01 type=number value="{P_a}" on:input={updateAtmosphericPressure}> hPa Atmospheric Pressure</label>
		<label><input step=0.01 type=number value="{P_s}"> hPa Saturation Pressure H<sub>2</sub>O</label>
		<label><input step=0.01 type=number value="{P_w}"> hPa Partial Pressure H<sub>2</sub>O</label>
	</fieldset></details>
</fieldset>
