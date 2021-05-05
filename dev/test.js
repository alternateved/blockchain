const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
bitcoin.createNewBlock(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf');
bitcoin.createNewBlock(111, 'OIUOEREDHKHKD', '78s97d4x6dsf');
bitcoin.createNewBlock(2889, 'OIUOEREDHKHKD', '78s97d4x6dsf');
console.log(bitcoin);
