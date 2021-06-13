
<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.js';
	//import {FmtNumber} from '../../lib/number.mjs';

	let dispatch = createEventDispatcher();

	export let c;
	let f;
	let k;
	let debounce = 0;

	$: inputC({target:{value:c}});

	function inputC({target:{value}}) {
		if (debounce||value==null) return;
		debounce=Date.now();
		setTimeout(() => {debounce=0;}, 10);
		c = +value;
		f = Physics.DegreesCtoF(c);
		k = Physics.DegreesCtoK(c);
		dispatch('temp', {c,f,k});
	}
	function inputF({target:{value}}) {
		if (debounce||value==null) return;
		f = +value;
		c = Physics.DegreesFtoC(f);
		k = Physics.DegreesCtoK(c);
		dispatch('temp', {c,f,k});
	}
	function inputK({target:{value}}) {
		if (debounce||value==null) return;
		k = +value;
		c = Physics.DegreesKtoC(k);
		f = Physics.DegreesCtoF(c);
		dispatch('temp', {c,f,k});
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
	<label><input type=number step=0.1 value={c} on:input="{inputC}">°C</label>
	<label>=<input type=number step=0.1 value={f} on:input="{inputF}">°F</label>
	<label>=<input type=number step=0.1 value={k} on:input="{inputK}">K</label>
</fieldset>
