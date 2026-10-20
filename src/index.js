import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import { getRskReleaseByBlockNumber, RSK_RELEASES } from './lib/nativeContracts/bridgeAbi'
import { getLatestBridgeAbi, getLatestBridgeMethods, getBridgeAddress, getRemascAddress } from './lib/utils'
import { publicRskNodeUrls, createRskNodeProvider } from './lib/nod3Connect'
import {
  ERC721_TRANSFER_TOPIC0,
  ERC1155_TRANSFER_SINGLE_TOPIC0,
  ERC1155_TRANSFER_BATCH_TOPIC0,
  ERC721_AND_ERC1155_EVENT_TOPIC0S
} from './lib/nftEventTopics'
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
  createRskNodeProvider,
  ERC721_TRANSFER_TOPIC0,
  ERC1155_TRANSFER_SINGLE_TOPIC0,
  ERC1155_TRANSFER_BATCH_TOPIC0,
  ERC721_AND_ERC1155_EVENT_TOPIC0S
}

export default ContractParser
