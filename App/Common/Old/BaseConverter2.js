"use strict";

//Not_Enough_Data_ 2016

function decToBin(decimal) {
	//Setup
	var neg = "";
	if (decimal.substr(0,1) === "-") {
		neg = "-";
		decimal = decimal.substr(1);
	}
	decimal = toIntArr(decimal);
	decimal.removeZerosAtFront();
	if (decimal === []) {
		return "0";
	}
	var pow = [1,0,2,4];
	var step = 1024;
	var res = [];
	
	console.log("#1", new Date().getTime());
	
	//Find higest power of 2
	var correct = "untested";
	while (correct !== "good") {
		correct = testPow(pow);
		if (correct === "too low") {
			pow = strintTimesDigit(pow, 2);
			pow.removeZerosAtFront();
		} else if (correct === "too high") {
			pow = strIntDiv(pow, 2);
		}
	}
	pow.removeZerosAtFront();
	
	console.log("#2", new Date().getTime(), arrToStr(pow));
	
	//Generate binary number
	var remaining = decimal;
	while (strintGEQ(pow, [1])) {
		if (strintLSS(pow, remaining)) { //pow < remaining
			remaining = strSubtract(remaining, pow);
			res.push(1);
			pow = strIntDiv(pow, 2);
		} else if (strintEQ(pow, remaining)) { //pow == remaining
			remaining = [0];
			res.push(1);
			//Add all remaining zeros (faster than continuing normal loop)
			console.log("#3", new Date().getTime());
			while(strintGTR(pow, [1])) {
				res.push(0);
				pow = strIntDiv(pow, 2);
			}
			break;
		} else { //pow > remaining
			res.push(0);
			pow = strIntDiv(pow, 2);
		}
	}
	
	console.log("#4", new Date().getTime());
	
	while (res[0] === 0) {
		res.shift();
	}
	
	return neg + arrToStr(res);
	
	function testPow(pow) { //Pow = 1, 2, 4, 8, 16, 32, etc not 1, 2, 3, 4, 5 etc
		let nextPow = strintTimesDigit(pow, 2);
		if (strintLEQ(pow, decimal)){
			if (strintGTR(nextPow, decimal)) {
				return "good";
			} else {
				return "too low";
			}
		} else {
			return "too high";
		}
	}
}

function binaryByteToASCII(binary) {
	return String.fromCharCode(parseInt(binary, 2));
}

function ASCIICharToBinaryByte(ascii) {
	return ascii.charCodeAt(0).toString(2).padFront(8);
}

function binaryTwobytesToUTF16(binary) {
	return String.fromCharCode(parseInt(binary, 2));
}

function UTF16CharToBinaryTwobytes(utf16) {
	return utf16.charCodeAt(0).toString(2).padFront(16);
}

function binarySixbitsToBase64(binary) {
	var index = parseInt(binary, 2);
	switch (index) {
		case 0 : return "0";
		case 1 : return "1";
		case 2 : return "2";
		case 3 : return "3";
		case 4 : return "4";
		case 5 : return "5";
		case 6 : return "6";
		case 7 : return "7";
		case 8 : return "8";
		case 9 : return "9";
		case 10: return "a";
		case 11: return "b";
		case 12: return "c";
		case 13: return "d";
		case 14: return "e";
		case 15: return "f";
		case 16: return "g";
		case 17: return "h";
		case 18: return "i";
		case 19: return "j";
		case 20: return "k";
		case 21: return "l";
		case 22: return "m";
		case 23: return "n";
		case 24: return "o";
		case 25: return "p";
		case 26: return "q";
		case 27: return "r";
		case 28: return "s";
		case 29: return "t";
		case 30: return "u";
		case 31: return "v";
		case 32: return "w";
		case 33: return "x";
		case 34: return "y";
		case 35: return "z";
		case 36: return "A";
		case 37: return "B";
		case 38: return "C";
		case 39: return "D";
		case 40: return "E";
		case 41: return "F";
		case 42: return "G";
		case 43: return "H";
		case 44: return "I";
		case 45: return "J";
		case 46: return "K";
		case 47: return "L";
		case 48: return "M";
		case 49: return "N";
		case 50: return "O";
		case 51: return "P";
		case 52: return "Q";
		case 53: return "R";
		case 54: return "S";
		case 55: return "T";
		case 56: return "U";
		case 57: return "V";
		case 58: return "W";
		case 59: return "X";
		case 60: return "Y";
		case 61: return "Z";
		case 62: return "+";
		case 63: return "/";
		default: throw "Binary string is more than 6 digits long";
		//case 64: return "=" //for some reason lz-string has 65 characters
	}
}

