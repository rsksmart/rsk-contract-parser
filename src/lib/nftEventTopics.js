import { add0x } from '@rsksmart/rsk-utils'
import { abiEvents, solidityName, soliditySignature } from './utils'
import ERC721ABI from './jsonAbis/ERC721.json'
import ERC1155ABI from './jsonAbis/ERC1155.json'

const topic0Of = event => add0x(soliditySignature(solidityName(event)))

const topic0OfEventNamed = (abi, name) => topic0Of(abiEvents(abi).find(event => event.name === name))

export const ERC721_TRANSFER_TOPIC0 = topic0OfEventNamed(ERC721ABI, 'Transfer')

export const ERC1155_TRANSFER_SINGLE_TOPIC0 = topic0OfEventNamed(ERC1155ABI, 'TransferSingle')

export const ERC1155_TRANSFER_BATCH_TOPIC0 = topic0OfEventNamed(ERC1155ABI, 'TransferBatch')

export const ERC721_AND_ERC1155_EVENT_TOPIC0S = Object.freeze([
  ...new Set([...abiEvents(ERC721ABI), ...abiEvents(ERC1155ABI)].map(topic0Of))
])
