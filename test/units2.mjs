import * as Units from '../lib/units2.mjs';
import assertTrue, { AssertionError } from 'assert';

function assertFail(fun){
	try{
		fun();
	}catch(e){
		assertTrue(e instanceof AssertionError);
	}
}
function assertAll(...list) {
	return list.reduce((p,c)=>p&&c,true);
}
export default function Test() {
	let a=Units.x(1);
	assertTrue(a.val===1);
	a=new Units.x(2);
	assertTrue(a.val===2);
	let x= Units.kilogram(13);
	let y= Units.gram(x);
	let z= Units.kilogram(y);
	console.log(x,`\n${x}\n`,y,`\n${y}\n`,z,`\n${z}`);
	let $str='13 kilogram';
	let $num=13;
	assertAll(x===y,x===z,y===z);
	assertAll(`${x}` === $str, +x===$num,x+''===$str,''+x===$str);
	assertAll(`${z}` === $str, +z===$num,z+''===$str,''+z===$str);
	$str='13000 gram';
	$num=13;//value is in base units
	assertAll(`${y}` === $str, +y===$num,y+''===$str,''+y===$str);
}
