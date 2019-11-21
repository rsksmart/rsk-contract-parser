"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NativeContractsEvents = NativeContractsEvents;exports.default = void 0;var _rskUtils = require("rsk-utils");
var btcUtils = _interopRequireWildcard(require("./btcUtils"));
var _utils = require("./utils");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

function NativeContractsEvents({ bitcoinNetwork } = {}) {
  const network = bitcoinNetwork || 'testnet';
  const decodeAddress = address => {
    address = Buffer.from((0, _rskUtils.remove0x)(address), 'hex');
    return (0, _rskUtils.add0x)(address.toString('hex').slice(-40));
  };

  const decodeEventName = name => {
    return Buffer.from((0, _rskUtils.remove0x)(name), 'hex').toString('ascii').replace(/\0/g, '');
  };

  const removeEmptyStartBytes = d => {
    d = !Buffer.isBuffer(d) ? Buffer.from(d, 'hex') : d;
    return d.slice(d.findIndex(x => x > 0));
  };

  const decodeData = data => {
    let decoded = _rskUtils.rlp.decode(data);
    if (!Array.isArray(decoded)) decoded = [decoded];
    return decoded.map(d => (0, _rskUtils.add0x)(removeEmptyStartBytes(d).toString('hex')));
  };

  const decodeBtcTxHash = data => {
    if ((0, _rskUtils.remove0x)(data).length === 128) {
      let buffer = Buffer.from((0, _rskUtils.remove0x)(data), 'hex');
      data = (0, _rskUtils.add0x)(buffer.toString('ascii'));
    }
    return data;
  };
  const decodeArray = data => data.map(d => Array.isArray(d) ? decodeArray(d) : (0, _rskUtils.add0x)(d.toString('hex')));

  const decodeFederationData = data => {
    let [a160, keys] = data;
    let address = btcUtils.h160toAddress(a160, { prefixKey: 'scriptHash', network }).toString('hex');
    keys = keys.map(d => btcUtils.rskAddressFromBtcPublicKey(d.toString('hex')));
    return [address, keys];
  };

  const commitFederationDecoder = data => {
    const decoded = _rskUtils.rlp.decode(data);
    let [oldData, newData, block] = decoded;
    let [oldFederationAddress, oldFederationMembers] = decodeFederationData(oldData);
    let [newFederationAddress, newFederationMembers] = decodeFederationData(newData);
    block = block.toString('ascii');
    return [oldFederationAddress, oldFederationMembers, newFederationAddress, newFederationMembers, block];
  };
  const fakeAbi = Object.freeze((0, _utils.addSignatureDataToAbi)([
  { // Remasc events
    anonymous: false,
    inputs: [
    {
      indexed: true,
      name: 'to',
      type: 'address' },

    {
      indexed: false,
      name: 'blockHash',
      type: 'string' },

    {
      indexed: false,
      name: 'value',
      type: 'uint256' }],


    name: 'mining_fee_topic',
    type: 'event' },

  { // Bridge events
    inputs: [
    {
      indexed: false,
      name: 'btcTxHash',
      type: 'string' },

    {
      indexed: false,
      name: 'btcTx', // raw tx?
      type: 'string' }],


    name: 'release_btc_topic',
    type: 'event' },

  {
    inputs: [
    {
      indexed: false,
      name: 'sender',
      type: 'address' }],


    name: 'update_collections_topic',
    type: 'event' },

  {
    inputs: [
    {
      indexed: false,
      name: 'btcTxHash',
      type: 'string',
      _filter: decodeBtcTxHash },

    {
      indexed: false,
      name: 'federatorPublicKey',
      type: 'string' },

    {
      indexed: false,
      name: 'rskTxHash',
      type: 'string' }],


    name: 'add_signature_topic',
    type: 'event' },

  {
    inputs: [
    {
      indexed: false,
      name: 'oldFederationAddress',
      type: 'string' },

    {
      indexed: false,
      name: 'oldFederationMembers',
      type: 'address[]' },

    {
      indexed: false,
      name: 'newFederationAddress',
      type: 'string' },

    {
      indexed: false,
      name: 'newFederationMembers',
      type: 'address[]' },

    {
      indexed: false,
      name: 'activationBlockNumber',
      type: 'string' }],


    name: 'commit_federation_topic',
    type: 'event',
    _decoder: commitFederationDecoder }]));



  const getEventAbi = eventName => fakeAbi.find(a => a.name === eventName && a.type === 'event');

  const decodeByType = (type, value) => {
    if (type === 'address') return decodeAddress(value);
    return value;
  };

  const decodeInput = (input, value) => {
    let { type, _filter } = input;
    if (_filter && typeof _filter === 'function') {
      value = _filter(value);
    }
    return decodeByType(type, value);
  };

  const removeCustomProperties = obj => {
    const res = Object.assign({}, obj);
    for (let p in res) {
      if (p[0] === '_') delete res[p];
    }
    return res;
  };

  const cleanAbi = abi => {
    abi = removeCustomProperties(abi);
    let { inputs } = abi;
    if (Array.isArray(inputs)) abi.inputs = inputs.map(input => removeCustomProperties(input));
    return abi;
  };

  const decodeLog = log => {
    let topics = [...log.topics];
    let event = decodeEventName(topics.shift());
    let abi = getEventAbi(event);
    if (event && abi) {
      const { signature } = (0, _utils.getSignatureDataFromAbi)(abi);
      log.event = event;
      log.signature = signature;
      log.abi = cleanAbi(abi);
      log.args = [];
      const decoder = abi._decoder || decodeData;
      let dataDecoded = decoder(log.data);
      if (!Array.isArray(dataDecoded)) dataDecoded = [dataDecoded];
      for (let i in abi.inputs) {
        let input = abi.inputs[i];
        let { indexed } = input;
        let value = indexed === true ? topics[i] : dataDecoded[i - topics.length];
        let decoded = decodeInput(input, value);
        if (decoded) log.args.push(decoded);
      }
    }
    return log;
  };
  return Object.freeze({ decodeLog, abi: fakeAbi });
}var _default =

NativeContractsEvents;exports.default = _default;