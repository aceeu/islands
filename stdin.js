const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

str = '';

rl.on('line', function(line){
    if (line == '')
        rl.close();
    str = str.concat(line + '\n');
})
rl.on('close', () => console.log(str));
