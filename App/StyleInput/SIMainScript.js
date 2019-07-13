"use strict";

var canvases = [];
var canvasData;
const bgColor = "#FFFFFF";
const lineColors = ["#FF0000"];
const lineThickness = 1;
const hLineGap = 180;
const hLineColor = "#CCCCCC";
const hLineThickness = 3;
const templateColor = "#BBBBBB";
const nonactiveBrightness = "50%";
const nonactiveBlur = "5";
var canvasNum = 1;
var combinations = [];
var styleQuality = "Best Quality";
var loadingOverlay;
var loadingSpinner;
var singleLettersCount;
var lowercaseSingleLettersCount;
var letterWidths;
function VH(amount) { return (document.body.clientHeight / 100) * amount; }

const debugMode = true;

function Main() {
	//This made it impossible to edit textareas. Idk what the correct approach that avoids this is
	//	//Prevent scrolling on mobile
	//	document.body.addEventListener('touchstart',    function(e){ touchIntercept(e); });
	//	document.body.addEventListener('touchmove',     function(e){ touchIntercept(e); });
	//	document.body.addEventListener('MSPointerMove', function(e){ touchIntercept(e); });
	//	document.body.addEventListener('pointermove',   function(e){ touchIntercept(e); });
	//	document.body.addEventListener('mousedown',     function(e){ touchIntercept(e); });
	//	document.body.addEventListener('mouseup',       function(e){ touchIntercept(e); });
	//	document.body.addEventListener('mousemove',     function(e){ touchIntercept(e); });
	//	document.body.addEventListener('touchend',      function(e){ touchIntercept(e); });
	//	
	//	function touchIntercept(e) {
	//		if (e.target.id === "main" || e.target.id === "topPadding") {
	//			console.log("#1");
	//			e.stopPropagation();
	//		} else {
	//			console.log("#2");
	//			e.preventDefault();
	//			e.stopPropagation();
	//		}
	//	}
	
	loadingOverlay = document.getElementById("loadingOverlay");
	loadingSpinner = document.getElementById("spinnerContainer");
	setTimeout(Start, 500);
}

function Start() {
	loadingOverlay.style.visibility = "visible";
	
	//Get canvases
	//	var canvasCells = document.getElementById("inputArea").children[0].children[0].getElementsByTagName("TD");
	//	for (var i = 0; i < canvasCells.length; i++) {
	//		canvases.push(canvasCells.getElementsByClassName("inputPanel")[0]);
	//	}
	
	var urlVars = GetVariablesFromUrl();
	styleQuality = urlVars.styleQuality;
	
	combinations = GetCombinations(styleQuality);
	
	letterWidths = LoadLetterWidthsFromString(urlVars.letterWidths, singleLettersCount);
	
	canvasData = LoadCanvasDataFromStyleDecimal(urlVars.styleDecimal, combinations);
	
	SetupCanvases();
	
	
	ViewportUpdate();
	
	setTimeout(function() {
		sliderController.Init();
		loadingOverlay.style.visibility = "hidden";
		//loadingSpinner.innerHTML = "";
		console.log("Finished loading")
	}, 500);
}

