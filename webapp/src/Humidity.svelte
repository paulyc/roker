<label for=dewpoint>Dewpoint/Frostpoint<TempConvert/></label><br>
<input value={relativeHumidity} on:input="{e => setFromRH(e.target.value)}" type=number id=rh> % Relative Humidity =<br>
<input disabled value={absoluteHumidity} on:input="{e => setFromAH(e.target.value)}" type=number id=ah> kg/m^3 Absolute Humidity =<br>
<input disabled value={humidityRatio} on:input="{e => setFromH(e.target.value)}" type=number id=H> kg/kg Humidity Ratio (mass H<sub>2</sub>O:total airmass)

<style>
	input {
		width: 5em;
	}
</style>

<script>
	import TempConvert from './Temperature.svelte';
	import * as Physics from '../../lib/physics.js';
	 let relativeHumidity;
	 let absoluteHumidity;
     let humidityRatio;
	 let tempC;
	 let P_a;

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
