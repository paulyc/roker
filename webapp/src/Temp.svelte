
<script>
	import {createEventDispatcher,tick} from 'svelte';
	import * as Physics from '../../lib/physics.mjs';

	let dispatch = createEventDispatcher();

	export let c;
	let localc=$c;
	let f;
	let k;
	let debounce = 0;

	export function update(val){inputC({target:{value:val||$c}});}
	update();

	async function inputC({target:{value}}) {
		if (debounce||value==null||Number.isNaN(value)) return;
		//debounce=Date.now();
		//setTimeout(() => {debounce=0;}, 10);
		await tick();
		localc = +value;
		f = Physics.DegreesCtoF(localc);
		k = Physics.DegreesCtoK(localc);
		$c = localc;
		dispatch('temp', {c:localc,f,k});
	}
	async function inputF({target:{value}}) {
		if (debounce||value==null||Number.isNaN(value)) return;
		await tick();
		f = +value;
		localc = Physics.DegreesFtoC(f);
		k = Physics.DegreesCtoK(localc);
		$c = localc;
		dispatch('temp', {c:localc,f,k});
	}
	async function inputK({target:{value}}) {
		if (debounce||value==null||Number.isNaN(value)) return;
		await tick();
		k = +value;
		localc = Physics.DegreesKtoC(k);
		f = Physics.DegreesCtoF(localc);
		$c = localc;
		dispatch('temp', {c:localc,f,k});
	}
</script>

<style>
	input {
		width: 5em;
	}
	label {
		display: inline;
	}
</style>

<fieldset>
	<slot></slot>
	<label><input type=number step=0.1 value={localc} on:input="{inputC}">°C</label>
	<label>=<input type=number step=0.1 value={f} on:input="{inputF}">°F</label>
	<label>=<input type=number step=0.1 value={k} on:input="{inputK}">K</label>
</fieldset>
