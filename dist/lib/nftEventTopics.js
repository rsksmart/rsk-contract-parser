"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ERC721_TRANSFER_TOPIC0 = exports.ERC721_AND_ERC1155_EVENT_TOPIC0S = exports.ERC1155_TRANSFER_SINGLE_TOPIC0 = exports.ERC1155_TRANSFER_BATCH_TOPIC0 = void 0;var _rskUtils = require("@rsksmart/rsk-utils");
var _utils = require("./utils");
var _ERC = _interopRequireDefault(require("./jsonAbis/ERC721.json"));
var _ERC2 = _interopRequireDefault(require("./jsonAbis/ERC1155.json"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const topic0Of = (event) => (0, _rskUtils.add0x)((0, _utils.soliditySignature)((0, _utils.solidityName)(event)));

const topic0OfEventNamed = (abi, name) => topic0Of((0, _utils.abiEvents)(abi).find((event) => event.name === name));

const ERC721_TRANSFER_TOPIC0 = exports.ERC721_TRANSFER_TOPIC0 = topic0OfEventNamed(_ERC.default, 'Transfer');

const ERC1155_TRANSFER_SINGLE_TOPIC0 = exports.ERC1155_TRANSFER_SINGLE_TOPIC0 = topic0OfEventNamed(_ERC2.default, 'TransferSingle');

const ERC1155_TRANSFER_BATCH_TOPIC0 = exports.ERC1155_TRANSFER_BATCH_TOPIC0 = topic0OfEventNamed(_ERC2.default, 'TransferBatch');

const ERC721_AND_ERC1155_EVENT_TOPIC0S = exports.ERC721_AND_ERC1155_EVENT_TOPIC0S = Object.freeze([
...new Set([...(0, _utils.abiEvents)(_ERC.default), ...(0, _utils.abiEvents)(_ERC2.default)].map(topic0Of))]
);