"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.RELEASES = void 0;exports.getBridgeAbiByBlockNumber = getBridgeAbiByBlockNumber;var _bridgeOrchid = _interopRequireDefault(require("./bridge-orchid.json"));
var _bridgeWasabi = _interopRequireDefault(require("./bridge-wasabi.json"));
var _bridgePapyrus = _interopRequireDefault(require("./bridge-papyrus.json"));
var _bridgeIris = _interopRequireDefault(require("./bridge-iris.json"));
var _bridgeFingerroot = _interopRequireDefault(require("./bridge-fingerroot.json"));
var _bridgeHop = _interopRequireDefault(require("./bridge-hop.json"));
var _bridgeLovell = _interopRequireDefault(require("./bridge-lovell.json"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const RELEASES = exports.RELEASES = {
  mainnet: [
  { height: 0, abi: _bridgeOrchid.default },
  { height: 1591000, abi: _bridgeWasabi.default },
  { height: 2392700, abi: _bridgePapyrus.default },
  { height: 3614800, abi: _bridgeIris.default },
  { height: 4598500, abi: _bridgeHop.default },
  { height: 5468000, abi: _bridgeFingerroot.default },
  { height: 7338024, abi: _bridgeLovell.default }],

  testnet: [
  { height: 0, abi: _bridgeWasabi.default },
  { height: 863000, abi: _bridgePapyrus.default },
  { height: 2060500, abi: _bridgeIris.default },
  { height: 3103000, abi: _bridgeHop.default },
  { height: 4015800, abi: _bridgeFingerroot.default },
  { height: 6110487, abi: _bridgeLovell.default }]

};

function getMatchingBridgeAbi(blockNumber, abisWithHeight) {
  const lastIndex = abisWithHeight.length - 1;

  if (blockNumber === 'latest') {
    return abisWithHeight[lastIndex].abi;
  }

  if (blockNumber >= abisWithHeight[lastIndex].height) {
    return abisWithHeight[lastIndex].abi;
  }

  for (let i = 1; i <= lastIndex; i++) {
    const previous = abisWithHeight[i - 1];
    if (blockNumber >= previous.height && blockNumber < abisWithHeight[i].height) {
      return previous.abi;
    }
  }
}

/**
 * Get the bridge ABI for a given block number and network.
 * @param {number | string} blockNumber - The block number to get the ABI for. Default is 'latest'.
 * @param {string} network - The network to get the ABI for. Can be either "testnet" or "mainnet".
 * @returns {any[]} The ABI for the given block number and network.
 */
function getBridgeAbiByBlockNumber(blockNumber = 'latest', network) {
  if (typeof blockNumber !== 'number' && blockNumber !== 'latest') {
    throw new Error('blockNumber must be a number or "latest"');
  }

  if (!['testnet', 'mainnet'].includes(network)) {
    throw new Error('network must be either "testnet" or "mainnet"');
  }

  return getMatchingBridgeAbi(blockNumber, RELEASES[network]);
}
//# sourceMappingURL=bridgeAbi.js.map