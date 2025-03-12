import { expect } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import { nod3Connect } from '../src/lib/nod3Connect'
import ERC20_ABI from '../src/lib/jsonAbis/ERC20.json'
import interfacesIds from '../src/lib/interfacesIds'
import { solidityName } from '../src/lib/utils'
import Contract from '../src/lib/Contract'
import { Bridge, HEROV6, USDRIF, USDCe } from './TestContracts'
import { PROXY_TYPES } from '../src/lib/types'

const originalConsoleLog = console.log

console.log = function (message) {
  if (!String(message).includes('duplicate definition')) {
    originalConsoleLog(message)
  }
}


const getNod3Instance = (network) => {
  if (!network) {
    throw new Error('Nod3 requires a network either "testnet" or "mainnet"')
  }

  if (network === 'mainnet') {
    return nod3Connect('https://public-node.rsk.co')
  }
  
  return nod3Connect('https://public-node.testnet.rsk.co')
}

describe('# Network', function () {
  it('should connect to public RSK testnet', async function () {
    const nod3 = getNod3Instance('testnet')
    const net = await nod3.net.version()
    expect(net.id).to.equal('31')
  })

  it('should connect to public RSK mainnet', async function () {
    const nod3 = getNod3Instance('mainnet')
    const net = await nod3.net.version()
    expect(net.id).to.equal('30')
  })
})