function SetupCanvases() {
	//	var canvasParent = document.getElementById("canvasParent")
	//	var canvasParentInnerHTML = "";
	//	for (let i = 0; i < combinations.length; i++) {
	//		if (i < singleLettersCount) {
	//			canvasParentInnerHTML += '<td>    <div class="sliderRail"><div class="sliderNode" style="margin-left:calc(32% - 30px)"><div class="letterWidthLine"></div></div><div class="sliderNode" style="margin-left:calc(68% - 30px)"><div class="letterWidthLine"></div></div></div>    <canvas class="inputPanel" onmousedown="CanvasMouseDown(this)" onmouseup="CanvasMouseUp(this)" onmouseout="CanvasMouseOut(this)" onmousemove="CanvasMouseMove(this, event)" width="600px" height="600px" style=""></canvas>    </td>'
	//		} else {
	//			canvasParentInnerHTML += '<td>    <canvas class="inputPanel" onmousedown="CanvasMouseDown(this)" onmouseup="CanvasMouseUp(this)" onmouseout="CanvasMouseOut(this)" onmousemove="CanvasMouseMove(this, event)" width="600px" height="600px" style=""></canvas>    </td>'
	//		}
	//	}
	//	canvasParent.innerHTML = canvasParentInnerHTML;
	//	var sliders = canvasParent.getElementsByClassName("sliderNode");
	//	for (var i = 0; i < sliders.length; i++) {
	//		sliderController.SliderInit(sliders[i]);
	//	}
	//	__(sliders);
	//	
	//	canvases = document.getElementsByClassName("inputPanel");
	//	
	//	//	var i = 0;
	//	//	//	var f = SetupCanvas;    //pass variables to setInterval() function
	//	//	//	f.canvas = canvases[i]; //''
	//	//	//	f.canvasID = i;         //''
	//	//	var loop = setInterval(function(canvas, canvasID) { //Arguments can be passed to setInterval like this.
	//	//		if (i < canvases.length) {
	//	//			SetupCanvas(canvas, canvasID);
	//	//			i++;
	//	//		} else {
	//	//			clearInterval(loop);
	//	//		}
	//	//	},100,canvases[i],i);
	//	
	//	 
	//	//	slowLoop(0, canvases.length, 1, 1000, function(i) {
	//	//		SetupCanvas(canvases[i], i);
	//	//		console.log(i);
	//	//	}, [], true);
	//	//	//start, end, step, interval, function, functionParams, passIteration
	//	
	//	for (var i = 0; i < canvases.length; i++) {
	//		SetupCanvas(canvases[i], i);
	//	}
	
	var canvasParent = document.getElementById("canvasParent")
	var canvasParentInnerHTML = "";
	for (var i = 0; i < combinations.length; i++) {
		canvasParentInnerHTML += '<td>&nbsp;</td>'
	}
	canvasParent.innerHTML = canvasParentInnerHTML;
	
	//	for (var i = 0; i < combinations.length; i++) {
	//		letterWidths[i] = {0:0.32, 1:0.68};
	//	}
}

function SetupCanvas(canvas, canvasID) {
	canvas.addEventListener("touchstart", function(e) { CanvasMouseDown(e.target, e); });
	canvas.addEventListener("touchend",   function(e) { CanvasMouseUp  (e.target, e); });
	canvas.addEventListener("touchmove",  function(e) { CanvasMouseMove(e.target, e); });
	canvas.addEventListener("mousedown",  function(e) { CanvasMouseDown(e.target, e); });
	canvas.addEventListener("mouseup",    function(e) { CanvasMouseUp  (e.target, e); });
	canvas.addEventListener("mouseout",   function(e) { CanvasMouseOut (e.target, e); });
	canvas.addEventListener("mousemove",  function(e) { CanvasMouseMove(e.target, e); });
	
	//	canvas.parentElement.addEventListener("touchstart", function(e) { if (e.target.className = "inputPanel") { CanvasMouseDown(e.target, e); } });
	//	canvas.parentElement.addEventListener("touchend",   function(e) { if (e.target.className = "inputPanel") { CanvasMouseUp  (e.target, e); } });
	//	canvas.parentElement.addEventListener("touchmove",  function(e) { if (e.target.className = "inputPanel") { CanvasMouseMove(e.target, e); } });
	//	canvas.parentElement.addEventListener("mousedown",  function(e) { if (e.target.className = "inputPanel") { CanvasMouseDown(e.target, e); } });
	//	canvas.parentElement.addEventListener("mouseup",    function(e) { if (e.target.className = "inputPanel") { CanvasMouseUp  (e.target, e); } });
	//	canvas.parentElement.addEventListener("mouseout",   function(e) { if (e.target.className = "inputPanel") { CanvasMouseOut (e.target, e); } });
	//	canvas.parentElement.addEventListener("mousemove",  function(e) { if (e.target.className = "inputPanel") { CanvasMouseMove(e.target, e); } });
	
	let ctx = canvas.getContext("2d");
	//	//Setup horizontal lines
	//	ctx.beginPath();
	//	ctx.lineWidth = hLineThickness;
	//	ctx.strokeStyle = hLineColor;
	//	//Top horizontal line
	//	ctx.moveTo(0,   600/2 - hLineGap/2);
	//	ctx.lineTo(600, 600/2 - hLineGap/2);
	//	ctx.stroke();
	//	//Bottom horizontal line
	//	ctx.moveTo(0,   600/2 + hLineGap/2);
	//	ctx.lineTo(600, 600/2 + hLineGap/2);
	//	ctx.stroke();
	//	//Finish horizontal lines
	//	ctx.closePath();
	
	//	//Draw templates
	//	DrawTemplate(canvas, canvasID);
	
	CalculateWidthMarkers(canvasID);
	
	//Setup properties
	if (canvasData[canvasID] && canvasData[canvasID].strokeData) {
		canvas.strokeData = new Array(canvasData[canvasID].strokeData.length);
	} else {
		canvas.strokeData = [];
	}
	canvas.mouseIsDown = false;
	canvas.mouseIsDownIsNew = false;
	//if (!canvas.strokeDeltaData) { canvas.strokeDeltaData = []; }
	if (!canvas.id) { canvas.id = canvasID; }
	
	//Draw existing strokes
	DrawExistingStrokes(canvas, canvasID);
	
	ctx.beginPath();
} 


