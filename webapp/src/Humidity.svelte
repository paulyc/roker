
<div>Dewpoint/Frostpoint<br>
	<TempConvert on:input bind:c={dewpoint} on:update="{e=>update({dewpoint:(e.detail.c)})}"/><br>
	<input bind:value="{rh}" on:input on:input="{e=>update({rh:(e.target.value)})}" type=number> % Relative Humidity =<br>
	<input disabled bind:value="{ah}" on:input on:input="{e=>update({ah:(e.target.value)})}" type=number> kg/m^3 Absolute Humidity =<br>
	<input disabled bind:value="{H}" on:input on:input="{e=>update({H:(e.target.value)})}" type=number> kg/kg Humidity Ratio (mass H<sub>2</sub>O:total airmass)<br>
	<input bind:value="{P_w}" on:input on:input="{e=>update({P_w:(e.target.value)})}" type=number> hPa Partial Pressure H<sub>2</sub>O<br>
    <input bind:value="{P_s}" on:input on:input="{e=>update({P_s:(e.target.value)})}" type=number> hPa Saturated Pressure H<sub>2</sub>O<br>
    <input bind:value="{P_a}" on:input on:input="{e=>update({P_a:(e.target.value)})}" type=number> hPa Atmospheric Pressure
</div>

<style>
	input {
		width: 5em;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import TempConvert from './Temperature.svelte';
	import * as Physics from '../../lib/physics.js';
	export let dewpoint;
	 let rh;
	let ah;
    let H;
	 let P_w;
	export let P_s;
	export let P_a;
	export let tempC;
	export function update(opts) {
		opts ??= {};
		P_s = Physics.SaturationPressure(tempC);
		if (opts.dewpoint != null) {
			dewpoint = opts.dewpoint;
			P_w = Physics.PressureFromDewpoint(tempC, opts.dewpoint);
			rh = Physics.RHFromDewpoint(tempC, opts.dewpoint);
			H = Physics.HumidityRatio(P_w,P_a);
			ah = Physics.AbsoluteHumidity(tempC,P_w,P_a);
			dispatch('update',{dewpoint});
		} else if (opts.rh != null) {
			rh = opts.rh;
			P_w = Physics.PressureFromRH(tempC, opts.rh);
			dewpoint = Physics.DewpointFromRH(opts.rh);
			H = Physics.HumidityRatio(P_w,P_a);
			ah = Physics.AbsoluteHumidity(tempC,P_w,P_a);
			dispatch('update',{rh});
		} else {
			P_w = Physics.PressureFromDewpoint(tempC, dewpoint);
			rh = Physics.RHFromDewpoint(tempC, dewpoint);
			H = Physics.HumidityRatio(P_w,P_a);
			ah = Physics.AbsoluteHumidity(tempC,P_w,P_a);
		}
	}

</script>
