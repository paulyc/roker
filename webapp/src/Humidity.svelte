<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.js';
	import Temp from './Temp.svelte';

	let dispatch = createEventDispatcher();

	export let tempC;
	export let dewpointC=20;
	export let P_a = Physics.StdAtmosphere;
	export let P_w;
	let P_sl = Physics.StdAtmosphere;
	let P_a_alt = Physics.StdAtmosphere;
	let P_s;
	let relativeHumidity=Physics.RHFromDewpoint(tempC, dewpointC);
	let absoluteHumidity;
    let humidityRatio;
	let altitude=0;
	let debounce=0;

	$: P_a_alt = Physics.AltitudePressureCoeff(altitude, tempC); // ?? cant be right
	$: P_s = Physics.SaturationPressure(tempC);
	$: P_w = Physics.PressureFromDewpoint(tempC, dewpointC);
	$: absoluteHumidity = Physics.AbsoluteHumidity(tempC, P_w, P_a);
	$: humidityRatio = Physics.HumidityRatio(P_w, P_a);

	function updateRH(evt) {
		relativeHumidity = evt.target.value;
		debounce=Date.now();
		setTimeout(() => {if (Date.now()-debounce>=900)debounce=0;}, 1000);
		dewpointC = Physics.DewpointFromRH(tempC, relativeHumidity);
		P_w = Physics.PressureFromRH(tempC, relativeHumidity);
		dispatch('update', {P_w});
	}
	function updateDewpoint(evt) {
		if (debounce)return;
		dewpointC = evt.detail.c;
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
		P_w = Physics.PressureFromDewpoint(tempC, dewpointC);
		dispatch('update', {P_w});
	}
	export function updateAtmosphericPressure(P) {
		if (P!==void 0) P_sl=P;
		P_a = P_sl;
		dispatch('update',{P_a});
	}
	export function updatePartialPressure(P) {
		P_w = P;
		dewpointC = Physics.DewpointFromPressure(tempC, P_w);
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
	}
	export function updateTemp(T) {
		tempC = T;
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
	}
</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
	<legend>Humidity</legend>
	<Temp c={dewpointC} on:temp={updateDewpoint}><legend>Dewpoint/Frostpoint</legend></Temp>
	<label><input step=0.1 type=number value={relativeHumidity} on:input="{updateRH}"> % Relative Humidity</label>
	<label><input step=0.1 type=number bind:value="{P_sl}" on:input={e=>updateAtmosphericPressure(e.target.value)}> hPa Atmospheric Pressure</label>
	<!--label>At<input step=1 type=number bind:value={altitude}> m Altitude =<input step=0.01 type=number bind:value={P_a_alt} disabled> hPa Atmospheric Pressure</label-->
	<label><input step=0.01 type=number value="{P_w}"> hPa Partial Pressure H<sub>2</sub>O</label>
	<details><fieldset>
		<label><input step=0.0001 type=number value="{(1e3*absoluteHumidity)}"> g/m<sup>3</sup> Absolute Humidity</label>
		<label><input step=0.0001 type=number value="{(100*humidityRatio)}"> % Humidity Ratio (mass H<sub>2</sub>O:total airmass)</label>
		<label><input step=0.01 type=number value="{P_s}"> hPa Saturation Pressure H<sub>2</sub>O</label>
	</fieldset></details>
	</fieldset>
