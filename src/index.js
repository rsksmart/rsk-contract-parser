import { ContractParser } from './lib/ContractParser'
import { BcSearch } from './lib/BcSearch'
import Contract from './lib/Contract'
import { getBridgeAbi } from './lib/nativeContracts/bridgeAbi'
const abi = { bridge: getBridgeAbi }
export { ContractParser, BcSearch, Contract, abi }
export default ContractParser

const originalConsoleLog = console.log

console.log = function (message) {
  if (!message.includes('duplicate definition')) {
    originalConsoleLog(message)
  }
}
