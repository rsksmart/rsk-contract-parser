"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getSignatureDataFromAbi = exports.erc165IdFromMethods = exports.erc165Id = exports.addSignatureDataToAbi = exports.abiSignatureData = exports.getInputsIndexes = exports.removeAbiSignatureData = exports.solidityName = exports.soliditySelector = exports.soliditySignature = exports.abiMethods = exports.abiEvents = exports.setAbi = void 0;var _rskUtils = require("rsk-utils");
var _types = require("./types");

const setAbi = abi => addSignatureDataToAbi(abi, true);exports.setAbi = setAbi;

const abiEvents = abi => abi.filter(v => v.type === 'event');exports.abiEvents = abiEvents;

const abiMethods = abi => abi.filter(v => v.type === 'function');exports.abiMethods = abiMethods;

const soliditySignature = name => (0, _rskUtils.keccak256)(name);exports.soliditySignature = soliditySignature;

const soliditySelector = signature => signature.slice(0, 8);exports.soliditySelector = soliditySelector;

const solidityName = abi => {
  let { name, inputs } = abi;
  inputs = inputs ? inputs.map(i => i.type) : [];
  return name ? `${name}(${inputs.join(',')})` : null;
};exports.solidityName = solidityName;

const removeAbiSignatureData = abi => {
  abi = Object.assign({}, abi);
  if (undefined !== abi[_types.ABI_SIGNATURE]) delete abi[_types.ABI_SIGNATURE];
  return abi;
};exports.removeAbiSignatureData = removeAbiSignatureData;

const getInputsIndexes = abi => {
  let { inputs } = abi;
  return inputs && abi.type === 'event' ? inputs.map(i => i.indexed) : null;
};exports.getInputsIndexes = getInputsIndexes;

const abiSignatureData = abi => {
  let method = solidityName(abi);
  let signature = method ? soliditySignature(method) : null;
  let index = getInputsIndexes(abi);
  let indexed = index ? index.filter(i => i === true).length : 0;
  return { method, signature, index, indexed };
};exports.abiSignatureData = abiSignatureData;

const addSignatureDataToAbi = (abi, skip) => {
  abi.map((value, i) => {
    if (!value[_types.ABI_SIGNATURE] || !skip) {
      value[_types.ABI_SIGNATURE] = abiSignatureData(value);
    }
  });
  return abi;
};exports.addSignatureDataToAbi = addSignatureDataToAbi;

const erc165Id = selectors => {
  let id = selectors.map(s => Buffer.from(s, 'hex')).
  reduce((a, bytes) => {
    for (let i = 0; i < _types.INTERFACE_ID_BYTES; i++) {
      a[i] = a[i] ^ bytes[i];
    }
    return a;
  }, Buffer.alloc(_types.INTERFACE_ID_BYTES));
  return (0, _rskUtils.add0x)(id.toString('hex'));
};exports.erc165Id = erc165Id;

const erc165IdFromMethods = methods => {
  return erc165Id(methods.map(m => soliditySelector(soliditySignature(m))));
};exports.erc165IdFromMethods = erc165IdFromMethods;

const getSignatureDataFromAbi = abi => {
  return abi[_types.ABI_SIGNATURE];
};exports.getSignatureDataFromAbi = getSignatureDataFromAbi;