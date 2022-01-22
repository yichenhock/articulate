import { useState } from 'react';
import { CommandContext } from './components/commandContext.js';
import MainComponent from './components/mainComponent.js'

function App() {
  const [command, setCommand] = useState(null);
  return (
    <CommandContext.Provider value={{command, setCommand}}>
      <MainComponent/>
    </CommandContext.Provider>
  );
}

export default App;
