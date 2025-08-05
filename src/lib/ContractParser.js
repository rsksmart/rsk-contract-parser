import interfacesIds from './interfacesIds'
import { includesAll } from '@rsksmart/rsk-utils'
import NativeContractsDecoder from './nativeContracts/NativeContractsDecoder'
import NativeContracts from './nativeContracts/NativeContracts'
import Contract from './Contract'
import EventDecoder from './EventDecoder'
import defaultABI from './Abi'
import ERC1967BeaconABI from './jsonAbis/ERC1967Beacon.json'
import {
  ABI_SIGNATURE,
  bitcoinRskNetWorks,
  contractsInterfaces,
  PROXY_TYPES
} from './types'
import {
  setAbi,
  removeAbiSignatureData,
  abiSignatureData,
  soliditySelector,
  soliditySignature,
  formatAddressFromSlot,
  notZero,
  toHex,
  getLatestBridgeMethods
} from './utils'
import { isAddress } from '@rsksmart/rsk-utils/dist/addresses'

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
   * @param {Object} [options.log] - Logging mechanism to use for error and debug messages
   * @param {Object} [options.initConfig] - Initial configuration object. Optional.
   * @example
   * const initConfig = {
   *   nativeContracts: {
   *     bridge: '0x0000000000000000000000000000000001000006', // Bridge contract address
   *     remasc: '0x0000000000000000000000000000000001000008' // Remasc contract address
   *   },
   *   net: {
   *     id: '30', // 30: RSK Mainnet, 31: RSK Testnet
   *   }
   * }
   * @param {Nod3} options.nod3 - Nod3 instance for making blockchain calls. Required for most functionality including contract analysis, proxy detection, and event decoding.
   * @param {number | string} [options.txBlockNumber] - Transaction's block number for accurate event decoding. Can be a block number or a tag. Defaults to tag 'latest'.
   */
  constructor ({ abi, log, initConfig = {}, nod3, txBlockNumber = 'latest' } = {}) {
    const { net } = initConfig
    this.netId = (net) ? net.id : undefined
    this.abi = setAbi(abi ?? defaultABI)
    this.log = log || console

    if (!nod3) throw new Error('Nod3 instance is required for ContractParser initialization')

    this.nod3 = nod3
    this.nativeContracts = NativeContracts(initConfig)
    if (this.netId) {
      const bitcoinNetwork = bitcoinRskNetWorks[this.netId]
      this.nativeContractsEvents = NativeContractsDecoder({ bitcoinNetwork, txBlockNumber })
    }
  }

  /**
   * Retrieves the methods from the ABI.
   * @param {Array} abi - The ABI to use for decoding
   * @param {boolean} [addAbiSignatureData=false] - Whether to add the ABI signature data to the methods (default: false)
   * @returns {Array} The methods
   */
  static getMethodsFromAbi (abi, addAbiSignatureData = false) {
    const methods = abi
      .filter(fragment => fragment.type === 'function')

    if (addAbiSignatureData) {
      return methods.map(method => {
        const sig = method[ABI_SIGNATURE] || abiSignatureData(method)
        sig.name = method.name
        return sig
      })
    }

    return methods
  }

  /**
   * Sets the Nod3 instance for making blockchain calls.
   * @param {Nod3} nod3 - Nod3 instance for making blockchain calls
   */
  setNod3 (nod3) {
    this.nod3 = nod3
  }

  /**
   * Retrieves the address of a native contract
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
   * Retrieves the current ABI being used by the ContractParser instance.
   * @returns {Array} The ABI
   */
  getAbi () {
    return this.abi
  }

  /**
   * Sets the ABI for the ContractParser instance.
   * @param {Array} abi - The Application Binary Interface (ABI). If no ABI is provided, a default ABI will be used.
   */
  setAbi (abi) {
    try {
      if (!abi) {
        // If no ABI is provided, use the default ABI
        this.abi = setAbi(defaultABI)
        return
      }

      this.abi = setAbi(abi)
    } catch (error) {
      throw new Error(`Error setting ABI: ${error}`)
    }
  }

  /**
   * Retrieves the methods and their selectors from the ABI.
   */
  getMethodsSelectors () {
    const selectors = {}
    const methods = this.getAbiMethods()

    for (const m in methods) {
      const method = methods[m]
      const signature = method.signature || soliditySignature(m)
      selectors[m] = soliditySelector(signature)
    }
    return selectors
  }

  /**
   * Retrieves the methods and their signatures from the ABI.
   */
  getAbiMethods () {
    const methods = {}

    this.abi
      .filter(def => def.type === 'function')
      .forEach(m => {
        const sig = m[ABI_SIGNATURE] || abiSignatureData(m)
        sig.name = m.name
        methods[sig.method] = sig
      })

    return methods
  }

  /**
   * Parses transaction logs and returns decoded events. Also handles native contract events.
   * @param {Array} logs - The transaction logs to parse
   * @returns {Array} An array of decoded events
   */
  parseTxLogs (logs) {
    return this.decodeLogs(logs).map(event => {
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
    const _addresses = event._addresses || []
    if (abi && args) {
      const inputs = abi.inputs || []
      inputs.forEach((v, i) => {
        if (v.type === 'address') {
          _addresses.push(args[i])
        }
        if (v.type === 'address[]') {
          const value = args[i] || []
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
   * Decodes transaction logs and returns decoded events. Also handles native contract events.
   * @param {Array} logs - The transaction logs to decode
   * @returns {Array} An array of decoded events
   */
  decodeLogs (logs) {
    const eventDecoder = EventDecoder(this.abi, this.log)
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
   * Creates a contract instance, useful for calling methods on the contract
   * @param {string} address - The address of the contract
   * @returns {Contract} A contract instance
   */
  makeContract (address) {
    const { nod3 } = this
    return new Contract(this.abi, { address, nod3 })
  }

  /**
   * Calls a method on a specific contract
   * @param {Contract} contract - The contract object
   * @param {FunctionFragment | string} method - The method to call
   * @param {Array} [params] - The parameters to pass to the method
   * @param {Object} [options] - The options for the call
   * @param {Object} [options.txData] - The transaction data for the call
   * @param {number | string} [options.blockNumber] - The specific block number to use for the call. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<* | null>} The result of the call
   */
  async call (contract, method, params = [], options = { txData: {}, blockNumber: 'latest' }) {
    try {
      const res = await contract.call(method, params, options)
      return res
    } catch (err) {
      // avoid spamming the console with errors
      // this.log.debug(`Error calling contract ${contract.getAddress()}: ${err}`)
      // this.log.debug(err)
      return null
    }
  }

  /**
   * Retrieves token data from a contract
   * @param {Contract} contract - The contract object
   * @param {number | string} [blockNumber] - The specific block number to use for the call. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<Object>} The token data
   */
  async getDefaultTokenData (contract, blockNumber = 'latest') {
    const defaultTokenMethods = [
      'name',
      'symbol',
      'decimals',
      'totalSupply'
    ]

    const result = await Promise.all(
      defaultTokenMethods.map(method => this.call(contract, method, [], { blockNumber }))
    )

    return result.reduce((v, a, i) => {
      const name = defaultTokenMethods[i]
      v[name] = a
      return v
    }, {})
  }

  /**
   * Maps interfaces to ERCs.
   * @param {Object} interfaces - The interfaces to map
   * @returns {Array} The mapped interfaces
   */
  mapInterfacesToERCs (interfaces) {
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
  hasMethodSelector (contractByteCode, selector) {
    return selector && contractByteCode && contractByteCode.includes(selector)
  }

  /**
   * Retrieves the methods from the contract bytecode.
   *
   * This bytecode is also the txInputData on contract creation transactions.
   * Note that using the default ABI for methods validation may not be 100% precise. Therefore, it is recommended to set a verified contract ABI and use the `getAbiMethods` method.
   *
   * @param {string} contractByteCode - The contract bytecode to analyze.
   */
  getMethodsFromContractByteCode (contractByteCode) {
    const methods = this.getMethodsSelectors()
    return Object.keys(methods)
      .filter(method => this.hasMethodSelector(contractByteCode, methods[method]) === true)
  }

  /**
   * Retrieves the contract methods and ERC interfaces
   * Uses the current set ABI to inspect the contract bytecode and validate methods and interfaces.
   * If a block number is provided, bytecode used to validate methods and interfaces will be retrieved from the node at the given block number.
   * @param {string} address - The contract address
   * @param {number | string} [blockNumber] - Optional. Retrieve methods and interfaces at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<{
   *   methods: string[],
   *   interfaces: string[]
   * }>} The contract methods and ERC interfaces
   */
  async getContractMethodsAndERCInterfaces (address, blockNumber = 'latest') {
    const contractByteCode = await this.getContractCodeFromNode(address, blockNumber)
    const methods = this.getMethodsFromContractByteCode(contractByteCode)
    const interfaces = this.getInterfacesByMethods(methods)

    return { methods, interfaces }
  }

  /**
   * Retrieves contract details using the current set ABI.
   * This method also detects if the contract is a proxy.
   * It is recommended to set the verified ABI of the contract so all methods and interfaces are detected.
   *
   * @param {string} contractAddress - The address of the contract
   * @param {number | string} [blockNumber] - Optional. Retrieve contract details at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   *
   * @returns {Promise<{
   *   address: string,
   *   isProxy: boolean,
   *   implementationAddress: string | null,
   *   beaconAddress: string | null,
   *   proxyType: string | null,
   *   methods: string[],
   *   interfaces: string[]
   * }>} The contract details
   */
  async getContractDetails (contractAddress, blockNumber = 'latest') {
    const contractDetails = {
      address: contractAddress,
      isProxy: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null,
      methods: [],
      interfaces: []
    }

    // Native contracts check - Bridge
    if (this.nativeContracts.isNativeContract(contractAddress)) {
      contractDetails.methods = getLatestBridgeMethods()
      return contractDetails
    }

    try {
      // ERC1822 Proxy check
      const ERC1822ProxyDetails = await this.isERC1822Proxy(contractAddress, blockNumber)
      if (ERC1822ProxyDetails.isProxy) {
        contractDetails.isProxy = true
        contractDetails.implementationAddress = ERC1822ProxyDetails.implementationAddress
        contractDetails.proxyType = ERC1822ProxyDetails.proxyType
        if (isAddress(contractDetails.implementationAddress)) {
          // Use implementation methods and interfaces. Append proxy standard interfaces
          const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(contractDetails.implementationAddress, blockNumber)
          contractDetails.methods = methods
          contractDetails.interfaces = [contractsInterfaces.ERC1822, ...interfaces]
        }

        return contractDetails
      }

      // ERC1967 Proxy check
      const ERC1967ProxyDetails = await this.isERC1967Proxy(contractAddress, blockNumber)
      if (ERC1967ProxyDetails.isProxy) {
        contractDetails.isProxy = true
        contractDetails.implementationAddress = ERC1967ProxyDetails.implementationAddress
        contractDetails.beaconAddress = ERC1967ProxyDetails.beaconAddress
        contractDetails.proxyType = ERC1967ProxyDetails.proxyType
        if (isAddress(contractDetails.implementationAddress)) {
          // Use implementation methods and interfaces. Append proxy standard interfaces
          const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(contractDetails.implementationAddress, blockNumber)
          contractDetails.methods = methods
          contractDetails.interfaces = [contractsInterfaces.ERC1967, ...interfaces]
        }

        return contractDetails
      }

      // Open Zeppelin Unstructured Storage Proxy check
      const OZUnstructuredStorageProxyDetails = await this.isOZUnstructuredStorageProxy(contractAddress, blockNumber)
      if (OZUnstructuredStorageProxyDetails.isProxy) {
        contractDetails.isProxy = true
        contractDetails.implementationAddress = OZUnstructuredStorageProxyDetails.implementationAddress
        contractDetails.proxyType = OZUnstructuredStorageProxyDetails.proxyType
        if (isAddress(contractDetails.implementationAddress)) {
          // Use implementation methods and interfaces
          const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(contractDetails.implementationAddress, blockNumber)
          contractDetails.methods = methods
          contractDetails.interfaces = interfaces
        }

        return contractDetails
      }

      // Normal contracts
      const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(contractAddress, blockNumber)
      contractDetails.methods = methods
      contractDetails.interfaces = interfaces

      return contractDetails
    } catch (error) {
      this.log.error(`[${contractAddress}] Error getting contract details: ${error}`)
      return Promise.reject(error)
    }
  }

  /**
     * Checks if the contract is a proxy contract using the ERC1822 Universal Upgradeable Proxy Standard (UUPS).
     * @param {string} contractAddress - The address of the contract
     * @param {number | string} [blockNumber] - Optional. Retrieve proxy details at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
     * @returns {Promise<{
    *   address: string,
    *   isProxy: boolean,
    *   implementationAddress: string | null,
    *   proxyType: string | null
    * }>} The proxy details
    * @see https://eips.ethereum.org/EIPS/eip-1822
    */
  async isERC1822Proxy (contractAddress, blockNumber = 'latest') {
    const result = {
      address: contractAddress,
      isProxy: false,
      implementationAddress: null,
      proxyType: null
    }

    // ERC1822 uses keccak256("PROXIABLE") as storage slot
    // keccak256("PROXIABLE") = 0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7
    const implementationSlot = '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7'
    let implementationSlotValue

    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot, blockNumber)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.ERC1822}: ${err}`)
      return Promise.reject(err)
    }

    if (notZero(implementationSlotValue)) {
      result.proxyType = PROXY_TYPES.ERC1822
      result.isProxy = true
      result.implementationAddress = formatAddressFromSlot(implementationSlotValue)

      return result
    }

    // Not a proxy contract
    return result
  }

  /**
   * Checks if the contract is a proxy contract using the ERC1967 standard.
   * @param {string} contractAddress - The address of the contract
   * @param {number | string} [blockNumber] - Optional. Retrieve proxy details at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<{
   *   address: string,
   *   isProxy: boolean,
   *   implementationAddress: string | null,
   *   beaconAddress: string | null,
   *   proxyType: string | null
   * }>} The proxy details
   * @see https://eips.ethereum.org/EIPS/eip-1967
   */
  async isERC1967Proxy (contractAddress, blockNumber = 'latest') {
    const result = {
      address: contractAddress,
      isProxy: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null
    }

    // Normal Proxies
    const implementationSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

    let implementationSlotValue
    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot, blockNumber)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.ERC1967.Normal}: ${err}`)
      return Promise.reject(err)
    }

    if (notZero(implementationSlotValue)) {
      result.proxyType = PROXY_TYPES.ERC1967.Normal
      result.isProxy = true
      result.implementationAddress = formatAddressFromSlot(implementationSlotValue)
      return result
    }

    // Beacon Proxies
    const beaconSlot = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'

    let beaconSlotValue
    try {
      beaconSlotValue = await this.getStorageSlotValueFromNode(contractAddress, beaconSlot, blockNumber)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.ERC1967.Beacon}: ${err}`)
      return Promise.reject(err)
    }

    if (notZero(beaconSlotValue)) {
      result.proxyType = PROXY_TYPES.ERC1967.Beacon
      result.isProxy = true

      try {
        // Get beacon contract address
        const beaconContractAddress = formatAddressFromSlot(beaconSlotValue)
        if (!isAddress(beaconContractAddress)) {
          throw new Error('Invalid beacon contract address')
        }
        result.beaconAddress = beaconContractAddress

        // Create contract instance for the beacon
        const beaconContract = new Contract(ERC1967BeaconABI, { address: beaconContractAddress, nod3: this.nod3 })

        // Get implementation contract address from beacon contract
        const implementationAddress = await beaconContract.call('implementation', [], { blockNumber })
        if (!isAddress(implementationAddress)) {
          throw new Error('Beacon returns an invalid implementation address')
        }

        result.implementationAddress = implementationAddress
        return result
      } catch (err) {
        this.log.warn(`[${contractAddress}] Error fetching implementation from beacon proxy: ${err}`)
        return Promise.reject(err)
      }
    }

    // Not a proxy contract
    return result
  }

  /**
   * Checks if the contract is a proxy contract using the Open Zeppelin Unstructured Storage Pattern (not an official standard)
   * @param {string} contractAddress - The address of the contract
   * @param {number | string} [blockNumber] - Optional. Retrieve proxy details at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<{
   *   address: string,
   *   isProxy: boolean,
   *   implementationAddress: string | null,
   *   proxyType: string | null
   * }>} The proxy details
   * @see https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48#code (USDC token - also mentioned in EIP1967)
   * @see https://ethereum.stackexchange.com/questions/99812/finding-the-address-of-the-proxied-to-address-of-a-proxy
   * @see https://blog.openzeppelin.com/proxy-patterns
   * @see https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_using_unstructured_storage
   * @see https://github.com/OpenZeppelin/openzeppelin-labs/blob/master/upgradeability_using_unstructured_storage/contracts/UpgradeabilityProxy.sol
   */
  async isOZUnstructuredStorageProxy (contractAddress, blockNumber = 'latest') {
    const result = {
      address: contractAddress,
      isProxy: false,
      implementationAddress: null,
      proxyType: null
    }

    const implementationSlot = '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3'
    let implementationSlotValue

    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot, blockNumber)
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${PROXY_TYPES.OZUnstructuredStorage}: ${err}`)
      return Promise.reject(err)
    }

    if (notZero(implementationSlotValue)) {
      result.proxyType = PROXY_TYPES.OZUnstructuredStorage
      result.isProxy = true
      result.implementationAddress = formatAddressFromSlot(implementationSlotValue)

      return result
    }

    // Not a proxy contract
    return result
  }

  /**
   * Retrieves the value of a storage slot for a specific contract from the node.
   * @param {string} contractAddress - The address of the contract
   * @param {string} slot - The slot to retrieve the value from
   * @param {number | string} [blockNumber] - Optional. Retrieve storage slot value at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<string>} The value of the storage slot
   */
  async getStorageSlotValueFromNode (contractAddress, slot, blockNumber = 'latest') {
    if (typeof blockNumber === 'number') {
      // Convert to hex
      blockNumber = toHex(blockNumber)
    }

    return this.nod3.eth.getStorageAt(contractAddress, slot, blockNumber)
  }

  /**
   * Retrieves the code of a contract from the node.
   * @param {string} contractAddress - The address of the contract
   * @param {number | string} [blockNumber] - Optional. Retrieve contract code at the given block number. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<string>} The contract code
   */
  async getContractCodeFromNode (contractAddress, blockNumber = 'latest') {
    if (typeof blockNumber === 'number') {
      // Convert to hex
      blockNumber = toHex(blockNumber)
    }

    return this.nod3.eth.getContractCodeAt(contractAddress, blockNumber)
  }

  /**
   * Retrieves the interfaces of the contract based on the methods.
   * @param {Array} methods - The methods of the contract
   */
  getInterfacesByMethods (methods) {
    const interfaces = Object.keys(interfacesIds)

    const mappedInterfaces = interfaces.map(i => [i, includesAll(methods, interfacesIds[i].methods)])

    const reducedInterfaces = mappedInterfaces.reduce((obj, value) => {
      obj[value[0]] = value[1]
      return obj
    }, {})

    return this.mapInterfacesToERCs(reducedInterfaces)
  }
}

export default ContractParser
