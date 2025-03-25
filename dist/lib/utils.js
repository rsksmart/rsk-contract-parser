"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.addSignatureDataToAbi = exports.abiSignatureData = exports.abiMethods = exports.abiEvents = void 0;exports.binarySearchNumber = binarySearchNumber;exports.erc165IdFromMethods = exports.erc165Id = void 0;exports.filterEvents = filterEvents;exports.formatAddressFromSlot = formatAddressFromSlot;exports.getSignatureDataFromAbi = exports.getLatestBridgeMethods = exports.getLatestBridgeAbi = exports.getInputsIndexes = exports.getBridgeAddress = void 0;exports.notZero = notZero;exports.soliditySignature = exports.soliditySelector = exports.solidityName = exports.setAbi = exports.removeAbiSignatureData = exports.processInputType = void 0;exports.toHex = toHex;var _rskUtils = require("@rsksmart/rsk-utils");
var _types = require("./types");
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _rskPrecompiledAbis = require("@rsksmart/rsk-precompiled-abis");
var _addresses = require("@rsksmart/rsk-utils/dist/addresses");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const getLatestBridgeAbi = () => {
  try {
    if (!_rskPrecompiledAbis.bridge || !_rskPrecompiledAbis.bridge.abi || !Array.isArray(_rskPrecompiledAbis.bridge.abi)) throw new Error('Invalid Bridge ABI');

    return _rskPrecompiledAbis.bridge.abi;
  } catch (error) {
    console.error(error);
    return [];
  }
};exports.getLatestBridgeAbi = getLatestBridgeAbi;

const getLatestBridgeMethods = () => {
  try {
    const bridgeAbi = getLatestBridgeAbi();
    return bridgeAbi.map(solidityName);
  } catch (error) {
    console.error(error);
    return [];
  }
};exports.getLatestBridgeMethods = getLatestBridgeMethods;

const getBridgeAddress = () => {
  try {
    if (!_rskPrecompiledAbis.bridge || !_rskPrecompiledAbis.bridge.address || !(0, _addresses.isAddress)(_rskPrecompiledAbis.bridge.address)) throw new Error('Invalid Bridge Address');

    return _rskPrecompiledAbis.bridge.address;
  } catch (error) {
    console.error(error);
    return null;
  }
};exports.getBridgeAddress = getBridgeAddress;
const setAbi = (abi) => addSignatureDataToAbi(abi, true);exports.setAbi = setAbi;

const abiEvents = (abi) => abi.filter((v) => v.type === 'event');exports.abiEvents = abiEvents;

const abiMethods = (abi) => abi.filter((v) => v.type === 'function');exports.abiMethods = abiMethods;

const soliditySignature = (name) => (0, _rskUtils.keccak256)(name);exports.soliditySignature = soliditySignature;

const soliditySelector = (signature) => signature.slice(0, 8);exports.soliditySelector = soliditySelector;

const processInputType = (input) => {
  if (input.type !== 'tuple' && !input.type.startsWith('tuple[')) {
    return input.type;
  }

  // Process tuple components
  const componentsTypes = input.components.map((component) => processInputType(component));
  const tupleRepresentation = `(${componentsTypes.join(',')})`;

  // If it's an array of tuples, append the array brackets
  if (input.type.startsWith('tuple[')) {
    const arrayBrackets = input.type.substring(5); // extract the array part: [] for dynamic array, '[number]' for fixed array
    return `${tupleRepresentation}${arrayBrackets}`;
  }

  return tupleRepresentation;
};

/**
 * Returns the solidity name (signature) of the provided function fragment
 * @param {Object} abi - The function fragment
 * @returns {string} The solidity name of the function fragment
 * @example
 * solidityName({
 *   name: 'balanceOf',
 *   inputs: [{ type: 'address' }],
 *   outputs: [{ type: 'uint256' }]
 *   // ...other function fragment fields
 * })
 * // returns 'balanceOf(address)'
 */exports.processInputType = processInputType;
const solidityName = (abi) => {
  let { name, inputs } = abi;
  inputs = inputs ? inputs.map((i) => processInputType(i)) : [];
  return name ? `${name}(${inputs.join(',')})` : null;
};exports.solidityName = solidityName;

