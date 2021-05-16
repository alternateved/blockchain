const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid');
const express = require('express');
const fetch = require('node-fetch');
const { json } = require('express');

const port = process.argv[2];
const currentNodeUrl = process.argv[3];

const app = express();
const bitcoin = new Blockchain(currentNodeUrl);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post('/transaction/broadcast', function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  // broadcast new transaction to all other nodes in the network
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/transaction';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    };

    requestPromises.push(fetch(url, requestOptions));
  });

  Promise.all(requestPromises).then(() =>
    res.json({ note: 'Transaction created and broadcasted successfully.' }),
  );
});

app.get('/mine', function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce,
  );
  const nodeAddress = uuid().replace(/[-]/g, '');
  bitcoin.createNewTransaction(12.5, '00', nodeAddress);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/receive-new-block';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newBlock }),
    };

    requestPromises.push(fetch(url, requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      const url = bitcoin.currentNodeUrl + '/transaction/broadcast';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 12.5,
          sender: '00',
          recipient: nodeAddress,
        }),
      };

      return fetch(url, requestOptions);
    })
    .then((data) => {
      res.json({
        note: 'New block mined & broadcasted successfully',
        block: newBlock,
      });
    });
});

app.post('/receive-new-block', function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({ note: 'New block received and accepted.', newBlock });
  } else {
    res.json({ note: 'New block rejected.', newBlock });
  }
});

app.post('/register-and-broadcast-node', function (req, res) {
  // register new node with the current node
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1)
    bitcoin.networkNodes.push(newNodeUrl);

  // broadcast new node to the rest of the nodes in network
  const regNodesPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/register-node';
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newNodeUrl }),
    };

    regNodesPromises.push(fetch(url, fetchOptions));
  });

  // register all of network nodes already present with new node
  Promise.all(regNodesPromises)
    .then((data) => {
      const url = newNodeUrl + '/register-nodes-bulk';
      const bulkRegisterOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        }),
      };

      return fetch(url, bulkRegisterOptions);
    })
    .then(() => {
      res.json({ note: 'New node registered with network successfully.' });
    });
});

app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      bitcoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: 'Bulk registration successful.' });
});

app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.' });
});

app.get('/consensus', function (req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + '/blockchain';
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    requestPromises.push(
      fetch(url, requestOptions).then((response) => response.json()),
    );
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;
    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: 'Current chain has not been replaced',
        chain: bitcoin.chain,
      });
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({ note: 'This chain has been replaced', chain: bitcoin.chain });
    }
  });
});

app.get('/block/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({ block: correctBlock });
});

app.get('/transaction/:transactionId', function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block,
  });
});

app.get('/address/:address', function (req, res) {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  res.json({
    addressData: addressData,
  });
});

app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
