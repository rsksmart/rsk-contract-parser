import { FunctionFragment, Interface } from '@ethersproject/abi'

/**
 * Contract class allows interaction with a contract on the blockchain.
 */
export default class Contract {
  /**
   * Creates a contract instance to interact with a blockchain contract.
   * @param {Object} abi - The contract ABI
   * @param {Object} options - The options object
   * @param {string} options.address - The address of the contract
   * @param {Object} options.nod3 - The nod3 instance
   * @throws {Error} If the ABI is invalid
   */
  constructor (abi, { address, nod3 } = {}) {
    if (!abi || typeof abi !== 'object') throw new Error('Invalid abi')

    this.abi = abi
    this.address = address
    this.nod3 = nod3
    this.contractInterface = new Interface(abi)
  }

  /**
   * Sets the address of the contract.
   * @param {string} newAddress - The new address of the contract
   */
  setAddress (newAddress) {
    this.address = newAddress
  }

  /**
   * Gets the address of the contract.
   * @returns {string} The address of the contract
   */
  getAddress () {
    return this.address
  }

  /**
   * Sets the nod3 instance.
   * @param {Object} nod3Instance - The nod3 instance
   */
  setNod3 (nod3Instance) {
    this.nod3 = nod3Instance
  }

  /**
   * Gets the contract ABI.
   * @returns {Object} The contract ABI
   */
  getAbi () {
    return this.abi
  }

  /**
   * Sets the contract ABI.
   * @param {Object} newAbi - The new contract ABI
   */
  setAbi (newAbi) {
    this.abi = newAbi
    this.contractInterface = new Interface(newAbi)
  }

  /**
   * Encodes a contract call.
   * @param {FunctionFragment | string} method - The method to call. Can be the method name or a FunctionFragment for more precise method selection
   * @param {Array} params - The parameters for the method call
   * @returns {string} The encoded call data
   */
  encodeCall (method, params = []) {
    return this.contractInterface.encodeFunctionData(method, params)
  }

  /**
   * Decodes a contract call.
   * @param {FunctionFragment | string} method - The method to decode. Can be the method name or a FunctionFragment for more precise method selection
   * @param {string} data - The encoded call data
   * @returns {Object} The decoded call result
   */
  decodeCall (method, data) {
    if (method instanceof FunctionFragment) {
      const { outputs } = method
      const decoded = this.contractInterface.decodeFunctionResult(method, data)
      return (Array.isArray(decoded) && outputs && outputs.length < 2) ? decoded[0] : decoded
    } else {
      const { outputs } = this.contractInterface.getFunction(method)
      const decoded = this.contractInterface.decodeFunctionResult(method, data)
      return (Array.isArray(decoded) && outputs && outputs.length < 2) ? decoded[0] : decoded
    }
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
  async call (method, params = [], options = { txData: {}, blockNumber: 'latest' }) {
    try {
      if (!this.nod3) throw new Error('Set nod3 instance before call')
      if (!this.address) throw new Error('The contract address is not defined')
      if (!Array.isArray(params)) throw new Error('Params must be an array')

      const tx = {
        ...options.txData,
        to: this.address,
        data: this.encodeCall(method, params)
      }

      const result = await this.nod3.eth.call(tx, options.blockNumber)

      const decodedResult = this.decodeCall(method, result)

      return decodedResult
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