const removeAbiSignatureData = (abi) => {
  abi = Object.assign({}, abi);
  if (undefined !== abi[_types.ABI_SIGNATURE]) delete abi[_types.ABI_SIGNATURE];
  return abi;
};exports.removeAbiSignatureData = removeAbiSignatureData;

const getInputsIndexes = (abi) => {
  const { inputs } = abi;
  return inputs && abi.type === 'event' ? inputs.map((i) => i.indexed) : [];
};exports.getInputsIndexes = getInputsIndexes;

const abiSignatureData = (abi) => {
  const method = solidityName(abi);
  const signature = method ? soliditySignature(method) : null;
  const index = getInputsIndexes(abi);
  const indexed = index ? index.filter((i) => i === true).length : 0;
  let eventSignature = null;
  if (method && abi.type === 'event') {
    eventSignature = soliditySignature(`${method}${Buffer.from(index).toString('hex')}`);
  }
  return { method, signature, index, indexed, eventSignature };
};exports.abiSignatureData = abiSignatureData;

const addSignatureDataToAbi = (abi, skip) => {
  if (!Array.isArray(abi)) {
    throw new Error('ABI must be an array');
  }

  abi.forEach((value) => {
    if (!value[_types.ABI_SIGNATURE] || !skip) {
      value[_types.ABI_SIGNATURE] = abiSignatureData(value);
    }
  });
  return abi;
};exports.addSignatureDataToAbi = addSignatureDataToAbi;

const erc165Id = (selectors) => {
  const id = selectors.map((s) => Buffer.from(s, 'hex')).
  reduce((a, bytes) => {
    for (let i = 0; i < _types.INTERFACE_ID_BYTES; i++) {
      a[i] = a[i] ^ bytes[i];
    }
    return a;
  }, Buffer.alloc(_types.INTERFACE_ID_BYTES));
  return (0, _rskUtils.add0x)(id.toString('hex'));
};exports.erc165Id = erc165Id;

const erc165IdFromMethods = (methods) => {
  return erc165Id(methods.map((m) => soliditySelector(soliditySignature(m))));
};exports.erc165IdFromMethods = erc165IdFromMethods;

const getSignatureDataFromAbi = (abi) => {
  return abi[_types.ABI_SIGNATURE];
};exports.getSignatureDataFromAbi = getSignatureDataFromAbi;

function filterEvents(abi) {
  const type = 'event';
  // get events from ABI
  const events = abi.filter((a) => a.type === type);
  // remove events from ABI
  abi = abi.filter((a) => a.type !== type);
  const keys = [...new Set(events.map((e) => e[_types.ABI_SIGNATURE].eventSignature))];
  const filteredEvents = keys.map((k) => events.find((e) => e[_types.ABI_SIGNATURE].eventSignature === k));
  abi = abi.concat(filteredEvents);
  return abi;
}

function filterArr(a) {
  if (!Array.isArray(a)) return a;
  return a.find((x) => filterArr(x));
}

async function binarySearchNumber(searchCb, high, low) {
  try {
    high = parseInt(high || 0);
    low = parseInt(low || 0);
    if (typeof searchCb !== 'function') throw new Error('SeachCb must be a function');
    const [l, h] = await Promise.all([low, high].map((b) => searchCb(b)));
    if (l !== h) {
      if (high === low + 1) {
        return high;
      } else {
        const mid = Math.floor(high / 2 + low / 2);
        const res = await Promise.all([
        binarySearchNumber(searchCb, high, mid),
        binarySearchNumber(searchCb, mid, low)]);
        return filterArr(res);
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

function notZero(value) {
  if (typeof value === 'string' && /^0x[0-9a-f]*$/i.test(value)) {
    return !(0, _bignumber.default)(value).isZero();
  }

  return false;
}

function formatAddressFromSlot(slot) {
  if (typeof slot === 'string') {
    return `0x${slot.slice(-40)}`;
  }
  return slot;
}

/**
 * Converts a number to a hex string.
 * @param {number} number - The number to convert
 * @returns {string} The hex string
 */
function toHex(number) {
  if (typeof number === 'number') {
    return '0x' + number.toString(16);
  }

  return number;
}
//# sourceMappingURL=utils.js.map