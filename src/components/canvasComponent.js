import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"
import { subscribeToVoiceCommands, commands } from "../voiceCommands";
import { resetRegions, getRegionSeedAndSize, floodFill } from "../floodfill";

const canvasWidth = 750;
const canvasHeight = 500;

let currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
let currentDelta = new Vector(0, 0);
let velocity = 50;

let commandQueue = [];

let discovered_region_seeds = new Set();
let discovered_region_objs = [];

let drawing_layer;
let text_layer;

class Region {
	constructor(name, size, seed, x, y) {
	  this.name = name;
	  this.size = size;
	  this.seed = seed;
	  this.x = x;
	  this.y = y;
	}
}

function CanvasComponent(props) {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.pixelDensity(3);
		p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
		p5.background(255, 255, 255);

		drawing_layer = p5.createGraphics(canvasWidth, canvasHeight);
  		text_layer = p5.createGraphics(canvasWidth, canvasHeight);

		subscribeToVoiceCommands((command) => {
			commandQueue.push(command);
		});
	};

	const handleCommand = (command, p5) => {
		switch (command) {
		case commands.UP:
		case commands.DOWN:
		case commands.LEFT:
		case commands.RIGHT:
			currentDelta = updateDelta(command, currentDelta);
			movePen(p5);
			break;
		case commands.REGIONS:
			identifyAllRegions(p5);
			break;
		case commands.FILL:
			fillAtPen(p5);
			break;
		default:
			console.log("unhandled " + command);
		}
	};

	const identifyAllRegions = (p5) => {
		discovered_region_seeds = new Set();
		discovered_region_objs = [];
		
		const min_region_size = 1000 * p5.pixelDensity() * p5.pixelDensity() * p5.pixelDensity()
		resetRegions();
		text_layer.clear()
		
		let w = drawing_layer.width * p5.pixelDensity();
		let h = drawing_layer.height * p5.pixelDensity();
		for (let x = Math.round(w/10); x < w; x+=Math.round(w/10)) {
		  for (let y = Math.round(h/10); y < h; y+=Math.round(h/10)) {
			  let region_data = getRegionSeedAndSize(p5, p5.createVector(x,y), drawing_layer)
			  let region = new Region(region_data[0], region_data[1], region_data[0], x, y)
	  
				console.log("The region at " + x + ", " + y + " is " + region.seed + ", size " + region.size)

			  if(region.size >= min_region_size && !(region.seed in discovered_region_seeds)){
				discovered_region_seeds.add(region.seed)
				discovered_region_objs = discovered_region_objs.concat(region)
				text_layer.text(discovered_region_objs.length-1, x/p5.pixelDensity(), y/p5.pixelDensity());
			  }
		  }
		}
		console.log("Identified " + discovered_region_seeds.size + " regions, of sizes: " + Array.from(discovered_region_objs).map(r => r.size))
		
		renderPainting(p5, true);
	  }
	
	  const renderPainting = (p5, show_text=false) => {
		p5.background(255, 255, 255)
		p5.image(drawing_layer, 0, 0)
		if(show_text) p5.image(text_layer, 0, 0)
	  }

	const fillAtPen = (p5) => {
		
		floodFill(p5, p5.createVector(Math.round(currentPos.x*p5.pixelDensity()), Math.round(currentPos.y*p5.pixelDensity())), [255, 0, 0, 255], drawing_layer)
		console.log("Flooded")
		renderPainting(p5);
	};

	const movePen = (p5) => {
		let newX = currentPos.x + currentDelta.x * velocity;
		let newY = currentPos.y + currentDelta.y * velocity;
		//drawing_layer.strokeWeight(4);
		drawing_layer.noSmooth();
		drawing_layer.line(currentPos.x, currentPos.y, newX, newY);
		currentPos.x = newX;
		currentPos.y = newY;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;

		if (typeof currentPos.x !== 'number' || typeof currentPos.y !== 'number') {
			console.log('bad currentPos: ' + JSON.stringify(currentPos));
		}
		renderPainting(p5);
	};

	// Top left: mouseX, mouseY = (0,0)
	// Bottom right: mouseX, mouseY = (width, height)
	const keyPressed = (p5) => {
		if (p5.key == 'ArrowUp') commandQueue.push("up");
		else if (p5.key == 'ArrowDown') commandQueue.push("down");
		else if (p5.key == 'ArrowRight') commandQueue.push("right");
		else if (p5.key == 'ArrowLeft') commandQueue.push("left");
		else if (p5.key == 'r') commandQueue.push("regions");
		else if (p5.key == 'f') commandQueue.push("fill");
	}

	const draw = (p5) => {
		while (commandQueue.length > 0) {
			const command = commandQueue.shift();
			props.setCommand(command);
			console.log("Pushing off command: " + command)
			handleCommand(command, p5);
			console.log(JSON.stringify(currentPos));
		}
	};

    return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
};

export default CanvasComponent; 
