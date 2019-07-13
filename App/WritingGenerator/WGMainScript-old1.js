"use strict";

var combinations = [];
var styleQuality = "";
var styleData = [];
var letterWidths = [];
var singleLettersCount;
var lowercaseSingleLettersCount;
const lineHeight = 100;
var logIndex = 0;

const debugMode = true;

function Main() {
	
	var urlVars = GetVariablesFromUrl();
	
	styleQuality = urlVars.styleQuality;
	
	combinations = GetCombinations(styleQuality);
	
	letterWidths = LoadLetterWidthsFromString(urlVars.letterWidths, singleLettersCount);
	
	styleData = LoadCanvasDataFromStyleDecimal(urlVars.styleDecimal, combinations);
	
	
	RemoveOffsetsFromStyleData();
	ValidateStyleData();
	
}

function GoButtonClick() {
	var input = document.getElementById("textToWriteInput");
	input.style.height = "10vh";
	setTimeout(function() {
		GenerateHandwriting(input.value);
	}, 100);
}



function RemoveOffsetsFromStyleData() {
	for (var i = 0; i < singleLettersCount; i++) {
		//Setup
		let comboData = styleData[i];
		
		//Calculate combination offset and width
		let lF = letterWidths[i][0]; //left line fraction
		let rF = letterWidths[i][1]; //right line fraction
		let wF = Math.abs(lF - rF); //width fraction
		
		let offset = lF * 600;
		let width = wF * 600;
		
		//Subtract offset from point array
		comboData.strokeData = AddPointToAllInPointArray(comboData.strokeData, new Point(-offset, 0));
		
		//Add extra properties to combo data
		comboData.width = width;
		comboData.firstLetterEnd = width;
		
		//Set styleData[i] to comboData
		styleData[i] = comboData;
	}
	for (var i = singleLettersCount; i < styleData.length; i++) {
		//Setup
		let comboData = styleData[i];
		let combo = combinations[i];
		let letter1 = combo.substring(0, combo.indexOf("-"));
		let letter2 = combo.substring(combo.indexOf("-") + 1);
		let letter1Index = combinations.indexOf(letter1);
		let letter2Index = combinations.indexOf(letter2);
		
		//Calculate combination offset and width
		let lF1 = letterWidths[letter1Index][0]; //left line fraction for letter 1
		let rF1 = letterWidths[letter1Index][1]; //right line fraction for letter 1
		let wF1 = Math.abs(lF1 - rF1); //width fraction for letter 1
		
		let lF2 = letterWidths[letter2Index][0]; //left line fraction for letter 2
		let rF2 = letterWidths[letter2Index][1]; //right line fraction for letter 2
		let wF2 = Math.abs(lF2 - rF2); //width fraction for letter 2
		
		let wFC = wF1 + wF2; //combined width fraction
		let lFC = (1 - wFC)/2; //combined left fraction
		let rFC = lFC + wFC //combined right fraction
		let mFC = lFC + wF1; //combined middle fraction
		
		let offset = lFC * 600;
		let width = wFC * 600;
		let letterJoinPos = (mFC * 600) - offset; //Not yet, but it will be
		
		//Subtract offset from point array
		comboData.strokeData = AddPointToAllInPointArray(comboData.strokeData, new Point(-offset, 0));
		
		//Add extra properties to combo data
		comboData.width = width;
		comboData.firstLetterEnd = width;
		
		//Set styleData[i] to comboData
		styleData[i] = comboData;
	}
}

function ValidateStyleData() {
	for (var i = 0; i < styleData.length; i++) {
		if (styleData[i] === undefined) {
			styleData[i] = {};
		}
		
		if (styleData[i].strokeData === undefined || styleData[i].strokeData === undefined || styleData[i].strokeData.length === 0) {
			styleData[i].strokeData = [
				{x:100, y:100, gap:false},
				{x:500, y:100, gap:false},
				{x:100, y:500, gap:false},
				{x:500, y:500, gap:false},
				{x:100, y:100, gap:false},
				{x:100, y:500, gap:false},
				{x:500, y:500, gap:false},
				{x:500, y:100, gap:false},
			];
			letterWidths[i] = {0:0, 1:600};
			styleData[i].width = 600;
			styleData[i].firstLetterEnd = 600;
		}
	}
}







// --- Generate Handwriting ---

