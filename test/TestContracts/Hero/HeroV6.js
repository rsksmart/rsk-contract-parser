import HeroV6_ABI from './HeroV6_ABI.json'
import HeroV6_BYTECODE from './HeroV6_bytecode'

export const HEROV6 = {
  abi: HeroV6_ABI,
  bytecode: HeroV6_BYTECODE,
  network: 'testnet',
  name: 'HeroV6',
  address: '0x053b55D51D013e3BFa7Be380f629C186f92aB734',
  unverifiedMethods: ['getBalance()'],
  unverifiedInterfaces: [],
  verifiedMethods: [
    'acceptAddresses(address[])',
    'acceptBytes(bytes1,bytes2,bytes32)',
    'acceptComplexTuple((uint256,uint256,address,bool,uint256[],string[],(uint256,uint256,address,bool),(uint256,uint256,address,bool)[]))',
    'acceptFixedComplexTupleArray((uint256,uint256,address,bool,uint256[],string[],(uint256,uint256,address,bool),(uint256,uint256,address,bool)[])[3])',
    'acceptTuple((uint256,uint256,address,bool))',
    'acceptUints(uint8,uint16,uint256,uint256)',
    'acceptedApprenticeTypes()',
    'addComplexData(uint256,address[],uint256[],string[])',
    'apprentices(string,uint256)',
    'complexDataIds(uint256)',
    'createComplexDataSnapshot()',
    'defeatVillian()',
    'getApprenticesByCategory(string)',
    'getApprenticesByCategoryBool(bool)',
    'getBalance()',
    'getComplexDataById(uint256)',
    'getHeroStats()',
    'hero()',
    'newApprentice(uint256)',
    'overloadTest(uint256)',
    'overloadTest(uint256,uint256)',
    'sendViaCall(address,uint256)',
    'totalApprentices()',
    'updateComplexData(uint256,address[],uint256[],string[])',
    'villiansDefeated()',
    'worldSaved()'
  ],
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
