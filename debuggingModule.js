const fs = require('fs');

class DebuggingModule {
  constructor(logFilePath = '/data/workspace/debug.log') {
    this.logFilePath = logFilePath;
    this.enableLogging();
  }

  enableLogging() {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.log('ERROR', ...args);
      originalConsoleError.apply(console, args);
    };
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.log('WARN', ...args);
      originalConsoleWarn.apply(console, args);
    };
  }

  log(level, ...args) {
    const timestamp = new Date().toISOString();
    const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    const line = `[${timestamp}] ${level}: ${message}\n`;
    fs.appendFile(this.logFilePath, line, err => {
      if (err) {
        console.error('Failed to write debug log:', err);
      }
    });
  }

  captureError(error) {
    this.log('EXCEPTION', error.stack || error.toString());
  }

  // Hier könnten weitere Debug-Funktionen folgen
}

module.exports = new DebuggingModule();
