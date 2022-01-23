class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let upVector = new Vector(0, -1);
let rightVector = new Vector(1, 0);
let downVector = new Vector(0, 1);
let leftVector = new Vector(-1, 0);

function magnitude(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function normalise(vector) {
    let mag = magnitude(vector);
    if(mag==0) return vector
    console.log("Normalized to " + vector.x / mag)
    return new Vector(vector.x / mag, vector.y / mag);
}

function midway(v1, v2) {
    let v1n = normalise(v1);
    let v2n = normalise(v2);
    let v = new Vector(v1n.x + v2n.x, v1n.y + v2n.y);
    return normalise(v);
}

// commands to implement: continue, up, right, down, left
export function updateDelta(command, prev) {
    switch (command) {
        case "continue":
            return prev;
        case "up":
            return midway(prev, upVector);
        case "right":
            return midway(prev, rightVector);
        case "down":
            return midway(prev, downVector);
        case "left":
            return midway(prev, leftVector);
        default:
            return prev;
    }
}

export default Vector;
