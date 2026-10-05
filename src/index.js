import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import { getRskReleaseByBlockNumber, RSK_RELEASES } from './lib/nativeContracts/bridgeAbi'
import { getLatestBridgeAbi, getLatestBridgeMethods, getBridgeAddress, getRemascAddress } from './lib/utils'
import { publicRskNodeUrls, createRskNodeProvider } from './lib/nod3Connect'
export {
  ContractParser,
  Contract,
  BcSearch,
  getRskReleaseByBlockNumber,
  getLatestBridgeAbi,
  getLatestBridgeMethods,
  getBridgeAddress,
  getRemascAddress,
  RSK_RELEASES,
  publicRskNodeUrls,
  createRskNodeProvider
}

export default ContractParser
