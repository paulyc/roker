import * as Physics from './physics.mjs';

export default function System(initialTempC, initialDewpointC) {
	this.temp = Number(initialTempC);
	this.dewpoint = Number(initialDewpointC);
}
