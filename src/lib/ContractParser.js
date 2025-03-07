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
  soliditySignature,
  formatAddressFromSlot,
  notZero
} from './utils'
import { isAddress } from '@rsksmart/rsk-utils/dist/addresses'

/**
 * Maps interfaces to ERCs.
 * @param {Object} interfaces - The interfaces to map
 * @returns {Array} The mapped interfaces
 */
function mapInterfacesToERCs (interfaces) {
  return Object.keys(interfaces)
    .filter(k => interfaces[k] === true)
    .map(t => contractsInterfaces[t] || t)
}

/**
 * Checks if a contract bytecode contains a method selector.
 * @param {string} contractByteCode - The bytecode of the contract
 * @param {string} selector - The selector to check for
 * @returns {boolean} True if the selector is found in the contract bytecode, false otherwise
 */
function hasMethodSelector (contractByteCode, selector) {
  return selector && contractByteCode && contractByteCode.includes(selector)
}

/**
 * Constants for proxy types.
 * @type {Object}
 * @property {Object} EIP1967 - Constants for EIP-1967 proxy types
 * @property {string} EIP1967.Normal - Normal EIP-1967 proxy type
 * @property {string} EIP1967.Beacon - Beacon EIP-1967 proxy type
 * @property {string} OZUnstructuredStorage - Open Zeppelin Unstructured Storage proxy type
 */
const PROXY_TYPES = {
  EIP1967: {
    Normal: 'EIP-1967 Normal',
    Beacon: 'EIP-1967 Beacon'
  },
  OZUnstructuredStorage: 'Open Zeppelin Unstructured Storage (pre EIP-1967)'
}

/**
 * The ContractParser class handles the analysis and interpretation of Ethereum smart contracts.
 *
 * This class provides comprehensive functionality for working with contract ABIs,
 * transaction data, and event logs in blockchain networks. It enables:
 *
 * - Decoding of contract method calls and event signatures
 * - Identification of implemented interfaces (ERC standards)
 * - Analysis of proxy patterns with implementation resolution
 * - Processing of native contract events specific to RSK networks
 */
export class ContractParser {
  /**
   * Creates a new ContractParser instance.
   * @param {Object} options - Configuration options
   * @param {Array} [options.abi] - The Application Binary Interface (ABI) used for decoding. If not provided, a default ABI is used, however its strongly recommended to provide the full ABI.
   * @param {Object} [options.log=console] - Logging mechanism to use for error and debug messages
   * @param {Object} [options.initConfig] - Initial configuration object
   * @param {Object} [options.initConfig.net] - Network configuration information
   * @param {string|number} [options.initConfig.net.id] - Network ID used to determine RSK/Bitcoin network
   * @param {Object} [options.nod3] - Nod3 instance for making blockchain calls
   * @param {number} [options.txBlockNumber] - Transaction's block number for accurate event decoding
   */
  constructor ({ abi, log, initConfig, nod3, txBlockNumber } = {}) {
    initConfig = initConfig || {}
    const { net } = initConfig
    this.netId = (net) ? net.id : undefined
    this.abi = setAbi(abi || defaultABI)
    this.log = log || console
    this.nod3 = nod3
    this.nativeContracts = NativeContracts(initConfig)
    if (this.netId) {
      let bitcoinNetwork = bitcoinRskNetWorks[this.netId]
      this.nativeContractsEvents = NativeContractsDecoder({ bitcoinNetwork, txBlockNumber })
    }
  }

  /**
   * Sets the Nod3 instance for making blockchain calls.
   * @param {Object} nod3 - Nod3 instance for making blockchain calls
   */
  setNod3 (nod3) {
    this.nod3 = nod3
  }

  /**
   * Retrieves the address of a native contract.
   * @param {string} name - The name of the native contract
   * @returns {string} The address of the native contract
   */
  getNativeContractAddress (name) {
    const { nativeContracts } = this
    if (nativeContracts) {
      return nativeContracts.getNativeContractAddress(name)
    }
  }

