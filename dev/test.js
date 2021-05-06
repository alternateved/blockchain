const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf');
bitcoin.createNewTransaction(100, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
bitcoin.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2');
// bitcoin.createNewBlock(111, 'OIUOEREDHKHKD', '78s97d4x6dsf');
// bitcoin.createNewBlock(2889, 'OIUOEREDHKHKD', '78s97d4x6dsf');
bitcoin.createNewTransaction(50, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
bitcoin.createNewTransaction(200, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
bitcoin.createNewTransaction(300, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9');
bitcoin.createNewBlock(23232, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2');

const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';
const currentBlockData = [
  {
    amount: 10,
    sender: 'B4CEE9C0E5CD571',
    recipient: '3A3F6E462D48E9',
  },
  {
    amount: 100,
    sender: 'B4CEE9C0E5CD571',
    recipient: '3A3F6E462D48E9',
  },
  {
    amount: 120,
    sender: 'B4CEE9C0E5CD571',
    recipient: '3A3F6E462D48E9',
  },
];
const nonce = 100;
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
