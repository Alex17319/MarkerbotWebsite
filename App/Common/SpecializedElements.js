"use strict";

var sliderController = {
	
	activeSliderNode:undefined,
	hasInitialised:false,
	sliderMoveEventListeners:[],
	
	Init:function() {
		if (sliderController.hasInitialised) {return false; }
		sliderController.hasInitialised = true;
		
		var sliderNodes = document.getElementsByClassName("sliderNode");
		for (var i = 0; i < sliderNodes.length; i++) {
			let sliderNode = sliderNodes[i];
			sliderNode.addEventListener("mousedown", function(e) {
				sliderController.SliderNodeMouseDown(e.target, e);
			});
			sliderNode.addEventListener("touchstart", function(e) {
				sliderController.SliderNodeMouseDown(e.target, e);
			});
		}
		
		document.addEventListener("mouseout", function(e) {
			if (
				   e.target === document.body
				|| (
					   e.target.parentElement === null
					&& e.target.tagName === "HTML"
				   )
				|| (
					   e.target.id === "main"
					&& e.toElement !== null
					&& e.toElement !== undefined
					&& e.toElement.parentElement === null
					&& e.toElement.tagName === "HTML"
				   )
			) {
				sliderController.DeactivateSliderNodes();
			}
		});
		document.body.addEventListener("mouseup",  sliderController.DeactivateSliderNodes );
		document.body.addEventListener("touchend", sliderController.DeactivateSliderNodes );
		window.addEventListener("resize",   sliderController.DeactivateSliderNodes );
		
		window.addEventListener("resize",   sliderController.NormaliseSliders      );

		document.body.addEventListener("mousemove", function(e){ sliderController.SliderNodesMouseMove(e); } );
		document.body.addEventListener("touchmove", function(e){ sliderController.SliderNodesMouseMove(e); } );
		
		return true;
	},
	
	SliderInit:function(slider) {
		//Properties of slider
		slider.sliderWidth = parseFloat(getComputedStyle(slider, null).getPropertyValue('width'),10);
		console.log(slider.sliderWidth);
		
		//Slider nodes
		var sliderNodes = slider.getElementsByClassName("sliderNode");
		for (var i = 0; i < sliderNodes.length; i++) {
			//Setup
			let sliderNode = sliderNodes[i];
			
			//Event listeners on slider nodes
			sliderNode.addEventListener("mousedown", function(e) {
				sliderController.SliderNodeMouseDown(e.target, e);
			});
			sliderNode.addEventListener("touchstart", function(e) {
				sliderController.SliderNodeMouseDown(e.target, e);
			});
			
			//Properties of slider nodes
			sliderNode.sliderFraction = sliderController.MarginLeftToFraction(slider.sliderWidth, parseFloat(sliderNode.style.marginLeft) || 0);
		}
		//	slider.addEventListener("resize", function(e) {
		//		var sliderNodes = slider.getElementsByClassName("sliderNode");
		//		for (var i = 0; i < sliderNodes.length; i++) {
		//			sliderController.NormaliseSliderNode(sliderNodes[i]);
		//		}
		//	});
	},
	
	AddEventListener:function(func) {
		sliderController.sliderMoveEventListeners.push(func);
	},
	
	FractionToMarginLeft:function(sliderWidth, fraction) {
		return (   (fraction * sliderWidth) * ( (sliderWidth - 16 + 2)/sliderWidth )   ) - 22;
	},
	
	MarginLeftToFraction:function(sliderWidth, marginLeft) {
		return (   ( marginLeft + 22 ) / ( (sliderWidth - 16 + 2)/sliderWidth )   ) / sliderWidth;
	},
	
	SliderNodeMouseDown:function(sliderNode, e) {
		if (sliderNode.className.indexOf("sliderNode") !== -1) {
			sliderController.activeSliderNode = sliderNode;
			sliderController.SliderNodesMouseMove(e);
		}
	},

	DeactivateSliderNodes:function() {
		sliderController.activeSliderNode = undefined;
	},

	SliderNodesMouseMove:function(mouseMoveEvent) {
		if (sliderController.activeSliderNode !== undefined) {
			//Setup
			let slider = sliderController.activeSliderNode.parentElement;
			let sliderRect = slider.getBoundingClientRect();
			let x = mouseMoveEvent.clientX - 7;
			
			//Move slider
			if (x > sliderRect.right - 14) {
				//Setup
				if (slider.sliderWidth === undefined) {
					slider.sliderWidth = parseFloat(getComputedStyle(slider, null).getPropertyValue('width'),10);
				}
				//Move
				sliderController.activeSliderNode.style.marginLeft = slider.sliderWidth - 7 - 30 + "px";
				sliderController.activeSliderNode.sliderFraction = 1;
			} else if (x < sliderRect.left) {
				//Move
				sliderController.activeSliderNode.style.marginLeft = -23 + "px";
				sliderController.activeSliderNode.sliderFraction = 0;
			} else {
				//Setup
				if (slider.sliderWidth === undefined) {
					slider.sliderWidth = parseFloat(getComputedStyle(slider, null).getPropertyValue('width'),10);
				}
				//Move
				sliderController.activeSliderNode.style.marginLeft = x - sliderRect.left - 23 + "px";
				sliderController.activeSliderNode.sliderFraction = (x - sliderRect.left)/(slider.sliderWidth - 14);
			}
			
			
			
			for (var i = 0; i < sliderController.sliderMoveEventListeners.length; i++) {
				sliderController.sliderMoveEventListeners[i].call("I don't know what this does, and I don't have internet", sliderController.activeSliderNode);
			}
		}
	},
	
	//	NormaliseSliders:function() {
	//		var sliderNodes = document.getElementsByClassName("sliderNode");
	//		for (var i = 0; i < sliderNodes.length; i++) {
	//			sliderController.NormaliseSliderNode(sliderNodes[i]);
	//		}
	//	},
	//	
	//	NormaliseSliderNode:function(sliderNode) {
	//		//Setup
	//		let slider = sliderNode.parentElement;
	//		let fraction = sliderNode.sliderFraction;
	//		slider.sliderWidth = parseFloat(getComputedStyle(slider, null).getPropertyValue('width'), 10);
	//		
	//		//Move
	//		sliderNode.style.marginLeft = sliderController.FractionToMarginLeft(slider.sliderWidth, fraction) + "px";
	//	}
}

//OnLoad(sliderController.Init);




