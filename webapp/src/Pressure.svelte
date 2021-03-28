<input value={partialPressure} on:input="{e => setFromPP(e.target.value)}" type=number> hPa Partial Pressure H<sub>2</sub>O<br>
<input value={saturatedPressure} on:input="{e => setFromSP(e.target.value)}" type=number> hPa Saturated Pressure H<sub>2</sub>O

<style>
	input {
		width: 5em;
	}
</style>

<script>
	export let saturatedPressure;
	export let partialPressure;

	function setFromSP(value) {
		saturatedPressure = +value;
	}

	function setFromPP(value) {
		partialPressure = +value;
	}
</script>
