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
	let P_a_alt;
	let P_s;
	let relativeHumidity=Physics.RHFromDewpoint(tempC, dewpointC);
	let altCoeff;
	let absoluteHumidity;
    let humidityRatio,mixingRatio;
	let altitude=0;
	let debounce=0;

	$: altCoeff = Physics.AltitudePressureCoeff(altitude, tempC);
	$: P_a_alt = P_sl*altCoeff;
	$: P_a = P_a_alt;
	$: P_s = Physics.SaturationPressure(tempC)*altCoeff;
	$: P_w = Physics.PressureFromDewpoint(tempC, dewpointC)*altCoeff;
	$: absoluteHumidity = Physics.AbsoluteHumidity(tempC, P_w, P_a);
	$: humidityRatio = Physics.HumidityRatio(P_w, P_a);
	$: mixingRatio = Physics.MixingRatio(tempC,P_w,P_a);
//	$: dewpointC = Physics.DewpointFromPressure(tempC, P_w);
//	$: relativeHumidity = Physics.RHFromPressure(tempC, P_w);

	function updateRH(evt) {
		if (debounce)return;
		relativeHumidity = evt.target.value;
		debounce=Date.now();
		setTimeout(() => {if (Date.now()-debounce>=5)debounce=0;}, 5);
		dewpointC = Physics.DewpointFromRH(tempC, relativeHumidity);
		P_w = Physics.PressureFromRH(tempC, relativeHumidity);
		dispatch('update', {P_w});
	}
	function updateDewpoint(evt) {
		if (debounce)return;
		debounce=Date.now();
		setTimeout(() => {if (Date.now()-debounce>=5)debounce=0;}, 5);
		dewpointC = evt.detail.c;
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
		P_w = Physics.PressureFromDewpoint(tempC, dewpointC);
		dispatch('update', {P_w});
	}
	export function updateAtmosphericPressure(P) {
		if (P) {
			P_sl=P;
			altitude=altitude;
		}
		dispatch('update',{P_a});
	}
	export function updatePartialPressure(P) {
		if (P) {
			P_w = P;
		}
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
	<label><input step=0.1 type=number value={relativeHumidity} on:input="{updateRH}">% Relative Humidity</label>
	<label><input step=0.1 type=number bind:value="{P_a}" on:input={updateAtmosphericPressure(void 0)}>hPa Atmospheric Pressure</label>
	<label><input step=10 type=number bind:value={altitude}>m Altitude</label>
	<label><input step=0.01 type=number value="{P_w}">hPa Partial Pressure H<sub>2</sub>O</label>
	<details><fieldset>
		<label><input step=0.0001 type=number value="{(1e3*absoluteHumidity)}">g/m<sup>3</sup> Volumetric (Absolute) Humidity</label>
		<label><input step=0.0001 type=number value="{(100*humidityRatio)}">% Humidity Ratio (mass H<sub>2</sub>O:total airmass)</label>
		<label><input step=0.0001 type=number value="{(1000*mixingRatio)}">g/kg Specific Humidity (Mixing Ratio, mass H<sub>2</sub>O:mass dry air)</label>
		<label><input step=0.01 type=number value="{P_s}">hPa Saturation Pressure H<sub>2</sub>O</label>
	</fieldset></details>
</fieldset>
