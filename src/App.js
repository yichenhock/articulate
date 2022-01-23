import { useState } from 'react';
import { CommandContext } from './components/commandContext.js';
import MainComponent from './components/mainComponent.js'

function App() {
  const [command, setCommand] = useState(null);
  const [currColour, setCurrentColour] = useState([0,0,0]); 
  const [colourToMix, setColourToMix] = useState(['black',null]); // null, true (more), false (less)

  return (
    <CommandContext.Provider value={{command, setCommand, currColour, setCurrentColour, colourToMix, setColourToMix}}>
      <MainComponent/>
    </CommandContext.Provider>
  );
}

export default App;
