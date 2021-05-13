const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid');
const express = require('express');
const fetch = require('node-fetch');

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
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
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
  res.json({ note: 'New block mined succesfully', block: newBlock });
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
      body: JSON.stringify(newNodeUrl),
    };
    regNodesPromises.push(fetch(url, fetchOptions));
  });

  // register all of network nodes already present with new node
  Promise.all(regNodesPromises)
    .then((data) => {
      console.log(data);
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

app.post('/register-nodes-bulk', function (req, res) {});

app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.' });
});
app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
