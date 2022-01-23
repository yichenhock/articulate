function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }
  
  function expandToNeighbours(p5,graphics,queue,current){
    let x = current.x
    let y = current.y
    
    if(x-1>0){queue.push(p5.createVector(x-1,y))}
    if(x+1<graphics.width * p5.pixelDensity()){queue.push(p5.createVector(x+1,y))} 
    if(y-1>0){queue.push(p5.createVector(x,y-1))}
    if(y+1<graphics.height * p5.pixelDensity()){queue.push(p5.createVector(x,y+1))}
    
    return queue
  }
  
  var index_visited = {};
  export function floodFill(p5, seed, fillColor, graphics) {
    graphics.loadPixels();

    index_visited = {};

  
    let index = 4 * (graphics.width * p5.pixelDensity() * seed.y + seed.x);
    let seedColor = [
      graphics.pixels[index],
      graphics.pixels[index + 1],
      graphics.pixels[index + 2],
      graphics.pixels[index + 3],
    ];
  
    console.log("Flooding at " + seed.x + ", " + seed.y + ", seed colour " + seedColor);

    let queue = [];
    queue.push(seed);
    while (queue.length) {
      let current = queue.shift();

      let index = 4 * (graphics.width * p5.pixelDensity() * current.y + current.x);

      // Skip if this already has a REGION
      if (index in index_visited) {
        continue;
      }

      let color = [
        graphics.pixels[index],
        graphics.pixels[index + 1],
        graphics.pixels[index + 2],
        graphics.pixels[index + 3],
      ];
      //console.log("Current x: " + current.x + ", current y: " + current.y + ", queue size " + queue.length)
      //console.log("Getting from " + (index) + ", colour " + graphics.pixels[index])
  
      // Skip if this isn't a match
      if (!arrayEquals(color, seedColor)) {
        continue;
      }
  
      //console.log("Setting " + (index) + " to " + fillColor[0])
      index_visited[index] = true;
      for (let i = 0; i < 4; i++) {
        
        graphics.pixels[index+i] = fillColor[i];
      }
      
      queue = expandToNeighbours(p5,graphics,queue, current)  
    }
    graphics.updatePixels()
  }
  
  // Regions are identified by the seed_index that first discovered them
  var index_to_region = {};
  
  export function resetRegions() {
    index_to_region = {};
  }

  export function getRegionSeedAndSize(p5, seed, graphics) {
    graphics.loadPixels();
  
    let seed_index =  4 * (p5.pixelDensity() * graphics.width * seed.y + seed.x);
    if (seed_index in index_to_region) {
      //console.log("Selected existing region " + index_to_region[seed_index])
      return [index_to_region[seed_index], -1]
    }
    
    let seedColor = [
      graphics.pixels[seed_index],
      graphics.pixels[seed_index + 1],
      graphics.pixels[seed_index + 2],
      graphics.pixels[seed_index + 3],
    ];
  
    let queue = [];
    queue.push(seed);
  
    let region_size = 0;
    while (queue.length) {
      let current = queue.shift();
      let index =  4 * (p5.pixelDensity() * graphics.width * current.y + current.x);

      // Skip if this already has a REGION
      if (index in index_to_region) {
        continue;
      }
      
      let color = [
        graphics.pixels[index],
        graphics.pixels[index + 1],
        graphics.pixels[index + 2],
        graphics.pixels[index + 3],
      ];
  
      // Skip if this isn't a COLOUR match
      if (!arrayEquals(color, seedColor)) {
          //console.log("not a colour match");
        continue;
      }
  
      let fill_col = [255,0,0,255]
      for (let i = 0; i < 4; i++) {
        // For now, fill regions with colour
        //graphics.pixels[index+i] = fill_col[i];
        index_to_region[index+i] = seed_index
        region_size += 1;
      }
      
      queue = expandToNeighbours(p5, graphics, queue, current)  
    }
    //console.log("Found new region " + seed_index)
    graphics.updatePixels()
    return [seed_index, region_size]
  }