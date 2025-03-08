import { Interface } from '@ethersproject/abi'

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
  constructor(abi, { address, nod3 } = {}) {
    if (!abi || typeof abi !== 'object') throw new Error('Invalid abi')
    
    this.abi = abi;
    this.address = address;
    this.nod3 = nod3;
    this.contractInterface = new Interface(abi);
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
    this.contractInterface = new Interface(newAbi);
  }

  /**
   * Encodes a contract call.
   * @param {string} methodName - The name of the method to call
   * @param {Array} params - The parameters for the method call
   * @returns {string} The encoded call data
   */
  encodeCall(methodName, params = []) {
    return this.contractInterface.encodeFunctionData(methodName, params);
  }

  /**
   * Decodes a contract call.
   * @param {string} methodName - The name of the method to decode
   * @param {string} data - The encoded call data
   * @returns {Object} The decoded call result
   */
  decodeCall(methodName, data) {
    const { outputs } = this.contractInterface.getFunction(methodName);
    const decoded = this.contractInterface.decodeFunctionResult(methodName, data);
    return (Array.isArray(decoded) && outputs && outputs.length < 2) ? decoded[0] : decoded;
  }

  /**
   * Makes a call to a contract method.
   * @param {string} methodName - The name of the method to call
   * @param {Array} params - The parameters for the method call
   * @param {Object} txData - Additional transaction data
   * @returns {Promise<*>} A promise that resolves to the call result
   * @throws {Error} If nod3 is not set, address is not defined, or params is not an array
   */
  async call(methodName, params = [], txData = {}) {
    try {
      if (!this.nod3) throw new Error(`Set nod3 instance before call`);
      if (!this.address) throw new Error(`The contract address is not defined`);
      if (!Array.isArray(params)) throw new Error(`Params must be an array`);
      
      const data = this.encodeCall(methodName, params);
      const to = this.address;
      const tx = Object.assign(txData, { to, data });
      const result = await this.nod3.eth.call(tx);
      return this.decodeCall(methodName, result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
