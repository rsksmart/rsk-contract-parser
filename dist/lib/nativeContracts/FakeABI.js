"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = FakeABI;var _rskUtils = require("@rsksmart/rsk-utils");
var _utils = require("../utils");
var btcUtils = _interopRequireWildcard(require("../btcUtils"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}

function FakeABI(network) {
  const decodeBtcTxHash = (data) => {
    if ((0, _rskUtils.remove0x)(data).length === 128) {
      const buffer = Buffer.from((0, _rskUtils.remove0x)(data), 'hex');
      data = (0, _rskUtils.add0x)(buffer.toString('ascii'));
    }
    return data;
  };
  // const decodeArray = data => data.map(d => Array.isArray(d) ? decodeArray(d) : add0x(d.toString('hex')))

  const decodeFederationData = (data) => {
    let [a160, keys] = data;
    const address = btcUtils.h160toAddress(a160, { prefixKey: 'scriptHash', network }).toString('hex');
    keys = keys.map((d) => btcUtils.rskAddressFromBtcPublicKey(d.toString('hex')));
    return [address, keys];
  };

  const commitFederationDecoder = (data) => {
    const decoded = _rskUtils.rlp.decode(data);
    let [oldData, newData, block] = decoded;
    const [oldFederationAddress, oldFederationMembers] = decodeFederationData(oldData);
    const [newFederationAddress, newFederationMembers] = decodeFederationData(newData);
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
      type: 'address'
    },
    {
      indexed: false,
      name: 'blockHash',
      type: 'string'
    },
    {
      indexed: false,
      name: 'value',
      type: 'uint256'
    }],

    name: 'mining_fee_topic',
    type: 'event'
  },
  { // Bridge events
    inputs: [
    {
      indexed: false,
      name: 'btcTxHash',
      type: 'string'
    },
    {
      indexed: false,
      name: 'btcTx', // raw tx?
      type: 'string'
    }],

    name: 'release_btc_topic',
    type: 'event'
  },
  {
    inputs: [
    {
      indexed: false,
      name: 'sender',
      type: 'address'
    }],

    name: 'update_collections_topic',
    type: 'event'
  },
  {
    inputs: [
    {
      indexed: false,
      name: 'btcTxHash',
      type: 'string',
      _filter: decodeBtcTxHash
    },
    {
      indexed: false,
      name: 'federatorPublicKey',
      type: 'string'
    },
    {
      indexed: false,
      name: 'rskTxHash',
      type: 'string'
    }],

    name: 'add_signature_topic',
    type: 'event'
  },
  {
    inputs: [
    {
      indexed: false,
      name: 'oldFederationAddress',
      type: 'string'
    },
    {
      indexed: false,
      name: 'oldFederationMembers',
      type: 'address[]'
    },
    {
      indexed: false,
      name: 'newFederationAddress',
      type: 'string'
    },
    {
      indexed: false,
      name: 'newFederationMembers',
      type: 'address[]'
    },
    {
      indexed: false,
      name: 'activationBlockNumber',
      type: 'string'
    }],

    name: 'commit_federation_topic',
    type: 'event',
    _decoder: commitFederationDecoder
  }]
  ));
}
//# sourceMappingURL=FakeABI.js.map