<div>
	<input bind:value={h} on:input type=number> kJ/kg Specific Enthalpy<br>
	<input bind:value={h_w} on:input type=number> kJ/kg Specific Enthalpy (H<sub>2</sub>O)
	<input bind:value={h_a} on:input type=number> kJ/kg Specific Enthalpy (Dry Air)<br>
	<input bind:value={h_s} on:input type=number> kJ/kg Specific Enthalpy (Saturated Air)
</div>

<style>
	input {
		width: 5em;
	}
</style>

<script>
	 let h;
	 let h_a;
     let h_w;
	 let h_s;
</script>
