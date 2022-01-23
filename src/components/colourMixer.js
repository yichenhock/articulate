var tapEvent = ('touchstart' in window) ? 'touchstart':'mousedown';

function Ball(size) {
  this.elem = document.createElement('div');
  this.size = size;
  this.elem.style.width  = size + 'px';
  this.elem.style.height = size + 'px';
  this.elem.style.borderRadius = (size * 0.5) + 'px';
  this.elem.style.position = 'absolute';
  this.elem.style['-webkit-transition-property'] = 'background-color, top, left, -webkit-transform';
  this.elem.style['-webkit-transition-duration'] = '.2s';
  this.elem.style['-webkit-transition-timing-function'] = 'ease';
  this.x = Math.ceil(window.innerWidth * Math.random());
  this.y = Math.ceil(window.innerHeight * Math.random());
  this.bounceSteps = [2.5, 0.1, 2.4, 0.15, 1.4, 0.6, 1.3, 0.7, 1.2, 0.8, 1.05, 0.95, 1.0];
  this.hue = this.initialHueValue();

  this.setBgColor();
  this.render();
  document.body.appendChild( this.elem );
  this.bounce([1.4, 0.6, 1.3, 0.7, 1.2, 0.8, 1.05, 0.95, 1.0]);
    
  document.addEventListener(tapEvent, this.mousedownHandler.bind(this), false);
}

Ball.prototype.render = function() {
  this.elem.style.left = (this.x - this.size * 0.5) + 'px';
  this.elem.style.top  = (this.y - this.size * 0.5) + 'px';
};

Ball.prototype.bounce = function(bounceSteps) {
  var steps = bounceSteps || this.bounceSteps;
  for (var i=0; i<steps.length; i++) {
    setTimeout(function(id) {
      this.elem.style['-webkit-transform'] = 'scale(' + steps[id] + ')';
    }.bind(this, i), 70*i);
  }
};

Ball.prototype.initialHueValue = function() {
  return Math.floor( Math.random() * 360 );
};

Ball.prototype.setBgColor = function() {
  this.elem.style.backgroundColor = 'hsl(' + this.hue + ', 100%, 50% )';
};

Ball.prototype.mousedownHandler = function( event ) {
  this.x = event.pageX;
  this.y = event.pageY;
  window.requestAnimationFrame(function() {
    this.render();
    this.bounce();
  }.bind(this));
  
  this.mousedownCallback && this.mousedownCallback.call(this);
};

window.onload = function() {
  if (!('webkitRequestAnimationFrame' in window)) { 
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    return false;
  }
  window.balls = [];
  window.balls.push(new Ball(50));
  window.balls.push(new Ball(50));
  
  window.balls[1].mousedownCallback = function() {
    var newBall, firstBall = balls.shift();
    this.hue = (firstBall.hue + this.hue) / 2;
    this.setBgColor();
    
    setTimeout(function() {
      firstBall.elem.parentElement.removeChild(firstBall.elem);
    }, 300);

    setTimeout(function() {
      newBall = new Ball(50);
      newBall.mousedownCallback = this.mousedownCallback;
      this.mousedownCallback = null;
      window.balls.push(newBall);
    }.bind(this), 500);
  };
};