function CanvasMouseDown(canvas, e) {
	e.preventDefault();
	//e.stopPropagation();
	console.log("_down [" + e.clientX + ", " + e.clientY + "]");
	canvas.mouseIsDown = true;
	canvas.mouseIsDownIsNew = true;
}

function CanvasMouseUp(canvas, e) {
	e.preventDefault();
	//e.stopPropagation();
	console.log("_up [" + e.clientX + ", " + e.clientY + "]");
	canvas.mouseIsDown = false;
	if (canvas.strokeData.length > 0) { canvas.strokeData[canvas.strokeData.length - 1].gap = true; }
}

function CanvasMouseOut(canvas, e) {
	e.preventDefault();
	//e.stopPropagation();
	console.log("_out [" + e.clientX + ", " + e.clientY + "]");
	canvas.mouseIsDown = false;
	if (canvas.strokeData.length > 0) { canvas.strokeData[canvas.strokeData.length - 1].gap = true; }
}

function CanvasMouseMove(canvas, e) {
	e.preventDefault();
	//e.stopPropagation();
	console.log("_move [" + e.clientX + ", " + e.clientY + "]");
	if (canvas.mouseIsDown) {
		AcceptInput(canvas, e);
	}
}

function ViewportUpdate(refreshVisible) {
	if (!refreshVisible) { refreshVisible = false; } else { refreshVisible = true; }
	var canvasTableCells = document.getElementById("canvasParent").getElementsByTagName("TD");
	var anythingChanged = false;
	for (var i = 0; i < canvasTableCells.length; i++) {
		let canvasTableCell = canvasTableCells[i];
		if (isElementInViewport(canvasTableCell)) {
			if (!(canvasTableCell.innerHTML.startsWith('<canvas') || canvasTableCell.innerHTML.startsWith('<div class="sliderRail"')) || refreshVisible) {
				if (i < singleLettersCount) {
					canvasTableCell.innerHTML = '<canvas class="inputPanel" width="600px" height="600px"></canvas>    <div class="sliderRail"><div class="sliderNode" style="margin-left:' + sliderController.FractionToMarginLeft(VH(60), letterWidths[i][0]) + 'px"><div class="letterWidthLine"></div></div><div class="sliderNode" style="margin-left:calc(' + sliderController.FractionToMarginLeft(VH(60), letterWidths[i][1]) + 'px"><div class="letterWidthLine"></div></div></div>    <div class="templateText">' + combinations[i].replace("-","") + '</div>';
					sliderController.SliderInit(canvasTableCell.children[1]);
					SetupCanvas(canvasTableCell.children[0], i);
					//console.log(((letterWidths[i][0] * VH(60)) * (VH(60) - 60)/VH(60)), VH(60), letterWidths[i][0], letterWidths[i][0] * VH(60));
				} else {
					canvasTableCell.innerHTML = '<canvas class="inputPanel" width="600px" height="600px"></canvas>    <div class="templateText">' + combinations[i].replace("-","") + '</div>    <div class="widthMarker" style="width:0vh"></div><div class="widthMarker" style="width:0vh"></div><div class="widthMarker" style="width:0vh">';
					SetupCanvas(canvasTableCell.children[0], i);
				}
				anythingChanged = true;
			}
		} else {
			if (!canvasTableCell.innerHTML.startsWith('<div class="disabledInputPanel"')) {
				if (!canvasData[i]) {canvasData[i] = {}; }
				if (canvasTableCell.innerHTML.startsWith('<div class="sliderRail"')) {
					canvasData[i].strokeData = canvasTableCell.children[1].strokeData;
				} else if (canvasTableCell.innerHTML.startsWith('<canvas')) {
					canvasData[i].strokeData = canvasTableCell.children[0].strokeData;
				}
				canvasTableCell.innerHTML = '<div class="disabledInputPanel">';
				anythingChanged = true;
			}
		}
	}
	if (anythingChanged) {
		canvases = document.getElementsByClassName("inputPanel");
	}
}

