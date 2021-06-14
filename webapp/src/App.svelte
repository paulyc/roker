
<script>
	import Params from './Params.svelte';
	let params1,params2;
	let fixedPressure=true;
	let station='KFMY';
	let P_a_1,P_w_1,P_a_2,P_w_2;
	$: fixedPressure && params2 && params2.partialPressure(P_w_1);
	$: fixedPressure && params2 && params2.atmosphericPressure(P_a_1);
	/*function update({detail:{P_w,P_a}}) {
		if (fixedPressure) {
			P_w && params2.partialPressure(P_w);
			P_a && params2.atmosphericPressure(P_a);
		}
	}*/

	import { onMount } from 'svelte';

	onMount(async () => {
		//const res = await fetch( `https://aviationweather.gov/metar/data?ids=${station.toUpperCase()}&format=raw&date=&hours=0`);
		//photos = await res.json();
		window.addEventListener('error', ev => console.error(ev));
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
		/*display: flex;*/
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
	<div><Params bind:this={params1} bind:P_a={P_a_1} bind:P_w={P_w_1} /></div>
	<p><input type=checkbox bind:checked={fixedPressure}>Fixed Pressure</p>
	<div><Params bind:this={params2} bind:P_a={P_a_2} bind:P_w={P_w_2} /></div>
</main>
