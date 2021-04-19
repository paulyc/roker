
<script>
	import Params from './Params.svelte';
	let params1,params2;
	let fixedPressure=true;
	function update1({detail:{P_w}}) {
		if (fixedPressure) {
			params2.fixedPressure(P_w);
		}
	}
	function Metar(s) {
		this.parse(s);
	}
	Metar.prototype.parse = function (str) {
		//while (str)
	};

	function getLatestMetar(station) {
		const url = `https://aviationweather.gov/metar/data?ids=${station.toUpperCase()}&format=raw&date=&hours=0`;
	}
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
	main {
		font-family: 'Agave Nerd Font Mono';
	}
	div {
		/*max-width: 40%;*/
		display: flex;
		float:inline-start;
	}
	input {
		vertical-align:center;
	}

</style>

<main>
	<div><Params bind:this={params1} on:update={update1}/></div>
	<div><input type=checkbox bind:checked={fixedPressure}>Fixed Pressure</div>
	<div><Params bind:this={params2} /></div>
</main>
