"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sha256 = exports.rskAddressFromBtcPublicKey = exports.pubToAddress = exports.parsePublic = exports.h160toAddress = exports.h160 = exports.decompressPublic = exports.compressPublic = void 0;var _crypto = _interopRequireDefault(require("crypto"));
var bs58 = _interopRequireWildcard(require("bs58"));
var _rskUtils = require("@rsksmart/rsk-utils");
var _secp256k = _interopRequireDefault(require("secp256k1"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const PREFIXES = {
  mainnet: {
    pubKeyHash: '00',
    scriptHash: '05'
  },
  testnet: {
    pubKeyHash: '6F',
    scriptHash: 'C4'
  },
  regtest: {
    pubKeyHash: '00',
    scriptHash: '00'
  }
};
const getNetPrefix = (netName) => {
  const prefixes = PREFIXES[netName];
  if (!prefixes) throw new Error(`Unknown network ${netName}`);
  return prefixes;
};

const createHash = (a, val, from = 'hex', to = 'hex') => _crypto.default.createHash(a).update(val, from).digest(to);

const sha256 = (val, from, to) => createHash('sha256', (0, _rskUtils.remove0x)(val), from, to);exports.sha256 = sha256;

const h160 = (val, from, to) => createHash('ripemd160', (0, _rskUtils.remove0x)(val), from, to);exports.h160 = h160;

const h160toAddress = (hash160, { network, prefixKey }) => {
  network = network || 'mainnet';
  prefixKey = prefixKey || 'pubKeyHash';
  const prefix = getNetPrefix(network)[prefixKey];
  hash160 = Buffer.isBuffer(hash160) ? hash160.toString('hex') : (0, _rskUtils.remove0x)(hash160);
  hash160 = `${prefix}${hash160}`;
  const check = sha256(sha256(hash160)).slice(0, 8);
  return bs58.encode(Buffer.from(`${hash160}${check}`, 'hex'));
};exports.h160toAddress = h160toAddress;

const pubToAddress = (pub, network) => {
  return h160toAddress(h160(sha256((0, _rskUtils.remove0x)(pub))), { network });
};exports.pubToAddress = pubToAddress;

const parsePublic = (pub, compressed) => {
  pub = !Buffer.isBuffer(pub) ? Buffer.from((0, _rskUtils.remove0x)(pub), 'hex') : pub;
  return _secp256k.default.publicKeyConvert(pub, compressed);
};exports.parsePublic = parsePublic;

const decompressPublic = (compressed) => parsePublic(compressed, false).toString('hex');exports.decompressPublic = decompressPublic;

const compressPublic = (pub) => parsePublic(pub, true).toString('hex');exports.compressPublic = compressPublic;

const rskAddressFromBtcPublicKey = (cpk) => (0, _rskUtils.add0x)((0, _rskUtils.keccak256)(parsePublic(cpk, false).slice(1)).slice(-40));exports.rskAddressFromBtcPublicKey = rskAddressFromBtcPublicKey;