function ChangeCombosSetting() {
	console.log(new Date().getTime());
	var styleQualityToggleButton =  document.getElementById("styleQualityToggleButton");
	if      (styleQuality === "Best Quality"      ) { styleQuality = "High Quality";      }
	else if (styleQuality === "High Quality"      ) { styleQuality = "Quick Setup";       }
	else if (styleQuality === "Quick Setup"       ) { styleQuality = "Extra Quick Setup"; }
	else if (styleQuality === "Extra Quick Setup" ) { styleQuality = "Best Quality";      }
	else {styleQuality = "High Quality"; }
	styleQualityToggleButton.innerHTML = "Mode: " + styleQuality;
	console.log(new Date().getTime());
	Restart();
}

sliderController.AddEventListener(function(sliderNode){
	SliderMove(sliderNode);
});

function SliderMove(sliderNode) {
	//console.log({x:sliderNode});
	var sliderIndex = sliderNode.parentElement.parentElement.cellIndex;
	var letter = combinations[sliderIndex];
	
	letterWidths[sliderIndex][GetElementIndex(sliderNode)] = sliderNode.sliderFraction;
	console.log(sliderIndex, GetElementIndex(sliderNode), sliderNode.sliderFraction)
	
	if (sliderIndex >= lowercaseSingleLettersCount) {
		return;
	}
	
	for (var i = singleLettersCount; i < combinations.length; i++) {
		let combo = combinations[i];
		if (combo.contains(letter)) {
			CalculateWidthMarkers(i);
		}
	}
}

//	function CalculateAllWidthMarkers() {
//		for (var i = singleLettersCount; i < combinations.length; i++) {
//			CalculateWidthMarkers(combinations[i]);
//		}
//	}

function CalculateWidthMarkers(comboIndex) {
	//Setup and error checking
	var combo = combinations[comboIndex];
	if (comboIndex < singleLettersCount) {
		return;
	}
	var comboTableCell = document.getElementById("canvasParent").children[comboIndex];
	if (!isElementInViewport(comboTableCell)) {
		return;
	}
	
	//Setup
	var letter1 = combo.substring(0, combo.indexOf("-"));
	var letter2 = combo.substring(combo.indexOf("-") + 1);
	
	var letter1Index = combinations.indexOf(letter1);
	var letter2Index = combinations.indexOf(letter2);
	if (letter1Index >= lowercaseSingleLettersCount || letter2Index >= lowercaseSingleLettersCount) {
		throw new Error("letter1Index or letter2Index is not valid. letter1Index = " + letter1Index + ", letter2Index = " + letter2Index + ", letter1");
	}
	//	var tableCells = document.getElementById("canvasParent").children;
	//	var letter1SliderNodes = tableCells[letter1Index].getElementsByClassName("sliderNode");
	//	var letter2SliderNodes = tableCells[letter2Index].getElementsByClassName("sliderNode");
	
	//	console.log(letter1SliderNodes, tableCells[letter1Index], tableCells)
	
	//Calculate
	var lF1 = letterWidths[letter1Index][0]; //left line fraction for letter 1
	var rF1 = letterWidths[letter1Index][1]; //right line fraction for letter 1
	var wF1 = Math.abs(lF1 - rF1); //width fraction for letter 1
	
	var lF2 = letterWidths[letter2Index][0]; //left line fraction for letter 2
	var rF2 = letterWidths[letter2Index][1]; //right line fraction for letter 2
	var wF2 = Math.abs(lF2 - rF2); //width fraction for letter 2
	
	var wFC = wF1 + wF2; //combined width fraction
	var lFC = (1 - wFC)/2; //combined left fraction
	var rFC = lFC + wFC //combined right fraction
	var mFC = lFC + wF1; //combined middle fraction
	
	//Apply
	var lines = comboTableCell.getElementsByClassName("widthMarker");
	lines[0].style.width = (lFC * 60) + "vh";
	lines[1].style.width = (mFC * 60) + "vh";
	lines[2].style.marginLeft = (rFC * 60) + "vh";
	lines[2].style.width = 60 - (rFC * 60) + "vh";
}

