"use strict";var _ContractParser = require("../lib/ContractParser");
var _nod3Connect = require("../lib/nod3Connect");

async function main() {
  const txHash = process.argv[2];

  if (!txHash) {
    console.error('Please provide a transaction hash');
    process.exit(1);
  }

  const network = process.argv[3];

  if (!network) {
    console.error('Please provide a network');
    process.exit(1);
  }

  const nod3 = (0, _nod3Connect.createRskNodeProvider)(network);
  const initConfig = {
    net: {
      id: _nod3Connect.publicRskNodeUrls[network].id
    }
  };

  if (!txHash) {
    console.error('Please provide a transaction hash');
    process.exit(1);
  }

  const parser = new _ContractParser.ContractParser({ nod3, initConfig });
  const txReceipt = await nod3.eth.getTransactionReceipt(txHash);
  const events = parser.parseTxLogs(txReceipt.logs);

  if (events.length !== txReceipt.logs.length) {
    console.error('Number of events does not match number of logs');
    process.exit(1);
  }

  const result = events.map((event, index) => ({ log: txReceipt.logs[index], event }));

  console.dir(result, { depth: null });
}

main();