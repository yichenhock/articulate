import React, {useState} from 'react';
import CanvasComponent from './canvasComponent';
import GridLines from 'react-gridlines'; 
import TopBarComponent from './topBarComponent';
import ColourPalette from './colourPaletteComponent';
import HelpOverlay from './helpOverlayComponent';
import './styles.css'
import { CommandContext } from './commandContext';

function MainComponent() {

  const [mixing, setMixing] = useState(false); 
  const [helpDisplay, setHelpDisplay] = useState(false); 

  return (
    <div className='App'>
      <div className='top-bar'>
        <CommandContext.Consumer>
          {({ command }) => (
            <TopBarComponent cmdText={command} helpDisplay={helpDisplay} setHelpDisplay={setHelpDisplay}/>
          )}
        </CommandContext.Consumer>
      </div>
      
      <div style={helpDisplay ? {display:'block'} : {display:'none'}}>
          <HelpOverlay/>
      </div>
      
      <div>
        <CommandContext.Consumer>
          {({ command, currColour, colourToMix }) => (
            <ColourPalette colourToMix={colourToMix} currentColour={currColour} command={command}/>
          )}
        </CommandContext.Consumer>

          
      </div>


      <GridLines className="grid-area" cellWidth={120} lineColor={'rgb(60, 60, 60)'} strokeWidth={1} cellWidth2={24} lineColor2={'rgb(60, 60, 60)'}>
        
        
        <div className='canvas-area'>
        <CommandContext.Consumer>
          {({ setCommand, setCurrentColour, setColourToMix }) => (
            <CanvasComponent setCommand={setCommand} setCurrentColour={setCurrentColour} setColourToMix={setColourToMix}/>
          )}
        </CommandContext.Consumer>
        </div>
        


      </GridLines>
    </div>
    );
  }


export default MainComponent; 