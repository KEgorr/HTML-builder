const path = require('path');
const fs = require('fs');

const textpath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(textpath ,'utf-8');
readableStream.on('data', chunk => console.log(chunk));