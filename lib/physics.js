// Copyright (C) 2021 Paul Ciarlo <paul.ciarlo@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * See Arden Buck equation, accurate in range -80 to 50 C
 * https://en.wikipedia.org/wiki/Arden_Buck_equation
 * Temperatures in Celsius
 */
const StdAtmosphere = 1013.25; // hPa
const ABParams = {
	a: t => t > 0 ? 6.1121 : 6.1115,
	b: t => t > 0 ? 18.678 : 23.036,
	c: t => t > 0 ? 257.14 : 279.82,
	d: t => t > 0 ? 234.5 : 333.7,
};
const ardenBuckConstant = t => Math.exp((ABParams.b(t) - t/ABParams.d(t))*(t/(ABParams.c(t)+t)));
const gammaFromDewpoint = (t, dp) => (dp * ABParams.b(t)) / (ABParams.c(t) + dp);
// rh = 100.0 * exp(gamma) / ardenBuckParam(temp)
// aBP(temp) * rh/100.0 = exp(gamma)
// gamma = ln(aBP(temp)*rh/100))
const gammaFromRH = (t, rh) => Math.log(ardenBuckConstant(t) * rh/100.0);

const PressureFromDewpoint = (t, dp) => ABParams.a(t) * Math.exp(gammaFromDewpoint(t, dp));
const DewpointFromPressure = (t, p) => ABParams.c(t)*Math.log(p/ABParams.a(t))/(ABParams.b(t) - Math.log(p/ABParams.a(t)));//dp=c*ln(pressure/a))/(b-ln(pressure/a))

const RHFromDewpoint = (t, dp) => 100.0 * Math.exp(gammaFromDewpoint(t, dp)) / ardenBuckConstant(t, dp);
const PressureFromRH = (t, rh) => ABParams.a(t) * Math.exp(gammaFromRH(t, rh));
const DewpointFromRH = (t, rh) => DewpointFromPressure(t, PressureFromRH(t, rh));
const SaturationPressure = t => ABParams.a(t) * ardenBuckConstant(t);

const DegreesCtoF = c => c * 9.0 / 5.0 + 32.0;
const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);
const DegreesCtoK = c => c + 273.15;
const DegreesKtoC = k => k - 273.15;

// P*V=n*R*T=N*k*T // R = 8.3145 J/molK n = moles N=molecules k = 1.38066e-23 J/K
//1 mol = 22.4L
// h = h_a + H * h_g
// H = m_v/m_a humidity ratio mass of water vapor / mass of dry air
// H = 0.62198 P_w / (p_a - p_w)
// h_a = c_pa * T specific enthalpy of dry air
// h_g = 2501 + c_pw*T
// 2501 specific enthalpy of water vapor at 0c
// c_pw = 1.84 kJ/kgK
// h = c_pa * T + 0.62198*P_w / (P_a - P_w)
// h_we latent evaporation heat of water = 2494 kJ/kg - 2.2/C*T
// c_pa = 1005 J/kgK (15C sea level) specific heat of air isobaric heat capacity
// c
// density = rho = 1.225 kg/m^3 at 15C sea level
// 1.1839 at 25C
const ρ_25 = 1.1839;
//
const R_w = 461.5;//J/kgK
const R_a = 286.9;//J/kgK
const ρ_a = (t,P_a) => P_a/R_a*t;//dry air
const ρ_w = (t,P_w) => P_w/R_w*t;
const ρ = H => ρ_a*(1+H)/(1+R_w/R_a*H);
const c_pa = 1.006; // kJ/kgK isobaric heat capacity of air
const c_pw = 1.840; // kJ/kgK specific heat of H2O_g at constant pressure
const m_w = (t,P_w) => 0.0180*(P_w*22.4)/(8.3145*t);
const m_a_dry = (t,P_a) => 0.0290*(P_a*22.4)/(8.3145*t);
//const m_a_moist = (t,P_w,P_a) =>
const SpecificEnthalpyDryAir = (t,P_a) => c_pa * t;
const SpecificEnthalpyH2O_0C = 2501;
const SpecificEnthalpyH2O = (t,P_a) => SpecificEnthalpyH2O_0C + c_pw * t;
const HumidityRatio = (P_w,P_a) => (R_a/R_w) * P_w / (P_a - P_w); // P_a pressure of air
const LatentHeat = (t,P_w,P_a) => HumidityRatio(P_w,P_a) * SpecificEnthalpyH2O(t);
const SpecificEnthalpyAir = (t,P_w,P_a) => SpecificEnthalpyDryAir(t) + LatentHeat(t,P_w,P_a);
const SpecificEnthalpySaturatedAir = (t,P_a) => SpecificEnthalpyAir(t, SaturationPressure(t), P_a);
// latent heat = rho * h_we * H - what is h_we ?? 61 or 51 at 25c?
// dont trust this version because of the density dependency
//const LatentHeat = (t,P_w,P_a) => ρ(t) * SpecificEnthalpyH2O(t) * HumidityRatio(P_w,P_a);

let _exports = {
    StdAtmosphere,
    ABParams,
    ardenBuckConstant,
    gammaFromDewpoint,
    gammaFromRH,
    PressureFromDewpoint,
    DewpointFromPressure,
    RHFromDewpoint,
    PressureFromRH,
    DewpointFromRH,
    SaturationPressure,
    DegreesCtoF,
    DegreesFtoC,
    DegreesCtoK,
    DegreesKtoC,
    SpecificEnthalpyDryAir,
    SpecificEnthalpySaturatedAir,
    SpecificEnthalpyH2O,
    HumidityRatio,
    SpecificEnthalpyAir,
    LatentHeat,
    ρ_25,
    c_pa,
    c_pw
};

module.exports = _exports;