function Base64CharToBinarySixbits(base64) {
	var chr = base64.substring(0,1);
	var decimal = "";
	if      (chr === "0") {decimal = 0  }
	else if (chr === "1") {decimal = 1  }
	else if (chr === "2") {decimal = 2  }
	else if (chr === "3") {decimal = 3  }
	else if (chr === "4") {decimal = 4  }
	else if (chr === "5") {decimal = 5  }
	else if (chr === "6") {decimal = 6  }
	else if (chr === "7") {decimal = 7  }
	else if (chr === "8") {decimal = 8  }
	else if (chr === "9") {decimal = 9  }
	else if (chr === "a") {decimal = 10 }
	else if (chr === "b") {decimal = 11 }
	else if (chr === "c") {decimal = 12 }
	else if (chr === "d") {decimal = 13 }
	else if (chr === "e") {decimal = 14 }
	else if (chr === "f") {decimal = 15 }
	else if (chr === "g") {decimal = 16 }
	else if (chr === "h") {decimal = 17 }
	else if (chr === "i") {decimal = 18 }
	else if (chr === "j") {decimal = 19 }
	else if (chr === "k") {decimal = 20 }
	else if (chr === "l") {decimal = 21 }
	else if (chr === "m") {decimal = 22 }
	else if (chr === "n") {decimal = 23 }
	else if (chr === "o") {decimal = 24 }
	else if (chr === "p") {decimal = 25 }
	else if (chr === "q") {decimal = 26 }
	else if (chr === "r") {decimal = 27 }
	else if (chr === "s") {decimal = 28 }
	else if (chr === "t") {decimal = 29 }
	else if (chr === "u") {decimal = 30 }
	else if (chr === "v") {decimal = 31 }
	else if (chr === "w") {decimal = 32 }
	else if (chr === "x") {decimal = 33 }
	else if (chr === "y") {decimal = 34 }
	else if (chr === "z") {decimal = 35 }
	else if (chr === "A") {decimal = 36 }
	else if (chr === "B") {decimal = 37 }
	else if (chr === "C") {decimal = 38 }
	else if (chr === "D") {decimal = 39 }
	else if (chr === "E") {decimal = 40 }
	else if (chr === "F") {decimal = 41 }
	else if (chr === "G") {decimal = 42 }
	else if (chr === "H") {decimal = 43 }
	else if (chr === "I") {decimal = 44 }
	else if (chr === "J") {decimal = 45 }
	else if (chr === "K") {decimal = 46 }
	else if (chr === "L") {decimal = 47 }
	else if (chr === "M") {decimal = 48 }
	else if (chr === "N") {decimal = 49 }
	else if (chr === "O") {decimal = 50 }
	else if (chr === "P") {decimal = 51 }
	else if (chr === "Q") {decimal = 52 }
	else if (chr === "R") {decimal = 53 }
	else if (chr === "S") {decimal = 54 }
	else if (chr === "T") {decimal = 55 }
	else if (chr === "U") {decimal = 56 }
	else if (chr === "V") {decimal = 57 }
	else if (chr === "W") {decimal = 58 }
	else if (chr === "X") {decimal = 59 }
	else if (chr === "Y") {decimal = 60 }
	else if (chr === "Z") {decimal = 61 }
	else if (chr === "+") {decimal = 62 }
	else if (chr === "/") {decimal = 63 }
	else {throw "'" + chr + "' is not a valid Base64 character"; }
	return decimal.toString(2).padFront(6);
}