function AcceptInput(canvas, event) {
	//var pos = getRelativeCursorPosition(canvas, event);
	var pos = canvas.eventRelativeCoords(event);
	var x = Math.round(pos.x);
	var y = Math.round(pos.y);
	
	
	var ctx = canvas.getContext("2d");
	
	if (canvas.mouseIsDownIsNew) {
		canvas.mouseIsDownIsNew = false;
		ctx.moveTo(x,y);
	}
	
	ctx.strokeStyle = lineColors[0]; //TODO: Random color
	ctx.lineWidth = lineThickness;
	//ctx.fillRect(x,y,10,10);
	//ctx.moveTo(0,0);
	ctx.lineTo(x,y);
	ctx.stroke();
	
	if (debugMode) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(x,y,5,5);
	}
	
	canvas.strokeData.push({x:x,y:y,gap:false});
	
	//function getRelativeCursorPosition(canvas, event) {
	//	var rect = canvas.getBoundingClientRect();
	//	var x = event.clientX - rect.left;
	//	var y = event.clientY - rect.top;
	//	return {x: x, y: y};
	//}
	
	
}

function Test1() {
	for (let i = 0; i < canvases.length; i++) {
		let toLog = "";
		for (let j = 0; j < canvases[i].strokeData.length; j++) {
			toLog += "(" + canvases[i].strokeData[j].x + "," + canvases[i].strokeData[j].y + "), ";
		}
		console.log(toLog);
	}
}

function InterpretInput(canvas) {
	for (let i = 0; i < canvas.strokeData.length; i++) {
		var prevPoint = {};
		if (i = 0) {
			prevPoint = {x:0,y:0};
		} else {
			prevPoint = canvas.strokeData[i-1];
		}
		var pointDelta = {x: canvas.strokeData[i].x - prevPoint.x, y: canvas.strokeData[i].y - prevPoint.y}
		canvas.strokeDeltaData[i] = pointDelta;
	}
	
	//TODO: More here?
	
	
}

function NextCanvas() {
	if (canvasNum < canvases.length) {
		canvasNum++;
	}
}


function PreviousCanvas() {
	if (canvasNum > 1) {
		canvasNum--;
		
	}
}

function ChangeCanvas() {
	for (let i = 0; i < canvases.length; i++) {
		canvases[i].mousemove = "";
		canvases[i].style.filter = "brightness(" + nonactiveBrightness + ") blur(" + nonactiveBlur + ")"
	}
	canvases[canvasNum - 1].mousemove = "CanvasMouseMove(this, event)";
}

//	function DrawTemplate(canvas, canvasID) {
//		var ctx = canvas.getContext("2d");
//		ctx.beginPath();
//		ctx.font = hLineGap*2 + 'px "Comic Sans MS", cursive, sans-serif';//"Segoe UI Semilight", "Segoe UI Light", "Segoe UI", Arial, sans-serif';
//		ctx.fillStyle = templateColor;
//		ctx.strokeStyle = ""; //needs checking
//		ctx.textAlign = "center";
//		ctx.fillText(combinations[canvasID], 600/2, 600/2 + hLineGap/2);
//		//console.log(canvasID + ", " + combinations[canvasID]);
//		ctx.closePath();
//	}

