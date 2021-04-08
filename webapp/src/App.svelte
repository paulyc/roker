
<script>
	import Params from './Params.svelte';
	let params1,params2;
	let constantPressure=true;
	function update(params) {
		if (constantPressure) {
			params2.constantPressure(params.P_w, params.P_s, params.P_a);
		}
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
	<div><Params bind:this={params1} on:update={e=>update(e.detail)}/></div>
	<div><input type=checkbox bind:checked={constantPressure}>Constant Pressure</div>
	<div><Params bind:this={params2} /></div>
</main>
