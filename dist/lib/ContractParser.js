"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.ContractParser = void 0;var _interfacesIds = _interopRequireDefault(require("./interfacesIds"));
var _rskUtils = require("@rsksmart/rsk-utils");
var _NativeContractsDecoder = _interopRequireDefault(require("./nativeContracts/NativeContractsDecoder"));
var _NativeContracts = _interopRequireDefault(require("./nativeContracts/NativeContracts"));
var _Contract = _interopRequireDefault(require("./Contract"));
var _EventDecoder = _interopRequireDefault(require("./EventDecoder"));
var _Abi = _interopRequireDefault(require("./Abi"));
var _types = require("./types");





var _utils = require("./utils");








var _addresses2 = require("@rsksmart/rsk-utils/dist/addresses");

var _abi = require("@ethersproject/abi");
var _Nod = require("@rsksmart/nod3/dist/classes/Nod3");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };} // import ERC165_ABI from './jsonAbis/ERC165.json'

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
class ContractParser {
  /**
   * Creates a new ContractParser instance.
   * @param {Object} options - Configuration options
   * @param {Array} [options.abi] - The Application Binary Interface (ABI) used for decoding. If not provided, a default ABI is used, however its strongly recommended to provide the full ABI.
   * @param {Object} [options.log=console] - Logging mechanism to use for error and debug messages
   * @param {Object} [options.initConfig] - Initial configuration object
   * @param {Object} [options.initConfig.net] - Network configuration information
   * @param {string|number} [options.initConfig.net.id] - Network ID used to determine RSK/Bitcoin network
   * @param {Nod3} [options.nod3] - Nod3 instance for making blockchain calls
   * @param {number} [options.txBlockNumber] - Transaction's block number for accurate event decoding
   */
  constructor({ abi, log, initConfig, nod3, txBlockNumber } = {}) {
    initConfig = initConfig || {};
    const { net } = initConfig;
    this.netId = net ? net.id : undefined;
    this.abi = (0, _utils.setAbi)(abi || _Abi.default);
    this.log = log || console;
    this.nod3 = nod3;
    this.nativeContracts = (0, _NativeContracts.default)(initConfig);
    if (this.netId) {
      let bitcoinNetwork = _types.bitcoinRskNetWorks[this.netId];
      this.nativeContractsEvents = (0, _NativeContractsDecoder.default)({ bitcoinNetwork, txBlockNumber });
    }
  }

  /**
   * Retrieves the methods from the ABI.
   * @param {Array} abi - The ABI to use for decoding
   * @param {boolean} [addAbiSignatureData=false] - Whether to add the ABI signature data to the methods (default: false)
   * @returns {Array} The methods
   */
  static getMethodsFromAbi(abi, addAbiSignatureData = false) {
    const methods = abi.
    filter((fragment) => fragment.type === 'function');

    if (addAbiSignatureData) {
      return methods.map((method) => {
        const sig = method[_types.ABI_SIGNATURE] || (0, _utils.abiSignatureData)(method);
        sig.name = method.name;
        return sig;
      });
    }

    return methods;
  }

  /**
   * Sets the Nod3 instance for making blockchain calls.
   * @param {Nod3} nod3 - Nod3 instance for making blockchain calls
   */
  setNod3(nod3) {
    this.nod3 = nod3;
  }

  /**
   * Retrieves the address of a native contract
   * @param {string} name - The name of the native contract
   * @returns {string} The address of the native contract
   */
  getNativeContractAddress(name) {
    const { nativeContracts } = this;
    if (nativeContracts) {
      return nativeContracts.getNativeContractAddress(name);
    }
  }

  /**
   * Retrieves the current ABI being used by the ContractParser instance.
   * @returns {Array} The ABI
   */
  getAbi() {
    return this.abi;
  }

