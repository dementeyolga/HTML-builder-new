const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'input.txt'));

stdout.write('please, enter some text\n');

process.on('SIGINT', () => process.exit()); // CTRL+C

process.on('exit', () => stdout.write('Bye bye!'));

stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  }
  writeStream.write(data);
});
