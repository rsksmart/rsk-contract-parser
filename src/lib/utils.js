import { keccak256, add0x } from '@rsksmart/rsk-utils'
import { ABI_SIGNATURE, INTERFACE_ID_BYTES } from './types'
import { bridge } from '@rsksmart/rsk-precompiled-abis'
import { isAddress } from '@rsksmart/rsk-utils/dist/addresses'

export const getLatestBridgeAbi = () => {
  try {
    if (!bridge || !bridge.abi || !Array.isArray(bridge.abi)) throw new Error('Invalid Bridge ABI')

    return bridge.abi
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getLatestBridgeMethods = () => {
  try {
    const bridgeAbi = getLatestBridgeAbi()
    return bridgeAbi.map(solidityName)
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getBridgeAddress = () => {
  try {
    if (!bridge || !bridge.address || !isAddress(bridge.address)) throw new Error('Invalid Bridge Address')

    return bridge.address
  } catch (error) {
    console.error(error)
    return null
  }
}
export const setAbi = abi => addSignatureDataToAbi(abi, true)

export const abiEvents = abi => abi.filter(v => v.type === 'event')

export const abiMethods = abi => abi.filter(v => v.type === 'function')

export const soliditySignature = name => keccak256(name)

export const soliditySelector = signature => signature.slice(0, 8)

export const processInputType = input => {
  if (input.type !== 'tuple' && !input.type.startsWith('tuple[')) {
    return input.type
  }

  // Process tuple components
  const componentsTypes = input.components.map(component => processInputType(component))
  const tupleRepresentation = `(${componentsTypes.join(',')})`

  // If it's an array of tuples, append the array brackets
  if (input.type.startsWith('tuple[')) {
    const arrayBrackets = input.type.substring(5) // extract the array part: [] for dynamic array, '[number]' for fixed array
    return `${tupleRepresentation}${arrayBrackets}`
  }

  return tupleRepresentation
}

/**
 * Returns the solidity name (signature) of the provided function fragment
 * @param {Object} abi - The function fragment
 * @returns {string} The solidity name of the function fragment
 * @example
 * solidityName({
 *   name: 'balanceOf',
 *   inputs: [{ type: 'address' }],
 *   outputs: [{ type: 'uint256' }]
 *   // ...other function fragment fields
 * })
 * // returns 'balanceOf(address)'
 */
export const solidityName = abi => {
  let { name, inputs } = abi
  inputs = (inputs) ? inputs.map(i => processInputType(i)) : []
  return (name) ? `${name}(${inputs.join(',')})` : null
}

export const removeAbiSignatureData = (abi) => {
  abi = Object.assign({}, abi)
  if (undefined !== abi[ABI_SIGNATURE]) delete abi[ABI_SIGNATURE]
  return abi
}

export const getInputsIndexes = abi => {
  const { inputs } = abi
  return (inputs && abi.type === 'event') ? inputs.map(i => i.indexed) : []
}

export const abiSignatureData = abi => {
  const method = solidityName(abi)
  const signature = (method) ? soliditySignature(method) : null
  const index = getInputsIndexes(abi)
  const indexed = (index) ? index.filter(i => i === true).length : 0
  let eventSignature = null
  if ((method && abi.type === 'event')) {
    eventSignature = soliditySignature(`${method}${Buffer.from(index).toString('hex')}`)
  }
  return { method, signature, index, indexed, eventSignature }
}

export const addSignatureDataToAbi = (abi, skip) => {
  if (!Array.isArray(abi)) {
    throw new Error('ABI must be an array')
  }

  abi.forEach(value => {
    if (!value[ABI_SIGNATURE] || !skip) {
      value[ABI_SIGNATURE] = abiSignatureData(value)
    }
  })
  return abi
}

export const erc165Id = selectors => {
  const id = selectors.map(s => Buffer.from(s, 'hex'))
    .reduce((a, bytes) => {
      for (let i = 0; i < INTERFACE_ID_BYTES; i++) {
        a[i] = a[i] ^ bytes[i]
      }
      return a
    }, Buffer.alloc(INTERFACE_ID_BYTES))
  return add0x(id.toString('hex'))
}

export const erc165IdFromMethods = methods => {
  return erc165Id(methods.map(m => soliditySelector(soliditySignature(m))))
}

export const getSignatureDataFromAbi = abi => {
  return abi[ABI_SIGNATURE]
}

export function filterEvents (abi) {
  const type = 'event'
  // get events from ABI
  const events = abi.filter(a => a.type === type)
  // remove events from ABI
  abi = abi.filter(a => a.type !== type)
  const keys = [...new Set(events.map(e => e[ABI_SIGNATURE].eventSignature))]
  const filteredEvents = keys.map(k => events.find(e => e[ABI_SIGNATURE].eventSignature === k))
  abi = abi.concat(filteredEvents)
  return abi
}

function filterArr (a) {
  if (!Array.isArray(a)) return a
  return a.find(x => filterArr(x))
}

export async function binarySearchNumber (searchCb, high, low) {
  try {
    high = parseInt(high || 0)
    low = parseInt(low || 0)
    if (typeof searchCb !== 'function') throw new Error('SeachCb must be a function')
    const [l, h] = await Promise.all([low, high].map(b => searchCb(b)))
    if (l !== h) {
      if (high === low + 1) {
        return high
      } else {
        const mid = Math.floor(high / 2 + low / 2)
        const res = await Promise.all([
          binarySearchNumber(searchCb, high, mid),
          binarySearchNumber(searchCb, mid, low)])
        return filterArr(res)
      }
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

export function notZero (value) {
  if (typeof value === 'string' && /^0x[0-9a-f]*$/i.test(value)) {
    return BigInt(value) !== BigInt(0)
  }

  return false
}

export function formatAddressFromSlot (slot) {
  if (typeof slot === 'string') {
    return `0x${slot.slice(-40)}`
  }
  return slot
}

/**
 * Converts a number to a hex string.
 * @param {number} number - The number to convert
 * @returns {string} The hex string
 */
export function toHex (number) {
  if (typeof number === 'number') {
    return '0x' + number.toString(16)
  }

  return number
}
