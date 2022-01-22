import React, { useEffect } from 'react'

const commands = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
    RED: 'red',
    YELLOW: 'yellow',
    BLUE: 'blue'
};

const commandWords = new Map([
  ['right', commands.RIGHT],
  ['write', commands.RIGHT],
  ['left', commands.LEFT],
  ['up', commands.UP],
  ['down', commands.DOWN],
  ['red', commands.RED],
  ['yellow', commands.YELLOW],
  ['blue', commands.BLUE],
]);

// TODO: pass to pj5s
let commandQueue = [];

function VoiceCommandComponent() {
  useEffect(() => {
    // more boilerplate to support safari
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!MediaRecorder.isTypeSupported('audio/webm')) return alert('Browser not supported');
      const mic = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      // TODO: allow choosing language
      // utterances?
      // diarize for multiple speakers
      // use search? (25 terms max)
      // use keywords?
      // don't provide interim results?
      // punctuate?

      const keywords = [...commandWords.keys()];

      const baseUrl = 'wss://api.deepgram.com/v1/listen';
      const params = new URLSearchParams([
        ['language', 'en-GB']
      ] 
      // + keywords.map((keyword) => ['keyword', keyword])
      );

      const url = baseUrl + '?' + params.toString();
      console.log(url);
      
      const socket = new WebSocket(url, ['token', DEEPGRAM_KEY]);

      // 100 - 1000 sensible range
      const sendInterval_ms = 250;

      const sendData = event => socket.send(event.data);
      socket.onopen = () => {
        mic.addEventListener('dataavailable', sendData);
        mic.start(sendInterval_ms);
      };

      socket.onmessage = message => {
        const received = JSON.parse(message.data);
        const alt0 = received.channel.alternatives[0];
        const transcript = alt0.transcript;
        console.log(transcript);
        const words = alt0.words.map((word) => word.word);
        let commands = [];
        
        for (const word of words) {
          if (commandWords.has(word)) {
            commands.push(commandWords.get(word));
            // check if finalised/overlap
            // (use time)
          }
        }

        for (const command of commands) {
          commandQueue.push(command);
        }

      };
 
      return () => {
        // cleanup
        mic.removeEventListener('dataavailable', sendData);
        socket.close();
      }
    }); 
  });

  // return something?
  return <p>TODO</p>;
}

export default VoiceCommandComponent;