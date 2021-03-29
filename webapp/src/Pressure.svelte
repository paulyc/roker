<div>
    <input bind:value={P_w} on:input type=number> hPa Partial Pressure H<sub>2</sub>O<br>
    <input bind:value={P_s} on:input type=number> hPa Saturated Pressure H<sub>2</sub>O<br>
    <input bind:value={P_a} on:input type=number> hPa Atmospheric Pressure
</div>

<style>
	input {
		width: 5em;
	}
</style>

<script>

let P_w;
let P_s;
let P_a;

</script>
