import USDCe_ABI from './USDCe_ABI.json'
import USDCe_BYTECODE from './USDCe_bytecode.js'
import USDCe_impl_ABI from './USDCe_impl_ABI.json'
import USDCe_impl_BYTECODE from './USDCe_impl_bytecode.js'

const TransferEvent1 = {
  log: {
    logIndex: 0,
    blockNumber: 7385540,
    blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
    transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
    transactionIndex: 2,
    address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
    data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000008fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
      '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
    ]
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 0,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0x8fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x02831c6b'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Transfer',
        inputs: [
          {
            type: 'address',
            name: 'from',
            indexed: true
          },
          {
            type: 'address',
            name: 'to',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'value',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0x8fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      eventId: '070b1c40020009e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1'
    },
    withVerifiedAbi: {
      logIndex: 0,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0x8fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x02831c6b'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Transfer',
        inputs: [
          {
            type: 'address',
            name: 'from',
            indexed: true
          },
          {
            type: 'address',
            name: 'to',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'value',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0x8fb68e5960bfb9c6e1ae6420b767ccd0287b514c',
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      eventId: '070b1c40020009e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1'
    }
  }
}

const BurnEvent = {
  log: {
    logIndex: 1,
    blockNumber: 7385540,
    blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
    transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
    transactionIndex: 2,
    address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
    data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
    topics: [
      '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
      '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
    ],
    abi: {},
    eventId: '070b1c40020019e70c73f82621b50169',
    timestamp: 1743069058,
    txStatus: '0x1',
    event: null,
    _addresses: []
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 1,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      abi: {},
      eventId: '070b1c40020019e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1',
      event: null,
      _addresses: []
    },
    withVerifiedAbi: {
      logIndex: 1,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      signature: 'cc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
      event: 'Burn',
      args: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x02831c6b'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Burn',
        inputs: [
          {
            type: 'address',
            name: 'burner',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'amount',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      eventId: '070b1c40020019e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1'
    }
  }
}

const TransferEvent2 = {
  log: {
    logIndex: 2,
    blockNumber: 7385540,
    blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
    transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
    transactionIndex: 2,
    address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
    data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398',
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    ]
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 2,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000',
        '0x02831c6b'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Transfer',
        inputs: [
          {
            type: 'address',
            name: 'from',
            indexed: true
          },
          {
            type: 'address',
            name: 'to',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'value',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000'
      ],
      eventId: '070b1c40020029e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1'
    },
    withVerifiedAbi: {
      logIndex: 2,
      blockNumber: 7385540,
      blockHash: '0x209907180e7f474c19891506d91e26929618be9576e829e70c73f82621b50169',
      transactionHash: '0xa8eb5a03859a82ce55277993d781312cfca0bfd8b24f8d8f2e8e050c3299b6d6',
      transactionIndex: 2,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0x0000000000000000000000000000000000000000000000000000000002831c6b',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000',
        '0x02831c6b'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Transfer',
        inputs: [
          {
            type: 'address',
            name: 'from',
            indexed: true
          },
          {
            type: 'address',
            name: 'to',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'value',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0x0000000000000000000000000000000000000000'
      ],
      eventId: '070b1c40020029e70c73f82621b50169',
      timestamp: 1743069058,
      txStatus: '0x1'
    }
  }
}

const MinterConfiguredEvent = {
  log: {
    logIndex: 0,
    blockNumber: 7029970,
    blockHash: '0x8cf326dc92135317f59be79af463f5e7ee7451d4a9b4de9548c5214e459e29d9',
    transactionHash: '0x55d21cfca76a0161d3721fe74c3ffcdc019b89a3b90db1a829d8378565cf1668',
    transactionIndex: 13,
    address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
    data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    topics: [
      '0x46980fca912ef9bcdbd36877427b6b90e860769f604e89c0e67720cece530d20',
      '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
    ],
    abi: {},
    eventId: '06b44d200d000e9548c5214e459e29d9',
    timestamp: 1734476754,
    txStatus: '0x1',
    event: null,
    _addresses: []
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 0,
      blockNumber: 7029970,
      blockHash: '0x8cf326dc92135317f59be79af463f5e7ee7451d4a9b4de9548c5214e459e29d9',
      transactionHash: '0x55d21cfca76a0161d3721fe74c3ffcdc019b89a3b90db1a829d8378565cf1668',
      transactionIndex: 13,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      topics: [
        '0x46980fca912ef9bcdbd36877427b6b90e860769f604e89c0e67720cece530d20',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      abi: {},
      eventId: '06b44d200d000e9548c5214e459e29d9',
      timestamp: 1734476754,
      txStatus: '0x1',
      event: null,
      _addresses: []
    },
    withVerifiedAbi: {
      logIndex: 0,
      blockNumber: 7029970,
      blockHash: '0x8cf326dc92135317f59be79af463f5e7ee7451d4a9b4de9548c5214e459e29d9',
      transactionHash: '0x55d21cfca76a0161d3721fe74c3ffcdc019b89a3b90db1a829d8378565cf1668',
      transactionIndex: 13,
      address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
      data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      topics: [
        '0x46980fca912ef9bcdbd36877427b6b90e860769f604e89c0e67720cece530d20',
        '0x000000000000000000000000af54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      signature: '46980fca912ef9bcdbd36877427b6b90e860769f604e89c0e67720cece530d20',
      event: 'MinterConfigured',
      args: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398',
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'MinterConfigured',
        inputs: [
          {
            type: 'address',
            name: 'minter',
            indexed: true
          },
          {
            type: 'uint256',
            name: 'minterAllowedAmount',
            indexed: false
          }
        ]
      },
      _addresses: [
        '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398'
      ],
      eventId: '06b44d200d000e9548c5214e459e29d9',
      timestamp: 1734476754,
      txStatus: '0x1'
    }
  }
}

export const USDCe = {
  abi: USDCe_ABI,
  bytecode: USDCe_BYTECODE,
  network: 'mainnet',
  name: 'USDCe',
  address: '0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67',
  unverifiedMethods: [
    'implementation()'
  ],
  unverifiedInterfaces: [],
  verifiedMethods: [],
  verifiedInterfaces: [],
  proxyDetails: {
    // Proxy contracts: implementation contract may change. In that case, proxy details must be updated
    isProxy: true,
    implementationABI: USDCe_impl_ABI,
    implementationBytecode: USDCe_impl_BYTECODE,
    implementationAddress: '0x40461291347e1ecbb09499f3371d3f17f10d7159',
    unverifiedImplementationMethods: [
      'allowance(address,address)',
      'approve(address,uint256)',
      'balanceOf(address)',
      'decimals()',
      'decreaseAllowance(address,uint256)',
      'increaseAllowance(address,uint256)',
      'mint(address,uint256)',
      'name()',
      'symbol()',
      'totalSupply()',
      'transfer(address,uint256)',
      'transferFrom(address,address,uint256)',
      'owner()',
      'transferOwnership(address)',
      'isMinter(address)',
      'pause()',
      'paused()',
      'unpause()',
      'removeMinter(address)',
      'burn(uint256)'
    ],
    unverifiedImplementationInterfaces: ['ERC20'],
    verifiedImplementationMethods: [
      'CANCEL_AUTHORIZATION_TYPEHASH()',
      'DOMAIN_SEPARATOR()',
      'PERMIT_TYPEHASH()',
      'RECEIVE_WITH_AUTHORIZATION_TYPEHASH()',
      'TRANSFER_WITH_AUTHORIZATION_TYPEHASH()',
      'allowance(address,address)',
      'approve(address,uint256)',
      'authorizationState(address,bytes32)',
      'balanceOf(address)',
      'blacklist(address)',
      'blacklister()',
      'burn(uint256)',
      'cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)',
      'cancelAuthorization(address,bytes32,bytes)',
      'configureMinter(address,uint256)',
      'currency()',
      'decimals()',
      'decreaseAllowance(address,uint256)',
      'increaseAllowance(address,uint256)',
      'initialize(string,string,string,uint8,address,address,address,address)',
      'initializeV2(string)',
      'initializeV2_1(address)',
      'initializeV2_2(address[],string)',
      'isBlacklisted(address)',
      'isMinter(address)',
      'masterMinter()',
      'mint(address,uint256)',
      'minterAllowance(address)',
      'name()',
      'nonces(address)',
      'owner()',
      'pause()',
      'paused()',
      'pauser()',
      'permit(address,address,uint256,uint256,bytes)',
      'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)',
      'receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)',
      'receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)',
      'removeMinter(address)',
      'rescueERC20(address,address,uint256)',
      'rescuer()',
      'symbol()',
      'totalSupply()',
      'transfer(address,uint256)',
      'transferFrom(address,address,uint256)',
      'transferOwnership(address)',
      'transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)',
      'transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)',
      'unBlacklist(address)',
      'unpause()',
      'updateBlacklister(address)',
      'updateMasterMinter(address)',
      'updatePauser(address)',
      'updateRescuer(address)',
      'version()'
    ],
    verifiedImplementationInterfaces: ['ERC20']
  },
  events: [
    TransferEvent1,
    BurnEvent,
    TransferEvent2,
    MinterConfiguredEvent
  ]
}
