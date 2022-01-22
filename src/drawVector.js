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
    return new Vector(vector.x / mag, vector.y / mag);
}

function midway(v1, v2) {
    let v1n = normalise(v1);
    let v2n = normalise(v2);
    let v = new Vector((v1n.x + v2n.x) / 2, (v1n.y + v2n.y) / 2);
    console.log(JSON.stringify(v));
    return v;
}

// commands to implement: continue, up, right, down, left
export function updateDelta(command, prev) {
    console.log(JSON.stringify(command));
    switch (command) {
        case "continue":
            return prev;
        case "up":
            return midway(prev, upVector);
        case "right":
            console.log(JSON.stringify(prev));
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
