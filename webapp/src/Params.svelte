<script>
import Temp from './Temp.svelte';
import Humidity from './Humidity.svelte';
import * as Physics from '../../lib/physics.js';
import {createEventDispatcher} from 'svelte';
import {writable} from 'svelte/store';

const dispatch = createEventDispatcher();

let T = 25;
let humidity;
 let P_a=Physics.StdAtmosphere
 let P_w;
let h_air,h_dry_air,h_sat_air,h_h2o;
let density,O2pressure,CO2pressure,O2volratio,O2massratio,O2absolute,CO2absolute;
let elecpower=500;
let mkcal=2000,mpower,molatp,molo2,masso2;
let spower=1500;
let joulesperkcal=4184;
let secperday=86400;
let airconsensible=11500,airconlatent=4400;//80f indoor 95f outdoor
let airconpower=5000;
let dollarsperkwh=0.12;
let kcalpermolatp=7.3;
let masso2perkcalperday=1.1;//grams O2 per kcal/day energy
let airconduty;
let totalinput,totaloutput;

$: mpower = mkcal*joulesperkcal/secperday;
$: molatp = mkcal/kcalpermolatp;
$: molo2 = molatp/4;
$: masso2 = molo2*Physics.MolarMass.O2;//grams
$: totalinput = elecpower+mpower+spower;
$: totaloutput = airconsensible+airconlatent;
$: airconduty = totalinput/totaloutput * 60;
$: aircondailycost = 24/60 * (airconduty * airconpower) * dollarsperkwh/1000;

$:  h_air = Physics.SpecificEnthalpyAir(T,P_w,P_a);
$:  h_dry_air = Physics.SpecificEnthalpyDryAir(T,P_a);
$:  h_sat_air = Physics.SpecificEnthalpySaturatedAir(T,P_a);
$:  h_h2o = Physics.SpecificEnthalpyH2O(T,P_w,P_a);
$:  h_density = h_air*density;

$: density=Physics.DensityAir(T,P_w,P_a);
$: O2pressure=Physics.PartialPressure('O2',P_w,P_a);
$: CO2pressure=100*Physics.PartialPressure('CO2',P_w,P_a);
$: O2volratio=100*Physics.VolumeRatio('O2',P_w,P_a);
$: O2massratio=100*Physics.MassRatio('O2',P_w,P_a);
$: O2absolute=1000*Physics.AbsoluteMass('O2',T,P_w,P_a); //grams
$: CO2absolute=1000000*Physics.AbsoluteMass('CO2',T,P_w,P_a); //milligrams

$:  dispatch('update',{
        T,
        P_w,P_a,
        h_air,h_dry_air,h_sat_air,h_h2o,
        density,O2pressure,O2volratio,O2massratio,O2absolute
    });

function updateTemp({detail:{c}}) {
    if (c ==null) return;
    T = c;
    humidity.updateTemp(T);
}

export function partialPressure(P_w) {
    humidity.updatePartialPressure(P_w);
    //humidity.$set({P_w});
}

export function atmosphericPressure(P_a) {
    humidity.updateAtmosphericPressure(P_a);
    //humidity.$set({P_a})
}

</script>

<style>
	input {
		width: 5em;
	}
</style>

<fieldset>
    <legend>params</legend>
    <Temp c={T} on:temp="{updateTemp}"><legend>Temperature</legend></Temp>
    <Humidity bind:this={humidity} tempC={T} bind:P_w bind:P_a />
    <fieldset>
        <legend>Enthalpy</legend>
        <label><input bind:value={h_air} type=number step=0.01>kJ/kg Specific Enthalpy</label>
        <details>
            <label><input bind:value={h_dry_air} on:input type=number step=0.01>kJ/kg Specific Enthalpy (Dry Air)</label>
            <label><input bind:value={h_sat_air} on:input type=number step=0.01>kJ/kg Specific Enthalpy (Saturated Air)</label>
            <label><input bind:value={h_h2o} on:input type=number step=0.01>kJ/kg Specific Enthalpy (H<sub>2</sub>O/Latent)</label>
            <label><input bind:value={h_density} on:input type=number step=0.01>kJ/m<sup>3</sup> Enthalpy Density</label>
        </details>
    </fieldset>
    <fieldset>
        <legend>Pressure/Density</legend>
        <label><input type=number step=1 bind:value={O2absolute}>g/m<sup>3</sup> O<sub>2</sub> Density</label>
        <details>
            <label><input type=number step=0.01 bind:value={density}>kg/m<sup>3</sup> Air Density</label>
            <label><input type=number step=1 bind:value={O2pressure}>hPa Partial Pressure O<sub>2</sub></label>
            <label><input type=number step=1 bind:value={CO2pressure}>Pa Partial Pressure CO<sub>2</sub></label>
            <label><input type=number step=1 bind:value={CO2absolute}>mg/m<sup>3</sup> CO<sub>2</sub> Density</label>
            <label><input type=number step=0.01 bind:value={O2volratio}>% O<sub>2</sub> Ratio (Volume)</label>
            <label><input type=number step=0.01 bind:value={O2massratio}>% O<sub>2</sub> Ratio (Mass)</label>
        </details>
    </fieldset>
    <fieldset>
        <legend>Heat</legend>
        <details>
            <label><input type=number step=10 bind:value={spower}>W Solar Heating</label>
            <label><input type=number step=10 bind:value={elecpower}>W Electric Heating</label>
            <label><input type=number step=10 bind:value={mkcal}>kcal/day<br>=<input type=number value={mpower}>W Mammalian Heating<br>
                (<input type=number value={molatp}>mol ATP/day=<input type=number value={masso2}>g O<sub>2</sub>/day<br>
                =<input type=number value={masso2/O2absolute}>m<sup>3</sup> Air/day)</label>
            <label><input type=number step=10 bind:value={totalinput}>W Total Input</label>
            <label><input type=number step=10 bind:value={airconsensible}>W AC Sensible</label>
            <label><input type=number step=10 bind:value={airconlatent}>W AC Latent</label>
            <label><input type=number step=10 bind:value={totaloutput}>W Total Output</label>
            <label><input type=number step=0.1 bind:value={airconduty}>min/h AC Duty Cycle</label>
            <label><input type=number step=0.001 bind:value={dollarsperkwh}>$/kWh Electricity Cost</label>
            <label><input type=number step=10 bind:value={airconpower}>W AC Power Consumption</label>
            <label><input type=number step=0.01 bind:value={aircondailycost}>$ AC Daily Cost</label>
        </details>
    </fieldset>
</fieldset>
