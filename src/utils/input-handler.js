const readline = require('node:readline');

class InputHandler {
  constructor() {
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY)
      process.stdin.setRawMode(true);
  }

  setHandler(handler) {
    process.stdin.on('keypress', handler);
  }
}

module.exports = InputHandler;