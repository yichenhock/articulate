import React, {useState} from 'react';
import CanvasComponent from './canvasComponent';
import GridLines from 'react-gridlines'; 
import TopBarComponent from './topBarComponent';
import ColourPalette from './colourPaletteComponent';
import HelpOverlay from './helpOverlayComponent';
import './styles.css'

function MainComponent() {

  const [mixing, setMixing] = useState(false); 

  const [helpDisplay, setHelpDisplay] = useState(false); 

  return (
    <div className='App'>
      <div className='top-bar'>
        <TopBarComponent cmdText='' helpDisplay={helpDisplay} setHelpDisplay={setHelpDisplay}/>
      </div>
      
      <div style={helpDisplay ? {display:'block'} : {display:'none'}}>
          <HelpOverlay/>
      </div>
      
      <div>
          <ColourPalette mixing={mixing} colourToMix={'white'} currentColour={[60,58,100]}/>
        </div>
      <GridLines className="grid-area" cellWidth={120} lineColor={'rgb(60, 60, 60)'} strokeWidth={1} cellWidth2={24} lineColor2={'rgb(60, 60, 60)'}>
        
        
        <div className='canvas-area'>
          <CanvasComponent/>
        </div>
        


      </GridLines>
    </div>
    );
  }


export default MainComponent; 