  /**
   * Sets the ABI for the ContractParser instance.
   * @param {Array} abi - The Application Binary Interface (ABI)
   */
  setAbi(abi) {
    try {
      if (!Array.isArray(abi)) {
        throw new Error('ABI must be an array');
      }

      this.abi = (0, _utils.setAbi)(abi);
    } catch (error) {
      throw new Error(`Error setting ABI: ${error}`);
    }
  }

  /**
   * Retrieves the methods and their selectors from the ABI.
   */
  getMethodsSelectors() {
    let selectors = {};
    let methods = this.getAbiMethods();

    for (let m in methods) {
      let method = methods[m];
      let signature = method.signature || (0, _utils.soliditySignature)(m);
      selectors[m] = (0, _utils.soliditySelector)(signature);
    }
    return selectors;
  }

  /**
   * Retrieves the methods and their signatures from the ABI.
   */
  getAbiMethods() {
    let methods = {};
    this.abi.filter((def) => def.type === 'function').
    map((m) => {
      let sig = m[_types.ABI_SIGNATURE] || (0, _utils.abiSignatureData)(m);
      sig.name = m.name;
      methods[sig.method] = sig;
    });
    return methods;
  }

  /**
   * Parses transaction logs and returns decoded events.
   * @param {Array} logs - The transaction logs to parse
   * @param {Array} [abi] - The Application Binary Interface (ABI)
   * @returns {Array} An array of decoded events
   */
  parseTxLogs(logs, abi) {
    return this.decodeLogs(logs, abi).map((event) => {
      this.addEventAddresses(event);
      event.abi = (0, _utils.removeAbiSignatureData)(event.abi);
      return event;
    });
  }

  /**
   * Adds event addresses to the event object.
   * @param {Object} event - The event object to add addresses to
   */
  addEventAddresses(event) {
    const { abi, args } = event;
    let _addresses = event._addresses || [];
    if (abi && args) {
      let inputs = abi.inputs || [];
      inputs.forEach((v, i) => {
        if (v.type === 'address') {
          _addresses.push(args[i]);
        }
        if (v.type === 'address[]') {
          let value = args[i] || [];
          if (Array.isArray(value)) {// temp fix to undecoded events
            value.forEach((v) => _addresses.push(v));
          } else {
            let i = 0;
            while (2 + (i + 1) * 40 <= value.length) {
              _addresses.push('0x' + value.slice(2 + i * 40, 2 + (i + 1) * 40));
              i++;
            }
          }
        }
      });
      event._addresses = [...new Set(_addresses)];
    }
    return event;
  }

  /**
   * Decodes transaction logs and returns decoded events.
   * @param {Array} logs - The transaction logs to decode
   * @param {Array} [abi] - The Application Binary Interface (ABI)
   * @returns {Array} An array of decoded events
   */
  decodeLogs(logs) {
    const eventDecoder = (0, _EventDecoder.default)(this.abi, this.log);
    if (!this.nativeContracts || !this.nativeContractsEvents) {
      throw new Error(`Native contracts decoder is missing, check the value of netId:${this.netId}`);
    }
    const { isNativeContract } = this.nativeContracts;
    const { nativeContractsEvents } = this;
    return logs.map((log) => {
      const { address } = log;
      const decoder = isNativeContract(address) ? nativeContractsEvents.getEventDecoder(log) : eventDecoder;
      return decoder.decodeLog(log);
    });
  }

  /**
   * Creates a contract instance, useful for calling methods on the contract
   * @param {string} address - The address of the contract
   * @returns {Contract} A contract instance
   */
  makeContract(address) {
    let { nod3 } = this;
    return new _Contract.default(this.abi, { address, nod3 });
  }

  /**
   * Calls a method on a contract
   * @param {FunctionFragment | string} method - The method to call
   * @param {Contract} contract - The contract object
   * @param {Array} [params] - The parameters to pass to the method
   * @param {Object} [options] - The options for the call
   */
  async call(method, contract, params = [], options = {}) {
    try {
      const res = await contract.call(method, params, options);
      return res;
    } catch (err) {
      this.log.trace(`Error calling contract ${contract.getAddress()}: ${err}`);
      this.log.trace(err);
      return null;
    }
  }