function GenerateHandwriting(textInput) {
	
	var previewOutput = document.getElementById("outputPreviewContainer");
	previewOutput.innerHTML = "";
	
	var textInputData = InterpretTextInput(textInput);
	
	var words = [];
	for (var i = 0; i < textInputData.length; i++) {
		let wordData = GenerateWord(textInputData[i]);
		wordData.pointArray = RandomizePointArray(wordData.pointArray);
		words.push(wordData);
	}
	
	console.log(words);
	
	for (var i = 0; i < words.length; i++) {
		let wordPointArray = words[i].pointArray;
		let wordWidth = words[i].width;
		
		//Note: "__ / 10"s are becuase the output has a 10x lower resolution
		
		let canvas = document.createElement("canvas");
		canvas.className = "wordCanvas";
		canvas.width  = (wordWidth / 10).toString();
		canvas.height = "60";
		
		previewOutput.appendChild(canvas);
		
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 1;
		if (debugMode) {
			ctx.fillStyle = "#0000FF";
		}
		
		for (var j = 0; j < wordPointArray.length; j++) {
			let point = wordPointArray[j];
			let x = point.x / 10;
			let y = point.y / 10;
			if (j === 0 || wordPointArray[j-1].gap) {
				//If the previous point specified to start a gap (or there is no previous point), move without drawing a line.
				ctx.moveTo(x,y);
			} else {
				ctx.lineTo(x,y);
			}
			if (debugMode) {
				ctx.fillRect(x,y,2,2);
			}
			
			logIndex++;
		}
		
		ctx.stroke();
		ctx.closePath();
		
		console.log(logIndex);
	}
}