  /**
   * Sets the ABI for the ContractParser instance.
   * @param {Array} abi - The Application Binary Interface (ABI) to use for decoding
   */
  setAbi (abi) {
    try {
      if (!Array.isArray(abi)) {
        throw new Error('ABI must be an array')
      }

      this.abi = setAbi(abi)
    } catch (error) {
      this.log.error('Error setting ABI. Switching back to default ABI.', error)
      this.abi = setAbi(defaultABI)
    }
  }

  /**
   * Retrieves the methods and their selectors from the ABI.
   * @param {Array} abi - The Application Binary Interface (ABI) to use for decoding
   * @returns {Object} An object containing method names as keys and their selectors as values
   */
  getMethodsSelectors (abi) {
    let selectors = {}
    let methods = this.getAbiMethods(abi || this.abi)
    for (let m in methods) {
      let method = methods[m]
      let signature = method.signature || soliditySignature(m)
      selectors[m] = soliditySelector(signature)
    }
    return selectors
  }

  /**
   * Retrieves the methods and their signatures from the ABI.
   * @param {Array} fromAbi - The ABI to use for decoding
   * @returns {Object} An object containing method names as keys and their signatures as values
   */
  getAbiMethods (fromAbi) {
    let methods = {}
    const abi = fromAbi || this.abi
    abi.filter(def => def.type === 'function')
      .map(m => {
        let sig = m[ABI_SIGNATURE] || abiSignatureData(m)
        sig.name = m.name
        methods[sig.method] = sig
      })
    return methods
  }

  /**
   * Parses transaction logs and returns decoded events.
   * @param {Array} logs - The transaction logs to parse
   * @param {Array} [abi] - The Application Binary Interface (ABI) to use for decoding
   * @returns {Array} An array of decoded events
   */
  parseTxLogs (logs, abi) {
    return this.decodeLogs(logs, abi).map(event => {
      this.addEventAddresses(event)
      event.abi = removeAbiSignatureData(event.abi)
      return event
    })
  }

