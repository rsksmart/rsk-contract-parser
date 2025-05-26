import USDRIF_ABI from './USDRIF_ABI.json'
import USDRIF_BYTECODE from './USDRIF_bytecode.js'
import USDRIF_impl_ABI from './USDRIF_impl_ABI.json'
import USDRIF_impl_BYTECODE from './USDRIF_impl_bytecode.js'

const UpgradedEvent = {
  log: {
    logIndex: 0,
    blockNumber: 5650464,
    blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
    transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
    transactionIndex: 0,
    address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
    data: '0x',
    topics: [
      '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
      '0x000000000000000000000000abb96fc7d16bbbae444e913cc6729694a4a4d69f'
    ],
    abi: {},
    eventId: '0563820000000ec36061a36dbadc0dd0',
    timestamp: 1695046826,
    txStatus: '0x1',
    event: null,
    _addresses: []
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 0,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x',
      topics: [
        '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
        '0x000000000000000000000000abb96fc7d16bbbae444e913cc6729694a4a4d69f'
      ],
      abi: {},
      eventId: '0563820000000ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1',
      event: null,
      _addresses: []
    },
    withVerifiedAbi: {
      logIndex: 0,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x',
      topics: [
        '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
        '0x000000000000000000000000abb96fc7d16bbbae444e913cc6729694a4a4d69f'
      ],
      signature: 'bc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
      event: 'Upgraded',
      args: [
        '0xabb96fc7d16bbbae444e913cc6729694a4a4d69f'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Upgraded',
        inputs: [
          {
            type: 'address',
            name: 'implementation',
            indexed: true
          }
        ]
      },
      _addresses: [
        '0xabb96fc7d16bbbae444e913cc6729694a4a4d69f'
      ],
      eventId: '0563820000000ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1'
    }
  }
}

const RoleGrantedEvent = {
  log: {
    logIndex: 1,
    blockNumber: 5650464,
    blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
    transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
    transactionIndex: 0,
    address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
    data: '0x',
    topics: [
      '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000009497d2aecd0757dd4fcb4d5f2131293570fad305',
      '0x000000000000000000000000ea14c08764c9e5f212c916e11a5c47eaf92571e4'
    ],
    abi: {},
    eventId: '0563820000001ec36061a36dbadc0dd0',
    timestamp: 1695046826,
    txStatus: '0x1',
    event: null,
    _addresses: []
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 1,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000009497d2aecd0757dd4fcb4d5f2131293570fad305',
        '0x000000000000000000000000ea14c08764c9e5f212c916e11a5c47eaf92571e4'
      ],
      abi: {},
      eventId: '0563820000001ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1',
      event: null,
      _addresses: []
    },
    withVerifiedAbi: {
      logIndex: 1,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000009497d2aecd0757dd4fcb4d5f2131293570fad305',
        '0x000000000000000000000000ea14c08764c9e5f212c916e11a5c47eaf92571e4'
      ],
      signature: '2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
      event: 'RoleGranted',
      args: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x9497d2aecd0757dd4fcb4d5f2131293570fad305',
        '0xea14c08764c9e5f212c916e11a5c47eaf92571e4'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'RoleGranted',
        inputs: [
          {
            type: 'bytes32',
            name: 'role',
            indexed: true
          },
          {
            type: 'address',
            name: 'account',
            indexed: true
          },
          {
            type: 'address',
            name: 'sender',
            indexed: true
          }
        ]
      },
      _addresses: [
        '0x9497d2aecd0757dd4fcb4d5f2131293570fad305',
        '0xea14c08764c9e5f212c916e11a5c47eaf92571e4'
      ],
      eventId: '0563820000001ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1'
    }
  }
}

const InitializedEvent = {
  log: {
    logIndex: 4,
    blockNumber: 5650464,
    blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
    transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
    transactionIndex: 0,
    address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [
      '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ],
    abi: {},
    eventId: '0563820000004ec36061a36dbadc0dd0',
    timestamp: 1695046826,
    txStatus: '0x1',
    event: null,
    _addresses: []
  },
  expectedEvent: {
    withUnverifiedAbi: {
      logIndex: 4,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      topics: [
        '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
      ],
      abi: {},
      eventId: '0563820000004ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1',
      event: null,
      _addresses: []
    },
    withVerifiedAbi: {
      logIndex: 4,
      blockNumber: 5650464,
      blockHash: '0x3e4c802b37e0338a45b651d4ea4fd36b5fce816cfe67fec36061a36dbadc0dd0',
      transactionHash: '0xf89fdc9f4cdc44ee7effb40985a1ed37d25ce253e5aaf01f3c7c88ed5250b0a5',
      transactionIndex: 0,
      address: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37',
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      topics: [
        '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
      ],
      signature: '7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498',
      event: 'Initialized',
      args: [
        '0x1'
      ],
      abi: {
        type: 'event',
        anonymous: false,
        name: 'Initialized',
        inputs: [
          {
            type: 'uint8',
            name: 'version',
            indexed: false
          }
        ]
      },
      _addresses: [],
      eventId: '0563820000004ec36061a36dbadc0dd0',
      timestamp: 1695046826,
      txStatus: '0x1'
    }
  }
}

export const USDRIF = {
  abi: USDRIF_ABI,
  bytecode: USDRIF_BYTECODE,
  network: 'mainnet',
  name: 'USDRIF',
  address: '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37',
  unverifiedMethods: [],
  unverifiedInterfaces: [],
  verifiedMethods: [],
  verifiedInterfaces: [],
  proxyDetails: {
    // Proxy contracts: implementation contract may change. In that case, proxy details must be updated
    isProxy: true,
    implementationABI: USDRIF_impl_ABI,
    implementationBytecode: USDRIF_impl_BYTECODE,
    implementationAddress: '0xabb96fc7d16bbbae444e913cc6729694a4a4d69f',
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
      'supportsInterface(bytes4)',
      'burn(address,uint256)'
    ],
    unverifiedImplementationInterfaces: ['ERC20', 'ERC165'],
    verifiedImplementationMethods: [
      'DEFAULT_ADMIN_ROLE()',
      'allowance(address,address)',
      'approve(address,uint256)',
      'balanceOf(address)',
      'burn(address,uint256)',
      'changeGovernor(address)',
      'decimals()',
      'decreaseAllowance(address,uint256)',
      'getRoleAdmin(bytes32)',
      'getRoleMember(bytes32,uint256)',
      'getRoleMemberCount(bytes32)',
      'governor()',
      'grantRole(bytes32,address)',
      'hasRole(bytes32,address)',
      'increaseAllowance(address,uint256)',
      'initialize(string,string,address,address)',
      'mint(address,uint256)',
      'name()',
      'proxiableUUID()',
      'renounceRole(bytes32,address)',
      'revokeRole(bytes32,address)',
      'supportsInterface(bytes4)',
      'symbol()',
      'totalSupply()',
      'transfer(address,uint256)',
      'transferAllRoles(address)',
      'transferFrom(address,address,uint256)',
      'upgradeTo(address)',
      'upgradeToAndCall(address,bytes)'
    ],
    verifiedImplementationInterfaces: ['ERC20', 'ERC165']
  },
  events: [
    UpgradedEvent,
    RoleGrantedEvent,
    InitializedEvent
  ]
}
