export const ABI_SIGNATURE = '__signatureData'

export const INTERFACE_ID_BYTES = 4

export const bitcoinNetworks = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
  REGTEST: 'regtest'
}

export const bitcoinRskNetWorks = {
  31: bitcoinNetworks.TESTNET,
  30: bitcoinNetworks.MAINNET,
  33: bitcoinNetworks.REGTEST
}

// Common contract interfaces
export const contractsInterfaces = {
  ERC20: 'ERC20',
  ERC677: 'ERC677',
  ERC165: 'ERC165',
  ERC721: 'ERC721',
  ERC1822: 'ERC1822', // Universal Upgradeable Proxy Standard (UUPS)
  ERC1967: 'ERC1967' // ERC 1967 standard for proxies
}

const ci = contractsInterfaces

export const tokensInterfaces = [
  ci.ERC20,
  ci.ERC677,
  ci.ERC721
]

/**
 * Constants for proxy types.
 */
export const PROXY_TYPES = {
  ERC1967: {
    Normal: 'ERC1967 Normal',
    Beacon: 'ERC1967 Beacon'
  },
  OZUnstructuredStorage: 'Open Zeppelin Unstructured Storage (pre ERC1967)'
}
