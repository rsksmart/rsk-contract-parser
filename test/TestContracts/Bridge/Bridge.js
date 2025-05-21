import { getLatestBridgeAbi, getBridgeAddress, getLatestBridgeMethods } from '../../../src/lib/utils'

const updateCollectionsEvent = {
  log: {
    logIndex: 0,
    blockNumber: 5650461,
    blockHash: '0x6ddec160925fb958111ae90a21c9644224c0fcd9ea6f140601524c9414f3146a',
    transactionHash: '0x6592b9f355ebb610673e9fac6e431e78dda457d22dac83ebf4dc77e805c563e7',
    transactionIndex: 2,
    address: '0x0000000000000000000000000000000001000006',
    data: '0x00000000000000000000000047442b55635c9888a2790b598935eb7aac2603e2',
    topics: [
      '0x1069152f4f916cbf155ee32a695d92258481944edb5b6fd649718fc1b43e515e'
    ]
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 0,
      blockNumber: 5650461,
      blockHash: '0x6ddec160925fb958111ae90a21c9644224c0fcd9ea6f140601524c9414f3146a',
      transactionHash: '0x6592b9f355ebb610673e9fac6e431e78dda457d22dac83ebf4dc77e805c563e7',
      transactionIndex: 2,
      address: '0x0000000000000000000000000000000001000006',
      data: '0x00000000000000000000000047442b55635c9888a2790b598935eb7aac2603e2',
      topics: [
        '0x1069152f4f916cbf155ee32a695d92258481944edb5b6fd649718fc1b43e515e'
      ],
      signature: '1069152f4f916cbf155ee32a695d92258481944edb5b6fd649718fc1b43e515e',
      event: 'update_collections',
      args: [
        '0x47442b55635c9888a2790b598935eb7aac2603e2'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'update_collections',
        inputs: [
          {
            type: 'address',
            name: 'sender',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0x47442b55635c9888a2790b598935eb7aac2603e2'
      ],
      eventId: '056381d00200040601524c9414f3146a',
      timestamp: 1695046701,
      txStatus: '0x1'
    },
    withVerifiedAbi: {
      logIndex: 0,
      blockNumber: 5650461,
      blockHash: '0x6ddec160925fb958111ae90a21c9644224c0fcd9ea6f140601524c9414f3146a',
      transactionHash: '0x6592b9f355ebb610673e9fac6e431e78dda457d22dac83ebf4dc77e805c563e7',
      transactionIndex: 2,
      address: '0x0000000000000000000000000000000001000006',
      data: '0x00000000000000000000000047442b55635c9888a2790b598935eb7aac2603e2',
      topics: [
        '0x1069152f4f916cbf155ee32a695d92258481944edb5b6fd649718fc1b43e515e'
      ],
      signature: '1069152f4f916cbf155ee32a695d92258481944edb5b6fd649718fc1b43e515e',
      event: 'update_collections',
      args: [
        '0x47442b55635c9888a2790b598935eb7aac2603e2'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'update_collections',
        inputs: [
          {
            type: 'address',
            name: 'sender',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0x47442b55635c9888a2790b598935eb7aac2603e2'
      ],
      eventId: '056381d00200040601524c9414f3146a',
      timestamp: 1695046701,
      txStatus: '0x1'
    }
  }
}

export const Bridge = {
  abi: getLatestBridgeAbi(),
  bytecode: '0x',
  network: 'testnet',
  name: 'Bridge',
  address: getBridgeAddress(),
  unverifiedMethods: getLatestBridgeMethods(),
  unverifiedInterfaces: [],
  verifiedMethods: getLatestBridgeMethods(),
  verifiedInterfaces: [],
  proxyDetails: {
    isProxy: false,
    implementationABI: null,
    implementationBytecode: null,
    implementationAddress: null,
    unverifiedImplementationMethods: null,
    unverifiedImplementationInterfaces: null,
    verifiedImplementationMethods: null,
    verifiedImplementationInterfaces: null
  },
  events: [
    /*
      Bridge: ABI is always known. The only case where the parser is unable to decode a bridge event is when the parser is not using the proper height-matched bridge ABI. (eg: new RSK nodes release)
      Example: A "TestEvent" event is emmited at block 100, but the parser is using an older bridge ABI valid from block 1 to 99, which doesn't support the "TestEvent" event. This will cause the parser to be unable to decode logs related to that event.
    */
    updateCollectionsEvent
  ]
}
