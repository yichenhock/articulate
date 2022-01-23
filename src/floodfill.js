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
    if(x+1<graphics.width){queue.push(p5.createVector(x+1,y))} 
    if(y-1>0){queue.push(p5.createVector(x,y-1))}
    if(y+1<graphics.height){queue.push(p5.createVector(x,y+1))}
    
    return queue
  }
  
  export function floodFill(p5, seed, fillColor, graphics) {
    graphics.loadPixels();
  
    let index = 4 * (graphics.width * seed.y + seed.x);
    let seedColor = [
      graphics.pixels[index],
      graphics.pixels[index + 1],
      graphics.pixels[index + 2],
      graphics.pixels[index + 3],
    ];
  
    let queue = [];
    queue.push(seed);
    while (queue.length) {
      let current = queue.shift();
      let index = 4 * (graphics.width * current.y + current.x);
      let color = [
        graphics.pixels[index],
        graphics.pixels[index + 1],
        graphics.pixels[index + 2],
        graphics.pixels[index + 3],
      ];
  
      // Skip if this isn't a match
      if (!arrayEquals(color, seedColor)) {
        continue;
      }
  
      for (let i = 0; i < 4; i++) {
        graphics.pixels[index+i] = fillColor[0 + i];
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
  
    let seed_index = 4 * (graphics.width * seed.y + seed.x);
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
      let index = 4 * (graphics.width * current.y + current.x);
      //console.log("We think that we are to look at y coord " + current.y + ", x coord " + current.x)
      //console.log("Theoretically, there should be " + 4 * graphics.width * graphics.height + " pixels in graphics. Actually, there are " + graphics.pixels.length)
      //console.log("graphics.width=" + graphics.width + ". graphics.width * p5.pixelDensity=" + graphics.displayWidth*p5.pixelDensity)

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
    console.log("Found new region " + seed_index)
    graphics.updatePixels()
    return [seed_index, region_size]
  }