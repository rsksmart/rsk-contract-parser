"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.RSK_RELEASES = void 0;exports.getRskReleaseByBlockNumber = getRskReleaseByBlockNumber;var _bridgeOrchid = _interopRequireDefault(require("./bridge-orchid.json"));
var _bridgeWasabi = _interopRequireDefault(require("./bridge-wasabi.json"));
var _bridgePapyrus = _interopRequireDefault(require("./bridge-papyrus.json"));
var _bridgeIris = _interopRequireDefault(require("./bridge-iris.json"));
var _bridgeFingerroot = _interopRequireDefault(require("./bridge-fingerroot.json"));
var _bridgeHop = _interopRequireDefault(require("./bridge-hop.json"));
var _bridgeLovell = _interopRequireDefault(require("./bridge-lovell.json"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const RSK_RELEASES = exports.RSK_RELEASES = {
  mainnet: [
  {
    name: 'orchid',
    height: 0,
    abi: _bridgeOrchid.default
  },
  {
    name: 'wasabi',
    height: 1591000,
    abi: _bridgeWasabi.default
  },
  {
    name: 'papyrus',
    height: 2392700,
    abi: _bridgePapyrus.default
  },
  {
    name: 'iris',
    height: 3614800,
    abi: _bridgeIris.default
  },
  {
    name: 'hop',
    height: 4598500,
    abi: _bridgeHop.default
  },
  {
    name: 'fingerroot',
    height: 5468000,
    abi: _bridgeFingerroot.default
  },
  {
    name: 'lovell',
    height: 7338024,
    abi: _bridgeLovell.default
  }],

  testnet: [
  {
    name: 'wasabi',
    height: 0,
    abi: _bridgeWasabi.default
  },
  {
    name: 'papyrus',
    height: 863000,
    abi: _bridgePapyrus.default
  },
  {
    name: 'iris',
    height: 2060500,
    abi: _bridgeIris.default
  },
  {
    name: 'hop',
    height: 3103000,
    abi: _bridgeHop.default
  },
  {
    name: 'fingerroot',
    height: 4015800,
    abi: _bridgeFingerroot.default
  },
  {
    name: 'lovell',
    height: 6110487,
    abi: _bridgeLovell.default
  }]

};

/**
 * Get the RSK release for a given block number and network.
 * @param {number | string} blockNumber - The block number to get the release for. Default is 'latest'.
 * @param {string} network - The network to get the release for. Can be either "testnet" or "mainnet".
 * @returns {Object} The release for the given block number and network.
 * @example
 * const mainnetRelease = getRskReleaseByBlockNumber(6200000, 'mainnet')
 * console.log(mainnetRelease)
 *
 * // result
 * {
 *   name: 'fingerroot',
 *   height: 5468000,
 *   abi
 * }
 *
 *  const testnetRelease = getRskReleaseByBlockNumber(6200000, 'testnet')
 *  console.log(testnetRelease)
 *
 *  // result
 *  {
 *    name: 'lovell',
 *    height: 6110487,
 *    abi
 *  }
 */
function getRskReleaseByBlockNumber(blockNumber = 'latest', network) {
  if (typeof blockNumber !== 'number' && blockNumber !== 'latest') {
    throw new Error('blockNumber must be a number or "latest"');
  }

  if (!['testnet', 'mainnet'].includes(network)) {
    throw new Error('network must be either "testnet" or "mainnet"');
  }

  const releases = RSK_RELEASES[network];
  const lastIndex = releases.length - 1;

  if (blockNumber === 'latest' || blockNumber >= releases[lastIndex].height) {
    return releases[lastIndex];
  }

  for (let i = 1; i <= lastIndex; i++) {
    const previousRelease = releases[i - 1];
    if (blockNumber >= previousRelease.height && blockNumber < releases[i].height) {
      return previousRelease;
    }
  }
}