  /**
   * Retrieves token data from a contract
   * @param {Contract} contract - The contract object
   * @param {Object} [options] - The options for the token data retrieval
   * @returns {Promise<Object>} The token data
   */
  async getTokenData(contract, { methods } = {}) {
    methods = methods || ['name', 'symbol', 'decimals', 'totalSupply'];
    let result = await Promise.all(
      methods.map((m) =>
      this.call(m, contract).
      then((res) => res).
      catch((err) => this.log.trace(`[Contract: ${contract.getAddress()}] Error executing ${m}  Error: ${err}`)))
    );
    return result.reduce((v, a, i) => {
      let name = methods[i];
      v[name] = a;
      return v;
    }, {});
  }

  /**
   * Maps interfaces to ERCs.
   * @param {Object} interfaces - The interfaces to map
   * @returns {Array} The mapped interfaces
   */
  mapInterfacesToERCs(interfaces) {
    return Object.keys(interfaces).
    filter((k) => interfaces[k] === true).
    map((t) => _types.contractsInterfaces[t] || t);
  }

  /**
   * Checks if a contract bytecode contains a method selector.
   * @param {string} contractByteCode - The bytecode of the contract
   * @param {string} selector - The selector to check for
   * @returns {boolean} True if the selector is found in the contract bytecode, false otherwise
   */
  hasMethodSelector(contractByteCode, selector) {
    return selector && contractByteCode && contractByteCode.includes(selector);
  }

  /**
   * Retrieves the methods from the contract bytecode.
   * 
   * This bytecode is also the txInputData on contract creation transactions. 
   * Note that using the default ABI for methods validation may not be 100% precise. Therefore, it is recommended to set a verified contract ABI and use the `getAbiMethods` method.
   * 
   * @param {string} contractByteCode - The contract bytecode to analyze.
   */
  getMethodsFromContractByteCode(contractByteCode) {
    let methods = this.getMethodsSelectors();
    return Object.keys(methods).
    filter((method) => this.hasMethodSelector(contractByteCode, methods[method]) === true);
  }

  /**
   * Retrieves the contract methods and ERC interfaces.
   * @param {string} address - The contract address
   */
  async getContractMethodsAndERCInterfaces(address) {
    const contractByteCode = await this.getContractCodeFromNode(address);
    const methods = this.getMethodsFromContractByteCode(contractByteCode);
    const interfaces = this.getInterfacesByMethods(methods);

    return { methods, interfaces };
  }

  /**
   * Retrieves the proxy details of a contract
   * @param {string} contractAddress - The address of the contract
   */
  async getProxyDetails(contractAddress) {
    let proxyDetails = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null,
      methods: [],
      interfaces: []
    };

    // ERC 1967 standard for proxies
    const ERC1967ProxyDetails = await this.isERC1967Proxy(contractAddress);
    if (ERC1967ProxyDetails.isUpgradeable) {
      proxyDetails = ERC1967ProxyDetails;

      if ((0, _addresses2.isAddress)(proxyDetails.implementationAddress)) {
        // Set implementation methods and interfaces
        const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(
          proxyDetails.implementationAddress,
          this.makeContract(proxyDetails.implementationAddress)
        );
        proxyDetails.methods = methods;
        proxyDetails.interfaces = [
        ...interfaces,
        _types.contractsInterfaces.ERC1822,
        _types.contractsInterfaces.ERC1967];

      }

      return proxyDetails;
    } else {
      // Open Zeppelin Unstructured Storage Pattern (before ERC1967)
      const OZUnstructuredStorageProxyDetails = await this.isOZUnstructuredStorageProxy(contractAddress);

      if (OZUnstructuredStorageProxyDetails.isUpgradeable) {
        proxyDetails = OZUnstructuredStorageProxyDetails;

        if ((0, _addresses2.isAddress)(proxyDetails.implementationAddress)) {
          // Set implementation methods and interfaces
          const { methods, interfaces } = await this.getContractMethodsAndERCInterfaces(
            proxyDetails.implementationAddress,
            this.makeContract(proxyDetails.implementationAddress)
          );
          proxyDetails.methods = methods;
          proxyDetails.interfaces = [
          ...interfaces,
          _types.contractsInterfaces.ERC1822];

        }

        return proxyDetails;
      }
    }

