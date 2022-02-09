import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"
import { subscribeToVoiceCommands, commands } from "../voiceCommands";
import { resetRegions, getRegionSeedAndSize, floodFill } from "../floodfill";
import { render } from "@testing-library/react";

const canvasWidth = 750;
const canvasHeight = 500;

let currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
let currentDelta = new Vector(0, 1);

let velocity = 0.19;
let velocityIncrement = 0.2;
let maxVelocity = 0.5;

let paint = true;
let going = false;

let strokeSize = 8;
let strokeIncrement = 2;
let mix = false;
let mixMore = false;
let mixLess = false;
let colorIncrement = 51;

let currentColour = [0, 0, 0];

let justSaved = false;

let commandQueue = [];

let discovered_region_seeds = new Set();
let discovered_region_objs = [];

let drawing_layer;
let text_layer;
let mouse_layer;

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
		// p5.cursor(p5.CROSS);

		drawing_layer = p5.createGraphics(canvasWidth, canvasHeight);
		text_layer = p5.createGraphics(canvasWidth, canvasHeight);
		mouse_layer = p5.createGraphics(canvasWidth, canvasHeight);
		drawing_layer.strokeWeight(strokeSize);
		drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);

		mouse_layer.noFill();
		mouse_layer.stroke(0);
		mouse_layer.ellipse(currentPos.x, currentPos.y, strokeSize, strokeSize);

		p5.image(mouse_layer, 0, 0);

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
				if (!mix) {
					currentDelta = updateDelta(command, currentDelta);
					movePen(p5);
				}
				break;
			case commands.GO:
				if (!mix) {
					going = true;
				}
				break;
			case commands.STOP:
				going = false;
				break;
			case commands.PAINT:
				paint = true;
				mix = false;
				break;
			case commands.MOVE:
				if (!mix) {
					paint = false;
				}
				break;
			case commands.QUICK:
				if (!mix) {
					velocity = Math.min(velocity + velocityIncrement, maxVelocity);
				}
				break;
			case commands.SLOW:
				if (!mix) {
					velocity = Math.max(velocity - velocityIncrement * 2, 0);
				}
				break;
			case commands.BOLD:
				if (!mix) {
					strokeSize = strokeSize + strokeIncrement;
					drawing_layer.strokeWeight(strokeSize);
				}
				break;
			case commands.SHRINK:
				if (!mix) {
					strokeSize = Math.max(strokeSize - strokeIncrement, 1);
				}
				drawing_layer.strokeWeight(strokeSize);
				break;
			case commands.MIX:
				paint = false;
				going = false;
				mix = true;
				console.log('MIX STATE');
				break;
			case commands.MORE:
				if (mix) {
					mixLess = false;
					mixMore = true;
				}
				console.log('MORE STATE');
				break;
			case commands.LESS:
				if (mix) {
					mixLess = true;
					mixMore = false;
				}
				console.log('LESS STATE');
				break;
			case commands.RED:
				if (mix) {
					if (mixMore) {
						currentColour[0] = Math.min(currentColour[0] + colorIncrement, 255);
						props.setColourToMix(['red', true]);
					} else {
						if (mixLess) {
							currentColour[0] = Math.max(currentColour[0] - colorIncrement, 0);
							props.setColourToMix(['red', false]);
						} else {
							currentColour = [255, 0, 0];
							props.setColourToMix(['red', null]);
						}
					}
					console.log('COLOUR ' + currentColour);
					props.setCurrentColour(currentColour);
					drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);
					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.GREEN:
				if (mix) {
					if (mixMore) {
						currentColour[1] = Math.min(currentColour[1] + colorIncrement, 255);
						props.setColourToMix(['green', true]);
					} else {
						if (mixLess) {
							currentColour[1] = Math.max(currentColour[1] - colorIncrement, 0);
							props.setColourToMix(['green', false]);
						} else {
							currentColour = [0, 255, 0];
							props.setColourToMix(['green', null]);
						}
					}
					console.log('COLOUR ' + currentColour);
					props.setCurrentColour(currentColour);
					drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);

					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.BLUE:
				if (mix) {
					if (mixMore) {
						currentColour[2] = Math.min(currentColour[2] + colorIncrement, 255);
						props.setColourToMix(['blue', true]);
					} else {
						if (mixLess) {
							currentColour[2] = Math.max(currentColour[2] - colorIncrement, 0);
							props.setColourToMix(['blue', false]);
						} else {
							currentColour = [0, 0, 255];
							props.setColourToMix(['blue', null]);
						}
					}
					console.log('COLOUR ' + currentColour);
					props.setCurrentColour(currentColour);
					drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);
					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.BLACK:
				if (mix) {
					if (mixMore) {
						currentColour[0] = Math.min(currentColour[0] - colorIncrement, 255);
						currentColour[1] = Math.min(currentColour[1] - colorIncrement, 255);
						currentColour[2] = Math.min(currentColour[2] - colorIncrement, 255);
						props.setColourToMix(['black', true]);
					} else {
						if (mixLess) {
							currentColour[0] = Math.max(currentColour[0] + colorIncrement, 0);
							currentColour[1] = Math.max(currentColour[1] + colorIncrement, 0);
							currentColour[2] = Math.max(currentColour[2] + colorIncrement, 0);
							props.setColourToMix(['black', false]);
						} else {
							currentColour = [0, 0, 0];
							props.setColourToMix(['black', null]);
						}
					}
					console.log('COLOUR ' + currentColour);
					props.setCurrentColour(currentColour);
					drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);
					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.WHITE:
				if (mix) {
					if (mixMore) {
						currentColour[0] = Math.max(currentColour[0] + colorIncrement, 0);
						currentColour[1] = Math.max(currentColour[1] + colorIncrement, 0);
						currentColour[2] = Math.max(currentColour[2] + colorIncrement, 0);
						props.setColourToMix(['white', true]);
					} else {
						if (mixLess) {
							currentColour[0] = Math.min(currentColour[0] - colorIncrement, 255);
							currentColour[1] = Math.min(currentColour[1] - colorIncrement, 255);
							currentColour[2] = Math.min(currentColour[2] - colorIncrement, 255);
							props.setColourToMix(['white', false]);
						} else {
							currentColour = [255, 255, 255];
							props.setColourToMix(['white', null]);
						}
					}
					console.log('COLOUR ' + currentColour);
					props.setCurrentColour(currentColour);
					drawing_layer.stroke(currentColour[0], currentColour[1], currentColour[2]);
					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.CLEAR:
				drawing_layer.background(255, 255, 255);
				renderPainting(p5);
				currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
				break;
			case commands.SAVE:
				drawing_layer.saveCanvas(p5.canvas, 'articulate', 'jpg');
				justSaved = true;
				break;
			case commands.REGIONS:
				going = false;
				identifyAllRegions(p5);
				break;
			case commands.FILL:
				fillAtPen(p5);
				break;
			case commands.ZERO:
			case commands.ONE:
			case commands.TWO:
			case commands.THREE:
				jumpPenToRegion(p5, command);
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
		for (let x = Math.round(w / 10); x < w; x += Math.round(w / 10)) {
			for (let y = Math.round(h / 10); y < h; y += Math.round(h / 10)) {
				let region_data = getRegionSeedAndSize(p5, p5.createVector(x, y), drawing_layer)
				let region = new Region(region_data[0], region_data[1], region_data[0], x, y)

				//console.log("The region at " + x + ", " + y + " is " + region.seed + ", size " + region.size)

				if (region.size >= min_region_size && !(region.seed in discovered_region_seeds)) {
					discovered_region_seeds.add(region.seed)
					discovered_region_objs = discovered_region_objs.concat(region)
					text_layer.text(discovered_region_objs.length - 1, x / p5.pixelDensity(), y / p5.pixelDensity());
				}
			}
		}
		console.log("Identified " + discovered_region_seeds.size + " regions, of sizes: " + Array.from(discovered_region_objs).map(r => r.size))

		renderPainting(p5, true);
	}

	const renderPainting = (p5, show_text = false) => {
		p5.background(255, 255, 255)
		p5.image(drawing_layer, 0, 0)
		p5.image(mouse_layer, 0, 0)
		if (show_text) p5.image(text_layer, 0, 0)
	}

	const fillAtPen = (p5) => {
		floodFill(p5, p5.createVector(Math.round(currentPos.x * p5.pixelDensity()), Math.round(currentPos.y * p5.pixelDensity())), currentColour.concat(255), drawing_layer)
		console.log("Flooded")
		renderPainting(p5);
	};

	const jumpPenToRegion = (p5, region_index_str) => {
		console.log("Going to attempt to jump to " + region_index_str)
		let region_index = { "zero": 0, "one": 1, "two": 2, "three": 3 }[region_index_str]
		console.log("Translated to index " + region_index)

		if (region_index >= discovered_region_objs.length) {
			console.log("Cancelling; no region exists")
			return
		}
		currentPos.x = discovered_region_objs[region_index].x;
		currentPos.y = discovered_region_objs[region_index].y;

		console.log("Jumping to " + currentPos.x + ", " + currentPos.y)

		//drawing_layer.strokeWeight(4);

		currentDelta.x = 0;
		currentDelta.y = 0;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;

		mouse_layer.noFill();
		mouse_layer.stroke(0);
		mouse_layer.ellipse(currentPos.x, currentPos.y, strokeSize, strokeSize);

		renderPainting(p5, false);
	}

	const movePen = (p5) => {
		let newX = currentPos.x + currentDelta.x * velocity;
		let newY = currentPos.y + currentDelta.y * velocity;
		if (paint) {
			// p5.line(currentPos.x, currentPos.y, newX, newY);
			//drawing_layer.noSmooth();
			drawing_layer.line(currentPos.x, currentPos.y, newX, newY);
		}
		currentPos.x = newX;
		currentPos.y = newY;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;

		mouse_layer.noFill();
		mouse_layer.stroke(0);
		mouse_layer.ellipse(currentPos.x, currentPos.y, strokeSize, strokeSize);

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
		else if (p5.key == 'g') commandQueue.push("go");
		else if (p5.key == '0') commandQueue.push("zero");
		else if (p5.key == '1') commandQueue.push("one");
		else if (p5.key == '2') commandQueue.push("two");
		else if (p5.key == '3') commandQueue.push("three");
	}

	const draw = (p5) => {

		drawing_layer.noFill();

		if (commandQueue.length > 0) {
			mouse_layer.clear();
			while (commandQueue.length > 0) {
				const command = commandQueue.shift();
				props.setCommand(command);
				if (!(command == commands.SAVE && justSaved)) {
					justSaved = false;
					console.log("Pushing off command: " + command)
					handleCommand(command, p5);
					console.log(JSON.stringify(currentPos));
				}
			}
		} else {
			if (going) {
				mouse_layer.clear();
				movePen(p5);
			}
		}


		//console.log(JSON.stringify(currentPos));
	};

	return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
};

export default CanvasComponent; 
