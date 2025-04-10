"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = NativeContractsEventDecoder;var _NativeContractsEvents = _interopRequireDefault(require("./NativeContractsEvents"));
var _EventDecoder = _interopRequireDefault(require("../EventDecoder"));
var _bridgeAbi = require("./bridgeAbi");
var _utils = require("../utils");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

function NativeContractsEventDecoder({ bitcoinNetwork, txBlockNumber }) {
  const nativeDecoder = (0, _NativeContractsEvents.default)({ bitcoinNetwork });
  const rskRelease = (0, _bridgeAbi.getRskReleaseByBlockNumber)(txBlockNumber, bitcoinNetwork);
  const ABI = (0, _utils.addSignatureDataToAbi)(rskRelease.abi);
  const solidityDecoder = (0, _EventDecoder.default)(ABI);

  const getEventDecoder = (log) => {
    const { eventABI } = solidityDecoder.getEventAbi([...log.topics]);
    return eventABI ? solidityDecoder : nativeDecoder;
  };
  return Object.freeze({ getEventDecoder });
}
//# sourceMappingURL=NativeContractsDecoder.js.map