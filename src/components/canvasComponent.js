import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"
import { subscribeToVoiceCommands, commands } from "../voiceCommands";

const canvasWidth = 750;
const canvasHeight = 500;

let currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
let currentDelta = new Vector(0, 1);

let velocity = 0.18;
let velocityIncrement = 0.2;
let maxVelocity = 0.3;

let paint = true;
let going = false;

let strokeSize = 8;
let strokeIncrement = 1;
let mix = false;
let mixMore = false;
let mixLess = false;
let colorIncrement = 51;

// using RGB for colours
let currentColour = [0, 0, 0];

let commandQueue = [];

function CanvasComponent(props) {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
		p5.background(255, 255, 255);
		p5.strokeWeight(strokeSize);
		p5.stroke(currentColour[0], currentColour[1], currentColour[2]);

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
					p5.strokeWeight(strokeSize);
				}
				break;
			case commands.SHRINK:
				if (!mix) {
					strokeSize = Math.max(strokeSize - strokeIncrement, 0);
				}
				p5.strokeWeight(strokeSize);
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
					} else {
						if (mixLess) {
							currentColour[0] = Math.max(currentColour[0] - colorIncrement, 0);
						} else {
							currentColour = [255, 0, 0];
						}
					}
					console.log('COLOUR ' + currentColour);
					p5.stroke(currentColour[0], currentColour[1], currentColour[2]);
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
					} else {
						if (mixLess) {
							currentColour[1] = Math.max(currentColour[1] - colorIncrement, 0);
						} else {
							currentColour = [0, 255, 0];
						}
					}
					console.log('COLOUR ' + currentColour);
					p5.stroke(currentColour[0], currentColour[1], currentColour[2]);
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
					} else {
						if (mixLess) {
							currentColour[2] = Math.max(currentColour[2] - colorIncrement, 0);
						} else {
							currentColour = [0, 0, 255];
						}
					}
					console.log('COLOUR ' + currentColour);
					p5.stroke(currentColour[0], currentColour[1], currentColour[2]);
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
					} else {
						if (mixLess) {
							currentColour[0] = Math.max(currentColour[0] + colorIncrement, 0);
							currentColour[1] = Math.max(currentColour[1] + colorIncrement, 0);
							currentColour[2] = Math.max(currentColour[2] + colorIncrement, 0);
						} else {
							currentColour = [0, 0, 0];
						}
					}
					console.log('COLOUR ' + currentColour);
					p5.stroke(currentColour[0], currentColour[1], currentColour[2]);
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
					} else {
						if (mixLess) {
							currentColour[0] = Math.min(currentColour[0] - colorIncrement, 255);
							currentColour[1] = Math.min(currentColour[1] - colorIncrement, 255);
							currentColour[2] = Math.min(currentColour[2] - colorIncrement, 255);
						} else {
							currentColour = [255, 255, 255];
						}
					}
					console.log('COLOUR ' + currentColour);
					p5.stroke(currentColour[0], currentColour[1], currentColour[2]);
					mix = false;
					paint = true;
					mixMore = false;
					mixLess = false;
				}
				break;
			case commands.CLEAR:
				p5.background(255, 255, 255);
				currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
				break;
			default:
				console.log("unhandled " + command);
		}
	};


	const movePen = (p5) => {
		let newX = currentPos.x + currentDelta.x * velocity;
		let newY = currentPos.y + currentDelta.y * velocity;
		if (paint) {
			p5.line(currentPos.x, currentPos.y, newX, newY);
		}
		currentPos.x = newX;
		currentPos.y = newY;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;

	};

	const draw = (p5) => {
		p5.noFill();

		if (commandQueue.length > 0) {
			while (commandQueue.length > 0) {
				const command = commandQueue.shift();
				handleCommand(command, p5);
			}
		} else {
			if (going) {
				movePen(p5);
			}
		}

		//console.log(JSON.stringify(currentPos));
	};

	return <Sketch setup={setup} draw={draw} />;
};

export default CanvasComponent; 
