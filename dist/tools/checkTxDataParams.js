#!/usr/bin/env node
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _nod = _interopRequireDefault(require("@rsksmart/nod3"));
var _Contract = _interopRequireDefault(require("../lib/Contract.js"));
var _process = require("process");
var _ERC = _interopRequireDefault(require("../lib/jsonAbis/ERC20.json"));
var _utils = require("../lib/utils.js");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
/**
 * Sends a transaction and verifies the txData parameters
 *
 * @param {Object} options Configuration options
 * @param {string} options.rpcUrl RPC URL to connect to
 * @param {string} options.contractAddress Contract address to interact with
 * @param {Object} options.abi Contract ABI
 * @param {string} options.method Method to call
 * @param {Array} options.params Parameters for the method
 * @param {Object} options.txData Transaction data including blockNumber if needed
 */
async function sendTransactionTest(options) {
  const { rpcUrl, contractAddress, abi, method, params = [], txData = {} } = options;
  let blockNumber = options.blockNumber;

  console.log('=== Transaction Test Parameters ===');
  console.log('RPC URL:', rpcUrl);
  console.log('Contract Address:', contractAddress);
  console.log('Method:', method);
  console.log('Params:', params);
  console.log('txData:', JSON.stringify(txData, null, 2));

  try {
    // Initialize nod3
    const nod3 = new _nod.default(new _nod.default.providers.HttpProvider(rpcUrl));

    // Initialize contract
    const contract = new _Contract.default(abi, {
      address: contractAddress,
      nod3
    });

    const data = contract.encodeCall(method, params);
    const to = contractAddress;
    const tx = Object.assign({}, txData, { to, data });

    console.log('\n=== Actual Transaction Sent ===');
    console.log(JSON.stringify(tx, null, 2));

    // Send the transaction
    console.log('\n=== Sending Call ===');

    if (!isNaN(parseInt(blockNumber))) {
      // Convert blockNumber to hex if it's a number
      blockNumber = (0, _utils.toHex)(blockNumber);
    }

    const result = await nod3.eth.call(tx, blockNumber);

    // Decode and display result
    const decodedResult = contract.decodeCall(method, result);
    console.log('\n=== Result ===');
    console.log(decodedResult);

    return { tx, result: decodedResult };
  } catch (err) {
    console.error('\n=== Error ===');
    console.error(err);
    throw err;
  }
}

// Simple CLI when run directly
if (require.main === module) {
  // Default example parameters - replace with your own or implement proper CLI args
  const exampleOptions = {
    rpcUrl: _process.argv[2] || 'http://localhost:4446',
    contractAddress: _process.argv[3] || '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    abi: _ERC.default, // Provide ABI as JSON string or import from file
    method: _process.argv[5] || 'totalSupply',
    params: JSON.parse(_process.argv[6] || '[]'),
    txData: JSON.parse(_process.argv[7] || '{}'),
    blockNumber: _process.argv[8] || '7350282'
  };

  sendTransactionTest(exampleOptions).
  then(() => console.log('\nTest completed successfully')).
  catch((err) => {
    console.error('Test failed:', err.message);
    process.exit(1);
  });
}var _default = exports.default =

sendTransactionTest;

/*

curl -X POST \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_call",
    "params": [
      {
        "to": "0x74C9F2B00581F1b11Aa7Ff05aa9f608B7389de67",
        "data": "0x06fdde03"
      },
      "0x6b0909"
    ]
  }' \
  http://localhost:4446

*/
//# sourceMappingURL=checkTxDataParams.js.map