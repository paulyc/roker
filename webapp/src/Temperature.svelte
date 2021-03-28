<input value={c} on:input="{e => setFromC(e.target.value)}" type=number id=degC> °C =
<input value={f} on:input="{e => setFromF(e.target.value)}" type=number id=degF> °F =
<input value={k} on:input="{e => setFromK(e.target.value)}" type=number id=degK> K

<style>
	input {
		width: 5em;
	}
</style>

<script>
	 let c;
	 let f;
     let k;

	function setFromC(value) {
		c = +value;
        k = c + 273.15;
		f = +(32 + (9 / 5 * c)).toFixed(1);
	}

	function setFromF(value) {
		f = +value;
		c =+(5 / 9 * (f - 32)).toFixed(1);
        k = c + 273.15;
	}

    function setFromK(value) {
        k = +value;
        c = k - 273.15;
		f = +(32 + (9 / 5 * c)).toFixed(1);
	}
</script>
