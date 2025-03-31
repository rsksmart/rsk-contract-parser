# RSK-contract-parser

> NodeJS module to interact with smart contracts and native RSK contracts.

## Overview

`rsk-contract-parser` is a comprehensive tool for parsing, analyzing, and interacting with smart contracts on the Rootstock (RSK) blockchain. It provides functionalities for decoding contract methods, events, and identifying contract interfaces (such as ERC standards), with special support for RSK native contracts.

## Features

- **Contract Analysis**: Identify implemented ERC standards and interface support
- **Event Decoding**: Parse and decode event logs from transactions
- **Proxy Detection**: Identify and analyze proxy patterns
- **Method Decoding**: Decode contract method calls from transaction data
- **RSK Native Contracts**: Special handling for RSK-specific contracts and event formats
- **Blockchain Interaction**: Easy contract interaction through the included Contract class

## Requirements

- Node.js >= 20

## Installation

```bash
npm install @rsksmart/rsk-contract-parser
```

## Usage

### Creating a `ContractParser` instance

The `ContractParser` class is the main class. It can be used to parse contracts, decode events, and interact with contracts on the blockchain by instantiating `Contract` instances.

```javascript
import { ContractParser, createRskNodeProvider, publicRskNodeUrls } from '@rsksmart/rsk-contract-parser';

// Use our network connection wrapper
const network = 'testnet';
const nod3 = createRskNodeProvider(network);

// Required for native contracts parsing
const initConfig = {
  net: {
    id: publicRskNodeUrls[network].id
  }
}

const parser = new ContractParser({ 
  nod3,
  initConfig
  // abi: ABI to use for events decoding and contract interactions. If not provided, ContractParser will use a default ABI that covers most standards but its strongly recommended to provide the contract's ABI.
  // txBlockNumber: Optional. Used for native events decoding. Can be a block number or tag 'latest' (Default: 'latest').
});
```

### Working with Token Contracts

You can use the `ContractParser` class to retrieve default token data from a contract:

```javascript
import { ContractParser, createRskNodeProvider, publicRskNodeUrls } from '@rsksmart/rsk-contract-parser';

const network = 'mainnet';
const nod3 = createRskNodeProvider(network);
const initConfig = {
  net: {
    id: publicRskNodeUrls[network].id
  }
}

const tokenAddress = '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37'; // USDRIF on Mainnet
const blockNumber = 7376491;

const parser = new ContractParser({ nod3, initConfig });

// Current parser ABI will be used for the contract instance
const contract = parser.makeContract(tokenAddress);

// Get default token information at a specific block
const tokenData = await parser.getDefaultTokenData(contract, blockNumber);
console.log(tokenData);
```

Result: 

```javascript
{
  name: 'RIF US Dollar',
  symbol: 'USDRIF',
  decimals: 18,
  totalSupply: BigInt('hex value')
}
```

`parser.makeContract()` method returns a `Contract` instance. You can use it directly like in the following example:

```javascript
import { Contract, createRskNodeProvider } from '@rsksmart/rsk-contract-parser';

// Setup
const abi = undefined; // For the following ERC20 methods, the default parser ABI can be used
const address = '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37'; // USDRIF on Mainnet
const nod3 = createRskNodeProvider('mainnet');

const contract = new Contract(abi, { address, nod3 });

// Call contract methods
const name = await contract.call('name'); // 'RIF US Dollar'
const symbol = await contract.call('symbol'); // 'USDRIF'
const decimals = await contract.call('decimals'); // 18
const totalSupply = await contract.call('totalSupply'); // BigInt('hex value')

// with params...
const params = ['0xaddress'];
const balance = await contract.call('balanceOf', params); // BigInt('hex value')

// with specific call options...
const options = {
  txData: {},
  blockNumber: 'latest'
}

const balance = await contract.call('balanceOf', params, options); // BigInt('hex value')
```

### Analyzing Contract Details

The `ContractParser` class also allows to get detailed information about a contract:

```javascript
import { ContractParser, createRskNodeProvider, publicRskNodeUrls } from '@rsksmart/rsk-contract-parser';

const nod3 = createRskNodeProvider('mainnet');
const initConfig = {
  net: {
    id: publicRskNodeUrls[network].id
  }
}

const parser = new ContractParser({ nod3, initConfig });
const contractAddress = '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37'; // USDRIF on Mainnet

// Get contract details at the latest block
const contractDetails = await parser.getContractDetails(contractAddress);
console.log(contractDetails);
```

Result:

```javascript
{
  address: '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37',
  isProxy: true,
  implementationAddress: '0xabb96fc7d16bbbae444e913cc6729694a4a4d69f',
  beaconAddress: null,
  proxyType: 'ERC1967 Normal',
  methods: [
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
  interfaces: [ 'ERC20', 'ERC165', 'ERC1822', 'ERC1967' ]
}
```

**Note:** It is recommended to set the verified ABI to retrieve the full contract details (in case of proxies, the implementation contract ABI). Using USDRIF verified abi, the result will be something like this:

```javascript
{
  address: '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37',
  isProxy: true,
  implementationAddress: '0xabb96fc7d16bbbae444e913cc6729694a4a4d69f',
  beaconAddress: null,
  proxyType: 'ERC1967 Normal',
  methods: [
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
  interfaces: [ 'ERC20', 'ERC165', 'ERC1822', 'ERC1967' ]
}
```

You can also retrieve the contract details at a specific block number:

```javascript
const contractDetails = await parser.getContractDetails(contractAddress, 100);
```

Result:

