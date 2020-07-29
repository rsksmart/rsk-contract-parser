"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _ethereumjsAbi = _interopRequireDefault(require("ethereumjs-abi"));
var _utils = require("./utils");
var _rskUtils = require("rsk-utils");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function EventDecoder(abi) {
  abi = (0, _utils.addSignatureDataToAbi)(abi);

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
    let decoded = _ethereumjsAbi.default.rawDecode(types, (0, _rskUtils.toBuffer)(data));
    if (Array.isArray(decoded)) {
      decoded = decoded.map(d => formatDecoded(d));
      if (decoded.length === 1) decoded = decoded.join();
    } else {
      decoded = formatDecoded(decoded);
    }
    return decoded;
  };

  const decodeData = (data, types) => {
    let decoded = _ethereumjsAbi.default.rawDecode(types, (0, _rskUtils.toBuffer)(data));
    return decoded.map(d => formatDecoded(d));
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