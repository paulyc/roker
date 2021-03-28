<input bind:value={specificEnthalpy} on:input type=number> kJ/kg Specific Enthalpy<br>
<input bind:value={specificEnthalpyDry} on:input type=number> kJ/kg Specific Enthalpy (Dry)<br>
<input bind:value={specificEnthalpySat} on:input type=number> kJ/kg Specific Enthalpy (Saturated)

<style>
	input {
		width: 5em;
	}
</style>

<script>
	 let specificEnthalpy;
	 let specificEnthalpyDry;
     let specificEnthalpySat;
	  let tempC;
	  let P_w;
	  let P_a;

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
