"use strict";var _ContractParser = _interopRequireDefault(require("../lib/ContractParser"));
var _nod3Connect = require("../lib/nod3Connect");
var _utils = require("../lib/utils");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

async function main() {
  const contractAddress = process.argv[2];
  const blockNumber = process.argv[3];
  const network = process.argv[4];

  let nod3Url = '';
  if (!contractAddress || !network || !blockNumber) {
    console.error('Usage: node getTokenData.js <contractAddress: address> <blockNumber: number|blockTag> <network: testnet|mainnet>');
    process.exit(1);
  }

  if (network !== 'testnet' && network !== 'mainnet') {
    console.error(`Invalid network: ${network}. Must be 'testnet' or 'mainnet'.`);
    process.exit(1);
  }

  if (network === 'testnet') {
    nod3Url = 'https://public-node.testnet.rsk.co';
  } else {
    nod3Url = 'https://public-node.rsk.co';
  }

  const nod3 = (0, _nod3Connect.nod3Connect)(nod3Url);
  const parser = new _ContractParser.default({ nod3 });
  const contract = parser.makeContract(contractAddress);

  const tokenData = await parser.getTokenData(contract, _utils.DEFAULT_TOKEN_METHODS, { blockNumber });
  console.log(tokenData);
}

main();
//# sourceMappingURL=getTokenData.js.map