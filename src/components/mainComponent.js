import React from 'react';
import CanvasComponent from './canvasComponent';
import GridLines from 'react-gridlines'; 
import TopBarComponent from './topBarComponent';
import './styles.css'
import { CommandContext } from './commandContext';

function MainComponent() {
    return (
    <div className='App'>
      <div className='top-bar'>
        <CommandContext.Consumer>
          {({ command }) => (
            <TopBarComponent cmdText={command}/>
          )}
        </CommandContext.Consumer>
      </div>
      
      <GridLines className="grid-area" cellWidth={120} lineColor={'rgb(60, 60, 60)'} strokeWidth={1} cellWidth2={24} lineColor2={'rgb(60, 60, 60)'}>
        <div className='canvas-area'>

        <CommandContext.Consumer>
          {({ setCommand }) => (
            <CanvasComponent setCommand={setCommand}/>
          )}
        </CommandContext.Consumer>
        </div>
      </GridLines>
    </div>
    );
  }


export default MainComponent; 