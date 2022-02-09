import React, { useEffect } from 'react';
import './styles.css'
import './colourMixer.css'

function ColourPalette(props) { // props: mixing (bool), colourToMix: 'black, etc', currentColour

    function Ball(size, colour) {
        this.elem = document.createElement('div');
        this.size = size;
        this.elem.style.width  = size + 'px';
        this.elem.style.height = size + 'px';
        this.elem.style.borderRadius = (size * 0.5) + 'px';
        this.elem.style.position = 'absolute';
        this.elem.style.zIndex = '9';
        this.elem.style.backgroundColor = colour;
        this.elem.style.opacity = '95%';

        this.elem.style['-webkit-transition-property'] = 'background-color, top, left, -webkit-transform';
        this.elem.style['-webkit-transition-duration'] = '.2s';
        this.elem.style['-webkit-transition-timing-function'] = 'ease';

        var circle_to_mix = document.getElementById(colour).getBoundingClientRect();
        this.x = circle_to_mix.x + 25;
        this.y = circle_to_mix.y + 25;

        this.bounceSteps = [2.5, 0.1, 2.4, 0.15, 1.4, 0.6, 1.3, 0.7, 1.2, 0.8, 1.05, 0.95];

        this.render();
        document.body.appendChild( this.elem );
        this.bounce([1.4, 0.6, 1.3, 0.7, 1.2, 0.8, 1.05, 0.95]);
        
        // move the thing over to the mixer thingy
        var mixing_circle = document.getElementById('mixing-circle').getBoundingClientRect();

        this.elem.style.left = (mixing_circle.x + 25 - this.size * 0.5) + 'px';
        this.elem.style.top  = (mixing_circle.y + 25 - this.size * 0.5) + 'px';
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

    function shrinkPalette(){
        var c = ['black', 'red', 'green', 'blue', 'white']
        var grow_circle = document.getElementById('grow-circle');
        var coloured_circles = []
        for (var i=0;i<c.length;i++){
            coloured_circles.push(document.getElementById(c[i]))
        }

        // decrease the size of the palette
        grow_circle.style.height = `${160}px`;
        grow_circle.style.width = `${160}px`;
        grow_circle.style.backgroundColor = 'rgb(29, 29, 29)';
        for (var i=0;i<c.length;i++){
            coloured_circles[i].style.opacity = '0%';
            coloured_circles[i].style.height = '0px';
            coloured_circles[i].style.width = '0px';
        }
    }
 
    function growPalette(){
        var c = ['black', 'red', 'green', 'blue', 'white']
        var grow_circle = document.getElementById('grow-circle');
        var coloured_circles = []
        for (var i=0;i<c.length;i++){
            coloured_circles.push(document.getElementById(c[i]))
        }
        // increase the size of the palette
        grow_circle.style.height = `${400}px`;
        grow_circle.style.width = `${400}px`;
        grow_circle.style.backgroundColor = 'rgb(43, 43, 43)';
        for (var i=0;i<c.length;i++){
            coloured_circles[i].style.opacity = '100%';
            coloured_circles[i].style.height = '50px';
            coloured_circles[i].style.width = '50px';
        }
    };

    useEffect(()=>{
        if (props.command=='mix'){
            growPalette();
        }
    }, [props.command])

    useEffect(()=>{
        console.log(props.colourToMix); // e.g. d['red', true]
        // let timer = null; 
        // let ball;

        if (props.colourToMix[1]==true){ // more
            // do the mixing! 
            // create a ball at the location of the current colour and move it and remove it
            const ball = new Ball(50, props.colourToMix[0])

            let timer = setTimeout(()=>{
                ball.elem.parentElement.removeChild(ball.elem); 
                shrinkPalette();
            },600)
            
            return()=>{
                clearTimeout(timer);
            }

        } else if (props.colourToMix[1]==false){ // or less

            var pulse_circle = document.getElementById('pulse-circle');
            pulse_circle.style.backgroundColor = props.colourToMix[0];
            pulse_circle.style.display = 'block';
            pulse_circle.style.animation = 'pulse 0.5s ease-out';

            let timer = setTimeout(()=>{
                pulse_circle.style.display = 'none';
                pulse_circle.style.animation = 'none';

                shrinkPalette();
            },600)
            
            return()=>{
                clearTimeout(timer);
            }

        } else{ // or just change colour
            shrinkPalette();
        }
        
    },[props.colourToMix]);

    useEffect(()=>{ // props.currentColour = [r,g,b]
        console.log('current colour: ', props.currentColour);
        var mixing_circle = document.getElementById('mixing-circle');
        let r = props.currentColour[0]
        let g = props.currentColour[1]
        let b = props.currentColour[2]
        mixing_circle.style.backgroundColor = `rgb(${r},${g},${b})`
    }, [props.currentColour, props.colourToMix])

    return (
    <div  className='colour-palette'>
        <div className='small-circle' id='mixing-circle'/>
        <div className='pulse-circle' id='pulse-circle'/>
        <div id='grow-circle'>
            {/* black, red, green, blue, white */}
            <div className='small-circle black' id='black'></div>
            <div className='small-circle red' id='red'></div>
            <div className='small-circle green' id='green'></div>
            <div className='small-circle blue' id='blue'></div>
            <div className='small-circle white' id='white'></div>
        </div>
    </div>
    );
  }

export default ColourPalette; 