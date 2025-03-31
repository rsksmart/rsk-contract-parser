import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import { getRskReleaseByBlockNumber, RSK_RELEASES } from './lib/nativeContracts/bridgeAbi'
import { getLatestBridgeAbi, getLatestBridgeMethods } from './lib/utils'
import { publicRskNodeUrls, createRskNodeProvider } from './lib/nod3Connect'
export {
  ContractParser,
  Contract,
  BcSearch,
  getRskReleaseByBlockNumber,
  getLatestBridgeAbi,
  getLatestBridgeMethods,
  RSK_RELEASES,
  publicRskNodeUrls,
  createRskNodeProvider
}

export default ContractParser

// HOTFIX: because the dependency @ethersproject/abi:5.7.0 spam the logs with 'duplicate definition' warning, this temporary fix should silence those messages until a newer version of the library fixes the issue
const originalConsoleLog = console.log
console.log = function (message) {
  if (!String(message).includes('duplicate definition')) {
    originalConsoleLog(message)
  }
}
