import { binarySearchNumber } from './utils'
import { isAddress } from '@rsksmart/rsk-utils'

export function BcSearch (nod3) {
  const getBlock = (hashOrNumber) => {
    return nod3.eth.getBlock(hashOrNumber)
  }

  const block = async (searchCb, highBlock, lowBlock) => {
    try {
      if (!highBlock) {
        const block = await getBlock('latest')
        const { number } = block
        highBlock = number
      }
      lowBlock = lowBlock || 1
      return binarySearchNumber(searchCb, highBlock, lowBlock)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const isContractAtBlock = async (address, blockNumber) => {
    let code = await nod3.eth.getCode(address, blockNumber)
    code = parseInt(code)
    return !isNaN(code) && code > 0
  }

  const deploymentBlock = (address, highBlock, lowBlock) => {
    return block(blockNumber => isContractAtBlock(address, blockNumber), highBlock, lowBlock)
  }
  const searchReceipt = async (transactions, cb) => {
    for (const tx of transactions) {
      const receipt = await nod3.eth.getTransactionReceipt(tx.hash)
      if (cb(receipt)) return { tx, receipt }
    }
  }
  const isItxDeployment = (address, itx) => {
    const { result, type } = itx
    const contractAddress = (result) ? result.address : undefined
    return type === 'create' && contractAddress === address
  }
  const deploymentTx = async (address, { blockNumber, blockTrace, block, highBlock } = {}) => {
    try {
      blockNumber = blockNumber || await deploymentBlock(address, highBlock)
      block = block || await nod3.eth.getBlock(blockNumber, true)
      const transactions = block.transactions.filter(tx => !isAddress(tx.to))
      let transaction = await searchReceipt(transactions, receipt => receipt.contractAddress === address)
      if (!transaction) { // internal transactions
        blockTrace = blockTrace || await nod3.trace.block(block.hash)
        const internalTx = blockTrace.find(trace => isItxDeployment(address, trace))
        if (internalTx) transaction = { internalTx }
      }
      if (transaction) transaction.timestamp = block.timestamp
      return transaction
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return Object.freeze({ block, deploymentBlock, deploymentTx, isItxDeployment })
}

export default BcSearch