describe('Contract parser', function () {
  describe('1) getTokenData()', () => {
    it('should return the token data', async () => {
      const expectedTokenData = {
        name: 'RIF Token',
        symbol: 'RIF',
        decimals: 0,
        totalSupply: BigInt('0x2710')
      }

      const nod3 = getNod3Instance('testnet')
      const parser = new ContractParser({ nod3 })
      const tokenAddress = '0xebea27d994371cd0cb9896ae4c926bc5221f6317'
      let contract = parser.makeContract(tokenAddress)
      const tokenData = await parser.getTokenData(contract)

      if (tokenData.totalSupply) {
        tokenData.totalSupply = BigInt(tokenData.totalSupply)
      }

      expect(tokenData).to.deep.equal(expectedTokenData)
    })
  })

  describe('2) getMethodsFromAbi()', () => {
    it('should return methods from ABI', async () => {
      const methods = ContractParser.getMethodsFromAbi(ERC20_ABI)
      expect(methods).to.have.length(9)
      
      const methodsSignatures = methods.map(method => solidityName(method))
      const expectedSignatures = interfacesIds.ERC20.methods

      expect(methodsSignatures).to.include.members(expectedSignatures)
      expect(methodsSignatures).to.have.length(expectedSignatures.length)
    })
  })

  describe('3) getNativeContractAddress()', () => {
    const nod3 = getNod3Instance('testnet')
    const parser = new ContractParser({ nod3 })

    const testCases = [
      {
        name: 'bridge',
        expectedAddress: '0x0000000000000000000000000000000001000006'
      },
      {
        name: 'remasc',
        expectedAddress: '0x0000000000000000000000000000000001000008'
      },
      {
        name: 'unknown name',
        expectedAddress: undefined
      }
    ]

    for (const { name, expectedAddress } of testCases) {
      it(`should return ${expectedAddress} for ${name}`, () => {
        const address = parser.getNativeContractAddress(name)
        expect(address).to.equal(expectedAddress)
      })
    }
  })

  describe('4) setAbi()', () => {
    it('should properly set an ABI', () => {
      const nod3 = getNod3Instance('testnet')
      const parser = new ContractParser({ nod3 })
      const abi = ERC20_ABI
      parser.setAbi(abi)
      expect(parser.getAbi()).to.equal(abi)

      expect(() => parser.setAbi('invalid')).to.throw('ABI must be an array')
    })
  })
  
  describe('5) getAbiMethods()', () => {
    const nod3 = getNod3Instance('testnet')
    const parser = new ContractParser({ nod3 })
    parser.setAbi(ERC20_ABI)
    
    const methods = parser.getAbiMethods()

    expect(Object.keys(methods)).to.have.length(9)

    const testCases = [
      {
        method: methods['transfer(address,uint256)'],
        expected: {
          name: 'transfer',
          method: 'transfer(address,uint256)',
          signature: 'a9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b'
        }
      },
      {
        method: methods['balanceOf(address)'],
        expected: {
          name: 'balanceOf',
          method: 'balanceOf(address)',
          signature: '70a08231b98ef4ca268c9cc3f6b4590e4bfec28280db06bb5d45e689f2a360be'
        }
      },
      {
        method: methods['approve(address,uint256)'],
        expected: {
          name: 'approve',
          method: 'approve(address,uint256)',
          signature: '095ea7b334ae44009aa867bfb386f5c3b4b443ac6f0ee573fa91c4608fbadfba'
        }
      },
      {
        method: methods['transferFrom(address,address,uint256)'],
        expected: {
          name: 'transferFrom',
          method: 'transferFrom(address,address,uint256)',
          signature: '23b872dd7302113369cda2901243429419bec145408fa8b352b3dd92b66c680b'
        }
      }
    ]

    for (const { method, expected } of testCases) {
      it(`should return details for "${method.name}" method`, () => {
        expect(method).to.exist
        expect(method.name).to.equal(expected.name)
        expect(method.method).to.equal(expected.method)
        expect(method.signature).to.equal(expected.signature)
      })
    }
  })

  describe('6) makeContract()', () => {
    it(`should create a contract instance for ${USDCe.name} ${USDCe.address} (${USDCe.network})`, () => {
      const nod3 = getNod3Instance(USDCe.network)
      const parser = new ContractParser({ nod3 })
      const contract = parser.makeContract(USDCe.address)
      expect(contract).to.exist.and.to.be.instanceOf(Contract)
      expect(contract.getAddress()).to.equal(USDCe.address)
    })
  })

  describe('7) call()', () => {
    it('should call a contract method', async () => {
      const nod3 = getNod3Instance(HEROV6.network)

      const parser = new ContractParser({ nod3, abi: HEROV6.abi })
      const contract = parser.makeContract(HEROV6.address)
      const result = await contract.call('hero')
      expect(result).to.equal('0xFEC90a97eeB211c0b15c4bb617ab24bCAd5106CF')
    })
  })

  describe('8) mapInterfacesToERCs()', () => {
    const nod3 = getNod3Instance('testnet')
    const parser = new ContractParser({ nod3 })
    
    const testCases = [
      {
        interfaces: {
          'ERC20': true,
          'ERC721': true,
          'ERC165': false,
        },
        expected: ['ERC20', 'ERC721']
      },
      {
        interfaces: {},
        expected: []
      },
      {
        interfaces: {
          'ERC20': false,
          'ERC1967': true
        },
        expected: ['ERC1967']
      }
    ]
    
    for (const { interfaces, expected } of testCases) {
      it(`should map interfaces to ERCs ${JSON.stringify(expected)}`, () => {
        const result = parser.mapInterfacesToERCs(interfaces)
        expect(result).to.include.members(expected)
        expect(result).to.not.include('ERC165')
        expect(result).to.have.length(expected.length)
      })
    }
  })

  describe('9) hasMethodSelector()', () => {
    const nod3 = getNod3Instance(HEROV6.network)
    const parser = new ContractParser({ nod3 })
    const contractBytecode = HEROV6.bytecode

    const selectors = [
      {
        selector: '7f513d5d',
        expected: true
      },
      {
        selector: 'f4cc3db1',
        expected: true
      },
      {
        selector: '8d5825e7',
        expected: true
      },
      {
        selector: '281fc69a',
        expected: false
      }
    ]

    for (const { selector, expected } of selectors) {
      it(`should return ${expected} when looking for selector "${selector}" in contract bytecode`, async () => {
        const result = parser.hasMethodSelector(contractBytecode, selector)
        expect(result).to.equal(expected)
      })
    }
  })

  describe('10) getMethodsSelectors()', () => {
    it('should return method selectors for a current set abi', async () => {
      const nod3 = getNod3Instance(HEROV6.network)
      const parser = new ContractParser({ nod3, abi: HEROV6.abi })
      const selectors = parser.getMethodsSelectors()

      expect(selectors).to.be.an('object')
      expect(Object.keys(selectors)).to.have.length(26)
      expect(Object.keys(selectors)).to.include.all.members(HEROV6.verifiedMethods)
    })
  })

  describe('11) getMethodsFromContractByteCode()', () => {
    it('should return detected methods from contract bytecode', async () => {
      const nod3 = getNod3Instance(HEROV6.network)

      const parser = new ContractParser({ nod3, abi: HEROV6.abi })
      const methods = parser.getMethodsFromContractByteCode(HEROV6.bytecode)

      expect(methods).to.have.length(26)
      expect(methods).to.include.all.members(HEROV6.verifiedMethods)
    })
  })

  describe('12) getContractCodeFromNode()', () => {
    it(`should return contract code for contract ${HEROV6.name} ${HEROV6.address} (${HEROV6.network})`, async () => {
      const nod3 = getNod3Instance(HEROV6.network)

      const parser = new ContractParser({ nod3, abi: HEROV6.abi })
      const contractCode = await parser.getContractCodeFromNode(HEROV6.address)

      expect(contractCode).to.not.equal('0x')
    })
  })

  describe('13) getInterfacesByMethods()', () => {
    it(`should return interfaces by methods for contract ${USDRIF.name} ${USDRIF.address} (${USDRIF.network})`, async () => {
      const nod3 = getNod3Instance(USDRIF.network)
      const parser = new ContractParser({ nod3, abi: USDRIF.proxyDetails.implementationABI })
      const interfaces = parser.getInterfacesByMethods(USDRIF.proxyDetails.verifiedImplementationMethods)
      const expectedInterfaces = USDRIF.proxyDetails.verifiedImplementationInterfaces

      expect(interfaces).to.have.length(expectedInterfaces.length)
      expect(interfaces).to.include.members(expectedInterfaces)
    })
  })

  describe('14) getContractMethodsAndERCInterfaces()', function() {
    this.timeout(60000)

    const testContracts = [Bridge, HEROV6, USDRIF, USDCe]

    for (const contract of testContracts) {
      describe(`${contract.name} ${contract.address} (${contract.network})`, () => {
        const nod3 = getNod3Instance(contract.network)

        it('should return correct methods and ERC interfaces for both verified and unverified ABI cases', async () => {
          // Skip Bridge verified ABI case since this method relies con contract bytecode inspection and bridge contract does not have accessible bytecode (0x)
          if (contract.address !== Bridge.address) {
            // Test contract with verified ABI
            const abi = contract.abi
            const expectedVerifiedMethods = contract.verifiedMethods
            const expectedVerifiedInterfaces = contract.verifiedInterfaces
            const verifiedParser = new ContractParser({ nod3, abi })
            const {
              methods: verifiedMethods,
              interfaces: verifiedInterfaces
            } = await verifiedParser.getContractMethodsAndERCInterfaces(contract.address)
            
            expect(verifiedMethods).to.have.length(expectedVerifiedMethods.length).and.to.include.all.members(expectedVerifiedMethods)
            expect(verifiedInterfaces).to.have.length(expectedVerifiedInterfaces.length).and.to.include.all.members(expectedVerifiedInterfaces)
          }

          // Test contract with default ABI (unverified case)
          const expectedUnverifiedMethods = contract.unverifiedMethods
          const expectedUnverifiedInterfaces = contract.unverifiedInterfaces
          const unverifiedParser = new ContractParser({ nod3 })
          const {
            methods: unverifiedMethods,
            interfaces: unverifiedInterfaces
          } = await unverifiedParser.getContractMethodsAndERCInterfaces(contract.address)

          expect(unverifiedMethods).to.have.length(expectedUnverifiedMethods.length).and.to.include.all.members(expectedUnverifiedMethods)
          expect(unverifiedInterfaces).to.have.length(expectedUnverifiedInterfaces.length).and.to.include.all.members(expectedUnverifiedInterfaces)

          // Test implementation contract if it's a proxy
          if (contract.proxyDetails.isProxy) {
            // Test implementation with verified ABI
            const abi = contract.proxyDetails.implementationABI
            const expectedImplVerifiedMethods = contract.proxyDetails.verifiedImplementationMethods
            const expectedImplVerifiedInterfaces = contract.proxyDetails.verifiedImplementationInterfaces
            const implVerifiedParser = new ContractParser({ nod3, abi })
            const {
              methods: implVerifiedMethods,
              interfaces: implVerifiedInterfaces
            } = await implVerifiedParser.getContractMethodsAndERCInterfaces(contract.proxyDetails.implementationAddress)
            
            expect(implVerifiedMethods).to.have.length(expectedImplVerifiedMethods.length).and.to.include.all.members(expectedImplVerifiedMethods)
            expect(implVerifiedInterfaces).to.have.length(expectedImplVerifiedInterfaces.length).and.to.include.all.members(expectedImplVerifiedInterfaces)

            // Test implementation with default ABI
            const expectedImplUnverifiedMethods = contract.proxyDetails.unverifiedImplementationMethods
            const expectedImplUnverifiedInterfaces = contract.proxyDetails.unverifiedImplementationInterfaces
            const implUnverifiedParser = new ContractParser({ nod3 })
            const {
              methods: implUnverifiedMethods,
              interfaces: implUnverifiedInterfaces
            } = await implUnverifiedParser.getContractMethodsAndERCInterfaces(contract.proxyDetails.implementationAddress)

            expect(implUnverifiedMethods).to.have.length(expectedImplUnverifiedMethods.length).and.to.include.all.members(expectedImplUnverifiedMethods)
            expect(implUnverifiedInterfaces).to.have.length(expectedImplUnverifiedInterfaces.length).and.to.include.all.members(expectedImplUnverifiedInterfaces)
          }
        })
      })
    }
  })

  describe('15) getStorageSlotValueFromNode()', () => {
    it('should return the slot value from node', async () => {
      const nod3 = getNod3Instance(USDRIF.network)
      const ERC1967_IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      const parser = new ContractParser({ nod3 })
      const value = await parser.getStorageSlotValueFromNode(USDRIF.address, ERC1967_IMPLEMENTATION_SLOT)

      expect(value).to.be.a('string').with.lengthOf(66)
    })
  })

  describe('16) isERC1967Proxy()', () => {
    it(`should return ERC1967 proxy details for ${USDRIF.name} ${USDRIF.address} (${USDRIF.network})`, async () => {
      const nod3 = getNod3Instance(USDRIF.network)
      const parser = new ContractParser({ nod3 })
      const proxyDetails = await parser.isERC1967Proxy(USDRIF.address)
      const {
        address,
        isUpgradeable,
        implementationAddress,
        beaconAddress,
        proxyType,
      } = proxyDetails

      expect(proxyDetails).to.exist
      expect(address).to.equal(USDRIF.address)
      expect(isUpgradeable).to.equal(true)
      expect(proxyType).to.equal(PROXY_TYPES.ERC1967.Normal)
      expect(implementationAddress).to.equal(USDRIF.proxyDetails.implementationAddress)
      expect(beaconAddress).to.equal(null)
    })

    it(`should return empty ERC1967 proxy details for ${HEROV6.name} ${HEROV6.address} (${HEROV6.network})`, async () => {
      const nod3 = getNod3Instance(HEROV6.network)
      const parser = new ContractParser({ nod3 })
      const proxyDetails = await parser.isERC1967Proxy(HEROV6.address)
      const {
        address,
        isUpgradeable,
        implementationAddress,
        beaconAddress,
        proxyType,
      } = proxyDetails

      expect(proxyDetails).to.exist
      expect(address).to.equal(HEROV6.address)
      expect(isUpgradeable).to.equal(false)
      expect(proxyType).to.equal(null)
      expect(implementationAddress).to.equal(null)
      expect(beaconAddress).to.equal(null)
    })
  })

  describe('17) isOZUnstructuredStorageProxy()', () => {
    it(`should return OZ unstructured storage proxy details for ${USDCe.name} ${USDCe.address} (${USDCe.network})`, async () => {
      const nod3 = getNod3Instance(USDCe.network)
      const parser = new ContractParser({ nod3 })
      const proxyDetails = await parser.isOZUnstructuredStorageProxy(USDCe.address)
      const {
        address,
        isUpgradeable,
        implementationAddress,
        beaconAddress,
        proxyType,
      } = proxyDetails

      expect(proxyDetails).to.exist
      expect(address).to.equal(USDCe.address)
      expect(isUpgradeable).to.equal(true)
      expect(proxyType).to.equal(PROXY_TYPES.OZUnstructuredStorage)
      expect(implementationAddress).to.equal(USDCe.proxyDetails.implementationAddress)
      expect(beaconAddress).to.equal(null)
    })

    it(`should return empty OZ unstructured storage proxy details for ${HEROV6.name} ${HEROV6.address} (${HEROV6.network})`, async () => {
      const nod3 = getNod3Instance(HEROV6.network)
      const parser = new ContractParser({ nod3 })
      const proxyDetails = await parser.isOZUnstructuredStorageProxy(HEROV6.address)
      const {
        address,
        isUpgradeable,
        implementationAddress,
        beaconAddress,
        proxyType,
      } = proxyDetails

      expect(proxyDetails).to.exist
      expect(address).to.equal(HEROV6.address)
      expect(isUpgradeable).to.equal(false)
      expect(proxyType).to.equal(null)
      expect(implementationAddress).to.equal(null)
      expect(beaconAddress).to.equal(null)
    })
  })

  describe('18) getProxyDetails()', function() {
    this.timeout(60000)

    const testCases = [
      {
        contract: Bridge,
        expectedProxyDetails: {
          address: Bridge.address,
          isUpgradeable: false,
          implementationAddress: null,
          beaconAddress: null,
          proxyType: null,
          methods: [],
          interfaces: []
        }
      },
      {
        contract: HEROV6,
        expectedProxyDetails: {
          address: HEROV6.address,
          isUpgradeable: false,
          implementationAddress: null,
          beaconAddress: null,
          proxyType: null,
          methods: [],
          interfaces: []
        }
      },
      {
        contract: USDRIF,
        expectedProxyDetails: {
          address: USDRIF.address,
          isUpgradeable: true,
          implementationAddress: USDRIF.proxyDetails.implementationAddress,
          beaconAddress: null,
          proxyType: PROXY_TYPES.ERC1967.Normal,
          methods: USDRIF.proxyDetails.unverifiedImplementationMethods,
          interfaces: [...USDRIF.proxyDetails.unverifiedImplementationInterfaces, 'ERC1967', 'ERC1822']
        }
      },
      {
        contract: USDCe,
        expectedProxyDetails: {
          address: USDCe.address,
          isUpgradeable: true,
          implementationAddress: USDCe.proxyDetails.implementationAddress,
          beaconAddress: null,
          proxyType: PROXY_TYPES.OZUnstructuredStorage,
          methods: USDCe.proxyDetails.unverifiedImplementationMethods,
          interfaces: [...USDCe.proxyDetails.unverifiedImplementationInterfaces, 'ERC1822']
        }
      }
    ]

    for (const { contract, expectedProxyDetails } of testCases) {
      describe(`${contract.name} ${contract.address} (${contract.network})`, () => {
        it('should return correct proxy details', async () => {
          const nod3 = getNod3Instance(contract.network)
          const parser = new ContractParser({ nod3 })
          const proxyDetails = await parser.getProxyDetails(contract.address)
          const {
            address,
            isUpgradeable,
            implementationAddress,
            beaconAddress,
            proxyType,
            methods,
            interfaces
          } = proxyDetails

          expect(proxyDetails).to.exist
          expect(address).to.equal(expectedProxyDetails.address)
          expect(isUpgradeable).to.equal(expectedProxyDetails.isUpgradeable)
          expect(proxyType).to.equal(expectedProxyDetails.proxyType)
          expect(implementationAddress).to.equal(expectedProxyDetails.implementationAddress)
          expect(beaconAddress).to.equal(expectedProxyDetails.beaconAddress)
          expect(methods).to.have.length(expectedProxyDetails.methods.length).and.to.include.all.members(expectedProxyDetails.methods)
          expect(interfaces).to.have.length(expectedProxyDetails.interfaces.length).and.to.include.all.members(expectedProxyDetails.interfaces)
        })
      })
    }
  })
})
