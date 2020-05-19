"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = NativeContractsEventDecoder;exports.ABI = void 0;var _NativeContractsEvents = _interopRequireDefault(require("./NativeContractsEvents"));
var _EventDecoder = _interopRequireDefault(require("../EventDecoder"));
var _bridge = _interopRequireDefault(require("./bridge.json"));
var _utils = require("../utils");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const ABI = (0, _utils.addSignatureDataToAbi)(_bridge.default);exports.ABI = ABI;

function NativeContractsEventDecoder({ bitcoinNetwork }) {
  const nativeDecoder = (0, _NativeContractsEvents.default)({ bitcoinNetwork });
  const solidityDecoder = (0, _EventDecoder.default)(ABI);

  const getEventDecoder = log => {
    const { eventABI } = solidityDecoder.getEventAbi([...log.topics]);
    return eventABI ? solidityDecoder : nativeDecoder;
  };
  return Object.freeze({ getEventDecoder });
}