//	function binarySevenbitsToBase128(binary) {
//		var index = parseInt(binary, 2);
//		switch (index) {
//			case 0x21 to 0x3E: return String.fromCharCode(index - 0x21);
//			case 0x40 to 0x7E: return String.fromCharCode(index - 0x40 + (0x7E - 0x40));
//			case 0xA1 to 
//		}
//	}

function bigIntBase93ToBase93(bigIntBase93) {
	var len = bigIntBase93.length;
	var res = "";
	for (var i = 0; i < len; i++) {
		let item = bigIntBase93.substr(i,1);
		if (item === "<") {
			let charNum = bigIntBase93.substr(i + 1, 2);
			if (charNum >= 63) { charNum++; }
			res += String.fromCharCode(charNum);
			i+=3;
		} else {
			res += item;
		}
	}
	return res;
}

//Limited to 40 zeros added (add more to string to increase)
String.prototype.padFront = function(digits) {
	var str = this;
	var intStr = str.substring(0, (str + ".").indexOf("."));
	var decStr = str.substring((str + ".").indexOf("."));
	var len = intStr.length;
	return (digits <= len && intStr + decStr) || "0000000000000000000000000000000000000000".substring(0,digits-len) + intStr + decStr;
}

function strIntDiv(numeratorStr, denominatorInt) { //works
	var t = toIntArr(numeratorStr); //t = top
	var b = denominatorInt;    //b = bottom
	if (b < 1 || b % 1 !== 0) {
		return "Invalid denominator";
	}
	var res = [];
	var remainder = "";
	//Digits before decimal point
	for (var i = 0; i < t.length; i++) {
		let digit = parseInt(remainder + t[i]);
		remainder = (   (digit % b) || "" && (digit % b).toString()   ).toString();
		res.push(wholeNumDiv(digit, b));
	}
	//Remove zero(s?) at start
	while(res[0] === 0) {
		res.shift();
	}
	if (res === []) {res = [0]; }
	//Digits after decimal point
	if (remainder !== "") {
		res.push(".");
		for (var i = 0; i < 20; i++) { //Roughly the same as above //Change '20' if you need more decimal places
			let digit = parseInt(remainder + "0");
			remainder = (   (digit % b) || "" && (digit % b).toString()   );
			res.push(wholeNumDiv(digit, b));
		}
	}
	return res;
}

//Returns the number of times the denominator compeletely goes into the numerator
function wholeNumDiv(numerator, denominator) { //works
	var remaining = numerator,
		res = 0;
	remaining -= denominator;
	while (remaining >= 0) {
		res++;
		remaining -= denominator;
	}
	return res;
}

//Returns the modulo of two floored numbers (always returns an int-string not a float-string)
function strIntModulo(numerator, denominator) { /*doesn't work*/ return "doesn't work";
	numerator = numerator.substr(0,(numerator + ".").indexOf(".")); //Floor
	denominator = Math.floor(denominator);                          //Floor
	var remaining = numerator + "";
	var lastPositive = "";
	for (var i = 40; i > 0; i--) {
		let subtract = Math.pow(denominator, i);
		if (subtract > 10000000000000000) {
			continue;
		}
		subtract = subtract.toString();
		console.log("#1: " + subtract);
		
		while (remaining.substr(0,1) !== "-") {
			lastPositive = remaining;
			remaining = strSubtract(remaining, subtract);
			console.log("#2: " + remaining);
		}
		remaining = lastPositive;
		
	}
	return lastPositive;
}

//	function strSubtract(a, b) {
//		a = a + "";
//		b = b + "";
//		var lenA = a.length;
//		var lenB = b.length;
//		var len = Math.Max(lenA, lenB);
//		var res = "";
//		var carry = 0;
//		for (var i = 0; i < len; i++) {
//			let digA;
//			let digB;
//			if (i < lenA) {
//				digA = parseInt(a.substr(lenA - i - 1,1) || 0);
//			} else {
//				digA = 0;
//			}
//			if (i < lenB) {
//				digB = parseInt(b.substr(lenB - i - 1,1) || 0) + carry;
//			} else {
//				digB = 0 + carry;
//			}
//			let subtracted = digA - digB;
//			if (i !== len - 1) {
//				if (subtracted < 0) {
//					carry = 1;
//					res = (10 + subtracted) + res;
//				} else {
//					carry = 0;
//					res = (10 - subtracted) + res;
//				}
//			} else {
//				carry = undefined;
//				res = subtracted + res;
//			}
//		}
//		if (res.substr(0,1) === "-") {
//			res = "-" + strSubtract(b, a);
//		}
//		//Remove zero(s?) at start
//		while(res.substr(0,1) === "0") {
//			res = res.substr(1);
//		}
//		return res;
//	}

