"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NativeContracts = NativeContracts;exports.default = exports.parseNativeContracts = exports.defaultNativeContracts = void 0;
var _rskUtils = require("rsk-utils");

const defaultNativeContracts = {
  bridge: '0x0000000000000000000000000000000001000006',
  remasc: '0x0000000000000000000000000000000001000008' };exports.defaultNativeContracts = defaultNativeContracts;


const parseNativeContracts = nativeContracts => {
  if (typeof nativeContracts !== 'object') throw new TypeError(`nativeContracts must be an object`);
  if (Object.keys(nativeContracts) < 1) throw new Error(`Empty native contracts list`);
  for (let name in nativeContracts) {
    let address = nativeContracts[name];
    if (!(0, _rskUtils.isAddress)(address)) throw new Error(`Address of ${name} is not an address`);
    nativeContracts[name] = address.toLowerCase();
  }
  return nativeContracts;
};exports.parseNativeContracts = parseNativeContracts;

function NativeContracts({ nativeContracts } = {}) {
  nativeContracts = parseNativeContracts(nativeContracts || defaultNativeContracts);
  const names = Object.keys(nativeContracts);

  const getNativeContractAddress = contractName => {
    return nativeContracts[contractName];
  };
  const getNativeContractName = address => {
    address = address.toLowerCase();
    return names.find(name => nativeContracts[name] === address);
  };

  const isNativeContract = address => !!getNativeContractName(address);

  const list = () => nativeContracts;

  return Object.freeze({ getNativeContractAddress, getNativeContractName, isNativeContract, list });
}var _default =

NativeContracts;exports.default = _default;