import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"
import { subscribeToVoiceCommands, commands } from "../voiceCommands";

const canvasWidth = 750;
const canvasHeight = 500;

let currentPos = new Vector(canvasWidth / 2, canvasHeight / 2);
let currentDelta = new Vector(0, 1);
let velocity = 50;

let commandQueue = [];

function CanvasComponent(props) {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
		p5.background(255, 255, 255);

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
		default:
			console.log("unhandled " + command);
		}
	};

	const movePen = (p5) => {
		let newX = currentPos.x + currentDelta.x * velocity;
		let newY = currentPos.y + currentDelta.y * velocity;
		p5.line(currentPos.x, currentPos.y, newX, newY);
		currentPos.x = newX;
		currentPos.y = newY;

		if (currentPos.x < 0) currentPos.x = 0;
		if (currentPos.x >= canvasWidth) currentPos.x = canvasWidth - 1;
		if (currentPos.y < 0) currentPos.y = 0;
		if (currentPos.y >= canvasWidth) currentPos.y = canvasHeight - 1;

	};

	const draw = (p5) => {
		p5.noFill();
		p5.stroke(0);
		
		while (commandQueue.length > 0) {
			const command = commandQueue.shift();
			props.setCommand(command);
			handleCommand(command, p5);
		}

		console.log(JSON.stringify(currentPos));
	};

	return <Sketch setup={setup} draw={draw} />;
};

export default CanvasComponent; 
