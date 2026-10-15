"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _abi = require("@ethersproject/abi");

const duplicateDefinitionKey = (fragment) => fragment.type === 'constructor' ? fragment.type : `${fragment.type} ${fragment.format()}`;

const firstFragmentPerKey = (abi) => {
  const byKey = new Map();
  for (const definition of abi) {
    const fragment = _abi.Fragment.from(definition);
    if (!fragment) continue;
    const key = duplicateDefinitionKey(fragment);
    if (!byKey.has(key)) byKey.set(key, fragment);
  }
  return [...byKey.values()];
};

const interfaceWithoutDuplicates = (abi) => new _abi.Interface(Array.isArray(abi) ? firstFragmentPerKey(abi) : abi);

const outputTypes = (fragment) => fragment.outputs.map((output) => output.format()).join(',');

/**
 * Contract class allows interaction with a contract on the blockchain.
 */
class Contract {
  /**
   * Creates a contract instance to interact with a blockchain contract.
   * @param {Object} abi - The contract ABI
   * @param {Object} options - The options object
   * @param {string} options.address - The address of the contract
   * @param {Object} options.nod3 - The nod3 instance
   * @throws {Error} If the ABI is invalid
   */
  constructor(abi, { address, nod3 } = {}) {
    if (!abi || typeof abi !== 'object') throw new Error('Invalid abi');

    this.abi = abi;
    this.address = address;
    this.nod3 = nod3;
    this.contractInterface = interfaceWithoutDuplicates(abi);
  }

  /**
   * Sets the address of the contract.
   * @param {string} newAddress - The new address of the contract
   */
  setAddress(newAddress) {
    this.address = newAddress;
  }

  /**
   * Gets the address of the contract.
   * @returns {string} The address of the contract
   */
  getAddress() {
    return this.address;
  }

  /**
   * Sets the nod3 instance.
   * @param {Object} nod3Instance - The nod3 instance
   */
  setNod3(nod3Instance) {
    this.nod3 = nod3Instance;
  }

  /**
   * Gets the contract ABI.
   * @returns {Object} The contract ABI
   */
  getAbi() {
    return this.abi;
  }

  /**
   * Sets the contract ABI.
   * @param {Object} newAbi - The new contract ABI
   */
  setAbi(newAbi) {
    this.abi = newAbi;
    this.contractInterface = interfaceWithoutDuplicates(newAbi);
  }

  /**
   * Encodes a contract call.
   * @param {FunctionFragment | string} method - The method to call. Can be the method name or a FunctionFragment for more precise method selection
   * @param {Array} params - The parameters for the method call
   * @returns {string} The encoded call data
   */
  encodeCall(method, params = []) {
    return this.contractInterface.encodeFunctionData(this.#resolveSignature(method, params), params);
  }

  #resolveSignature(method, params) {
    if (typeof method !== 'string' || method.includes('(') || !Array.isArray(this.abi)) return method;
    const fragments = this.abi.filter((f) => f && f.type === 'function' && f.name === method);
    if (fragments.length === 0) return method;
    const signatures = [...new Set(fragments.map((f) => _abi.FunctionFragment.from(f).format()))];
    if (signatures.length === 1) return signatures[0];
    if (Array.isArray(params)) {
      const byArity = [...new Set(fragments.
      filter((f) => (f.inputs || []).length === params.length).
      map((f) => _abi.FunctionFragment.from(f).format()))];
      if (byArity.length === 1) return byArity[0];
    }
    throw new Error(`Ambiguous method "${method}" — pass the signature: ${signatures.join(' | ')}`);
  }

  /**
   * Decodes a contract call.
   * @param {FunctionFragment | string} method - The method to decode. Can be the method name or a FunctionFragment for more precise method selection
   * @param {string} data - The encoded call data
   * @param {Array} [params] - Optional. The call parameters, used to pick among overloads of a bare method name by argument count when their outputs differ
   * @returns {Object} The decoded call result
   * @throws {Error} If a bare method name has overloads with different outputs that params do not disambiguate
   */
  decodeCall(method, data, params) {
    const fragment = method instanceof _abi.FunctionFragment ?
    method :
    this.contractInterface.getFunction(this.#resolveDecodeSignature(method, params));
    const { outputs } = fragment;
    const decoded = this.contractInterface.decodeFunctionResult(fragment, data);
    return Array.isArray(decoded) && outputs && outputs.length < 2 ? decoded[0] : decoded;
  }

  #resolveDecodeSignature(method, params) {
    if (typeof method !== 'string' || method.includes('(')) return method;
    const candidates = Object.values(this.contractInterface.functions).filter((f) => f.name === method);
    if (candidates.length < 2) return method;
    const resolvable = (fragments) => fragments.length > 0 && new Set(fragments.map(outputTypes)).size === 1;
    if (resolvable(candidates)) return candidates[0].format();
    if (Array.isArray(params)) {
      const byArity = candidates.filter((f) => f.inputs.length === params.length);
      if (resolvable(byArity)) return byArity[0].format();
    }
    throw new Error(`Ambiguous method "${method}" — its overloads return different types, pass the signature or the params: ${candidates.map((f) => f.format()).join(' | ')}`);
  }

  /**
   * Makes a call to a contract method.
   * @param {FunctionFragment | string} method - The method to call. Can be the method name or a FunctionFragment for more precise method selection
   * @param {Array} params - The parameters for the method call
   * @param {Object} options - The options for the call
   * @param {Object} [options.txData] - The transaction data for the call
   * @param {number | string} [options.blockNumber] - The specific block number to use for the call. Can be a block number or a tag. Defaults to tag 'latest'.
   * @returns {Promise<*>} A promise that resolves to the call result
   */
  async call(method, params = [], options = { txData: {}, blockNumber: 'latest' }) {
    try {
      if (!this.nod3) throw new Error('Set nod3 instance before call');
      if (!this.address) throw new Error('The contract address is not defined');
      if (!Array.isArray(params)) throw new Error('Params must be an array');

      const signature = this.#resolveSignature(method, params);

      const tx = {
        ...options.txData,
        to: this.address,
        data: this.encodeCall(signature, params)
      };

      const result = await this.nod3.eth.call(tx, options.blockNumber);

      const decodedResult = this.decodeCall(signature, result);

      return decodedResult;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}exports.default = Contract;