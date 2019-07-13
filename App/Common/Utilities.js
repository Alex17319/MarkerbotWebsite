"use strict";

//Read as "blank x" (verb, noun) meaning "set x to undefined"
function __(x) {
	x = undefined;
}

console.logAs = function(varName, content, moreContent, etc) {
	contentArr = arguments;
	contentArr.shift();
	if (contentArr.length === 0) {
		console.log(varName + " === " + window[varName]);
	} else if (contentArr.length === 1) {
		window[varName] = contentArr[0];
		console.log(varName + " := " + window[varName]);
	} else {
		window[varName] = contentArr;
		console.log(varName + " := " + window[varName]);
	}
}

/**Used in things like "var a = b || Throw(new Error("ERROR!"));"**/
function Throw(error) {
	throw error;
}

Array.prototype.containsPrimitive = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i].Equals(obj)) {
			return true;
		}
	}
	return false;
}

Array.prototype.shuffle = function() {
	var randomPos, temp, i = this.length;
	while (--i) {
		randomPos = Math.floor(Math.random() * i);
		temp = this[i - 1];
		this[i - 1] = this[randomPos];
		this[randomPos] = temp;
	}
	return this;
}

Array.prototype.joinNoCommas = function() {
	var len = this.length;
	var res = "";
	for (var i = 0; i < len; i++) {
		res += this[i];
	}
	return res;
}

String.prototype.contains = function(str) {
	return (this.indexOf(str) !== -1);
}

String.prototype.containsNothingOtherThan = function(str) {
	if (str.length !== 1) {
		throw new Error("String.containsNothingOtherThan(str): str must have length 1")
	}
	if (this.length === 0) {
		return true;
	}
	var i = this.length;
	while (i--) {
		if (this.substr(i,1) !== str) {
			return false;
		}
	}
	return true;
}

String.prototype.occurrences = function(substring, allowOverlapping) {
	substring += "";
	if (substring.length <= 0) return (this.length + 1);
	var n = 0,
		pos = 0,
		step = allowOverlapping ? 1 : substring.length;
	while (true) {
		pos = this.indexOf(substring, pos);
		if (pos >= 0) {
			++n;
			pos += step;
		} else break;
	}
	return n;
}

String.prototype.startsWith = function(str1, str2, str3, etc) { //Adds functionality (I think), and IE doesn't support it by default
	if (arguments.length == 1) {
		if (this.substring(0,str1.length) === str1) {
			return true;
		} else {
			return false;
		}
	} else if (arguments.length > 1) {
		for (let i = 0; i < arguments.length; i++) {
			let str = arguments[i];
			if (this.substring(0,str.length) === str) {
				return true;
			}
		}
		return false;
	} else {
		throw new Error("String.startsWith(): No potential starts to the string have been supplied");
	}
}

String.prototype.endsWith = function(str1, str2, str3, etc) { //Adds functionality (I think), and IE doesn't support it by default
	if (arguments.length == 1) {
		if (this.substring(this.length - str1.length) === str1) {
			return true;
		} else {
			return false;
		}
	} else if (arguments.length > 1) {
		let thisLen = this.length;
		for (let i = 0; i < arguments.length; i++) {
			let str = arguments[i];
			if (this.substring(thisLen - str.length) === str) {
				return true;
			}
		}
		return false;
	} else {
		throw new Error("String.endsWith(): No potential ends to the string have been supplied");
	}
}

Array.prototype.endsWith = function(item) {
	return (this[this.length - 1] === item);
}

String.prototype.substringPositiveOnly = function(start, end) {
	if (start >= 0 && end >= 0) {
		return this.substring(start, end);
	} else {
		let e = new Error("Start or end is either negative or NaN");
		e.name = "InvalidIndexError";
		throw e;
	}
}

Number.prototype.padFront = function(digits) {
	var str = this.toString();
	var intStr = str.substring(0, (str + ".").indexOf(".")); //(str.indexOf(".") === -1 && str) || str.indexOf(".") );
	var decStr = str.substring((str + ".").indexOf(".")); //(str.indexOf(".") === -1 || str.indexOf(".")) && str.length );
	var len = intStr.length;
	return (digits <= len && intStr + decStr) || "00000000000000000000".substring(0,digits-len) + intStr + decStr;
	//If 'digits <= len' returns true, the code after the && will run, and the result from that will be returned.
	//  The brackets will therefore evaluate to a string (true) so the code after the || will not run
	//Otherwise, the && will stop, the brackets will evaluate to false, and the code after the || will run
}

