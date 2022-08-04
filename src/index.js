import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import bridge from './lib/nativeContracts/bridgeAbi'
const abi = { bridge }
export { ContractParser, BcSearch, Contract, abi }
export default ContractParser
