import { useState } from 'react';
import { CommandContext } from './components/commandContext.js';
import MainComponent from './components/mainComponent.js'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: [
      'Comfortaa',
    ].join(','),
  },
});

function App() {
  const [command, setCommand] = useState(null);
  const [currColour, setCurrentColour] = useState([0,0,0]); 
  const [colourToMix, setColourToMix] = useState(['black',null]); // null, true (more), false (less)

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CommandContext.Provider value={{command, setCommand, currColour, setCurrentColour, colourToMix, setColourToMix}}>
        <MainComponent/>
      </CommandContext.Provider>
    </ThemeProvider>
  );
}

export default App;