  /**
   * Adds event addresses to the event object.
   * @param {Object} event - The event object to add addresses to
   */
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
          } else {
            let i = 0
            while (2 + (i + 1) * 40 <= value.length) {
              _addresses.push('0x' + value.slice(2 + i * 40, 2 + (i + 1) * 40))
              i++
            }
          }
        }
      })
      event._addresses = [...new Set(_addresses)]
    }
    return event
  }

  /**
   * Decodes transaction logs and returns decoded events.
   * @param {Array} logs - The transaction logs to decode
   * @param {Array} [abi] - The Application Binary Interface (ABI) to use for decoding
   * @returns {Array} An array of decoded events
   */
  decodeLogs (logs, abi) {
    abi = abi || this.abi
    const eventDecoder = EventDecoder(abi, this.log)
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

  /**
   * Creates a contract instance, useful for calling methods on the contract.
   * @param {string} address - The address of the contract
   * @param {Array} [abi] - The Application Binary Interface (ABI) to use for the contract
   * @returns {Object} A contract instance
   */
  makeContract (address, abi) {
    abi = abi || this.abi
    let { nod3 } = this
    return Contract(abi, { address, nod3 })
  }

  /**
   * Calls a method on a contract.
   * @param {string} method - The method to call
   * @param {Object} contract - The contract object
   * @param {Array} [params] - The parameters to pass to the method
   * @param {Object} [options] - The options for the call
   */
  async call (method, contract, params = [], options = {}) {
    try {
      const res = await contract.call(method, params, options)
      return res
    } catch (err) {
      return null
    }
  }

  /**
   * Retrieves token data from a contract.
   * @param {Object} contract - The contract object
   * @param {Object} [options] - The options for the token data retrieval
   * @returns {Promise<Object>} The token data
   */
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

  /**
   * Retrieves the methods from the contract bytecode.
   * @param {string} contractByteCode - The bytecode of the contract. This also happens to be the txInputData on contract creation txs
   * @returns {Object} An object containing method names as keys and their selectors as values
   */
  getMethodsFromContractByteCode (contractByteCode) {
    let methods = this.getMethodsSelectors()
    return Object.keys(methods)
      .filter(method => hasMethodSelector(contractByteCode, methods[method]) === true)
  }

  /**
   * Retrieves the contract information from the contract bytecode.
   * @param {string} contractByteCode - The bytecode of the contract. This also happens to be the txInputData on contract creation txs
   * @param {Object} contract - The contract object
   * @returns {Object} An object containing the methods and interfaces of the contract
   */
  async getContractMethodsAndERCInterfaces (address, contract) {
    const contractByteCode = await this.getContractCodeFromNode(address)
    const { interfaces, methods } = await this.getContractImplementedInterfaces(contractByteCode, contract)

    return {
      methods,
      interfaces: mapInterfacesToERCs(interfaces)
    }
  }

  /**
   * Retrieves the proxy details of a contract.
   * @param {string} contractAddress - The address of the contract
   * @returns {Promise<Object>} The proxy details
   */
  async getProxyDetails (contractAddress) {
    let proxyDetails = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null,
      methods: [],
      interfaces: []
    }

    // ERC 1967 standard for proxies
    const ERC1967ProxyDetails = await this.isERC1967Proxy(contractAddress)
    if (ERC1967ProxyDetails.isUpgradeable) {
      proxyDetails = ERC1967ProxyDetails

      if (isAddress(proxyDetails.implementationAddress)) {
        // Set implementation methods and interfaces
        const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(
          proxyDetails.implementationAddress,
          this.makeContract(proxyDetails.implementationAddress)
        )
        proxyDetails.methods = methods
        proxyDetails.interfaces = [
          ...interfaces,
          contractsInterfaces.ERC1822,
          contractsInterfaces.ERC1967
        ]
      }

      return proxyDetails
    } else {
      // Open Zeppelin Unstructured Storage Pattern (before EIP-1967)
      const OZUnstructuredStorageProxyDetails = await this.isOZUnstructuredStorageProxy(contractAddress)

      if (OZUnstructuredStorageProxyDetails.isUpgradeable) {
        proxyDetails = OZUnstructuredStorageProxyDetails

        if (isAddress(proxyDetails.implementationAddress)) {
          // Set implementation methods and interfaces
          const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(
            proxyDetails.implementationAddress,
            this.makeContract(proxyDetails.implementationAddress)
          )
          proxyDetails.methods = methods
          proxyDetails.interfaces = [
            ...interfaces,
            contractsInterfaces.ERC1822
          ]
        }

        return proxyDetails
      }
    }

    return proxyDetails
  }

  /**
   * Retrieves the implemented interfaces of the contract.
   * @param {string} contractByteCode - The byte code of the contract. This also happens to be the txInputData on contract creation txs
   * @param {Object} contract - The contract object
   * @returns {Object} An object containing the methods and interfaces of the contract
   */
  async getContractImplementedInterfaces (contractByteCode, contract) {
    let methods = this.getMethodsFromContractByteCode(contractByteCode)
    let isErc165 = false
    //  skip non-erc165 contracts
    if (includesAll(methods, ['supportsInterface(bytes4)'])) {
      isErc165 = await this.implementsErc165(contract)
    }
    let interfaces
    if (isErc165) {
      interfaces = await this.getInterfacesERC165(contract)
    } else {
      interfaces = this.getInterfacesByMethods(methods)
    }

    return { methods, interfaces }
  }

  /**
   * Checks if the contract is a proxy contract using the ERC1967 standard.
   * @param {string} contractAddress - The address of the contract
   * @returns {Object} An object containing the proxy details
   * @see https://eips.ethereum.org/EIPS/eip-1967
   */
  async isERC1967Proxy (contractAddress) {
    const result = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null
    }

    // Normal Proxies
    const implementationSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

    let implementationSlotValue
    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.EIP1967.Normal}: ${err}`)
      return result
    }

    if (notZero(implementationSlotValue)) {
      result.proxyType = PROXY_TYPES.EIP1967.Normal
      result.isUpgradeable = true
      result.implementationAddress = formatAddressFromSlot(implementationSlotValue)
      return result
    }

    // Beacon Proxies
    const beaconSlot = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'

    let beaconSlotValue
    try {
      beaconSlotValue = await this.getStorageSlotValueFromNode(contractAddress, beaconSlot)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.EIP1967.Beacon}: ${err}`)
      return result
    }

    if (notZero(beaconSlotValue)) {
      result.proxyType = PROXY_TYPES.EIP1967.Beacon
      result.isUpgradeable = true

      try {
        // Get beacon contract address
        const beaconContractAddress = formatAddressFromSlot(beaconSlotValue)

        if (!isAddress(beaconContractAddress)) {
          throw new Error('Invalid beacon contract address')
        }

        // Create contract instance for the beacon
        const beaconContract = this.makeContract(beaconContractAddress)

        // Get implementation contract address from beacon contract
        const implementationAddress = await this.call('implementation', beaconContract)

        if (!isAddress(implementationAddress)) {
          throw new Error('Beacon returns an invalid implementation address')
        }

        result.implementationAddress = implementationAddress
        return result
      } catch (err) {
        this.log.warn(`[${contractAddress}] Error fetching implementation from beacon proxy: ${err}`)
        return result
      }
    }

    // Not a proxy contract
    return result
  }

  // Open Zeppelin Unstructured Storage Pattern (before EIP-1967)
  // Article: https://blog.openzeppelin.com/proxy-patterns
  // Repository: https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_using_unstructured_storage
  // Contract: https://github.com/OpenZeppelin/openzeppelin-labs/blob/master/upgradeability_using_unstructured_storage/contracts/UpgradeabilityProxy.sol
  async isOZUnstructuredStorageProxy (contractAddress) {
    const result = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null
    }

    const implementationSlot = '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3'
    let implementationSlotValue
    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.OZUnstructuredStorage}: ${err}`)
      return result
    }

    if (notZero(implementationSlotValue)) {
      result.proxyType = PROXY_TYPES.OZUnstructuredStorage
      result.isUpgradeable = true
      result.implementationAddress = formatAddressFromSlot(implementationSlotValue)

      return result
    }

    return result
  }

  /**
   * Retrieves the value of a storage slot from the node.
   * @param {string} contractAddress - The address of the contract
   * @param {string} slot - The slot to retrieve the value from
   * @returns {Promise<string>} The value of the storage slot
   */
  async getStorageSlotValueFromNode (contractAddress, slot) {
    return this.nod3.eth.getStorageAt(contractAddress, slot)
  }

  /**
   * Retrieves the contract code from the node.
   * @param {string} contractAddress - The address of the contract
   * @returns {Promise<string>} The contract code
   */
  async getContractCodeFromNode (contractAddress) {
    return this.nod3.eth.getContractCodeAt(contractAddress)
  }

  /**
   * Retrieves the interfaces of the contract based on the ERC165 standard.
   * @param {Object} contract - The contract object
   * @returns {Promise<Object>} An object containing the interfaces of the contract
   */
  async getInterfacesERC165 (contract) {
    let ifaces = {}
    let keys = Object.keys(interfacesIds)
    for (let i of keys) {
      ifaces[i] = await this.supportsInterface(contract, interfacesIds[i].id)
    }
    return ifaces
  }

  /**
   * Retrieves the interfaces of the contract based on the methods.
   * @param {Array} methods - The methods of the contract
   * @returns {Object} An object containing the interfaces of the contract
   */
  getInterfacesByMethods (methods) {
    return Object.keys(interfacesIds)
      .map(i => {
        return [i, includesAll(methods, interfacesIds[i].methods)]
      })
      .reduce((obj, value) => {
        obj[value[0]] = value[1]
        return obj
      }, {})
  }

  /**
   * Checks if the contract supports a specific interface.
   * @param {Object} contract - The contract object
   * @param {string} interfaceId - The ID of the interface to check
   * @returns {Promise<boolean>} True if the contract supports the interface, false otherwise
   */
  async supportsInterface (contract, interfaceId) {
    // fixed gas to prevent infinite loops
    let options = { gas: '0x7530' }
    let res = await this.call('supportsInterface', contract, [interfaceId], options)
    return res
  }

  /**
   * Checks if the contract implements the ERC165 standard.
   * @param {Object} contract - The contract object
   * @returns {Promise<boolean>} True if the contract implements the ERC165 standard, false otherwise
   */
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
