import USDRIF_ABI from './USDRIF_ABI.json'
import USDRIF_BYTECODE from './USDRIF_bytecode.js'
import USDRIF_impl_ABI from './USDRIF_impl_ABI.json'
import USDRIF_impl_BYTECODE from './USDRIF_impl_bytecode.js'

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
  }
}
