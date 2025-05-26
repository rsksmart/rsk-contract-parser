import DollarOnChain_ABI from './DollarOnChain_ABI.json'
import DollarOnChain_bytecode from './DollarOnChain_bytecode'

const approvalEvent = {
  log: {
    logIndex: 20,
    blockNumber: 7390281,
    blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
    transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
    transactionIndex: 0,
    address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
    topics: [
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
      '0x0000000000000000000000002bee6167f91d10db23252e03de039da6b9047d49'
    ]
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 20,
      blockNumber: 7390281,
      blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
      transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
      transactionIndex: 0,
      address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
      data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
      topics: [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x0000000000000000000000002bee6167f91d10db23252e03de039da6b9047d49'
      ],
      signature: '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      event: 'Approval',
      args: [
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x2bee6167f91d10db23252e03de039da6b9047d49',
        '0xb5b583ca27cb771045'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Approval',
        inputs: [
          {
            type: 'address',
            name: 'owner',
            indexed: true
          },
          {
            type: 'address',
            name: 'spender',
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
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x2bee6167f91d10db23252e03de039da6b9047d49'
      ],
      eventId: '070c4490000145f1c672f0068d2a2ba0',
      timestamp: 1743186566,
      txStatus: '0x1'
    },
    withVerifiedAbi: {
      logIndex: 20,
      blockNumber: 7390281,
      blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
      transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
      transactionIndex: 0,
      address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
      data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
      topics: [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x0000000000000000000000002bee6167f91d10db23252e03de039da6b9047d49'
      ],
      signature: '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      event: 'Approval',
      args: [
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x2bee6167f91d10db23252e03de039da6b9047d49',
        '0xb5b583ca27cb771045'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Approval',
        inputs: [
          {
            type: 'address',
            name: 'owner',
            indexed: true
          },
          {
            type: 'address',
            name: 'spender',
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
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0x2bee6167f91d10db23252e03de039da6b9047d49'
      ],
      eventId: '070c4490000145f1c672f0068d2a2ba0',
      timestamp: 1743186566,
      txStatus: '0x1'
    }
  }
}

const transferEvent = {
  log: {
    logIndex: 18,
    blockNumber: 7390281,
    blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
    transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
    transactionIndex: 0,
    address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000005f777270259e32f79589fe82269db6209f7b7582',
      '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce'
    ]
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 18,
      blockNumber: 7390281,
      blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
      transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
      transactionIndex: 0,
      address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
      data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000005f777270259e32f79589fe82269db6209f7b7582',
        '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0x5f777270259e32f79589fe82269db6209f7b7582',
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0xb5b583ca27cb771045'
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
        '0x5f777270259e32f79589fe82269db6209f7b7582',
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce'
      ],
      eventId: '070c4490000125f1c672f0068d2a2ba0',
      timestamp: 1743186566,
      txStatus: '0x1'
    },
    withVerifiedAbi: {
      logIndex: 18,
      blockNumber: 7390281,
      blockHash: '0x3c44500e66db823e9be865996742ca88f48232992b8f15f1c672f0068d2a2ba0',
      transactionHash: '0x469f388b727b7c62df8286474d7eac926bd95b076eca362f66c57e2fb659697e',
      transactionIndex: 0,
      address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
      data: '0x0000000000000000000000000000000000000000000000b5b583ca27cb771045',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000005f777270259e32f79589fe82269db6209f7b7582',
        '0x000000000000000000000000fe75d38b6ef8d1649b7d69a4a044e443c6afe1ce'
      ],
      signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      event: 'Transfer',
      args: [
        '0x5f777270259e32f79589fe82269db6209f7b7582',
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce',
        '0xb5b583ca27cb771045'
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
        '0x5f777270259e32f79589fe82269db6209f7b7582',
        '0xfe75d38b6ef8d1649b7d69a4a044e443c6afe1ce'
      ],
      eventId: '070c4490000125f1c672f0068d2a2ba0',
      timestamp: 1743186566,
      txStatus: '0x1'
    }
  }
}

export const DollarOnChain = {
  abi: DollarOnChain_ABI,
  bytecode: DollarOnChain_bytecode,
  network: 'mainnet',
  name: 'DollarOnChain',
  address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
  unverifiedMethods: [
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
    'isOwner()',
    'owner()',
    'renounceOwnership()',
    'transferOwnership(address)',
    'addMinter(address)',
    'isMinter(address)',
    'renounceMinter()',
    'burn(address,uint256)'
  ],
  unverifiedInterfaces: ['ERC20'],
  verifiedMethods: [
    'name()',
    'approve(address,uint256)',
    'totalSupply()',
    'transferFrom(address,address,uint256)',
    'decimals()',
    'increaseAllowance(address,uint256)',
    'mint(address,uint256)',
    'balanceOf(address)',
    'renounceOwnership()',
    'owner()',
    'isOwner()',
    'symbol()',
    'addMinter(address)',
    'renounceMinter()',
    'burn(address,uint256)',
    'decreaseAllowance(address,uint256)',
    'transfer(address,uint256)',
    'isMinter(address)',
    'allowance(address,address)',
    'transferOwnership(address)'
  ],
  verifiedInterfaces: ['ERC20'],
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
    approvalEvent,
    transferEvent
  ]
}