```javascript
{
  address: '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37',
  isProxy: false,
  implementationAddress: null,
  beaconAddress: null,
  proxyType: null,
  methods: [],
  interfaces: []
}
```

### Working with Native Contracts

The `ContractParser` class allows interaction with native contracts like the Bridge and Remasc.

```javascript
import {
  ContractParser,
  getRskReleaseByBlockNumber,
  RSK_RELEASES,
  createRskNodeProvider,
  publicRskNodeUrls
} from '@rsksmart/rsk-contract-parser';

const network = 'mainnet';
const nod3 = createRskNodeProvider(network);
const initConfig = {
  net: {
    id: publicRskNodeUrls[network].id
  }
}

const parser = new ContractParser({ nod3, initConfig });

// Get RSK native contract address
const bridgeAddress = parser.getNativeContractAddress('bridge'); // '0x0000000000000000000000000000000001000006' (testnet and mainnet)
const remascAddress = parser.getNativeContractAddress('remasc'); // '0x0000000000000000000000000000000001000008' (testnet and mainnet)

// To interact with the bridge and decode its events, we need to get the correct rsk release for the specified block and network, which contains the proper bridge ABI
const bridgeRelease = getRskReleaseByBlockNumber(7338024, 'mainnet');

// Available RSK releases
console.log(RSK_RELEASES.mainnet); // Available releases for mainnet
console.log(RSK_RELEASES.testnet); // Available releases for testnet
```

### Bridge specific

You can easily get the latest bridge ABI and methods (latest rsk release):

```javascript
import { getLatestBridgeMethods, getLatestBridgeAbi } from '@rsksmart/rsk-contract-parser';

const bridgeAbi = getLatestBridgeAbi();
const bridgeMethods = getLatestBridgeMethods();

```

Another way is to retrieve the latest rsk release using the `getRskReleaseByBlockNumber` method:

```javascript
import { getRskReleaseByBlockNumber } from '@rsksmart/rsk-contract-parser';

const latestRskRelease = getRskReleaseByBlockNumber('latest', 'mainnet');
console.log(latestRskRelease);
```

Result:

```javascript
{
  name // <rsk-release-name>,
  height // <activation-block-number>,
  abi // <bridge-abi>
}
```

### Parsing Transaction Logs

The `ContractParser` class allows to parse transaction logs.

```javascript
import { ContractParser, createRskNodeProvider, publicRskNodeUrls } from '@rsksmart/rsk-contract-parser';

const network = 'mainnet';
const nod3 = createRskNodeProvider(network);
const initConfig = {
  net: {
    id: publicRskNodeUrls[network].id
  }
}

const parser = new ContractParser({ nod3, initConfig });
const txReceipt = await nod3.eth.getTransactionReceipt('0xTransactionHash');

// Parse transaction logs from a transaction using the current parser ABI
const events = parser.parseTxLogs(txReceipt.logs);
```

### Example

For the following log present in the tx **0x833ff7250b7b6f0d1e0e048bdf0417af16ea6e0dd5e22929da12d9ea9a68cbff** (mainnet):

```javascript
{
  logIndex: 0,
  blockNumber: 7389136,
  blockHash: '0x304f91fe91075cf228bf6365cd54e147836b5b1cd56e253d7d928a36b3edb851',
  transactionHash: '0x833ff7250b7b6f0d1e0e048bdf0417af16ea6e0dd5e22929da12d9ea9a68cbff',
  transactionIndex: 3,
  address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
  data: '0x000000000000000000000000000000000000000000000659a719ccc43e100000',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x0000000000000000000000007ef673bedb238526168c44885797d117921c66cc',
    '0x000000000000000000000000804c44cec51b24e9f20447f8d21ba153403280d1'
  ]
}
```

The result will be:

```javascript
{
  logIndex: 0,
  blockNumber: 7389136,
  blockHash: '0x304f91fe91075cf228bf6365cd54e147836b5b1cd56e253d7d928a36b3edb851',
  transactionHash: '0x833ff7250b7b6f0d1e0e048bdf0417af16ea6e0dd5e22929da12d9ea9a68cbff',
  transactionIndex: 3,
  address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
  data: '0x000000000000000000000000000000000000000000000659a719ccc43e100000',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x0000000000000000000000007ef673bedb238526168c44885797d117921c66cc',
    '0x000000000000000000000000804c44cec51b24e9f20447f8d21ba153403280d1'
  ],
  signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  event: 'Transfer',
  args: [
    '0x7ef673bedb238526168c44885797d117921c66cc',
    '0x804c44cec51b24e9f20447f8d21ba153403280d1',
    '0x0659a719ccc43e100000'
  ],
  abi: {
    type: 'event',
    anonymous: false,
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value', indexed: false }
    ]
  },
  _addresses: [
    '0x7ef673bedb238526168c44885797d117921c66cc',
    '0x804c44cec51b24e9f20447f8d21ba153403280d1'
  ]
}
```

### Blockchain searches

The `BcSearch` class allows to search specific data on the blockchain.

Deployments:
```javascript
import { BcSearch, createRskNodeProvider } from '@rsksmart/rsk-contract-parser';

const network = 'mainnet';
const nod3 = createRskNodeProvider(network);

// Initialize blockchain search helper
const bcSearch = BcSearch(nod3);

// Get deployment tx for a contract
const contractAddress = '0x3A15461d8aE0F0Fb5Fa2629e9DA7D66A794a6e37'; // USDRIF
const deployment = await bcSearch.deploymentTx(contractAddress);
```