//Only works with non-negative integers
function strSubtract(a, b, asArr) { //works
	//Setup
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	var lenA = arrA.length;
	var lenB = arrB.length;
	var len = Math.Max(lenA, lenB);
	var res = [];
	var negative = false;
	
	//Convert to ints
	for (var i = 0; i < len; i++) {
		arrA[len - i - 1] = parseInt(a[lenA - i - 1] || 0);
		arrB[len - i - 1] = parseInt(b[lenB - i - 1] || 0);
	}
	
	//Subtract
	for (var i = len - 1; i >= 0; i--) {
		let digA = arrA[i];
		let digB = arrB[i];
		let subtracted = digA - digB;
		if (subtracted < 0) {
			if (i > 0) {
				arrA[i - 1] -= 1; //reverse carry
			} else {
				negative = true;
			}
			subtracted = (digA + 10) - digB; //apply reverse carry
		}
		res.unshift(subtracted);
	}
	
	//Detect and apply negative
	if (negative) {
		let exp10 = "1";
		for (var i = 0; i < res.length; i++) {
			exp10 += "0";
		}
		res = strSubtract(exp10, res, true);
		res.unshift("-");
	}
	
	//Remove zeros at start
	while(res[0] === 0) {
		res.shift();
	}
	
	return res;
}

function strintTimesInt(a, b) {
	//Error detection
	if (b < 0 || b.toString().indexOf("e") !== -1) {
		return false;
	}
	
	//Setup
	a = toIntArr(a);
	a.unshift(0);
	var len = a.length;
	var carry = 0;
	var carryStr = "";
	var res = [];
	
	//Multiply
	for (var i = len - 1; i >= 0; i--) {
		let dig = a[i];
		let digRes = ((dig * b) + parseInt(carryStr.substring(carryStr.length - 1) || 0));
		//	if (digRes.toString().length === 2) { //length is always 1 or 2
		//		digRes = digRes.toString();
		//		carry = parseInt(digRes.substr(0,1));
		//		res.unshift(parseInt(digRes.substr(1,2)));
		//	} else {
		//		carry = 0;
		//		res.unshift(digRes);
		//	}
		let digResStr = digRes.toString();
		carry = Math.floor(carry/10);
		carry = parseInt(digResStr.substring(0,digResStr.length - 1)) + carry;
		carryStr = (carry || "").toString();
		res.unshift(parseInt(digResStr.substr(digResStr.length - 1)));
	}
	
	return res;
}

Math.Max = function(a, b) { //works
	if (a > b) { return a; }
	else {return b;}
}

//For strints and strdecimals
function strintEQ(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	if (arrEq(arrA, arrB)) {
		return true; //a === b
	} else {
		return false; //a !== b
	}
}

//For strints and strdecimals
function strintNEQ(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	if (arrEq(arrA, arrB)) {
		return false; //a === b
	} else {
		return true; //a !== b
	}
}

//For strints and strdecimals
function strintGTR(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	for (var i = 0; i < len; i++) {
		let digA = arrA[i];
		let digB = arrB[i];
		if (digA > digB) {
			return true; //a > b
		} else if (digA < digB) {
			return false; //a < b
		}
	}
	return false; //a === b
}

//For strints and strdecimals
function strintGEQ(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	for (var i = 0; i < len; i++) {
		let digA = arrA[i];
		let digB = arrB[i];
		if (digA > digB) {
			return true; //a > b
		} else if (digA < digB) {
			return false; //a < b
		}
	}
	return true; //a === b
}

