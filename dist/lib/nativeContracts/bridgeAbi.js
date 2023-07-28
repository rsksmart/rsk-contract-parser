"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getBridgeAbi = getBridgeAbi;var _bridgeOrchid = _interopRequireDefault(require("./bridge-orchid.json"));
var _bridgeWasabi = _interopRequireDefault(require("./bridge-wasabi.json"));
var _bridgePapyrus = _interopRequireDefault(require("./bridge-papyrus.json"));
var _bridgeIris = _interopRequireDefault(require("./bridge-iris.json"));
var _bridgeFingerroot = _interopRequireDefault(require("./bridge-fingerroot.json"));
var _bridgeHop = _interopRequireDefault(require("./bridge-hop.json"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const RELEASES = {
  mainnet: {
    0: _bridgeOrchid.default,
    1591000: _bridgeWasabi.default,
    2392700: _bridgePapyrus.default,
    3614800: _bridgeIris.default,
    4598500: _bridgeHop.default,
    5468000: _bridgeFingerroot.default },

  testnet: {
    0: _bridgeWasabi.default,
    863000: _bridgePapyrus.default,
    2060500: _bridgeIris.default,
    3103000: _bridgeHop.default,
    4015800: _bridgeFingerroot.default } };



function getBridgeAbi({ txBlockNumber, bitcoinNetwork }) {
  function findMatchingActivationHeight(txHeight, heights) {
    // Finds the highest release activation height that is lower than/equal to the tx's block number, in
    // order to find the ABI that corresponds to the bridge version used at the moment of the transaction.

    let matchingActivationHeight = -1;
    for (let i = 0; i < heights.length; i++) {
      const currentHeight = heights[i];

      if (txHeight >= currentHeight && matchingActivationHeight < currentHeight) {
        matchingActivationHeight = currentHeight;
      }
    }

    return matchingActivationHeight;
  }
  if (isNaN(txBlockNumber) || txBlockNumber < 0) {
    throw new Error('Invalid tx block number');
  } else if (!['testnet', 'mainnet'].includes(bitcoinNetwork)) {
    throw new Error('Invalid bitcoin network');
  }

  const activationHeights = Object.keys(RELEASES[bitcoinNetwork]);

  const matchingActivationHeight = findMatchingActivationHeight(txBlockNumber, activationHeights);

  return RELEASES[bitcoinNetwork][matchingActivationHeight];
}