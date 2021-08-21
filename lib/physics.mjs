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

export const StdAtmosphere = 1013.25; // hPa
export const ABParams = {
	a: t => t > 0 ? 6.1121 : 6.1115,
	b: t => t > 0 ? 18.678 : 23.036,
	c: t => t > 0 ? 257.14 : 279.82,
	d: t => t > 0 ? 234.5 : 333.7,
};
export const ardenBuckConstant = t => Math.exp((ABParams.b(t) - t/ABParams.d(t))*(t/(ABParams.c(t)+t)));
export const gammaFromDewpoint = (t, dp) => (dp * ABParams.b(t)) / (ABParams.c(t) + dp);
// rh = 100.0 * exp(gamma) / ardenBuckParam(temp)
// aBP(temp) * rh/100.0 = exp(gamma)
// gamma = ln(aBP(temp)*rh/100))
export const gammaFromRH = (t, rh) => Math.log(ardenBuckConstant(t) * rh/100.0);

export const PressureFromDewpoint = (t, dp) => ABParams.a(t) * Math.exp(gammaFromDewpoint(t, dp));
export const DewpointFromPressure = (t, p) => ABParams.c(t)*Math.log(p/ABParams.a(t))/(ABParams.b(t) - Math.log(p/ABParams.a(t)));//dp=c*ln(pressure/a))/(b-ln(pressure/a))

export const RHFromDewpoint = (t, dp) => 100.0 * Math.exp(gammaFromDewpoint(t, dp)) / ardenBuckConstant(t, dp);
export const PressureFromRH = (t, rh) => ABParams.a(t) * Math.exp(gammaFromRH(t, rh));
export const DewpointFromRH = (t, rh) => DewpointFromPressure(t, PressureFromRH(t, rh));
export const SaturationPressure = t => ABParams.a(t) * ardenBuckConstant(t);
export const RHFromPressure = (t,p_w) => 100*p_w/SaturationPressure(t);
export const WetBulbTemp = (t,rh) => (
    t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659))
    + Math.atan(t + rh)- Math.atan(rh - 1.676331)
    + 0.00391838 * rh**(3/2) * Math.atan(0.023101 * rh)
    - 4.686035); // Stull (2011) https://doi.org/10.1175/JAMC-D-11-0143.1

export const DegreesCtoF = c => c * 9.0 / 5.0 + 32.0;
export const DegreesFtoC = f => 5.0 / 9.0 * (f - 32.0);
export const DegreesCtoK = c => c + 273.15;
export const DegreesKtoC = k => k - 273.15;

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
export const ρ_25 = 1.1839;
//
export const R_w = 461.5;//J/kgK
export const R_a = 286.9;//J/kgK
export const ρ_a = (t,P_a) => (100*P_a)/(R_a*DegreesCtoK(t));//hPa,dry air
export const ρ_w = (t,P_w) => (100*P_w)/(R_w*DegreesCtoK(t));//hPa,water vapor
export const ρ_H = (H,t,P_a) => ρ_a(t,P_a)*(1+H)/(1+R_w/R_a*H);
export const ρ = (t,P_w,P_a) => ρ_a(t,P_a)*(1+HumidityRatio(P_w,P_a))/(1+R_w/R_a*HumidityRatio(P_w,P_a));
export const DensityAir = ρ;
export const DensityAir_H = ρ_H;
export const DensityDryAir = ρ_a;
export const DensityH2O_g = ρ_w;
export const c_pa = 1.006; // kJ/kgC isobaric heat capacity of air
export const c_pw = 1.840; // kJ/kgC specific heat of H2O_g at constant pressure
export const n = 8.3144598; //J/molK
export const m_w = (t,P_w) => 0.0180*(100*P_w*22.4)/(n*DegreesCtoK(t));
export const m_a_dry = (t,P_a) => 0.0290*(100*P_a*22.4)/(8.3145*DegreesCtoK(t));

export const SpecificEnthalpyDryAir = (t,P_a) => c_pa * t; // SensibleHeat
export const EvapHeatH2O_0C = 2501; // kJ/kg
export const HumidityRatio = (P_w,P_a) => (R_a/R_w) * P_w / (P_a - P_w); // P_a pressure of air
export const VolumetricHumidity = (t,P_w,P_a) => HumidityRatio(P_w,P_a) * ρ_H(HumidityRatio(P_w,P_a),t,P_a);
export const AbsoluteHumidity = VolumetricHumidity;
export const SpecificHumidity  = (t,P_w,P_a) => VolumetricHumidity(t,P_w,P_a)/DensityAir(t,P_w,P_a);
export const MixingRatio = (t,P_w,P_a) => VolumetricHumidity(t,P_w,P_a)/DensityDryAir(t,P_a); // same as humidity ratio?
export const SpecificEnthalpyH2O = (t,P_w,P_a) => HumidityRatio(P_w,P_a) * (EvapHeatH2O_0C + c_pw * t);
export const SpecificEnthalpyAir = (t,P_w,P_a) => SpecificEnthalpyDryAir(t) + SpecificEnthalpyH2O(t,P_w,P_a);
export const EnthalpyDensityAir  = (t,P_w,P_a) => ρ(t,P_w,P_a) * SpecificEnthalpyAir(t,P_w,P_a);
export const SpecificEnthalpySaturatedAir = (t,P_a) => SpecificEnthalpyAir(t, SaturationPressure(t), P_a);
// latent heat = rho * h_we * H - what is h_we ?? 61 or 51 at 25c?
//const LatentHeat = (t,P_w,P_a) => ρ(t) * SpecificEnthalpyH2O(t) * HumidityRatio(P_w,P_a);

export const VolumeRatioDryAir = {
    N2:   0.780818,
    O2:   0.209435,
    Ar:   0.009332,
    CO2:  0.000420,
    Trace:0.000030,
};
export const VolumeRatioSum = Object.entries(VolumeRatioDryAir).reduce((prev,[k,v]) => prev+v,0);

export const MolarMass = {
    N2:   28.0134,
    O2:   31.9988,
    Ar:   39.9480,
    CO2:  44.0100,
    Trace:19.8254,
    H2O:  18.01528,
    Air:  28.97,//28.96590,
};

export const MolarMassAir = Object.entries(VolumeRatioDryAir).reduce((prev,[k,v]) => prev+v*MolarMass[k]/VolumeRatioSum, 0);

export const MassRatioDryAir = Object.fromEntries(Object.keys(VolumeRatioDryAir).map(k =>
    [k,VolumeRatioDryAir[k]*MolarMass[k]/MolarMass.Air]
));

export const VolumeRatio = (S,P_w,P_a) => (1.0-P_w/P_a)*VolumeRatioDryAir[S];
export const MassRatio = (S,P_w,P_a) => (1.0-HumidityRatio(P_w,P_a))*MassRatioDryAir[S];
export const PartialPressure = (S,P_w,P_a) => (P_a-P_w)*VolumeRatioDryAir[S];
export const AbsoluteMass = (S,T,P_w,P_a) => DensityAir(T,P_w,P_a) * PartialPressure(S,P_w,P_a)/P_a;

export const g = 9.80665; // m/s^2
export const R = 8.3144598; // J/molK
export const N_a = 6.0221409e23;
export const k = 1.38066e-23; // J/K
export const AltitudePressureCoeff = (h,T_C) => Math.exp(-(MolarMass.Air/1000)*g*h/((R)*DegreesCtoK(T_C))); // h in meters

export const PersonPower = E => E*4184./86400; //E in kcal/day, Power in Watts
