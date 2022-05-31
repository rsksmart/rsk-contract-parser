"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.tokensInterfaces = exports.contractsInterfaces = exports.bitcoinRskNetWorks = exports.bitcoinNetworks = exports.INTERFACE_ID_BYTES = exports.ABI_SIGNATURE = void 0;const ABI_SIGNATURE = '__signatureData';exports.ABI_SIGNATURE = ABI_SIGNATURE;

const INTERFACE_ID_BYTES = 4;exports.INTERFACE_ID_BYTES = INTERFACE_ID_BYTES;

const bitcoinNetworks = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
  REGTEST: 'regtest' };exports.bitcoinNetworks = bitcoinNetworks;


const bitcoinRskNetWorks = {
  31: bitcoinNetworks.TESTNET,
  30: bitcoinNetworks.MAINNET,
  33: bitcoinNetworks.REGTEST };exports.bitcoinRskNetWorks = bitcoinRskNetWorks;


const contractsInterfaces = {
  ERC20: 'ERC20',
  ERC677: 'ERC677',
  ERC165: 'ERC165',
  ERC721: 'ERC721',
  EIP1167: 'EIP1167' };exports.contractsInterfaces = contractsInterfaces;


const ci = contractsInterfaces;

const tokensInterfaces = [
ci.ERC20,
ci.ERC677,
ci.ERC721];exports.tokensInterfaces = tokensInterfaces;