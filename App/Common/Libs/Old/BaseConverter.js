"use strict";

//Modified by Not_Enough_Data_

// orion elenzil
// 20080905

function getValueOfDigit(digit, alphabet)
{
   var pos = alphabet.indexOf(digit);
   return pos;
}

function convertBase(src, srcAlphabet, dstAlphabet) { /*doesn't work*/ return "doesn't work";
   var srcBase = srcAlphabet.length;
   var dstBase = dstAlphabet.length;

   var wet     = src;
   var val     = 0;
   var mlt     = 1;

   while (wet.length > 0)
   {
     var digit  = wet.charAt(wet.length - 1);
     val       += mlt * getValueOfDigit(digit, srcAlphabet);
     wet        = wet.substring(0, wet.length - 1);
     mlt       *= srcBase;
   }

   wet          = val.toString();
   var ret      = "";

   while (wet >= dstBase)
   {
     var digitVal = strIntModulo(wet, dstBase);
     var digit    = dstAlphabet.charAt(digitVal);
     ret          = digit + ret;
     wet = strIntDiv(wet, dstBase);
   }

   var digit    = dstAlphabet.charAt(wet);
   ret          = digit + ret;
   
   return ret;
}

function convertBaseArr(src, srcAlphabet, dstAlphabet) { /*doesn't work*/ return "doesn't work";
   var srcBase = srcAlphabet.length;
   var dstBase = dstAlphabet.length;

   var wet     = src;
   var val     = 0;
   var mlt     = 1;

   while (wet.length > 0)
   {
     var digit  = wet[wet.length - 1];
     val       += mlt * getValueOfDigit(digit, srcAlphabet);
     wet        = wet.slice(0, wet.length - 1);
     mlt       *= srcBase;
   }

   wet          = val.toString();
   var ret      = "";

   while (wet >= dstBase)
   {
     var digitVal = Math.floor(strIntModulo(wet, dstBase));
     var digit    = dstAlphabet[digitVal];
     ret          = digit + ret;
     wet = strIntDiv(wet, dstBase);
   }

   var digit    = dstAlphabet[Math.floor(wet)];
   ret          = digit + ret;
   
   return ret;
}

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
	var res = [];
	
	
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

function strintTimesDigit(a, b) {
	//Error detection
	if (b < 0 || b > 9) {
		return false;
	}
	
	//Setup
	a = toIntArr(a);
	a.unshift(0);
	var len = a.length;
	var carry = 0;
	var res = [];
	
	//Multiply
	for (var i = len - 1; i >= 0; i--) {
		let dig = a[i];
		let digRes = ((dig * b) + carry);
		if (digRes.toString().length === 2) { //length is always 1 or 2
			digRes = digRes.toString();
			carry = parseInt(digRes.substr(0,1));
			res.unshift(parseInt(digRes.substr(1,2)));
		} else {
			carry = 0;
			res.unshift(digRes);
		}
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