function DrawExistingStrokes(canvas, canvasID) {
	if (canvasData[canvasID] && canvasData[canvasID].strokeData && canvasData[canvasID].strokeData.length > 0) {
		let strokeData = canvasData[canvasID].strokeData;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.strokeStyle = lineColors[0]; //TODO: Random color
		ctx.lineWidth = lineThickness + 0.8; //For some reason the lines drawn without stroke() inbetween (which is very slow) are thinner
		canvas.strokeData = []; //Just in case
		for (let i = 0; i < strokeData.length; i++) {
			let dataPoint = strokeData[i];
			let x = dataPoint.x;
			let y = dataPoint.y;
			if (i === 0 || strokeData[i-1].gap) { //If the previous point specified to start a gap (or there is no previous point), move without drawing a line.
				ctx.moveTo(x,y);
			} else {
				ctx.lineTo(x,y);
			}
			if (debugMode) {
				ctx.fillStyle = "#000000";
				ctx.fillRect(x,y,5,5);
			}
			canvas.strokeData[i] = {x:x,y:y,gap:dataPoint.gap};
			//if (strokeData[i+1] && strokeData[i+1].gap) {
			//	canvas.strokeData[canvas.strokeData.length - 1].gap = true;
			//}
		}
		ctx.stroke();
		ctx.closePath();
	}
}


function Restart() {
	loadingOverlay.style.visibility = "visible";
	//	setTimeout(function(){
	//		loadingSpinner.innerHTML = '<div class="sk-circle" style="width:20vh; height:20vh"><div class="sk-circle1 sk-child"></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div><div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div><div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div></div>'
	//	}, 50);
	setTimeout(RestartInternal, 500);
}
function RestartInternal() {
	document.getElementById("canvasParent").innerHTML = "<!--canvases go here-->";
	canvasData = [];
	
	combinations = GetCombinations(styleQuality);
	canvasData = new Array(combinations.length);
	
	SetupCanvases();
	
	ViewportUpdate();
	
	loadingOverlay.style.visibility = "hidden";
	//loadingSpinner.innerHTML = "";
}

function SaveToUrl() {
	window.location.hash = FormatCanvasDataForUrl();
}

function FormatCanvasDataForUrl() {
	//Update canvasData (usually done when the canvas scrolls out of view)
	var canvasTableCells = document.getElementById("canvasParent").getElementsByTagName("TD");
	for (var i = 0; i < canvasTableCells.length; i++) {
		let canvasTableCell = canvasTableCells[i];
		if (canvasTableCell.innerHTML.startsWith("<canvas")) {
			if (!canvasData[i]) { canvasData[i] = []; }
			canvasData[i].strokeData = canvasTableCell.children[0].strokeData;
		} else if (canvasTableCell.innerHTML.startsWith('<div class="sliderRail"')) {
			if (!canvasData[i]) { canvasData[i] = []; }
			canvasData[i].strokeData = canvasTableCell.children[1].strokeData;
		}
	}
	
	//Convert canvasData into a rough delta-data decimal
	var styleData = "";
	var prevX = 0;
	var prevY = 0;
	for (var i = 0; i < canvasData.length; i++) {
		let strokeData = canvasData[i].strokeData;
		styleData += "7";
		for (let j = 0; j < strokeData.length; j++) {
			let point = strokeData[j];
			let x = Math.round(point.x/2);
			let y = Math.round(point.y/2);
			if (point.gap) { 
				let deltaX = (x - prevX + 300).padFront(3);
				let deltaY = (y - prevY + 300).padFront(3);
				styleData += "8" + deltaX + deltaY;
			} else {
				let deltaX = (x - prevX + 50).padFront(2);
				let deltaY = (y - prevY + 50).padFront(2);
				let deltaXFirstChr = deltaX.substring(0,1);
				if (
					   deltaX.length !== 2
					|| deltaY.length !== 2
					|| deltaY.substring(0,1) === "-"
					|| deltaXFirstChr === "-"
					|| deltaXFirstChr === "7"
					|| deltaXFirstChr === "8"
					|| deltaXFirstChr === "9"
				) {
					styleData += "9" + (x - prevX + 300).padFront(3) + (y - prevY + 300).padFront(3);
				} else {
					styleData += deltaX + deltaY;
				}
			}
			prevX = x;
			prevY = y;
		}
		prevX = 0;
		prevY = 0;
	}
	
	//Remove empty canvas "7"s
	while (styleData.substr(styleData.length - 1,1) === "7") {
		styleData = styleData.substring(0,styleData.length - 1);
	}
	
	//Compress to uri component
	styleData = LZString.compressToEncodedURIComponent(styleData);
	
	//Get style quality
	var styleQuality_ = 0;
	if      (styleQuality === "Best Quality"     ) { styleQuality_ = 1; }
	else if (styleQuality === "High Quality"     ) { styleQuality_ = 2; }
	else if (styleQuality === "Quick Setup"      ) { styleQuality_ = 3; }
	else if (styleQuality === "Extra Quick Setup") { styleQuality_ = 4; }
	else { styleQuality_ = 1; }
	
	//Convert letterWidths to a saveable string
	var letterWidthsStr = "";
	for (var i = 0; i < letterWidths.length; i++) {
		letterWidthsStr += Math.round(letterWidths[i][0] * 100) + "+" + Math.round(letterWidths[i][1] * 100) + ","
	}
	
	//Format correctly
	var urlData = "#quality=" + styleQuality_ + ";style=" + styleData + ";letterWidths=" + letterWidthsStr + ";";
	console.log(urlData);
	
	//Set hash to urlData
	return urlData;
}