    return proxyDetails;
  }

  /**
   * Checks if the contract is a proxy contract using the ERC1967 standard.
   * @param {string} contractAddress - The address of the contract
   * @see https://eips.ethereum.org/EIPS/eip-1967
   */
  async isERC1967Proxy(contractAddress) {
    const result = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null
    };

    // Normal Proxies
    const implementationSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

    let implementationSlotValue;
    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot);
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${_types.PROXY_TYPES.ERC1967.Normal}: ${err}`);
      return result;
    }

    if ((0, _utils.notZero)(implementationSlotValue)) {
      result.proxyType = _types.PROXY_TYPES.ERC1967.Normal;
      result.isUpgradeable = true;
      result.implementationAddress = (0, _utils.formatAddressFromSlot)(implementationSlotValue);
      return result;
    }

    // Beacon Proxies
    const beaconSlot = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50';

    let beaconSlotValue;
    try {
      beaconSlotValue = await this.getStorageSlotValueFromNode(contractAddress, beaconSlot);
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${_types.PROXY_TYPES.ERC1967.Beacon}: ${err}`);
      return result;
    }

    if ((0, _utils.notZero)(beaconSlotValue)) {
      result.proxyType = _types.PROXY_TYPES.ERC1967.Beacon;
      result.isUpgradeable = true;

      try {
        // Get beacon contract address
        const beaconContractAddress = (0, _utils.formatAddressFromSlot)(beaconSlotValue);

        if (!(0, _addresses2.isAddress)(beaconContractAddress)) {
          throw new Error('Invalid beacon contract address');
        }

        // Create contract instance for the beacon
        const beaconContract = this.makeContract(beaconContractAddress);

        // Get implementation contract address from beacon contract
        const implementationAddress = await this.call('implementation', beaconContract);

        if (!(0, _addresses2.isAddress)(implementationAddress)) {
          throw new Error('Beacon returns an invalid implementation address');
        }

        result.implementationAddress = implementationAddress;
        return result;
      } catch (err) {
        this.log.warn(`[${contractAddress}] Error fetching implementation from beacon proxy: ${err}`);
        return result;
      }
    }

    // Not a proxy contract
    return result;
  }

  /**
   * Checks if the contract is a proxy contract using the Open Zeppelin Unstructured Storage Pattern.
   * @param {string} contractAddress - The address of the contract
   * @see https://blog.openzeppelin.com/proxy-patterns
   * @see https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_using_unstructured_storage
   * @see https://github.com/OpenZeppelin/openzeppelin-labs/blob/master/upgradeability_using_unstructured_storage/contracts/UpgradeabilityProxy.sol
   */
  async isOZUnstructuredStorageProxy(contractAddress) {
    const result = {
      address: contractAddress,
      isUpgradeable: false,
      implementationAddress: null,
      beaconAddress: null,
      proxyType: null
    };

    const implementationSlot = '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3';
    let implementationSlotValue;
    try {
      implementationSlotValue = await this.getStorageSlotValueFromNode(contractAddress, implementationSlot);
    } catch (err) {
      this.log.warn(`[${contractAddress}] Error checking implementation slot for ${_types.PROXY_TYPES.OZUnstructuredStorage}: ${err}`);
      return result;
    }

    if ((0, _utils.notZero)(implementationSlotValue)) {
      result.proxyType = _types.PROXY_TYPES.OZUnstructuredStorage;
      result.isUpgradeable = true;
      result.implementationAddress = (0, _utils.formatAddressFromSlot)(implementationSlotValue);

      return result;
    }

    return result;
  }

  /**
   * Retrieves the value of a storage slot from the node.
   * @param {string} contractAddress - The address of the contract
   * @param {string} slot - The slot to retrieve the value from
   * @returns {Promise<string>} The value of the storage slot
   */
  async getStorageSlotValueFromNode(contractAddress, slot) {
    return this.nod3.eth.getStorageAt(contractAddress, slot);
  }

  /**
   * Retrieves the contract code from the node.
   * @param {string} contractAddress - The address of the contract
   * @returns {Promise<string>} The contract code
   */
  async getContractCodeFromNode(contractAddress) {
    return this.nod3.eth.getContractCodeAt(contractAddress);
  }

  /**
   * Retrieves the interfaces of the contract based on the methods.
   * @param {Array} methods - The methods of the contract
   */
  getInterfacesByMethods(methods) {
    const interfaces = Object.keys(_interfacesIds.default);

    const mappedInterfaces = interfaces.map((i) => [i, (0, _rskUtils.includesAll)(methods, _interfacesIds.default[i].methods)]);

    const reducedInterfaces = mappedInterfaces.reduce((obj, value) => {
      obj[value[0]] = value[1];
      return obj;
    }, {});

    return this.mapInterfacesToERCs(reducedInterfaces);
  }

  // /**
  //  * Retrieves the interfaces of the contract based on the ERC165 standard.
  //  * @param {Object} contract - The contract object
  //  * @returns {Promise<Object>} An object containing the interfaces of the contract
  //  */
  // async getInterfacesERC165 (contract) {
  //   let ifaces = {}
  //   let keys = Object.keys(interfacesIds)
  //   for (let i of keys) {
  //     ifaces[i] = await this.supportsInterface(contract, interfacesIds[i].id)
  //   }
  //   return ifaces
  // }

  // /**
  //  * Checks if the contract supports a specific interface.
  //  * @param {Contract} contract - The contract object
  //  * @param {string} interfaceId - The ID of the interface to check
  //  * @returns {Promise<boolean>} True if the contract supports the interface, false otherwise
  //  * @see https://eips.ethereum.org/EIPS/eip-165
  //  */
  // async supportsInterface (contract, interfaceId) {
  //   let res = false

  //   try {
  //     const ERC165_GAS_LIMIT = '0x7530' // 30000
  //     const fragment = FunctionFragment.from(ERC165_ABI.find(f => f.name === 'supportsInterface'))
  //     res = await contract.call(fragment, [interfaceId], { gas: ERC165_GAS_LIMIT })
  //   } catch (err) {
  //     this.log.warn(`[Contract: ${contract.getAddress()}] Error calling supportsInterface for interfaceId ${interfaceId}: ${err}`)
  //   }

  //   // Response values:
  //   // false: interface not supported
  //   // null: erc165 not implemented
  //   if (res === false || res === null) { 
  //     return false // normalize response
  //   } else {
  //     return true
  //   }
  // }

  // /**
  //  * Checks if the contract implements the ERC165 standard.
  //  * @param {Object} contract - The contract object
  //  * @returns {Promise<boolean>} True if the contract implements the ERC165 standard, false otherwise
  //  * @see https://eips.ethereum.org/EIPS/eip-165
  //  */
  // async implementsErc165 (contract) {
  //   try {
  //     const firstCallResult = await this.supportsInterface(contract, interfacesIds.ERC165.id)
  //     if (firstCallResult) {
  //       const secondCallResult = await this.supportsInterface(contract, '0xffffffff')
  //       const isErc165 = secondCallResult === false || secondCallResult === null

  //       return isErc165
  //     }
  //     return false
  //   } catch (err) {
  //     return Promise.reject(err)
  //   }
  // }
}exports.ContractParser = ContractParser;var _default = exports.default =

ContractParser;
//# sourceMappingURL=ContractParser.js.map