
export const commands = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
    RED: 'red',
    YELLOW: 'yellow',
    BLUE: 'blue',
    REGIONS: 'regions',
    FILL: 'fill'
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
  ['regions', commands.REGIONS],
  ['fill', commands.FILL],
]);

export function subscribeToVoiceCommands(onCommand) {
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
    
    const socket = new WebSocket(url, ['token', process.env.REACT_APP_DEEPGRAM_API_KEY]);

    // 100 - 1000 sensible range
    const sendInterval_ms = 100;

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
      
      for (const word of words) {
          if (commandWords.has(word)) {
            const command = commandWords.get(word)
            // commands.push(command);
            onCommand(command);
            // check if finalised/overlap
            // (use time)
          }
      }

      // let newCommandLog = commandLog.slice();
      // for (const command of commands) {
      //   // commandQueue.push(command);
      //   newCommandLog.push(command);
      // }
      // setCommandLog(newCommandLog);
    };

    // TODO: return to caller!
    // return () => {
    //   // cleanup
    //   mic.removeEventListener('dataavailable', sendData);
    //   socket.close();
    // }
  }); 
}