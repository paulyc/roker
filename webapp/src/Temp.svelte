
<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.js';

	let dispatch = createEventDispatcher();

	export let c;
	let f;
	let k;
	inputC({target:{value:c}});

	function inputC({target:{value}}) {
		c = +value;
		f = Physics.DegreesCtoF(c);
		k = Physics.DegreesCtoK(c);
		dispatch('temp', {c,f,k});
	}
	function inputF({target:{value}}) {
		f = +value;
		c = Physics.DegreesFtoC(f);
		k = Physics.DegreesCtoK(c);
		dispatch('temp', {c,f,k});
	}
	function inputK({target:{value}}) {
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
</style>

<div>
	<input type=number step=0.1 value={c} on:input="{inputC}"> °C
=	<input type=number step=0.1 value={f} on:input="{inputF}"> °F
=	<input type=number step=0.1 value={k} on:input="{inputK}"> K
</div>
