<label for=dewpoint>Dewpoint/Frostpoint<TempConvert/></label><br>
<input bind:value={relativeHumidity} on:input="{e => setFromRH(e.target.value)}" type=number id=rh> % Relative Humidity =<br>
<input disabled bind:value={absoluteHumidity} on:input="{e => setFromAH(e.target.value)}" type=number id=ah> kg/m^3 Absolute Humidity =<br>
<input disabled bind:value={humidityRatio} on:input="{e => setFromH(e.target.value)}" type=number id=H> kg/kg Humidity Ratio (mass H<sub>2</sub>O:total airmass)
<input bind:value={P_w} on:input type=number> hPa Partial Pressure H<sub>2</sub>O<br>
<input bind:value={P_s} on:input type=number> hPa Saturated Pressure H<sub>2</sub>O<br>
<input bind:value={P_s} on:input type=number> hPa Atmospheric Pressure

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
	 let tempC;
	 let P_a;
	 let P_s;
	 let P_w;

	function setFromRH(value) {
		relativeHumidity = +value;
	}

	function setFromAH(value) {
		absoluteHumidity = +value;
	}

    function setFromH(value) {
		humidityRatio = +value;
	}
</script>
