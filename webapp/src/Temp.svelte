
<script>
	import {createEventDispatcher} from 'svelte';
	import * as Physics from '../../lib/physics.js';

	let dispatch = createEventDispatcher();

	export let c;
	let f;
	let k;

	let cString,fString,kString;

	$: cString = c.toString();//.toFixed(1);
	$: fString = f.toString();//.toFixed(1);
	$: kString = k.toString();//.toFixed(1);

	$: dispatch('temp', {c,f,k});
	$:	k = Physics.DegreesCtoK(c);
	$:	f = Physics.DegreesCtoF(c);

	function setFromF(value) {
	//	f = +value;
		c = Physics.DegreesFtoC(+value);
      //  k = Physics.DegreesCtoK(c);
	}

    function setFromK(value) {
      //  k = +value;
        c = Physics.DegreesKtoC(+value);
	//	f = Physics.DegreesCtoF(c);
	}
	//setFromC(c);
</script>

<style>
	input {
		width: 5em;
	}
</style>

<div>
	<input type=number value={cString} on:input="{e => c=+e.target.value}"> °C =
	<input type=number value={fString} on:input="{e => c=Physics.DegreesFtoC(+e.target.value)}"> °F =
	<input type=number value={kString} on:input="{e => c=Physics.DegreesKtoC(+e.target.value)}"> K
</div>
