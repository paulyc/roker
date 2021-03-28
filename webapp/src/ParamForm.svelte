<script>
import TempConvert from './Temperature.svelte';
import HumidityConvert from './Humidity.svelte';
import PressureConvert from './Pressure.svelte';
import EnthalpyConvert from './Enthalpy.svelte';
</script>

<fieldset>
    <legend>params</legend>
    <ul>
        <li>
            <label for=temp1>Temperature</label>
            <TempConvert id=temp1/>
        </li>
        <li>
            <label for=humid1>Humidity</label>
            <HumidityConvert id=humid1/>
        </li>
        <li>
            <label for=press1>Pressure</label>
            <PressureConvert id=press1/>
        </li>
        <li>
            <label for=enthalpy1>Enthalpy</label>
            <EnthalpyConvert id=enthalpy1/>
        </li>
    </ul>
</fieldset>
