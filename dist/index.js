"use strict";Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, "BcSearch", { enumerable: true, get: function () {return _BcSearch.BcSearch;} });Object.defineProperty(exports, "Contract", { enumerable: true, get: function () {return _Contract.default;} });Object.defineProperty(exports, "ContractParser", { enumerable: true, get: function () {return _ContractParser.ContractParser;} });Object.defineProperty(exports, "RSK_RELEASES", { enumerable: true, get: function () {return _bridgeAbi.RSK_RELEASES;} });Object.defineProperty(exports, "createRskNodeProvider", { enumerable: true, get: function () {return _nod3Connect.createRskNodeProvider;} });exports.default = void 0;Object.defineProperty(exports, "getLatestBridgeAbi", { enumerable: true, get: function () {return _utils.getLatestBridgeAbi;} });Object.defineProperty(exports, "getLatestBridgeMethods", { enumerable: true, get: function () {return _utils.getLatestBridgeMethods;} });Object.defineProperty(exports, "getRskReleaseByBlockNumber", { enumerable: true, get: function () {return _bridgeAbi.getRskReleaseByBlockNumber;} });Object.defineProperty(exports, "publicRskNodeUrls", { enumerable: true, get: function () {return _nod3Connect.publicRskNodeUrls;} });var _ContractParser = require("./lib/ContractParser");
var _BcSearch = require("./lib/BcSearch");
var _Contract = _interopRequireDefault(require("./lib/Contract"));
var _bridgeAbi = require("./lib/nativeContracts/bridgeAbi");
var _utils = require("./lib/utils");
var _nod3Connect = require("./lib/nod3Connect");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}var _default = exports.default =












_ContractParser.ContractParser;

// HOTFIX: because the dependency @ethersproject/abi:5.7.0 spam the logs with 'duplicate definition' warning, this temporary fix should silence those messages until a newer version of the library fixes the issue
const originalConsoleLog = console.log;
console.log = function (message) {
  if (!String(message).includes('duplicate definition')) {
    originalConsoleLog(message);
  }
};