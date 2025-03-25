import { getLatestBridgeAbi, getBridgeAddress, getLatestBridgeMethods } from '../../../src/lib/utils'

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
  }
}
