import { getBridgeAbi, getBridgeAddress, getBridgeMethods } from '../../../src/lib/utils'

export const Bridge = {
  abi: getBridgeAbi(),
  bytecode: '0x',
  network: 'testnet',
  name: 'Bridge',
  address: getBridgeAddress(),
  unverifiedMethods: getBridgeMethods(),
  unverifiedInterfaces: [],
  verifiedMethods: getBridgeMethods(),
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
