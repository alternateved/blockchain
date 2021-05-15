const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

/* const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1621105506675,
      transactions: [],
      nonce: 100,
      hash: '0',
      previousBlockHash: '0',
    },
    {
      index: 2,
      timestamp: 1621105593289,
      transactions: [],
      nonce: 18140,
      hash: '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100',
      previousBlockHash: '0',
    },
    {
      index: 3,
      timestamp: 1621105594600,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'a9d19b90b5b011eb92e121f9f2bad708',
          transactionId: 'a9d51e00b5b011eb92e121f9f2bad708',
        },
      ],
      nonce: 81770,
      hash: '00003882b3a3d655e9060ae7a09f17c6aaa0e7f6e7686a94165e1e56972e1eea',
      previousBlockHash:
        '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100',
    },
    {
      index: 4,
      timestamp: 1621105600772,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'aa99a680b5b011eb92e121f9f2bad708',
          transactionId: 'aa99f4a0b5b011eb92e121f9f2bad708',
        },
        {
          amount: 520,
          sender: 'ALEXHT845SJ5TKCJ2',
          recipient: 'JENN5BG5DF6HT8NG9',
        },
        {
          amount: 520,
          sender: 'ALEXHT845SJ5TKCJ2',
          recipient: 'JENN5BG5DF6HT8NG9',
        },
        {
          amount: 520,
          sender: 'ALEXHT845SJ5TKCJ2',
          recipient: 'JENN5BG5DF6HT8NG9',
        },
      ],
      nonce: 13050,
      hash: '00004675d5af2eec35b7be0ec52920b862a78ff6bbea7af598fcda19268bd37b',
      previousBlockHash:
        '00003882b3a3d655e9060ae7a09f17c6aaa0e7f6e7686a94165e1e56972e1eea',
    },
    {
      index: 5,
      timestamp: 1621105601844,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ae476c40b5b011eb92e121f9f2bad708',
          transactionId: 'ae47e170b5b011eb92e121f9f2bad708',
        },
      ],
      nonce: 99594,
      hash: '000020ef57b1bfaba141c70999073a6d3c389c1a11235eede5b128b819170cc6',
      previousBlockHash:
        '00004675d5af2eec35b7be0ec52920b862a78ff6bbea7af598fcda19268bd37b',
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: '00',
      recipient: 'aeeaff40b5b011eb92e121f9f2bad708',
      transactionId: 'aeeb4d60b5b011eb92e121f9f2bad708',
    },
  ],
  networkNodes: [],
  currentNodeUrl: 'http://localhost:3001',
}; 
console.log('VALID:', bitcoin.chainIsValid(bc1.chain));
*/

/* 
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
console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
 */
