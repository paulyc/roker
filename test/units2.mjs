import * as Units from '../lib/units2.mjs';
import assertTrue, { AssertionError } from 'assert';

function assertFail(fun){
	try{
		fun();
	}catch(e){
		assertTrue(e instanceof AssertionError);
	}
}
export default function Test() {
	assertTrue(1+1===2);
	assertFail(()=>assertTrue(1+1!==2));
	let x= Units.kilogram(13);
	let y= Units.gram(x);
	let z= Units.kilogram(y);
	console.log(x,y,z);
	console.log(...[x,y,z].map(v=>new String(v)));
}

