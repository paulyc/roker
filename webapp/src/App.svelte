
<script>
	import {onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import Params from './Params.svelte';
	import * as Physics from '../../lib/physics.mjs';

	let params1,params2;
	let fixedPressure=true;
	let station='KFMY';

	let T_1=writable(25),T_2=writable(25);
	let P_a_1=writable(Physics.StdAtmosphere);
	let P_w_1=writable(Physics.PressureFromDewpoint($T_1, 20));
	let P_a_2=writable(Physics.StdAtmosphere);
	let P_w_2=writable(Physics.PressureFromDewpoint($T_2, 20));

	$: if (fixedPressure) {
		$P_w_2 = $P_w_1;
		$P_a_2 = $P_a_1;
		params2 && params2.update();
	}
	/*function update({detail:{P_w,P_a}}) {
		if (fixedPressure) {
			P_w && params2.partialPressure(P_w);
			P_a && params2.atmosphericPressure(P_a);
		}
	}*/

	onMount(async () => {
		//const res = await fetch( `https://aviationweather.gov/metar/data?ids=${station.toUpperCase()}&format=raw&date=&hours=0`);
		//photos = await res.json();
		window.addEventListener('error', ev => console.error('tophandler',ev));
		//window.onerror = function(message, source, lineno, colno, error) { console.error(message, source, lineno, colno, error); };
	});

</script>

<style>
	@font-face {
		font-family: 'Agave Nerd Font Mono';
		font-style: monospace;
		src: url(/agavenerdfontmono.ttf);
	}
	@font-face {
		font-family: 'Operator Narrow';
		font-style: normal;
		src: url(/operator_narrow.woff2);
	}
	@font-face {
		font-family: 'Operator Mono';
		font-style: monospace;
		src: url(/operator_mono.woff2);
	}
	@font-face {
		font-family: 'Cascadia Mono';
		font-style: monospace;
		src: url(/CascadiaMono.ttf);
	}
	@font-face {
		font-family: 'Operator Mono Book';
		font-style: monospace;
		src: url(/OperatorNarrow-Book.woff2);
	}
	@font-face {
		font-family: 'Dank Mono Regular';
		font-style: monospace;
		src: url(/DankMono-Regular.ttf);
	}
	@font-face {
		font-family: 'Aurulent Sans Mono';
		font-style: monospace;
		src: url(/AurulentSansMono.woff2);
	}
	main {
		display: flex;
		font-family: 'Aurulent Sans Mono';/* 'Agave Nerd Font Mono';*/
		font-size: 10pt;
	}
	div {
		display: flex;
		float:inline-start;
	}
	input {
		vertical-align:center;
	}

</style>

<main>
	<div><Params T={T_1} P_a={P_a_1} P_w={P_w_1} bind:this={params1}/></div>
	<p><input type=checkbox bind:checked={fixedPressure}>Fixed Pressure</p>
	<div><Params T={T_2} P_a={P_a_2} P_w={P_w_2} bind:this={params2}/></div>
</main>
