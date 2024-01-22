const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  terminal: false,
});

const exitProcess = () => {
  stdout.write('\nBye!\n');
  exit();
};

stdout.write('Welcome! Type your input (type "exit" to quit):\n');

rl.on('line', (input) => {
  if (input === 'exit') {
    exitProcess();
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', exitProcess);