String.prototype.padFront = function(digits) {
	var str = this;
	var intStr = str.substring(0, (str + ".").indexOf("."));
	var decStr = str.substring((str + ".").indexOf("."));
	var len = intStr.length;
	return (digits <= len && intStr + decStr) || "00000000000000000000".substring(0,digits-len) + intStr + decStr;
	//If 'digits <= len' returns true, the code after the && will run, and the result from that will be returned.
	//  The brackets will therefore evaluate to a string (true) so the code after the || will not run
	//Otherwise, the && will stop, the brackets will evaluate to false, and the code after the || will run
}

function SwitchStringsAt(str1, str2, index) {
	str1 += ""; str2 += "";
	if (index > str1.length || index > str2.length) {
		throw new Error("SwitchStringsAt(): Cannot switch the strings, as the index is longer than one (or both) of the strings' length");
	}
	let resStr1 = str1.substring(0, index) + str2.substring(index);
	let resStr2 = str2.substring(0, index) + str1.substring(index);
	return {str1:resStr1, str2:resStr2};
}

function SwitchArraysAt(arr1, arr2, index) {
	var len = arr1.length;
	if (len !== arr2.length) {
		throw new Error("SwitchArraysAt(): Cannot switch the arrays, as the arrays are different lengths");
	}
	if (index >= len) {
		throw new Error("SwitchArraysAt(): Cannot switch the arrays, as the index is longer than or equal to the arrays' lengths");
	}
	
	for (var i = index; i < len; i++) {
		let temp = arr1[i];
		arr1[i] = arr2[i];
		arr2[i] = temp;
	}
}

Math.randomIntBetweenInclusive = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

Math.randomFloatBetweenInclusiveExclusive = function(min, max) {
	return Math.random() * (max - min) + min;
}

Math.bellCurve01Sine = function(x) {
	return (Math.sin(2 * Math.PI * (x - 1/4)) + 1) / 2;
}

Math.valueBetween = function(val1, val2, fraction) {
	if (isNaN(val1) || isNaN(val2) || isNaN(fraction)) {
		throw new Error("Math.valueBetween(): An argument is NaN.")
	}
	let d = val2 - val1; //delta
	let rd = d * fraction; //result delta
	let r = val1 + rd; //result
	return r;
}

Math.fractionBetween = function(val1, val2, between) {
	if (isNaN(val1) || isNaN(val2) || isNaN(between)) {
		throw new Error("Math.fractionBetween(): An argument is NaN.")
	}
	if (between > val2 || between < val1) {
		throw new Error("Math.fractionBetween(): Between is not between (inclusive) val1 and val1.");
	}
	let dVal2 = val2 - val1; //Delta val2
	let dBetween = between - val1; //Delta between
	return (dBetween / dVal2);
}

