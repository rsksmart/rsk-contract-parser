"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _ethereumjsAbi = _interopRequireDefault(require("ethereumjs-abi"));
var _utils = require("./utils");
var _types = require("./types");
var _rskUtils = require("rsk-utils");
var _buffer = require("buffer");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function EventDecoder(abi) {

  abi = (0, _utils.addSignatureDataToAbi)(abi);

  const formatDecoded = decoded => {
    let encoding = _buffer.Buffer.isBuffer(decoded) ? 'hex' : 16;
    return (0, _rskUtils.add0x)(decoded.toString(encoding));
  };

  const getEventName = topics => {
    const sigHash = (0, _rskUtils.remove0x)(topics.shift());
    let events = abi.filter(i => {
      let { indexed, signature } = i[_types.ABI_SIGNATURE];
      return signature === sigHash && indexed === topics.length;
    });
    if (events.length > 1) throw new Error('Duplicate events in ABI');
    const eventABI = events[0];
    return { eventABI, topics };
  };

  const decodeElement = (data, types) => formatDecoded(_ethereumjsAbi.default.rawDecode(types, (0, _rskUtils.toBuffer)(data)));

  const decodeData = (data, types) => {
    let decoded = _ethereumjsAbi.default.rawDecode(types, (0, _rskUtils.toBuffer)(data));
    return decoded.map(d => formatDecoded(d));
  };
  const decodeLog = log => {
    log = Object.assign({}, log);
    const { eventABI, topics } = getEventName(log.topics);
    const { address } = log;
    if (!eventABI) return log;
    const event = eventABI.name;
    let args = topics.map((topic, index) => decodeElement(topic, [eventABI.inputs[index].type]));
    const dataDecoded = decodeData(log.data, eventABI.inputs.filter(i => i.indexed === false).map(i => i.type));
    args = args.concat(dataDecoded);
    return Object.assign(log, { event, address, args, abi: eventABI });
  };
  return Object.freeze({ decodeLog });
}var _default =

EventDecoder;exports.default = _default;