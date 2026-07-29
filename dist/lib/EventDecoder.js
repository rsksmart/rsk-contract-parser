"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _utils = require("./utils");
var _rskUtils = require("@rsksmart/rsk-utils");
var _abi = require("@ethersproject/abi");

// ERC-1155 token ids and amounts feed balance reconstruction downstream, so
// they decode to uint256 decimal strings and arrays keep their arity even with
// a single element (generic decoding collapses one-element arrays to a scalar
// and formats numbers as hex)
const ERC1155_EVENT_SIGNATURES = new Set([
(0, _utils.soliditySignature)('TransferSingle(address,address,address,uint256,uint256)'),
(0, _utils.soliditySignature)('TransferBatch(address,address,address,uint256[],uint256[])'),
(0, _utils.soliditySignature)('URI(string,uint256)')]
);

function EventDecoder(abi, logger) {
  const contractInterface = new _abi.Interface((0, _utils.addSignatureDataToAbi)(abi));

  const getEventAbi = (topics) => {
    topics = [...topics];
    const sigHash = (0, _rskUtils.remove0x)(topics.shift());
    const events = abi.filter((i) => {
      const { indexed, signature } = (0, _utils.getSignatureDataFromAbi)(i);
      return signature === sigHash && indexed === topics.length;
    });
    if (events.length > 1) throw new Error('Duplicate events in ABI');
    const eventABI = events[0];
    return { eventABI, topics };
  };

  const formatElement = (type, decoded) => {
    if (decoded._isIndexed) return { _isIndexed: true, hash: decoded.hash };
    if (decoded._isBigNumber) {
      return decoded.toHexString();
    }
    const res = (0, _rskUtils.add0x)(Buffer.isBuffer(decoded) ? (0, _rskUtils.bufferToHex)(decoded) : decoded.toString(16));
    if (type === 'address' || type === 'address[]') return res.toLowerCase();
    return res;
  };

  const encodeElement = (type, decoded) => {
    if (Array.isArray(decoded)) {
      decoded = decoded.map((d) => formatElement(type, d));
      if (decoded.length === 1) decoded = decoded.join();
    } else {
      decoded = formatElement(type, decoded);
    }
    return decoded;
  };

  const formatErc1155Element = (type, decoded) => {
    if (decoded && decoded._isBigNumber) return decoded.toString();
    return formatElement(type, decoded);
  };

  const encodeErc1155Element = (type, decoded) => {
    if (Array.isArray(decoded)) return decoded.map((d) => formatErc1155Element(type, d));
    return formatErc1155Element(type, decoded);
  };

  const decodeLog = (log) => {
    try {
      const { eventFragment, name, args, topic } = contractInterface.parseLog(log);

      const { address } = log;

      const parsedArgs = [];
      const encoder = ERC1155_EVENT_SIGNATURES.has((0, _rskUtils.remove0x)(topic)) ? encodeErc1155Element : encodeElement;

      for (const i in eventFragment.inputs) {
        parsedArgs.push(
          encoder(eventFragment.inputs[i].type, args[i])
        );
      }

      return Object.assign({}, log, {
        signature: (0, _rskUtils.remove0x)(topic),
        event: name,
        address,
        args: parsedArgs,
        abi: JSON.parse(eventFragment.format('json'))
      });
    } catch (e) {
      // temporary fix to avoid ethers "no matching event" error spam
      if (!e.message.includes('no matching event')) {
        logger.error(e);
      }
      return log;
    }
  };

  return Object.freeze({ decodeLog, getEventAbi });
}var _default = exports.default =

EventDecoder;