//?//	function GetVariablesFromUrl() { //Same as in HandwritingGenerator
//?//		//Initial uri read stuff
//?//		var uriHash = window.location.hash;
//?//		
//?//		//Isolate variables in uri
//?//		var styleDecimal = "";
//?//		var styleQuality = "";
//?//		var letterWidths = "";
//?//		for (var i = 0; i < uriHash.length - 1; i++) {
//?//			let chr = uriHash.substr(i,1);
//?//			if (chr === "#" || chr === ";") {
//?//				if (uriHash.substr(i, 1) === "#" || uriHash.substr(i, 1) === ";") {
//?//					let ip1 = i + 1;
//?//					if (uriHash.substr(ip1, 6).toLowerCase() === "style=") {
//?//						styleDecimal = uriHash.substring(ip1 + 6, uriHash.indexOf(";", ip1));
//?//					} else if (uriHash.substr(ip1, 8).toLowerCase() === "quality=") {
//?//						styleQuality = uriHash.substring(ip1 + 8, uriHash.indexOf(";", ip1));
//?//					} else if (uriHash.substr(ip1, 13).toLowerCase() === "letterwidths=") {
//?//						letterWidths = uriHash.substring(ip1 + 13, uriHash.indexOf(";", ip1));
//?//					} else {
//?//						throw new Error("Invalid uri variable name.");
//?//					}
//?//				} else {
//?//					throw new Error("Invalid uri variable name.");
//?//				}
//?//				i = uriHash.indexOf(";", i + 1) - 1;
//?//			}
//?//		}
//?//		
//?//		//Interpret variables
//?//		//Style Quality
//?//		if      (styleQuality === "1") { styleQuality = "Best Quality"     ; }
//?//		else if (styleQuality === "2") { styleQuality = "High Quality"     ; }
//?//		else if (styleQuality === "3") { styleQuality = "Quick Setup"      ; }
//?//		else if (styleQuality === "4") { styleQuality = "Extra Quick Setup"; }
//?//		else if (styleQuality === "" ) { styleQuality = "Best Quality"     ; }
//?//		else { throw new Error("Invalid style quality setting in uri"); }
//?//		//Style Decimal
//?//		styleDecimal = LZString.decompressFromEncodedURIComponent(styleDecimal) || "";
//?//		
//?//		
//?//		return {styleQuality:styleQuality, styleDecimal:styleDecimal, letterWidths:letterWidths};
//?//	}
//?//	
//?//	function LoadCanvasDataFromStyleDecimal(styleDecimal, combinations) { //Same as in HandwritingGenerator
//?//		//Setup
//?//		const len = styleDecimal.length;
//?//		var styleData = new Array(combinations.length);
//?//		for (var i = 0; i < styleData.length; i++) {
//?//			styleData[i] = {strokeData:[]};
//?//		}
//?//		
//?//		if (len === 0) { return styleData; }
//?//		var combinationNum = 0;
//?//		
//?//		//Loop through uri string and populate styleData
//?//		var strokeData = [];
//?//		var curX = 0;
//?//		var curY = 0;
//?//		for (var i = 0; i < len;) { //increment is variable
//?//			let chr = styleDecimal.substr(i,1);
//?//			if (chr === "7") { //new canvas
//?//				if (i !== 0) {
//?//					styleData[combinationNum] = {strokeData:strokeData};
//?//					combinationNum++;
//?//				}
//?//				strokeData = [];
//?//				curX = 0;
//?//				curY = 0;
//?//				i += 1;
//?//			} else {
//?//				let gap = false;
//?//				let dx = 0; //delta x
//?//				let dy = 0; //delta y
//?//				if (chr === "8") { //two three-digit coords, gap = true
//?//					gap = true;
//?//					dx = (parseInt(styleDecimal.substr(i + 1,3)) - 300) * 2;
//?//					dy = (parseInt(styleDecimal.substr(i + 4,3)) - 300) * 2;
//?//					i += 7;
//?//				} else if (chr === "9") { //two three-digit coords, gap = false
//?//					dx = (parseInt(styleDecimal.substr(i + 1,3)) - 300) * 2;
//?//					dy = (parseInt(styleDecimal.substr(i + 4,3)) - 300) * 2;
//?//					i += 7;
//?//				} else { //chr = 0,1,2,3,4,5,6 //two two-digit coords, gap = false
//?//					dx = (parseInt(styleDecimal.substr(i    ,2)) - 50) * 2;
//?//					dy = (parseInt(styleDecimal.substr(i + 2,2)) - 50) * 2;
//?//					i += 4;
//?//				}
//?//				
//?//				curX += dx;
//?//				curY += dy;
//?//				
//?//				strokeData.push({x:curX, y:curY, gap:gap});
//?//			}
//?//		}
//?//		styleData[combinationNum] = {strokeData:strokeData};
//?//		
//?//		return styleData;
//?//	}
//?//	
//?//	function LoadLetterWidthsFromString(letterWidthsStr, singleLettersCount) {
//?//		//Setup
//?//		letterWidthsStr = "," + letterWidthsStr;
//?//		var letterWidthsArr = new Array(singleLettersCount);
//?//		for (var i = 0; i < letterWidthsArr.length; i++) {
//?//			letterWidthsArr[i] = {0:0.32, 1:0.68}
//?//		}
//?//		var arrayIndex = 0;
//?//		
//?//		//Loop and populate
//?//		for (var i = 0; i < letterWidthsStr.length; i++) {
//?//			let chr = letterWidthsStr.substr(i, 1);
//?//			if (chr === ",") {
//?//				try {
//?//					let numPair = letterWidthsStr.substringPositiveOnly(i + 1, letterWidthsStr.indexOf(",", i + 1));
//?//					let num1 = numPair.substringPositiveOnly(0, numPair.indexOf("+"));
//?//					let num2 = numPair.substring(num1.length + 1);
//?//					num1 = parseInt(num1) / 100;
//?//					num2 = parseInt(num2) / 100;
//?//					letterWidthsArr[arrayIndex] = {0:num1, 1:num2};
//?//					arrayIndex++;
//?//					i += numPair.length + 1 - 1;
//?//				} catch(e) {
//?//					if (e.name === "InvalidIndexError") {
//?//						arrayIndex++;
//?//					} else {
//?//						throw e;
//?//					}
//?//				}
//?//			}
//?//		}
//?//		return letterWidthsArr;
//?//	}

function OpenImportDialog() {
	let importDialogOverlay = document.getElementById("importDialogOverlay");
	let styleImportArea = document.getElementById("styleImportArea");
	
	//styleImportArea.value = FormatCanvasDataForUrl();
	styleImportArea.value = window.location.hash;
	
	importDialogOverlay.style.display = "block";
}

function CloseImportDialog() {
	let importDialogOverlay = document.getElementById("importDialogOverlay");
	let styleImportArea = document.getElementById("styleImportArea");
	
	window.location.hash = styleImportArea.value;
	
	Start();
	//	//Part of the code in Start()
	//	loadingOverlay.style.visibility = "visible";
	//	var urlVars = GetVariablesFromUrl();
	//	styleQuality = urlVars.styleQuality;
	//	combinations = GetCombinations(styleQuality);
	//	letterWidths = LoadLetterWidthsFromString(urlVars.letterWidths, singleLettersCount);
	//	canvasData = LoadCanvasDataFromStyleDecimal(urlVars.styleDecimal, combinations);
	//	
	//	Restart();
	
	importDialogOverlay.style.display = "none";
}