function CleanUpTextInput(textInput) {
	var res = textInput.replace(/[^0-9a-z\~\!\@\#\$\%\^\&\)\(\_\+\=\:\;\'\"\,\.\<\>\/\?\£\ \-]/gmi, "") //Remove all characters other than those listed (in /[^here]/gmi) (global, multiline, case insensitive (hence 'gmi'))
	res = res.replace(/  +/g, " "); //Remove duplicate spaces
	return res;
}

function InterpretTextInput(textInput) {
	//Setup
	var input = CleanUpTextInput(" " + textInput + " ");
	
	//TODO: Add support for numbers and punctuation, and so remove this:
	input = input.replace(/[^a-z\ ]/gmi, "").replace(/  +/g, " ");
	
	//Setup
	var words = [];
	var wordsData = [];
	
	//Split into words and letters
	for (var i = 0; i < input.length;) {
		let chr = input.substr(i,1);
		if (chr = " ") {
			let ip1 = i + 1;
			let word = input.substring(ip1, ((input.indexOf(" ", ip1) + 1) || (input.length + 1)) - 1);
			if (word.length !== 0) {
				words.push(word);
				let letters = word.split("");
				wordsData.push(letters);
				i += word.length + 1;
			} else {
				break;
			}
		} else {
			i++;
		}
	}
	
	if (debugMode) {
		console.log("Words: \"" + words + "\"");
	}
	
	//Setup
	var combinedWordsData = [];
	var toLog = {layer1:"", layer2:""};
	
	//Group into letter combinations (by splitting and duplicating across two layers)
	for (var i = 0; i < wordsData.length; i++) {
		//Setup
		let lettersData = wordsData[i];
		let combinedLettersData = {layer1:[], layer2:[" "]};
		let layer = false;
		
		//Push combinations to alternating layers
		for (var j = 0; j < lettersData.length; j++) {
			combinedLettersData["layer" + (layer + 1)].push(lettersData[j], (lettersData[j + 1] || "*")); //TODO: Replace "*"
			layer = !layer;
		}
		
		//Make lengths the same
		if (combinedLettersData.layer1.length === combinedLettersData.layer2.length + 1) {
			combinedLettersData.layer2.push(" ");
		} else if (combinedLettersData.layer1.length + 1 === combinedLettersData.layer2.length) {
			combinedLettersData.layer1.push(" ");
		} else if (combinedLettersData.layer1.length !== combinedLettersData.layer2.length) {
			throw new Error("The lengths of the layer strings are different by more than 1");
		}
		
		//Append and prepend whitespace
		combinedLettersData.layer1.unshift(" ");
		combinedLettersData.layer2.unshift(" ");
		combinedLettersData.layer1.push(" ");
		combinedLettersData.layer2.push(" ");
		
		//Replace invalid combinations with spaces or single letters
		layer = false;
		let len = combinedLettersData.layer1.length;
		for (var j = 1; j < len - 1; j++) {
			let letter1 = combinedLettersData["layer" + (layer + 1)][j    ];
			let letter2 = combinedLettersData["layer" + (layer + 1)][j + 1];
			let combo = letter1 +"-"+ letter2;
			if (!combinations.containsPrimitive(combo)) {
				combinedLettersData["layer" + (layer + 1)][j  ] = " ";
				combinedLettersData["layer" + (layer + 1)][j+1] = " ";
				if (combinedLettersData["layer" + ((!layer) + 1)][j] === " ") {
					if        (combinedLettersData["layer" + (layer + 1)][j - 1] === " ") {
						       combinedLettersData["layer" + (layer + 1)][j] = letter1;
					} else if (combinedLettersData["layer" + ((!layer) + 1)][j - 1] === " ") {
						       combinedLettersData["layer" + ((!layer) + 1)][j] = letter1;
							   SwitchArraysAt(combinedLettersData["layer" + (layer + 1)], combinedLettersData["layer" + ((!layer) + 1)], j + 1);
							   layer = !layer; //Keep layer same for next time (as the rest of the arrays just switched, and it would normally switch)
					} else {
						throw new Error("Something went wrong.");
					}
				}
			}
			layer = !layer;
		}
		
		//Remove starting and trailing spaces (that are common to both layers)
		while (combinedLettersData.layer1[0] === " " && combinedLettersData.layer2[0] === " ") {
			combinedLettersData.layer1.shift();
			combinedLettersData.layer2.shift();
		}
		while (combinedLettersData.layer1.endsWith(" ") && combinedLettersData.layer2.endsWith(" ")) {
			combinedLettersData.layer1.pop();
			combinedLettersData.layer2.pop();
		}
		
		//Swap if needed (so that layer1[0] !== " ")
		if (combinedLettersData.layer1[0] === " ") {
			let temp = combinedLettersData.layer1;
			combinedLettersData.layer1 = combinedLettersData.layer2;
			combinedLettersData.layer2 = temp;
		}
		
		//Append to main array
		combinedWordsData.push(combinedLettersData);
		
		//Prepare toLog (optional)
		if (debugMode) {
			toLog.layer1 += combinedLettersData.layer1.joinNoCommas() + "|";
			toLog.layer2 += combinedLettersData.layer2.joinNoCommas() + "|";
		}
		
		logIndex++;
	}
	
	//Log (optional)
	if (debugMode) {
		console.log("Words split across layers: ");
		console.log("[" + toLog.layer1 + "]");
		console.log("[" + toLog.layer2 + "]");
	}
	
	console.log(logIndex);
	
	//Return
	return combinedWordsData;
}


function GenerateWord(twoLayerWordData) {
	//Setup
	var word = twoLayerWordData;
	if (word.layer1.length !== word.layer2.length) {
		throw new Error("Lengths are not equal");
	}
	var len = word.layer1.length;
	
	//Proceed according to word length
	if (len === 0) {
		throw new Error("Word is 0 characters long. This should never happen");
	} else if (len === 1) {
		
		//Convert text to handwritten letters
		
		//Setup
		let letter = word.layer1[0];
		let letterIndex = combinations.indexOf(letter);
		let letterWidth = styleData[letterIndex].firstLetterEnd;
		let pointArray = styleData[letterIndex].strokeData.Clone();
		
		//Apply
		let result = {pointArray:[], width:undefined};
		result.pointArray = pointArray;
		result.width = letterWidth;
		
		logIndex++;
		console.log(logIndex);
		
		//Return
		return result;
		
	} else { //length > 1
		
		//Setup
		let wordData = {
			layer1:{
				pointArray:[],
				strengthSections:[]
			},
			layer2:{
				pointArray:[],
				strengthSections:[]
			}
		};
		
		//Convert text to handwritten letters
		let layerBool = true;
		let offsetSoFar = 0;
		for (var i = 0; i < len;) {
			let layer;
			let otherLayer;
			if (layerBool === true) {
				layer = "layer1";
				otherLayer = "layer2";
			} else if (layerBool === false) {
				layer = "layer2";
				otherLayer = "layer1";
			} else {
				throw new Error("Something went very wrong.");
			}
			
			if (word[layer][i] === " ") {
				//Error checking
				if (i === len - 1) {
					break;
				}
				
				//Setup
				let otherLetter = word[otherLayer][i];
				let otherLetterIndex = combinations.indexOf(otherLetter);
				if (otherLetterIndex === -1) {
					throw new Error("Something went wrong.");
				}
				let otherLetterWidth = styleData[otherLetterIndex].firstLetterEnd;
				
				//Append points
				wordData.layer1.pointArray = AppendToPointArrayWithOffset(wordData.layer1.pointArray, styleData[otherLetterIndex].strokeData, new Point(offsetSoFar, 0));
				
				//Setup strength section
				let strengthSection      = { start:{dist:undefined,fraction:undefined}, end:{dist:undefined,fraction:undefined} };
				let strengthSectionOther = { start:{dist:undefined,fraction:undefined}, end:{dist:undefined,fraction:undefined} };
				strengthSection     .start.dist = offsetSoFar;
				strengthSectionOther.start.dist = offsetSoFar;
				strengthSection     .end  .dist = offsetSoFar + otherLetterWidth;
				strengthSectionOther.end  .dist = offsetSoFar + otherLetterWidth;
				strengthSection     .start.fraction = 0;
				strengthSection     .end  .fraction = 0;
				strengthSectionOther.start.fraction = 1;
				strengthSectionOther.end  .fraction = 1;
				//Append strength section
				wordData[layer     ].strengthSections.push(strengthSection     );
				wordData[otherLayer].strengthSections.push(strengthSectionOther);
				
				//Add to offset
				offsetSoFar += otherLetterWidth;
				
				//Move forward 1 letter, staying in the same layer
				i++;
			} else {
				//Setup
				let comboLength;
				let combo;
				if (word[layer][i + 1] === " " || word[layer][i + 1] === undefined) {
					combo = word[layer][i];
					comboLength = 1;
				} else {
					combo = word[layer][i] + "-" + word[layer][i + 1];
					comboLength = 2;
				}
				let comboIndex = combinations.indexOf(combo);
				if (comboIndex === -1) {
					throw new Error("Something went wrong. (combo = " + combo + ", comboIndex = " + comboIndex + ", i = " + i + ")");
				}
				let firstLetterWidth = styleData[comboIndex].firstLetterEnd;
				
				//Append points
				if (comboLength === 1) {
					//Move single letters into layer 1 (so layer 1 has something at every position)
					wordData.layer1.pointArray = AppendToPointArrayWithOffset(wordData.layer1.pointArray, styleData[comboIndex].strokeData, new Point(offsetSoFar, 0));
				} else {
					if (word[otherLayer][i] === " " && word[otherLayer][i + 1] === " ") {
						//Move two letter combinations that correspond to whitepace in the other layer into layer 1 (so layer 1 has something at every position)
						wordData.layer1.pointArray = AppendToPointArrayWithOffset(wordData.layer1.pointArray, styleData[comboIndex].strokeData, new Point(offsetSoFar, 0));
					} else {
						wordData[layer].pointArray = AppendToPointArrayWithOffset(wordData[layer].pointArray, styleData[comboIndex].strokeData, new Point(offsetSoFar, 0));
					}
				}
				
				//Setup strength section
				let strengthSection      = { start:{dist:undefined,fraction:undefined}, end:{dist:undefined,fraction:undefined} };
				let strengthSectionOther = { start:{dist:undefined,fraction:undefined}, end:{dist:undefined,fraction:undefined} };
				strengthSection     .start.dist = offsetSoFar;
				strengthSectionOther.start.dist = offsetSoFar;
				strengthSection     .end  .dist = offsetSoFar + firstLetterWidth;
				strengthSectionOther.end  .dist = offsetSoFar + firstLetterWidth;
				if (word[otherLayer][i] === " ") {
					strengthSection     .start.fraction = 1;
					strengthSection     .end  .fraction = 1;
					strengthSectionOther.start.fraction = 0;
					strengthSectionOther.end  .fraction = 0;
				} else {
					strengthSection     .start.fraction = 0;
					strengthSection     .end  .fraction = 1;
					strengthSectionOther.start.fraction = 1;
					strengthSectionOther.end  .fraction = 0;
				}
				//Append strength section
				if (comboLength === 1) {
					//Move single letters into layer 1 (so layer 1 has something at every position)
					wordData.layer1.strengthSections.push(strengthSection     );
					wordData.layer2.strengthSections.push(strengthSectionOther);
				} else {
					if (word[otherLayer][i] === " " && word[otherLayer][i + 1] === " ") {
						//Move two letter combinations that correspond to whitepace in the other layer into layer 1 (so layer 1 has something at every position)
						wordData.layer1.strengthSections.push(strengthSection     );
						wordData.layer2.strengthSections.push(strengthSectionOther);
					} else {
						wordData[layer     ].strengthSections.push(strengthSection     );
						wordData[otherLayer].strengthSections.push(strengthSectionOther);
					}
				}
				
				//Add to offset
				offsetSoFar += firstLetterWidth;
				
				
				//Move forward 1 letter, and change layer
				i++;
				layerBool = !layerBool;
			}
			
			logIndex++;
		}
		
		console.log(logIndex);
		
		//Get width
		let wordWidth = offsetSoFar;
		
		//-//	//Merge layers
		//-//	let combinedLayers = {pointArray:[], width:wordWidth};
		//-//	let len2 = wordData.layer1.pointArray.length;
		//-//	for (var i = 0; i < len2; i++) {
		//-//		//Setup the two points
		//-//		let point = wordData.layer1.pointArray[i];
		//-//		let otherPoint = GetCorrespondingPointTo(point, wordData.layer1.pointArray, wordData.layer2.pointArray);
		//-//		
		//-//		//Setup bounding strengths
		//-//		let boundingStrengths = GetBoundingStrengths(point, wordData.layer1.strengthSections);
		//-//		let otherBoundingStrengths = GetBoundingStrengths(otherPoint, wordData.layer1.strengthSections);
		//-//		
		//-//		//Get fraction between bounding strength positions (only inlude layer 1)
		//-//		let fraction;
		//-//		try {
		//-//			fraction = Math.fractionBetween(boundingStrengths.start.dist, boundingStrengths.end.dist, point.x);
		//-//		} catch (e) {
		//-//			debugger;
		//-//			console.log(boundingStrengths, point);
		//-//			throw new Error();
		//-//		}
		//-//		
		//-//		//Get the strength (only include layer 1)
		//-//		let strength = Math.valueBetween(boundingStrengths.start.fraction, boundingStrengths.end.fraction, fraction);
		//-//		
		//-//		//Get point fraction of the way between point and otherPoint
		//-//		let resPoint;
		//-//		if (strength === 1) {
		//-//			resPoint = point;
		//-//		} else if (strength === 0) {
		//-//			resPoint = otherPoint;
		//-//			//TODO: Remove this and fix:
		//-//			//console.log("This shouldn't happen");
		//-//		} else {
		//-//			resPoint = GetPointBetween(point, otherPoint, strength);
		//-//		}
		//-//		
		//-//		//Add gap to resPoint
		//-//		if (point.gap || otherPoint.gap) {
		//-//			resPoint.gap = true;
		//-//		} else {
		//-//			resPoint.gap = false;
		//-//		}
		//-//		
		//-//		//Append to combined
		//-//		combinedLayers.pointArray.push(resPoint);
		//-//		
		//-//		logIndex++;
		//-//	}
		let combinedLayers = {pointArray:wordData.layer1.pointArray, width:wordWidth};
		console.log("hi");
		
		console.log(logIndex);
		
		return combinedLayers;
	}
}

function RandomizePointArray(pointArray) {
	//Setup
	const len = pointArray.length;
	const shiftsPerHundredPoints = 5;	//Adjust if needed
	const minShiftSpread = 20;			//Adjust if needed
	const maxShiftSpread = 500;			//Adjust if needed
	const minShiftMagnitude = 1			//Adjust if needed
	const maxShiftMagnitude = 10		//Adjust if needed
	var totalShifts = shiftsPerHundredPoints/100 * len;
	var newPointArray = new Array(len);
	
	//Loop and create shifts
	for (var i = 0; i < totalShifts; i++) {
		let randomIndex = Math.randomIntBetweenInclusive(0, len);
		
		let shiftMagnitude = Math.randomFloatBetweenInclusiveExclusive(minShiftMagnitude, maxShiftMagnitude);
		let shiftDiretion = Math.randomFloatBetweenInclusiveExclusive(0, Math.PI);
		let shiftSpread = Math.randomIntBetweenInclusive(minShiftSpread, maxShiftSpread);
		
		let shiftTarget = new Point(Math.cos(shiftDiretion) * shiftMagnitude, Math.sin(shiftDiretion) * shiftMagnitude);
		
		for (var j = randomIndex; j < len; j++) {
			//Same as below
			//Setup
			let stepsFromShiftCentre = Math.abs(j - randomIndex);
			let fractionOfShiftSpread = stepsFromShiftCentre / shiftSpread;
			let strength = 1 - fractionOfShiftSpread;
			let currentShiftTarget = new Point(shiftTarget.x * strength, shiftTarget.y * strength);
			
			//Apply
			newPointArray[j] = {
				x: pointArray[j].x + currentShiftTarget.x,
				y: pointArray[j].y + currentShiftTarget.y
			};
			if (pointArray.gap !== undefined) {
				newPointArray.gap = pointArray.gap;
			}
		}
		for (var j = randomIndex - 1; j >= 0; j--) {
			//Same as above
			//Setup
			let stepsFromShiftCentre = Math.abs(i - randomIndex);
			let fractionOfShiftSpread = stepsFromShiftCentre / shiftSpread;
			let strength = Math.bellCurve01Sine((1 - fractionOfShiftSpread) / 2 + 0.5);
			let currentShiftTarget = new Point(shiftTarget.x * strength, shiftTarget.y * strength);
			
			//Apply
			newPointArray[j] = {
				x: pointArray[j].x + currentShiftTarget.x,
				y: pointArray[j].y + currentShiftTarget.y
			};
			if (pointArray[j].gap !== undefined) {
				newPointArray[j].gap = pointArray[j].gap;
			}
		}
		
		logIndex++;
	}
	
	console.log(logIndex);
	
	return newPointArray;
}

function GetBoundingStrengths(point, strengthSections) {
	var beyondStart = false;
	var beforeEnd = false;
	for (var i = 0; i < strengthSections.length; i++) {
		let section = strengthSections[i];
		if (point.x >= section.start.dist && point.x <= section.end.dist) {
			return {
				start:{
					fraction:section.start.fraction,
					dist:section.start.dist
				},
				end:{
					fraction:section.end.fraction,
					dist:section.end.dist
				}
			};
		} else {
			if (point.x > section.start.dist) {
				beyondStart = true;
			} else if (point.x < section.start.dist) {
				beforeEnd = true;
			}
		}
	}
	//Usually would have returned by this point
	if (beforeEnd && !beyondStart) {
		return {
			start:{
				fraction:strengthSections[0].start.fraction,
				dist:strengthSections[0].start.dist - 100 //Arbitrary and meaningless value (0 might cause errors)
			},
			end:{
				fraction:strengthSections[0].start.fraction,
				dist:strengthSections[0].start.dist
			}
		};
	} else if (beyondStart && !beforeEnd) {
		return {
			start:{
				fraction:strengthSections[strengthSections.length - 1].end.fraction,
				dist:strengthSections[strengthSections.length - 1].end.dist
			},
			end:{
				fraction:strengthSections[strengthSections.length - 1].end.fraction,
				dist:strengthSections[strengthSections.length - 1].end.dist + 100 //Arbitrary and meaningless value (0 might cause errors)
			}
		};
	}
	throw new Error("Something went wrong."); //Shouldn't be reached
}

function GetPointBetween(point1, point2, fraction) {
	if (point1 === undefined || point2 === undefined || fraction === undefined) {
		throw new Error("GetPointBetween: An argument is invalid.")
	}
	let dx = point2.x - point1.x; //delta x
	let dy = point2.y - point1.y; //delta y
	let rdx = dx * fraction; //result delta x
	let rdy = dy * fraction; //result delta y
	let rx = point1.x + rdx; //result x
	let ry = point1.y + rdy; //result y
	
	let res = {x:rx, y:ry};
	
	if (point1.gap === true || point2.gap === true) {
		res.gap = true;
	}
	
	return res;
}

function GetPointsClosestTo(point, pointArray, outGap) {
	//Setup
	const len = pointArray.length;
	
	//Error detection
	if (len === 0) {
		throw new Error("Invalid array.");
	}
	
	//Setup
	const pointX = point.x;
	const pointY = point.y;
	
	//Loop
	var closestDist = Infinity;
	var selectedPoints = [];
	var selectedGaps = [];
	for (var i = 0; i < len; i++) {
		let currentPoint = pointArray[i];
		let dist = Math.sqrt(Math.pow(currentPoint.x - pointX, 2) + Math.pow(currentPoint.y - pointY, 2));
		if (dist === closestDist) {
			selectedPoints.push({x:currentPoint.x, y:currentPoint.y});
			selectedGaps.push(currentPoint.gap || false);
		} else if (dist < closestDist) {
			closestDist = dist;
			selectedPoints = [{x:currentPoint.x, y:currentPoint.y}];
			selectedGaps = [currentPoint.gap || false];
		}
	}
	if (outGap !== undefined && outGap !== null) {
		if (selectedGaps.containsPrimitive(true)) {
			outGap.value = true;
		} else {
			outGap.value = false;
		}
	}
	return selectedPoints;
}

function GetCorrespondingPointTo(point, containingPointArray, otherPointArray) {
	//Setup
	const otherLen = otherPointArray.length;
	const containingLen = containingPointArray.length;
	
	//Error detection
	if (otherLen === 0 || containingLen === 0) {
		return {x:300, y:300, gap:false}; //TODO: Remove
		throw new Error("Invalid array.");
	}
	
	//Setup
	const pointX = point.x;
	const pointY = point.y;
	
	//Loop
	var furthestDistance = 0;
	var selectedPoints = [];
	for (var i = 0; i < otherLen; i++) {
		let otherPoint = otherPointArray[i];
		let closestPointsToOtherPoint = GetPointsClosestTo(otherPoint, containingPointArray);
		if (closestPointsToOtherPoint.contains({x:pointX, y:pointY})) { //Have to remove unwanted properties
			let dist = Math.sqrt(Math.pow(otherPoint.x - pointX, 2) + Math.pow(otherPoint.y - pointY, 2));
			if (dist === furthestDistance) {
				selectedPoints.push({x:otherPoint.x, y:otherPoint.y, gap:otherPoint.gap});
			} else if (dist > furthestDistance) {
				furthestDistance = dist;
				selectedPoints = [{x:otherPoint.x, y:otherPoint.y, gap:otherPoint.gap}];
			}
		}
	}
	
	//Calculate average if necessary, and return
	if (selectedPoints.length === 1) {
		return selectedPoints[0];
	} else if (selectedPoints.length > 1) {
		let res = Math.mean(selectedPoints);
		let gap = false;
		for (i = 0; i < selectedPoints.length; i++) {
			if (selectedPoints[i].gap) {gap = true; break; }
		}
		res.gap = gap;
		return res;
	} else if (selectedPoints.length === 0) {
		//There are no points that say this point is closest. Instead, just get the closest point
		let gap = {value:undefined};
		let closestPoints = GetPointsClosestTo(point, otherPointArray, gap);
		if (closestPoints.length === 1) {
			let res = closestPoints[0];
			res.gap = gap;
			return res;
		} else if (closestPoints.length > 1) {
			let res = Math.mean(closestPoints);
			res.gap = gap;
			return res;
		} else {
			throw new Error("Something went wrong. Maybe a point's x or y component is NaN?");
		}
	} else {
		throw new Error("Something went very wrong.");
	}
}

function AddPointToAllInPointArray(pointArray, point) {
	var newArray = Array(pointArray.length);
	for (var i = 0; i < pointArray.length; i++) {
		let currentPoint = pointArray[i];
		let newPoint = {x:currentPoint.x + point.x, y:currentPoint.y + point.y};
		if (currentPoint.gap !== undefined) {
			newPoint.gap = currentPoint.gap;
		}
		newArray[i] = newPoint;
	}
	return newArray;
}


function AppendToPointArrayWithOffset(pointArray, appendedPointArray, offset) {
	var offsetPointArray = AddPointToAllInPointArray(appendedPointArray, offset);
	return pointArray.concat(offsetPointArray);
}

function Point(x, y) {
	if (this === window) {	//If used like "x = Point(1,2);"
		return {x:x, y:y};
	} else {				//If used like "x = new Point(1,2);"
		this.x = x;
		this.y = y;
	}
}



