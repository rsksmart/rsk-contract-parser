"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = FakeABI;
var _rskUtils = require("@rsksmart/rsk-utils");
var _utils = require("../utils");
var btcUtils = _interopRequireWildcard(require("../btcUtils"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

function FakeABI(network) {
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
  return Object.freeze((0, _utils.addSignatureDataToAbi)([
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


}