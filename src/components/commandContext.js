import React from 'react';

const defaultValue = {
    command: null,
    setCommand: (command) => {}
};

export const CommandContext = React.createContext(defaultValue);

CommandContext.displayName = "CommandContext";