//For strints and strdecimals
function strintLSS(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	for (var i = 0; i < len; i++) {
		let digA = arrA[i];
		let digB = arrB[i];
		if (digA > digB) {
			return false; //a > b
		} else if (digA < digB) {
			return true; //a < b
		}
	}
	return false; //a === b
}

//For strints and strdecimals
function strintLEQ(a, b) { //works
	//Setup
	var len = Math.Max(a.length, b.length);
	var arrA = toIntArr(a);
	var arrB = toIntArr(b);
	
	//Adjust length
	arrA.zeroPadFront(len);
	arrB.zeroPadFront(len);
	
	//Compare
	for (var i = 0; i < len; i++) {
		let digA = arrA[i];
		let digB = arrB[i];
		if (digA > digB) {
			return false; //a > b
		} else if (digA < digB) {
			return true; //a < b
		}
	}
	return true; //a === b
}

function strArrToIntArr(strArr) {
	var len = strArr.length;
	var intArr = Array(len);
	while (len--) { //'len' now means 'i'
		intArr[len] = parseInt(strArr[len]);
	}
	return intArr;
}

//Outputs an array of single character strings
//Can take srings, ints (without scientific notation), arrays of single char strings, and arrays of single digit ints (warning: little/no error handling)
function toStrArr(input) { //works
	var res = [];
	if (Object.prototype.toString.call( input ) === "[object Array]") { //meaning "if (typeof(input) === Array)"
		res = input;
		let i = res.length;
		while(i--) {
			res[i] = res[i].toString();
		}
	} else {
		res = (input.toString()).split("");
	}
	return res;
}

//Outputs an array of single digit strings
//Can take srings, ints (without scientific notation), arrays of single char strings, and arrays of single digit ints (warning: little/no error handling)
function toIntArr(input) {
	var res = [];
	if (Object.prototype.toString.call( input ) === "[object Array]") { //meaning "if (typeof(input) === Array)"
		res = input;
	} else {
		res = (input.toString()).split("");
	}
	let i = res.length;
	while(i--) {
		res[i] = parseInt(res[i]);
	}
	return res;
}

function arrToStr(input) {
	var res = "";
	for (var i = 0; i < input.length; i++) {
		res += input[i];
	}
	return res;
}


Array.prototype.zeroPadFront = function(len) {
	var	arr = this;
	arr.push(".");
	var arrLen = arr.length;
	for (var i = 0; i < arrLen; i++) {
		if (arr[i].toString() === "NaN") {
			arr[i] = ".";
		}
	}
	var front = arr.splice(0, arr.indexOf("."));
	var end = arr.splice(arr.indexOf("."), arr.length - 1);
	
	
	var shiftLen = len - front.length;
	for (var i = 0; i < shiftLen; i++) {
		front.unshift(0);
	}
	
	//Clear <this>
	var arrLen = this.length;
	for (i = 0; i < arrLen; i++) {
		this.pop();
	}
	
	//Set <this> to res
	var res = front.concat(end);
	arrLen = res.length
	for (i = 0; i < arrLen; i++) {
		this[i] = res[i];
	}
}

//	Array.prototype.unZeroPadEnd = function() {
//		while (this[this.length - 1] === 0 || this[this.length - 1] === "0") {
//			this.pop();
//		}
//	}

Array.prototype.removeZerosAtFront = function() {
	while (this[0] === 0 || this[0] === "0") {
		this.shift();
	}
}

function arrEq(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	var len = arr1.length;
	for (var i = 0; i < len; i++) {
		let item1 = arr1[i];
		let item2 = arr2[i];
		if (Object.prototype.toString.call( item1 ) === "[object Array]") { //If array
			if (Object.prototype.toString.call( item2 ) === "[object Array]") { //If array
				if (!arrEq(item1, item2)) {
					return false;
				}
			} else {
				return false;
			}
		} else {
			if (item1 !== item2 && (item1.toString() !== "NaN" || item2.toString() !== "NaN")) { //NaN stuff is needed for some reason
				return false;
			}
		}
	}
	return true;
}




