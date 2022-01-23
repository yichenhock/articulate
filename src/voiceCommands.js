import { insertFindingOccurrence } from "./occurences";

export const commands = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  GO: 'go',
  STOP: 'stop',
  PAINT: 'paint',
  MOVE: 'move',
  QUICK: 'quick',
  SLOW: 'slow',
  BOLD: 'bold',
  SHRINK: 'shrink',
  MORE: 'more',
  LESS: 'less',
  MIX: 'mix',
  BLACK: 'black',
  WHITE: 'white',
  CLEAR: 'clear',
  SAVE: 'save',
  REGIONS: 'regions',
  FILL: 'fill',
  ZERO: 'zero',
  ONE: 'one',
  TWO: 'two',
  THREE: 'three',
  FOUR: 'four',
  FIVE: 'five',
  SIX: 'six',
  HELP: 'help',
  CLOSE: 'close'
};


const commandWords = new Map([
  ['right', commands.RIGHT],
  ['left', commands.LEFT],
  ['up', commands.UP],
  ['upwards', commands.UP],
  ['down', commands.DOWN],
  ['red', commands.RED],
  ['green', commands.GREEN],
  ['blue', commands.BLUE],
  ['go', commands.GO],
  ['stop', commands.STOP],
  ['paint', commands.PAINT],
  ['move', commands.MOVE],
  ['quick', commands.QUICK],
  ['slow', commands.SLOW],
  ['bold', commands.BOLD],
  ['shrink', commands.SHRINK],
  ['more', commands.MORE],
  ['less', commands.LESS],
  ['mix', commands.MIX],
  ['black', commands.BLACK],
  ['white', commands.WHITE],
  ['clear', commands.CLEAR],
  ['save', commands.SAVE],
  ['regions', commands.REGIONS],
  ['fill', commands.FILL],
  ['flood', commands.FILL],
  ['zero', commands.ZERO],
  ['one', commands.ONE],
  ['two', commands.TWO],
  ['three', commands.THREE],
  ['four', commands.FOUR],
  ['five', commands.FIVE],
  ['six', commands.SIX],
  ['seven', commands.SEVEN],
]);


export function subscribeToVoiceCommands(onCommand) {
  // TODO: more boilerplate to support safari
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    if (!MediaRecorder.isTypeSupported('audio/webm')) return alert('Browser not supported');
    const mic = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    // 100 - 1000 sensible range
    const sendInterval_ms = 100;

    // {command: occurrences}
    let firedCommands = new Map();

    // TODO: allow choosing language
    // utterances?
    // diarize for multiple speakers
    // use search? (25 terms max)
    // use keywords?
    // don't provide interim results?
    // punctuate?

    const listenForKeywords = (keywords, apiKey, i) => {
      const baseUrl = 'wss://api.deepgram.com/v1/listen';
      const paramsList = [
        ['language', 'en-GB'],
      ].concat(keywords.map((keyword) => ['search', keyword]));
      const params = new URLSearchParams(paramsList);

      const url = baseUrl + '?' + params.toString();
      console.log(`${i}: ${url}`);

      const socket = new WebSocket(url, ['token', apiKey]);

      socket.onmessage = message => {
        const received = JSON.parse(message.data);
        const alt0 = received.channel.alternatives[0];
        const search = received.channel.search;

        const transcript = alt0.transcript;
        console.log(`tr${i}: ${transcript}`);

        if (!search) return;
        for (const result of search) {
          const word = result.query;
          const command = commandWords.get(word);

          if (!firedCommands.has(command)) {
            firedCommands.set(command, []);
          }
          const commandOccurrences = firedCommands.get(command);
          for (const hit of result.hits) {
            if (hit.confidence < 0.8) continue;

            const occurrence = { start: hit.start, end: hit.end };

            const seen = insertFindingOccurrence(occurrence, commandOccurrences);
            if (seen) continue;
            console.log(`${i}: ${word} @ ${hit.start} - ${hit.end} (${hit.snippet})`);
            onCommand(command);
          }
        }
      };

      return socket;

    };

    const keywords = [...commandWords.keys()];
    let socketKeywords = [[], []];
    for (let i = 0; i < keywords.length; i++) {
      socketKeywords[i % 2].push(keywords[i]);
    }

    let open1 = false;
    let open2 = false;
    const socket1 = listenForKeywords(socketKeywords[0], process.env.REACT_APP_DEEPGRAM_API_KEY, 1)
    const socket2 = listenForKeywords(socketKeywords[1], process.env.REACT_APP_DEEPGRAM_API_KEY_2, 2)

    const sendData = event => {
      socket1.send(event.data)
      socket2.send(event.data)
    };
    socket1.onopen = () => {
      open1 = true;
      if (open2) {
        mic.addEventListener('dataavailable', sendData);
        mic.start(sendInterval_ms);
      }
    };
    socket2.onopen = () => {
      open2 = true;
      if (open1) {
        mic.addEventListener('dataavailable', sendData);
        mic.start(sendInterval_ms);
      }
    };

    // TODO: return to caller!
    // return () => {
    //   // cleanup
    //   mic.removeEventListener('dataavailable', sendData);
    //   socket.close();
    // }
  });
}