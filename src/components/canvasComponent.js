import React from "react";
import Sketch from "react-p5";
import Vector from "../drawVector"
import { updateDelta } from "../drawVector"

let currentPos = new Vector(0, 0);
let currentDelta = new Vector(0, 1);
let velocity = 100;

function CanvasComponent(props) {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(750, 500).parent(canvasParentRef);
		p5.background(255, 255, 255);
	};

	const draw = (p5) => {
		p5.noFill();
		p5.stroke(0);
		console.log(JSON.stringify(currentDelta));
		currentDelta = updateDelta("right", currentDelta);
		let newX = currentPos.x + currentDelta.x * velocity;
		let newY = currentPos.y + currentDelta.y * velocity;
		console.log(newX);
		console.log(newY);
		p5.line(currentPos.x, currentPos.y, newX, newY);
	};

	return <Sketch setup={setup} draw={draw} />;
};

export default CanvasComponent; 
