<script>
import { tick } from 'svelte';

	import { writable } from 'svelte/store';
	import * as Physics from '../../lib/physics.mjs';
	import Temp from './Temp.svelte';

	export let tempC;
	export let P_a;
	export let P_w;

	export let P_s;
	let relativeHumidity=writable();
	let wetBulbTempC=writable();
	let dewpointC=writable();
	let absoluteHumidity;
	let specificHumidity;
    let humidityRatio;
	let mixingRatio;

	let debounce=0;
	//$: dewpointC = Physics.DewpointFromPressure($tempC, $P_w);
	//$: $relativeHumidity = Physics.RHFromPressure($tempC, $P_w);
	$: absoluteHumidity = Physics.AbsoluteHumidity($tempC, $P_w, $P_a);
	$: specificHumidity = Physics.SpecificHumidity($tempC, $P_w, $P_a);
	$: mixingRatio = Physics.MixingRatio($tempC,$P_w,$P_a);

	let wetbulb;
	let dewpoint;
	$: $relativeHumidity = Physics.RHFromPressure($tempC,$P_w);
	$: $dewpointC = Physics.DewpointFromPressure($tempC,$P_w);
	$: $wetBulbTempC = Physics.WetBulbTemp($tempC,$relativeHumidity);
	//$: if (wetbulb && $wetBulbTempC) wetbulb.update();
	//$: if (dewpoint && $dewpointC) dewpoint.update();

	function updateRH({target:{value}}) {
	//	if (debounce || value == null)return;
	//	debounce=Date.now();
	//	setTimeout(() => {debounce=0;}, 50);
		$relativeHumidity = value;
		$P_w = Physics.PressureFromRH($tempC, $relativeHumidity);
	//	await tick();
	//	wetbulb.update();
	//	dewpoint.update();
	}
	function updateDewpoint({detail:{c}}) {
	//	if (debounce || c == null)return;
	//	debounce=Date.now();
	//	setTimeout(() => {debounce=0;}, 50);
		$dewpointC = c;
		$P_w = Physics.PressureFromDewpoint($tempC, $dewpointC);
	}
	export function updatePartialPressure({target:{value}}) {
	//	if (debounce || value == null)return;
	//	debounce=Date.now();
	//	setTimeout(() => {debounce=0;}, 50);
		$P_w = value;
		if(wetbulb) wetbulb.update();
		if(dewpoint) dewpoint.update();
	}

	export function update(){
		updatePartialPressure({target:{value:$P_w}});
	}
	update();

</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
	<legend>Humidity</legend>
	<Temp c={dewpointC} bind:this={dewpoint} on:temp={updateDewpoint}><legend>Dewpoint/Frostpoint</legend></Temp>
	<label><input step=0.1 type=number value={$relativeHumidity} on:input="{updateRH}">% Relative Humidity</label>
	<label><input step=0.01 type=number value="{$P_w}" on:input={updatePartialPressure}>hPa Partial Pressure H<sub>2</sub>O</label>
	<Temp c={wetBulbTempC} bind:this={wetbulb}><legend>Wet Bulb Temp</legend></Temp>
	<details><fieldset>
		<label><input step=0.0001 type=number value="{(1e3*absoluteHumidity)}">g/m<sup>3</sup> Volumetric (Absolute) Humidity</label>
		<label><input step=0.0001 type=number value="{(1000*mixingRatio)}">g/kg Mixing Ratio (mass H<sub>2</sub>O:dry airmass)</label>
		<label><input step=0.0001 type=number value="{(1000*specificHumidity)}">g/kg Specific Humidity (mass H<sub>2</sub>O:total airmass)</label>
		<label><input step=0.01 type=number value="{$P_s}">hPa Saturation Pressure H<sub>2</sub>O</label>
	</fieldset></details>
</fieldset>
