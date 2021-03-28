<input value={specificEnthalpy} on:input="{e => setFromSpec(e.target.value)}" type=number> kJ/kg Specific Enthalpy<br>
<input value={specificEnthalpyDry} on:input="{e => setFromDry(e.target.value)}" type=number> kJ/kg Specific Enthalpy (Dry)<br>
<input value={specificEnthalpySat} on:input="{e => setFromSat(e.target.value)}" type=number> kJ/kg Specific Enthalpy (Saturated)

<style>
	input {
		width: 5em;
	}
</style>

<script>
	 let specificEnthalpy;
	 let specificEnthalpyDry;
     let specificEnthalpySat;
	export let tempC;
	export let P_w;
	export let P_a;

	function setFromSpec(value) {
		specificEnthalpy = +value;
	}

	function setFromDry(value) {
		specificEnthalpyDry= +value;
	}

    function setFromSat(value) {
        specificEnthalpySat = +value;
	}
</script>
