"use strict";Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, "ContractParser", { enumerable: true, get: function () {return _ContractParser.ContractParser;} });Object.defineProperty(exports, "BcSearch", { enumerable: true, get: function () {return _BcSearch.BcSearch;} });Object.defineProperty(exports, "Contract", { enumerable: true, get: function () {return _Contract.default;} });exports.default = exports.types = exports.abi = void 0;var _ContractParser = require("./lib/ContractParser");
var _BcSearch = require("./lib/BcSearch");
var _Contract = _interopRequireDefault(require("./lib/Contract"));
var _bridgeAbi = _interopRequireDefault(require("./lib/nativeContracts/bridgeAbi"));
var _types = require("./lib/types");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
const abi = { bridge: _bridgeAbi.default };exports.abi = abi;
const types = { contractsInterfaces: _types.contractsInterfaces };exports.types = types;var _default =

_ContractParser.ContractParser;exports.default = _default;