import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import bridge from './lib/nativeContracts/bridgeAbi'
import { contractsInterfaces } from './lib/types'
import * as Constants from './lib/Constants';
const abi = { bridge }
const types = { contractsInterfaces }
export { ContractParser, BcSearch, Contract, abi, types, Constants }
export default ContractParser
