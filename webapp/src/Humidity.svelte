<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.mjs';
	import Temp from './Temp.svelte';

	let dispatch = createEventDispatcher();

	let tempComponent;
	export let tempC=25;
	export let dewpointC=20;
	export let P_a;
	export let P_w;
	export let P_sl=Physics.StdAtmosphere;
	let P_s;
	let relativeHumidity=Physics.RHFromDewpoint(tempC, dewpointC);
	let altCoeff;
	let absoluteHumidity;
    let humidityRatio,mixingRatio;
	let altitude=0;
	let debounce=0;

	$: altCoeff = Physics.AltitudePressureCoeff(altitude, tempC);
	$: P_a = P_sl*altCoeff;
	$: P_s = Physics.SaturationPressure(tempC)*altCoeff;
	$: P_w = Physics.PressureFromDewpoint(tempC, dewpointC)*altCoeff;
	//$: dewpointC = Physics.DewpointFromPressure(tempC, P_w);
	//$: relativeHumidity = Physics.RHFromPressure(tempC, P_w);
	$: absoluteHumidity = Physics.AbsoluteHumidity(tempC, P_w, P_a);
	$: humidityRatio = Physics.HumidityRatio(P_w, P_a);
	$: mixingRatio = Physics.MixingRatio(tempC,P_w,P_a);

	function updateRH({target:{value}}) {
		if (debounce || value == null)return;
		debounce=Date.now();
		setTimeout(() => {debounce=0;}, 5);
		relativeHumidity = value;
		dewpointC = Physics.DewpointFromRH(tempC, relativeHumidity);
		P_w = Physics.PressureFromRH(tempC, relativeHumidity);
		dispatch('update', {P_w});
	}
	function updateDewpoint({detail:{c}}) {
		if (debounce || c == null)return;
		debounce=Date.now();
		setTimeout(() => {debounce=0;}, 5);
		dewpointC = c;
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
		P_w = Physics.PressureFromDewpoint(tempC, dewpointC);
		dispatch('update', {P_w});
	}
	export function updateAtmosphericPressure(P) {
		if (P != null) {
			P_a=P;
			altitude=altitude;
		}
		dispatch('update',{P_a});
	}
	export function updatePartialPressure(P) {
		if (P != null) {
			P_w = P;
		}
		dewpointC = Physics.DewpointFromPressure(tempC, P_w);
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
	}
	export function updateTemp(T) {
		if (T == null) return;
		tempC = T;
		relativeHumidity = Physics.RHFromDewpoint(tempC, dewpointC);
	}
	export function updateAltitude({target:{value}}) {
		if (value == null) return;
		altitude = value;
		dispatch('update',{altitude});
	}
</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
	<legend>Humidity</legend>
	<Temp bind:this={tempComponent} c={dewpointC} on:temp={updateDewpoint}><legend>Dewpoint/Frostpoint</legend></Temp>
	<label><input step=0.1 type=number value={relativeHumidity} on:input="{updateRH}">% Relative Humidity</label>
	<label><input step=0.1 type=number value="{P_a}" on:input={e=>updateAtmosphericPressure(e.target.value)}>hPa Atmospheric Pressure</label>
	<label><input step=10 type=number bind:value={altitude} on:input={updateAltitude}>m Altitude</label>
	<label><input step=0.01 type=number value="{P_w}">hPa Partial Pressure H<sub>2</sub>O</label>
	<details><fieldset>
		<label><input step=0.0001 type=number value="{(1e3*absoluteHumidity)}">g/m<sup>3</sup> Volumetric (Absolute) Humidity</label>
		<label><input step=0.0001 type=number value="{(100*humidityRatio)}">% Humidity Ratio (mass H<sub>2</sub>O:total airmass)</label>
		<label><input step=0.0001 type=number value="{(1000*mixingRatio)}">g/kg Specific Humidity (Mixing Ratio, mass H<sub>2</sub>O:mass dry air)</label>
		<label><input step=0.01 type=number value="{P_s}">hPa Saturation Pressure H<sub>2</sub>O</label>
	</fieldset></details>
</fieldset>
