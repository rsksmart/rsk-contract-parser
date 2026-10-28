import { expect } from 'chai'
import { Interface, EventFragment } from '@ethersproject/abi'
import ERC721ABI from '../src/lib/jsonAbis/ERC721.json'
import ERC1155ABI from '../src/lib/jsonAbis/ERC1155.json'
import {
  ERC721_TRANSFER_TOPIC0,
  ERC1155_TRANSFER_SINGLE_TOPIC0,
  ERC1155_TRANSFER_BATCH_TOPIC0,
  ERC721_AND_ERC1155_EVENT_TOPIC0S
} from '../src'

const ethersTopic0 = signature => Interface.getEventTopic(EventFragment.from(signature))
const ethersEventTopic0s = abi => Object.values(new Interface(abi).events).map(event => Interface.getEventTopic(event))
const LOWERCASE_0X_TOPIC0 = /^0x[0-9a-f]{64}$/

describe('NFT event topics exported from the package root', function () {
  const transferTopics = [
    ['ERC721_TRANSFER_TOPIC0', ERC721_TRANSFER_TOPIC0, 'Transfer(address,address,uint256)'],
    ['ERC1155_TRANSFER_SINGLE_TOPIC0', ERC1155_TRANSFER_SINGLE_TOPIC0, 'TransferSingle(address,address,address,uint256,uint256)'],
    ['ERC1155_TRANSFER_BATCH_TOPIC0', ERC1155_TRANSFER_BATCH_TOPIC0, 'TransferBatch(address,address,address,uint256[],uint256[])']
  ]

  for (const [name, topic0, signature] of transferTopics) {
    it(`${name} equals the ethers keccak of ${signature}`, function () {
      expect(topic0).to.equal(ethersTopic0(signature))
    })
  }

  it('ERC721_AND_ERC1155_EVENT_TOPIC0S holds the ethers topic0 of every event in ERC721.json and ERC1155.json, once each', function () {
    const expected = [...new Set([...ethersEventTopic0s(ERC721ABI), ...ethersEventTopic0s(ERC1155ABI)])].sort()
    expect([...ERC721_AND_ERC1155_EVENT_TOPIC0S].sort()).to.deep.equal(expected)
    expect(ERC721_AND_ERC1155_EVENT_TOPIC0S).to.have.lengthOf(expected.length)
  })

  it('every exported topic0 is a lowercase 0x-prefixed 32-byte hex string, as a node returns log.topics[0]', function () {
    for (const topic0 of [ERC721_TRANSFER_TOPIC0, ERC1155_TRANSFER_SINGLE_TOPIC0, ERC1155_TRANSFER_BATCH_TOPIC0, ...ERC721_AND_ERC1155_EVENT_TOPIC0S]) {
      expect(topic0).to.match(LOWERCASE_0X_TOPIC0)
    }
  })

  it('ERC721_AND_ERC1155_EVENT_TOPIC0S is a frozen array so no consumer changes another consumer\'s copy', function () {
    expect(ERC721_AND_ERC1155_EVENT_TOPIC0S).to.be.an('array')
    expect(Object.isFrozen(ERC721_AND_ERC1155_EVENT_TOPIC0S)).to.equal(true)
  })
})
