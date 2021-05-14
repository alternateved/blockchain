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
};
