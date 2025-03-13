import { bridge } from '@rsksmart/rsk-precompiled-abis'
import { solidityName } from '../../../src/lib/utils'

// LOVELL 7.1.0
export const Bridge = {
  abi: bridge.abi,
  bytecode: '0x',
  network: 'testnet',
  name: 'Bridge',
  address: bridge.address,
  unverifiedMethods: [],
  unverifiedInterfaces: [],
  verifiedMethods: bridge.abi.map(solidityName),
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
