"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.interfacesIds = exports.default = void 0;var _utils = require("./utils");

const erc20methods = [
'name()',
'symbol()',
'decimals()',
'totalSupply()',
'balanceOf(address)',
'allowance(address,address)',
'transfer(address,uint256)',
'approve(address,uint256)',
'transferFrom(address,address,uint256)'];


const erc677Methods = erc20methods.concat([
'transferAndCall(address,uint256,bytes)']
);

const interfacesIds = exports.interfacesIds = {
  ERC20: makeInterface(erc20methods),
  ERC677: makeInterface(erc677Methods),
  ERC165: makeInterface(['supportsInterface(bytes4)']),
  ERC721: makeInterface([
  'balanceOf(address)',
  'ownerOf(uint256)',
  'approve(address,uint256)',
  'getApproved(uint256)',
  'setApprovalForAll(address,bool)',
  'isApprovedForAll(address,address)',
  'transferFrom(address,address,uint256)',
  'safeTransferFrom(address,address,uint256)',
  'safeTransferFrom(address,address,uint256,bytes)']
  ),
  ERC721Enumerable: makeInterface([
  'totalSupply()',
  'tokenOfOwnerByIndex(address,uint256)',
  'tokenByIndex(uint256)']
  ),
  ERC721Metadata: makeInterface([
  'name()',
  'symbol()',
  'tokenURI(uint256)']
  ),
  ERC721Exists: makeInterface([
  'exists(uint256)']
  ),
  // erc165: ERC-1155 mandates supportsInterface, so a negative bytecode scan
  // (e.g. a proxy) can be settled by calling it on-chain
  ERC1155: makeInterface([
  'safeTransferFrom(address,address,uint256,uint256,bytes)',
  'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)',
  'balanceOf(address,uint256)',
  'balanceOfBatch(address[],uint256[])',
  'setApprovalForAll(address,bool)',
  'isApprovedForAll(address,address)'],
  { erc165: true }),
  ERC1155MetadataURI: makeInterface([
  'uri(uint256)'],
  { erc165: true })
};

function makeInterface(methods, { erc165 = false } = {}) {
  const id = (0, _utils.erc165IdFromMethods)(methods);
  return { methods, id, erc165 };
}var _default = exports.default =

interfacesIds;