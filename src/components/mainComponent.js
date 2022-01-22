import React from 'react';
import CanvasComponent from './canvasComponent';
import GridLines from 'react-gridlines'; 
import TopBarComponent from './topBarComponent';
import './styles.css'

function MainComponent() {
    return (
    <div className='App'>
      <div className='top-bar'>
        <TopBarComponent/>
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