Math.mean = function(vectorNArray) {
	//Accept arrays in array or argument list form
	if (arguments.length > 1) {
		vectorNArray = arguments;
	}
	
	//Error detection
	if (vectorNArray.length === 0) {
		console.log("Could not caluclate average: Invalid array. (arguments passed to Math.mean = ", arguments, ")");
		throw new Error("Could not caluclate average: Invalid array. (arguments passed to Math.mean = " + arguments + ")");
	}
	
	try {
		//Calculate average for each axis
		if (Object.prototype.toString.call( vectorNArray[0] ) === "[object Array]") { //if first item is an array (so axes are named '0', '1', '2', '3', etc)
			let meanPoint = [];
			let firstItem = vectorNArray[0];
			for (var i = 0; i < firstItem.length; i++) {
				meanPoint.push(MeanVector1(vectorNArray, i));
			}
			return meanPoint;
		} else if (vectorNArray[0].x !== undefined) { //if the first item has a defined 'x' property (so axes are named 'x', 'y', etc (up to 'w'))
			let meanX = MeanVector1(vectorNArray, "x");
			if (vectorNArray[0].y !== undefined) {
				let meanY = MeanVector1(vectorNArray, "y");
				if (vectorNArray[0].z !== undefined) {
					let meanZ = MeanVector1(vectorNArray, "z");
					if (vectorNArray[0].w !== undefined) {
						let meanW = MeanVector1(vectorNArray, "w");
						if (vectorNArray[0].v !== undefined) {
							throw new Error("When using vectors with more than four dimensions, arrays (eg. [0, 1, 2, 3, 4]) rather than objects (eg. {x:1, y:2, z:3, w:4, v:5}) must be used.");
						} else {
							return {x:meanX, y:meanY, z:meanX, w:meanW};
						}
					} else {
						return {x:meanX, y:meanY, z:meanX};
					}
				} else {
					return {x:meanX, y:meanY};
				}
			} else {
				return {x:meanX};
			}
		} else if (parseInt(vectorNArray[0]).toString() !== "NaN") { //if the first item is a number (so the items are all scalars)
			return MeanVector1(vectorNArray, "");
		} else { //if the first item could not be interpreted
			throw new Error("Could not caluclate average: Unable to interpret components of first vector in array");
		}
	} catch (e) {
		if (e.message = "Len=0") {
			console.log("Could not caluclate average: Invalid array. (arguments passed to Math.mean = ", arguments, ")");
			throw new Error("Could not caluclate average: Invalid array. (arguments passed to Math.mean = " + arguments + ")");
		} else {
			throw e;
		}
	}
	
	function MeanVector1(vectorNArray, propertyName) {
		var len = vectorNArray.length;
		if (len === 0) {
			throw new Error("Len=0");
		}
		propertyName += "";
		var sum = 0;
		if (propertyName === "") {
			for (var i = 0; i < len; i++) {
				let component = vectorNArray[i];
				if (typeof(component) !== "number") {
					throw new Error("Could not caluclate average: Invalid number '" + vectorNArray[i] + "' (type = '" + typeof(vectorNArray[i]) + "') at position " + (i + 1) + ".");
				} else {
					sum += component;
				}
			}
		} else {
			for (var i = 0; i < len; i++) {
				let component = vectorNArray[i][propertyName];
				if (typeof(component) !== "number") {
					if (parseInt(propertyName).toString() === "NaN") {
						throw new Error ("Could not caluclate average: Invalid '" + propertyName + "' component '" + vectorNArray[i][propertyName] + "' (type = '" + typeof(vectorNArray[i][propertyName]) + "') at point number " + (i + 1) + ".");
					} else {
						throw new Error ("Could not caluclate average: Invalid component '" + vectorNArray[i][propertyName] + "' (type = '" + typeof(vectorNArray[i][propertyName]) + "') for axis number " + (parseInt(propertyName) + 1) + " at point number " + (i + 1) + ".");
					}
				} else {
					sum += component;
				}
			}
		}
		return sum / len;
	}
}

/**Checks if the properties in two objects are identical (not necessarily the same instance) (ignores types, except for primitives)**/
Object.prototype.Equals = function(other) {
	//Quick checks
	if (this === other) {return true; }
	if (Object.prototype.toString.call(this) !== Object.prototype.toString.call(other)) {return false; }
	if (typeof(this) === "number" || typeof(this) === "string" || typeof(this) === "boolean" || typeof(this) === "undefined") {
		if (this !== other) {return false; }
	}
	
	//Setup for looping through properties
	var thisProps = Object.getOwnPropertyNames(this);
	var otherProps = Object.getOwnPropertyNames(other);
	var len = thisProps.length;
	
	//Another quick check
	if (len !== otherProps.length) {return false; }
	
	//Loop through properties
	var i = len;
	while (i--) {
		let thisPropName = thisProps[i];
		let otherPropName = otherProps[i];
		if (thisPropName !== otherPropName) {return false; }
		let thisProp = this[thisPropName];
		let otherProp = other[otherPropName];
		if (thisProp !== otherProp && !(thisProp.Equals(otherProp))) {return false; }
	}
	return true;
}

