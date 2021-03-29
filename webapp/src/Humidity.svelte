
<div>Dewpoint/Frostpoint<br>
	<TempConvert bind:c={dewpoint} on:input={onDewpoint}/><br>
	<input bind:value={relativeHumidity} on:input="{onRH}" type=number> % Relative Humidity =<br>
	<input disabled bind:value={absoluteHumidity} on:input="{onAH}" type=number> kg/m^3 Absolute Humidity =<br>
	<input disabled bind:value={humidityRatio} on:input="{onH}" type=number> kg/kg Humidity Ratio (mass H<sub>2</sub>O:total airmass)
</div>

<style>
	input {
		width: 5em;
	}
</style>

<script>
	import TempConvert from './Temperature.svelte';
	//import * as Physics from '../../lib/physics.js';
	let relativeHumidity;
	 let absoluteHumidity;
     let humidityRatio;
	 let dewpoint;

	 function onDewpoint() {

	 }

	function onRH() {
	}

	function onAH() {
	}

    function onH() {
	}
</script>
