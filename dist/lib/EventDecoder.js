"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _utils = require("./utils");
var _rskUtils = require("@rsksmart/rsk-utils");
var _web3EthAbi = _interopRequireDefault(require("web3-eth-abi"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function EventDecoder(abi) {
  abi = (0, _utils.addSignatureDataToAbi)(abi);

  const rawDecode = (types, data) => {
    const decoded = _web3EthAbi.default.decodeParameters(types, data);
    delete decoded['__length__'];
    const arrDecoded = Object.keys(decoded).map(key => decoded[key]);
    return arrDecoded;
  };

  const formatDecoded = decoded => {
    return (0, _rskUtils.add0x)(Buffer.isBuffer(decoded) ? (0, _rskUtils.bufferToHex)(decoded) : decoded.toString(16));
  };

  const getEventAbi = topics => {
    topics = [...topics];
    const sigHash = (0, _rskUtils.remove0x)(topics.shift());
    let events = abi.filter(i => {
      let { indexed, signature } = (0, _utils.getSignatureDataFromAbi)(i);
      return signature === sigHash && indexed === topics.length;
    });
    if (events.length > 1) throw new Error('Duplicate events in ABI');
    const eventABI = events[0];
    return { eventABI, topics };
  };

  const decodeElement = (data, types) => {
    try {
      let decoded = rawDecode(types, data);
      if (Array.isArray(decoded)) {
        decoded = decoded.map(d => formatDecoded(d).toLowerCase());
        if (decoded.length === 1) decoded = decoded.join();
      } else {
        decoded = formatDecoded(decoded);
      }
      return decoded;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  const decodeData = (data, types) => {
    try {
      let decoded = rawDecode(types, data);
      return decoded.map(d => formatDecoded(d).toLowerCase());
    } catch (e) {
      console.log(e);
      return [''];
    }
  };

  const decodeLog = log => {
    log = Object.assign({}, log);
    const { eventABI, topics } = getEventAbi(log.topics);
    const { address } = log;
    if (!eventABI) return log;
    const { name } = eventABI;
    const { signature } = (0, _utils.getSignatureDataFromAbi)(eventABI);
    const { inputs } = eventABI;
    const indexedInputs = inputs.filter(i => i.indexed === true);
    let decodedTopics = topics.map((topic, index) => decodeElement(topic, [indexedInputs[index].type]));
    const decodedData = decodeData(log.data, inputs.filter(i => i.indexed === false).map(i => i.type));
    const args = [];
    for (let input of inputs) {
      args.push(input.indexed ? decodedTopics.shift() : decodedData.shift());
    }
    return Object.assign(log, { event: name, address, args, abi: eventABI, signature });
  };
  return Object.freeze({ decodeLog, getEventAbi });
}var _default =

EventDecoder;exports.default = _default;