//	//Only copies properties found in <this>, which may or may not be found in <source>
//	//May be unreliable
//	//Doesn't work on primitive types
//	Object.prototype.CopyFrom = function(source) {
//		if (source === undefined || this === undefined) {
//			throw new Error("Could not copy the object, as the source or destination is undefined.");
//		}
//		var thisProps = Object.getOwnPropertyNames(this);
//		var i = thisProps.length;
//		while (i--) {
//			let thisPropName = thisProps[i];
//			this[thisPropName] = source[thisPropName];
//		}
//	}
//	
//	//Sets everything in the destination to undefined (doesn't set the destination to undefined), then copies everything in the source
//	//Incomplete
//	Object.prototype.CopyTo = function(destination) {
//		if (source === undefined || this === undefined) {
//			throw new Error("Could not copy the object, as the source or destination is undefined.");
//		}
//		
//		//Primitive types
//		if (typeof(this) === "number" || typeof(this) === "string" || typeof(this) === "boolean" || typeof(this) === "undefined") {
//			destination = this;
//		}
//		
//		//Clear destination
//		var destProps = Object.getOwnPropertyNames(destination);
//		
//		
//		var thisProps = Object.getOwnPropertyNames(this);
//		var i = thisProps.length;
//		while (i--) {
//			let thisPropName = thisProps[i];
//			this[thisPropName] = source[thisPropName];
//		}
//	}
//	
//	//Incomplete
//	Object.prototype.ClearPropertyValues = function() {
//		//Primitive types
//		if (typeof(this) === "number" || typeof(this) === "string" || typeof(this) === "boolean" || typeof(this) === "undefined") {
//			this = undefined;
//		}
//		
//		var thisProps = Object.getOwnPropertyNames(this);
//		var i = thisProps.length;
//		while (i--) {
//			
//			destination[thisProps]
//		}
//	}

Object.prototype.Clone = function() {
	return Object.assign({}, this);
}

Array.prototype.Clone = function() {
	//Setup
	var len = this.length;
	var newArray = new Array(len);
	//Copy (recursively) (I don't think slice() does this)
	var i = len;
	while (i--) {
		newArray[i] = this[i].Clone();
	}
	//Return
	return newArray;
}

function EscapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function OnLoad(func) {
	var loop = setInterval(function(){
		if (document && document.body && document.body.addEventListener) {
			func.call();
			clearInterval(loop);
		}
	}, 10);
}

