import interfacesIds from './interfacesIds'
import { includesAll } from '@rsksmart/rsk-utils'
import NativeContractsDecoder from './nativeContracts/NativeContractsDecoder'
import NativeContracts from './nativeContracts/NativeContracts'
import Contract from './Contract'
import EventDecoder from './EventDecoder'
import defaultABI from './Abi'
import { ABI_SIGNATURE, bitcoinRskNetWorks, contractsInterfaces } from './types'
import {
  setAbi,
  removeAbiSignatureData,
  abiSignatureData,
  soliditySelector,
  soliditySignature
} from './utils'
import { remove0x } from '@rsksmart/rsk-utils/dist/strings'
import { EIP_1167_PREFIX, EIP_1167_SUFFIX } from './Constants';

export class ContractParser {
  constructor ({ abi, log, initConfig, nod3 } = {}) {
    initConfig = initConfig || {}
    const { net } = initConfig
    this.netId = (net) ? net.id : undefined
    this.abi = setAbi(abi || defaultABI)
    this.log = log || console
    this.nod3 = nod3
    this.nativeContracts = NativeContracts(initConfig)
    if (this.netId) {
      let bitcoinNetwork = bitcoinRskNetWorks[this.netId]
      this.nativeContractsEvents = NativeContractsDecoder({ bitcoinNetwork })
    }
  }

  setNod3 (nod3) {
    this.nod3 = nod3
  }

  getNativeContractAddress (name) {
    const { nativeContracts } = this
    if (nativeContracts) {
      return nativeContracts.getNativeContractAddress(name)
    }
  }

  setAbi (abi) {
    this.abi = setAbi(abi)
  }

  getMethodsSelectors () {
    let selectors = {}
    let methods = this.getAbiMethods()
    for (let m in methods) {
      let method = methods[m]
      let signature = method.signature || soliditySignature(m)
      selectors[m] = soliditySelector(signature)
    }
    return selectors
  }

  getAbiMethods () {
    let methods = {}
    this.abi.filter(def => def.type === 'function')
      .map(m => {
        let sig = m[ABI_SIGNATURE] || abiSignatureData(m)
        sig.name = m.name
        methods[sig.method] = sig
      })
    return methods
  }

  parseTxLogs (logs, abi) {
    return this.decodeLogs(logs, abi).map(event => {
      this.addEventAddresses(event)
      event.abi = removeAbiSignatureData(event.abi)
      return event
    })
  }

  addEventAddresses (event) {
    const { abi, args } = event
    let _addresses = event._addresses || []
    if (abi && args) {
      let inputs = abi.inputs || []
      inputs.forEach((v, i) => {
        if (v.type === 'address') {
          _addresses.push(args[i])
        }
        if (v.type === 'address[]') {
          let value = args[i] || []
          if (Array.isArray(value)) { // temp fix to undecoded events
            value.forEach(v => _addresses.push(v))
          }
        }
      })
      event._addresses = [...new Set(_addresses)]
    }
    return event
  }

  decodeLogs (logs, abi) {
    abi = abi || this.abi
    const eventDecoder = EventDecoder(abi)
    if (!this.nativeContracts || !this.nativeContractsEvents) {
      throw new Error(`Native contracts decoder is missing, check the value of netId:${this.netId}`)
    }
    const { isNativeContract } = this.nativeContracts
    const { nativeContractsEvents } = this
    return logs.map(log => {
      const { address } = log
      const decoder = (isNativeContract(address)) ? nativeContractsEvents.getEventDecoder(log) : eventDecoder
      return decoder.decodeLog(log)
    })
  }

  makeContract (address, abi) {
    abi = abi || this.abi
    let { nod3 } = this
    return Contract(abi, { address, nod3 })
  }

  async call (method, contract, params = [], options = {}) {
    try {
      const res = await contract.call(method, params, options)
      return res
    } catch (err) {
      this.log.warn(`Method ${method} call ${err}`)
      return null
    }
  }

  async getTokenData (contract, { methods } = {}) {
    methods = methods || ['name', 'symbol', 'decimals', 'totalSupply']
    let result = await Promise.all(
      methods.map(m =>
        this.call(m, contract)
          .then(res => res)
          .catch(err => this.log.debug(`[${contract.address}] Error executing ${m}  Error: ${err}`)))
    )
    return result.reduce((v, a, i) => {
      let name = methods[i]
      v[name] = a
      return v
    }, {})
  }

  hasMethodSelector (txInputData, selector) {
    return (selector && txInputData) ? txInputData.includes(selector) : null
  }

  getMethodsBySelectors (txInputData) {
    let methods = this.getMethodsSelectors()
    return Object.keys(methods)
      .filter(method => this.hasMethodSelector(txInputData, methods[method]) === true)
  }

  async getContractInfo (txInputData, contract) {
    let methods = this.getMethodsBySelectors(txInputData)
    let isErc165 = false
    //  skip non-erc165 contracts
    if (includesAll(methods, ['supportsInterface(bytes4)'])) {
      isErc165 = await this.implementsErc165(contract)
    }
    let interfaces
    if (isErc165) interfaces = await this.getInterfacesERC165(contract)
    else if (this.isEIP1167(txInputData)) interfaces = { EIP1167: true };
    else interfaces = this.getInterfacesByMethods(methods)
    interfaces = Object.keys(interfaces)
      .filter(k => interfaces[k] === true)
      .map(t => contractsInterfaces[t] || t)
    return { methods, interfaces }
  }

  getEip1167MasterCopy (bytecode) {
    const implementationAddress = bytecode.replace(EIP_1167_PREFIX, '').replace(EIP_1167_SUFFIX, '');
    return implementationAddress;
  }

  isEIP1167(bytecode) {
    const re = new RegExp(`^${EIP_1167_PREFIX}[a-f0-9]{40}${EIP_1167_SUFFIX}$`, 'i');
    return re.test(remove0x(bytecode));
  }

  async getInterfacesERC165(contract) {
    let ifaces = {}
    let keys = Object.keys(interfacesIds)
    for (let i of keys) {
      ifaces[i] = await this.supportsInterface(contract, interfacesIds[i].id)
    }
    return ifaces
  }

  getInterfacesByMethods (methods, isErc165) {
    return Object.keys(interfacesIds)
      .map(i => {
        return [i, includesAll(methods, interfacesIds[i].methods)]
      })
      .reduce((obj, value) => {
        obj[value[0]] = value[1]
        return obj
      }, {})
  }

  async supportsInterface (contract, interfaceId) {
    // fixed gas to prevent infinite loops
    let options = { gas: '0x7530' }
    let res = await this.call('supportsInterface', contract, [interfaceId], options)
    return res
  }

  async implementsErc165 (contract) {
    try {
      let first = await this.supportsInterface(contract, interfacesIds.ERC165.id)
      if (first === true) {
        let second = await this.supportsInterface(contract, '0xffffffff')
        return !(second === true || second === null)
      }
      return false
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export default ContractParser
