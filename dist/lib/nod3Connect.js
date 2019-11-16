"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.nod3Connect = void 0;var _nod = _interopRequireDefault(require("nod3"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const nod3Connect = url => {
  url = url || 'http://localhost:4444';
  return new _nod.default(
  new _nod.default.providers.HttpProvider(url));

};exports.nod3Connect = nod3Connect;var _default =

nod3Connect();exports.default = _default;