function toRadix(decimal,radix,radixDef) {
	if (radixDef === undefined) {
		radixDef = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
	//Source: http://www.javascripter.net/faq/convert3.htm
	var HexN="", Q=Math.floor(Math.abs(decimal)), R;
	while (true) {
		R=Q%radix;
		HexN = radixDef.charAt(R)
			+ HexN;
		Q=(Q-R)/radix; 
		if (Q==0) { break; }
	}
	return ((decimal<0) ? "-"+HexN : HexN);
}

function IsORIsChildOf(elem, other) {
	var currentElem = elem;
	while (currentElem !== null) {
		if (currentElem.Equals(other)) {
			return true;
		}
		currentElem = currentElem.parentElement;
	}
	return false;
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return rect.bottom > 0 &&
	       rect.right > 0 &&
	       rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
	       rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

function slowLoop(start, end, step, interval, content, contentParamsArr, passIteration) {
	var loopData = {i:start, step:step, end:end, content:content, params:contentParamsArr, iterationParams:[], passIteration:passIteration, loop:undefined};
	//for (var i = 0; i < loopData.params.length; i++) {
	//	if (loopData.params[i] === "<<<ITERATION>>>") {
	//		loopData.iterationParams.push(i);
	//	}
	//}
	if (passIteration) {
		loopData.params.unshift();
	}
	
	if (start < end && step > 0) { //If looping forward
		var loop = setInterval(function(contentParamsArr) {
			if (loopData.i < loopData.end) {
				//let params = loopData.params;
				//let iterationParams = loopData.iterationParams;
				//let i = loopData.i;
				//for (let j = 0; j < iterationParams.length; j++) {
				//	params[iterationParams[j]] = i;
				//}
				if (loopData.passIteration) {
					loopData.params[0] = loopData.i;
				}
				loopData.content.apply(this, loopData.params);
				loopData.i += loopData.step;
			} else {
				clearInterval(loop);
			}
		},interval,loopData);
		loopData.loop = loop;
	} else if (start > end && step < 0) { //If looping backward
		var loop = setInterval(function(contentParamsArr) {
			if (loopData.i > loopData.end) {
				//let params = loopData.params;
				//let iterationParams = loopData.iterationParams;
				//let i = loopData.i;
				//for (let j = 0; j < iterationParams.length; j++) {
				//	params[iterationParams[j]] = i;
				//}
				if (loopData.passIteration) {
					loopData.params[0] = loopData.i;
				}
				loopData.content.apply(this, loopData.params);
				loopData.i += loopData.step;
			} else {
				clearInterval(loop);
			}
		},interval,loopData);
		loopData.loop = loop;
	} else { //Error
		console.log("The loop is invalid")
	}
}

//	function Array.prototype.last = function() {
//		return this[this.length-1];
//	}

function compressionTest(decimal, full) {
	var base64 = decimalToBase64Sections(decimal); //just for logging
	var ascii = decimalToASCII(decimal);
	var utf16 = decimalToUTF16(decimal);
	var binary = bigInt(decimal, 10).toString(2);
	
	var a = ascii;
	var b = base64;
	var c = Base64String.compress(base64);
	var d = LZString.compressToEncodedURIComponent(Base64String.compress(base64));
	var e = LZString.compressToEncodedURIComponent(ascii);
	var f = LZString.compress(ascii);
	var g = LZString.compress(base64);
	var h = LZString.compressToEncodedURIComponent(base64);
	var i = utf16;
	var j = LZString.compress(utf16);
	var k = LZString.compressToEncodedURIComponent(utf16);
	var l = LZString.compress(decimal);
	var m = LZString.compressToEncodedURIComponent(decimal);
	var n = LZString.compress(binary);
	var o = LZString.compressToEncodedURIComponent(binary);
	
	
	var r_a = ASCIIToDecimal(a);
	var r_b = Base64SectionsToDecimal(b);
	var r_c = Base64SectionsToDecimal(Base64String.decompress(c));
	var r_d = Base64SectionsToDecimal(Base64String.decompress(LZString.decompressFromEncodedURIComponent(d)));
	var r_e = ASCIIToDecimal(LZString.decompressFromEncodedURIComponent(e));
	var r_f = ASCIIToDecimal(LZString.decompress(f));
	var r_g = Base64SectionsToDecimal(LZString.decompress(g));
	var r_h = Base64SectionsToDecimal(LZString.decompressFromEncodedURIComponent(h));
	var r_i = UTF16ToDecimal(i);
	var r_j = UTF16ToDecimal(LZString.decompress(j));
	var r_k = UTF16ToDecimal(LZString.decompressFromEncodedURIComponent(k));
	var r_l = LZString.decompress(l);
	var r_m = LZString.decompressFromEncodedURIComponent(m);
	var r_n = bigInt(LZString.decompress(n), 2).toString(10);
	var r_o = bigInt(LZString.decompressFromEncodedURIComponent(o), 2).toString(10);
	
	if (full) {
		//	console.log("#1: "  + a + ",,,,,,,,,,,,,,,," + r_a + ",,,,,,,,,,,,,,,," + (decimal === r_a));
		//	console.log("#2: "  + b + ",,,,,,,,,,,,,,,," + r_b + ",,,,,,,,,,,,,,,," + (decimal === r_b));
		//	console.log("#3: "  + c + ",,,,,,,,,,,,,,,," + r_c + ",,,,,,,,,,,,,,,," + (decimal === r_c));
		//	console.log("#4: "  + d + ",,,,,,,,,,,,,,,," + r_d + ",,,,,,,,,,,,,,,," + (decimal === r_d));
		//	console.log("#5: "  + e + ",,,,,,,,,,,,,,,," + r_e + ",,,,,,,,,,,,,,,," + (decimal === r_e));
		//	console.log("#6: "  + f + ",,,,,,,,,,,,,,,," + r_f + ",,,,,,,,,,,,,,,," + (decimal === r_f));
		//	console.log("#7: "  + g + ",,,,,,,,,,,,,,,," + r_g + ",,,,,,,,,,,,,,,," + (decimal === r_g));
		//	console.log("#8: "  + h + ",,,,,,,,,,,,,,,," + r_h + ",,,,,,,,,,,,,,,," + (decimal === r_h));
		//	console.log("#9: "  + i + ",,,,,,,,,,,,,,,," + r_i + ",,,,,,,,,,,,,,,," + (decimal === r_i));
		//	console.log("#10: " + j + ",,,,,,,,,,,,,,,," + r_j + ",,,,,,,,,,,,,,,," + (decimal === r_j));
		//	console.log("#11: " + k + ",,,,,,,,,,,,,,,," + r_k + ",,,,,,,,,,,,,,,," + (decimal === r_k));
		//	console.log("#12: " + l + ",,,,,,,,,,,,,,,," + r_l + ",,,,,,,,,,,,,,,," + (decimal === r_l));
		//	console.log("#13: " + m + ",,,,,,,,,,,,,,,," + r_m + ",,,,,,,,,,,,,,,," + (decimal === r_m));
		//	console.log("#14: " + n + ",,,,,,,,,,,,,,,," + r_n + ",,,,,,,,,,,,,,,," + (decimal === r_n));
		//	console.log("#15: " + o + ",,,,,,,,,,,,,,,," + r_o + ",,,,,,,,,,,,,,,," + (decimal === r_o));
	}
	console.log(
		"Original length: " + decimal.length + "\n" +
		"#1:  " + (decimal === r_a) + ", length = " + a.length + ", ascii\n" +
		"#2:  " + (decimal === r_b) + ", length = " + b.length + ", base64\n" +
		"#3:  " + (decimal === r_c) + ", length = " + c.length + ", raw\n" +
		"#4:  " + (decimal === r_d) + ", length = " + d.length + ", uri\n" +
		"#5:  " + (decimal === r_e) + ", length = " + e.length + ", uri\n" +
		"#6:  " + (decimal === r_f) + ", length = " + f.length + ", raw\n" +
		"#7:  " + (decimal === r_g) + ", length = " + g.length + ", raw\n" +
		"#8:  " + (decimal === r_h) + ", length = " + h.length + ", uri\n" +
		"#9:  " + (decimal === r_i) + ", length = " + i.length + ", utf16\n" +
		"#10: " + (decimal === r_j) + ", length = " + j.length + ", raw\n" +
		"#11: " + (decimal === r_k) + ", length = " + k.length + ", uri\n" +
		"#12: " + (decimal === r_l) + ", length = " + l.length + ", raw\n" +
		"#13: " + (decimal === r_m) + ", length = " + m.length + ", uri\n" +
		"#14: " + (decimal === r_n) + ", length = " + n.length + ", raw\n" +
		"#15: " + (decimal === r_o) + ", length = " + o.length + ", uri\n"
	);
	
	return undefined;
}

function compressDecimalToURIComponent(decimal) {
	return LZString.compressToEncodedURIComponent(decimal);
}




function decimalToASCII(decimal) {
	var sectLen = 8;
	decimal = "1" + decimal;
	var res = "";
	var binary = bigInt(decimal, 10).toString(2);
	//console.log(binary);
	while ((binary.length + 1) % sectLen !== 0) {
		binary = "0" + binary;
	}
	binary = "1" + binary;
	for (var i = 0; i < binary.length; i+=sectLen) {
		let section = binary.substr(i, sectLen);
		let ascii = binaryByteToASCII(section);
		res += ascii;
	}
	
	return res;
}

function decimalToBase64Sections(decimal) {
	var sectLen = 6;
	decimal = "1" + decimal;
	//console.log("#1", decimal);
	var res = "";
	var binary = bigInt(decimal, 10).toString(2);
	//console.log("#2", binary);
	while ((binary.length + 1) % sectLen !== 0) {
		//console.log(binary.length, binary.length + 1, (binary.length + 1) % sectLen);
		binary = "0" + binary;
	}
	binary = "1" + binary;
	//console.log("#2.1", binary);
	for (var i = 0; i < binary.length; i+=sectLen) {
		let section = binary.substr(i, sectLen);
		let base64 = binarySixbitsToBase64(section);
		res += base64;
	}
	//console.log("#3", res);
	
	return res;
}

function decimalToUTF16(decimal) {
	var sectLen = 16;
	decimal = "1" + decimal;
	var res = "";
	var binary = bigInt(decimal, 10).toString(2);
	//console.log(binary);
	while ((binary.length + 1) % sectLen !== 0) {
		binary = "0" + binary;
	}
	binary = "1" + binary;
	for (var i = 0; i < binary.length; i+=sectLen) {
		let section = binary.substr(i, sectLen);
		let utf16 = binaryTwobytesToUTF16(section);
		res += utf16;
	}
	
	return res;
}



function ASCIIToDecimal(ascii) {
	ascii += "";
	var binary = "";
	for (var i = 0; i < ascii.length; i+=1) {
		let section = ascii.substr(i, 1);
		let bin = ASCIICharToBinaryByte(section);
		binary += bin;
	}
	binary = binary.substring(1);
	var decimal = bigInt(binary, 2).toString(10).substring(1)
	return decimal;
}

function Base64SectionsToDecimal(base64) {
	base64 += "";
	//console.log("#4", base64);
	var binary = "";
	for (var i = 0; i < base64.length; i+=1) {
		let section = base64.substr(i, 1);
		let bin = Base64CharToBinarySixbits(section);
		binary += bin;
	}
	//console.log("#5", binary);
	binary = binary.substring(1);
	//console.log("#5.1", binary);
	var decimal = bigInt(binary, 2).toString(10).substring(1)
	//console.log("#6", decimal);
	return decimal;
}

function UTF16ToDecimal(utf16) {
	utf16 += "";
	var binary = "";
	for (var i = 0; i < utf16.length; i+=1) {
		let section = utf16.substr(i, 1);
		let bin = UTF16CharToBinaryTwobytes(section);
		binary += bin;
	}
	
	binary = binary.substring(1);
	var decimal = bigInt(binary, 2).toString(10).substring(1)
	return decimal;
}



function GetAsciiChars() {
	var chars = "";
	for (var i = 0; i < 256; i++) {
		chars += "###" + String.fromCharCode(i);
	}
	return chars;
}

function GetAsciiCharsArr() {
	var chars = [];
	for (var i = 0; i < 256; i++) {
		chars.push(String.fromCharCode(i));
	}
	return chars;
}

function GetAsciiRepresentation() {
	var chars = [];
	for (var i = 0; i < 256; i++) {
		chars.push("#" + i.padFront(3));
	}
	return chars;
}

function GetElementIndex(elem) {
	if (elem === undefined) {
		throw new Error("GetElementIndex: elem is undefined");
	}
	if (elem.parentElement === undefined) {
		throw new Error("GetElementIndex: elem has no parent");
	}
	var currentElem = elem;
	var index = 0;
	var previousElementSibling = currentElem.previousElementSibling
	while (previousElementSibling !== null) {
		index++;
		currentElem = previousElementSibling;
		previousElementSibling = currentElem.previousElementSibling;
	}
	return index;
}

/* Source: http://stackoverflow.com/a/27204937/4149474 */
/* Returns pixel coordinates according to the pixel that's under the mouse cursor */
HTMLCanvasElement.prototype.eventRelativeCoords = function(event) {
	var x,y;
	//This is the current screen rectangle of canvas
	var rect = this.getBoundingClientRect();
	var top    = rect.top;
	var bottom = rect.bottom;
	var left   = rect.left;
	var right  = rect.right;
	//Subtract border size
	// Get computed style
	var styling = getComputedStyle(this,null);
	// Turn the border widths in integers
	var topBorder    = parseInt(styling.getPropertyValue('border-top-width'   ),10);
	var rightBorder  = parseInt(styling.getPropertyValue('border-right-width' ),10);
	var bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'),10);
	var leftBorder   = parseInt(styling.getPropertyValue('border-left-width'  ),10);
	//Subtract border from rectangle
	top    += topBorder;
	bottom -= bottomBorder;
	left   += leftBorder;
	right  -= rightBorder;
	//Recalculate mouse offsets to relative offsets
	x = event.clientX - left;
	y = event.clientY - top;
	//Also recalculate offsets of canvas is stretched
	var width = right - left;
	//I use this to reduce number of calculations for images that have normal size 
	if(this.width != width) {
		let height = bottom - top;
		//changes coordinates by ratio
		x = x*(this.width/width);
		y = y*(this.height/height);
	} 
	//Return as an object
	return {x:x, y:y};
}