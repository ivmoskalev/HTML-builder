const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');
readStream.on('data', (chunk) => stdout.write(chunk));
