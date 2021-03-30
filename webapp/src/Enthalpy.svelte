<div>
	<input value={h} on:input type=number> kJ/kg Specific Enthalpy<br>
	<input value={h_w} on:input type=number> kJ/kg Specific Enthalpy (H<sub>2</sub>O)<br>
	<input value={h_a} on:input type=number> kJ/kg Specific Enthalpy (Dry Air)<br>
	<input value={h_s} on:input type=number> kJ/kg Specific Enthalpy (Saturated Air)
</div>

<style>
	input {
		width: 5em;
	}
</style>

<script>
	export let h;
	export let h_a;
    export let h_w;
	export let h_s;
</script>
