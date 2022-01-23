import React from 'react';

const defaultValue = {
    command: null,
    setCommand: (command) => {},

    currColour: [0,0,0],
    setCurrentColour: (currColour)=>{},

    colourToMix: ['black', null], 
    setColourToMix: (colourToMix)=>{}
};

export const CommandContext = React.createContext(defaultValue);

CommandContext.displayName = "CommandContext";