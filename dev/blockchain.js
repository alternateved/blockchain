const crypto = require('crypto');
const { v1: uuid } = require('uuid');

module.exports = class Blockchain {
  constructor(currentNodeUrl) {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.currentNodeUrl = currentNodeUrl;
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, recipient) {
    return {
      amount,
      sender,
      recipient,
      transactionId: uuid().replace(/[-]/g, ''),
    };
  }

  addTransactionToPendingTransactions(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce + JSON.stringify(currentBlockData);
    const hash = crypto
      .createHash('sha256')
      .update(dataAsString, 'utf8')
      .digest('hex');

    return hash;
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.slice(0, 4) !== '0000') {
      nonce += 1;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  chainIsValid(blockchain) {
    let validChain = true;

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;
    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    for (let i = 1; i < blockchain.length; i += 1) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock['hash'],
        {
          transactions: currentBlock['transactions'],
          index: currentBlock['index'],
        },
        currentBlock['nonce'],
      );
      if (blockHash.slice(0, 4) !== '0000') validChain = false;
      if (currentBlock['previousBlockHash'] !== prevBlock['hash'])
        validChain = false;
    }

    return validChain;
  }

  getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach((block) => {
      if (block.hash === blockHash) correctBlock = block;
    });

    return correctBlock;
  }
};
