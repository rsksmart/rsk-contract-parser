"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.publicRskNodeUrls = exports.nod3Connect = exports.default = exports.createRskNodeProvider = void 0;var _nod = _interopRequireDefault(require("@rsksmart/nod3"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const nod3Connect = (url) => {
  url = url || process.env.RSK_NODE_URL || 'http://localhost:4444';
  return new _nod.default(
    new _nod.default.providers.HttpProvider(url)
  );
};

// Default network URLs
exports.nod3Connect = nod3Connect;const publicRskNodeUrls = exports.publicRskNodeUrls = {
  mainnet: {
    url: 'https://public-node.rsk.co',
    id: '30'
  },
  testnet: {
    url: 'https://public-node.testnet.rsk.co',
    id: '31'
  }
};

const createRskNodeProvider = (network, customUrl) => {
  if (!['mainnet', 'testnet'].includes(network)) {
    throw new Error("Network must be either 'mainnet' or 'testnet'");
  }

  // Use custom URL if provided, otherwise use default
  const url = customUrl || publicRskNodeUrls[network].url;
  const provider = new _nod.default.providers.HttpProvider(url);
  return new _nod.default(provider);
};exports.createRskNodeProvider = createRskNodeProvider;var _default = exports.default =

nod3Connect();
//# sourceMappingURL=nod3Connect.js.map