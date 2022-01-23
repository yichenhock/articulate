import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"
import { subscribeToVoiceCommands, commands } from "../voiceCommands";
import { resetRegions, getRegionSeedAndSize, floodFill } from "../floodfill";

const canvasWidth = 200;
const canvasHeight = 200;

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
		p5.pixelDensity(1);
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
		case "up":
		case "down":
		case "left":
		case "right":
			currentDelta = updateDelta(command, currentDelta);
			movePen(p5);
			break;
		case "regions":
			identifyAllRegions(p5);
			break;
		default:
			console.log("unhandled " + command);
		}
	};

	const identifyAllRegions = (p5) => {
		discovered_region_seeds = new Set();
		discovered_region_objs = [];
		//text_layer.clear();f
		
		const min_region_size = 1000
		resetRegions();
		text_layer.clear()
		
		for (let x = drawing_layer.width/10; x < drawing_layer.width; x+=drawing_layer.width/10) {
		  for (let y = drawing_layer.height/10; y < drawing_layer.height; y+=drawing_layer.height/10) {
			  let region_data = getRegionSeedAndSize(p5, p5.createVector(x,y), drawing_layer)
			  let region = new Region(region_data[0], region_data[1], region_data[0], x, y)
	  
				console.log("The region at " + x + ", " + y + " is " + region.seed + ", size " + region.size)

			  if(region.size >= min_region_size && !(region.seed in discovered_region_seeds)){
				discovered_region_seeds.add(region.seed)
				discovered_region_objs = discovered_region_objs.concat(region)
				text_layer.text(discovered_region_objs.length-1, x, y);
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

	const movePen = (p5) => {
		console.log("currentPos.x: " + currentPos.x)
		console.log("currentDelta.x: " + currentDelta.x)
		console.log("velocity: " + velocity)
		let newX = currentPos.x + currentDelta.x * velocity;
		console.log("newX: " + newX)
		let newY = currentPos.y + currentDelta.y * velocity;
		//drawing_layer.strokeWeight(4);
		drawing_layer.noSmooth();
		drawing_layer.line(currentPos.x, currentPos.y, newX, newY);
		console.log("newX: " + newX)
		currentPos.x = newX;
		currentPos.y = newY;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;
		renderPainting(p5);
	};

	// Top left: mouseX, mouseY = (0,0)
	// Bottom right: mouseX, mouseY = (width, height)
	const keyPressed = (p5) => {
		if (p5.key == 'ArrowUp') commandQueue.push("up");
		else if (p5.key == 'ArrowDown') commandQueue.push("down");
		else if (p5.key == 'ArrowRight') commandQueue.push("right");
		else if (p5.key == 'ArrowLeft') commandQueue.push("left");
		else if (p5.key == ' ') commandQueue.push("regions");
	}

	const draw = (p5) => {
		while (commandQueue.length > 0) {
			const command = commandQueue.shift();
			console.log("Pushing off command: " + command)
			handleCommand(command, p5);
			console.log(JSON.stringify(currentPos));
		}
	};

	return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
};

export default CanvasComponent; 
