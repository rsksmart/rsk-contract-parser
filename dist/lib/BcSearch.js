"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.BcSearch = BcSearch;exports.default = void 0;var _utils = require("./utils");
var _rskUtils = require("@rsksmart/rsk-utils");

function BcSearch(nod3) {
  const getBlock = hashOrNumber => {
    return nod3.eth.getBlock(hashOrNumber);
  };

  const block = async (searchCb, highBlock, lowBlock) => {
    try {
      if (!highBlock) {
        let block = await getBlock('latest');
        let { number } = block;
        highBlock = number;
      }
      lowBlock = lowBlock || 1;
      return (0, _utils.binarySearchNumber)(searchCb, highBlock, lowBlock);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const isContractAtBlock = async (address, blockNumber) => {
    console.log("isContractAtBlock executing ");
    console.log("address=> ", address);
    console.log("blockNumber=> ", blockNumber);
    let code = await nod3.eth.getCode(address, blockNumber);
    console.log("code=> ", code);
    code = parseInt(code);
    const isCode = !isNaN(code) && code > 0;
    console.log("isCode=> ", isCode);
    return isCode;
  };

  const deploymentBlock = (address, highBlock, lowBlock) => {
    return block(blockNumber => isContractAtBlock(address, blockNumber), highBlock, lowBlock);
  };
  const searchReceipt = async (transactions, cb) => {
    for (let tx of transactions) {
      let receipt = await nod3.eth.getTransactionReceipt(tx.hash);
      if (cb(receipt)) return { tx, receipt };
    }
  };
  const isItxDeployment = (address, itx) => {
    let { result, type } = itx;
    let contractAddress = result ? result.address : undefined;
    return type === 'create' && contractAddress === address;
  };
  const deploymentTx = async (address, { blockNumber, blockTrace, block, highBlock } = {}) => {
    console.log('STARTING deploymentTx');
    console.log('address=> ', address);
    console.log('blockNumber=> ', blockNumber);
    console.log('blockTrace=> ', blockTrace);
    console.log('block=> ', block);
    console.log('highBlock=> ', highBlock);
    try {
      blockNumber = blockNumber || (await deploymentBlock(address, highBlock));
      console.log('deploymentBlock=> ', blockNumber);
      block = block || (await nod3.eth.getBlock(blockNumber, true));
      console.log('getBlock=> ', block);
      let transactions = block.transactions.filter(tx => !(0, _rskUtils.isAddress)(tx.to));
      console.log('transactions=> ', transactions);
      let transaction = await searchReceipt(transactions, receipt => receipt.contractAddress === address);
      console.log('transaction=> ', transaction);
      if (!transaction) {// internal transactions
        blockTrace = blockTrace || (await nod3.trace.block(block.hash));
        let internalTx = blockTrace.find(trace => isItxDeployment(address, trace));
        if (internalTx) transaction = { internalTx };
      }
      if (transaction) transaction.timestamp = block.timestamp;
      return transaction;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return Object.freeze({ block, deploymentBlock, deploymentTx, isItxDeployment });
}var _default =

BcSearch;exports.default = _default;