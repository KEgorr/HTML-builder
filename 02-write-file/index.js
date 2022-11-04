const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

process.stdin.resume();

const text = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст\n');

stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    console.log('Запись в файл окончена');
    process.exit();
  }
  else {text.write(data);
  }
});

process.on( 'SIGINT', function() {
  console.log('Запись в файл окончена');
  process.exit();
});