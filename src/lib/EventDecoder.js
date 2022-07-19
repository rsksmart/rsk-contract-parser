import { addSignatureDataToAbi, getSignatureDataFromAbi } from './utils'
import { remove0x, add0x, bufferToHex } from '@rsksmart/rsk-utils'
import ethAbi from 'ethereumjs-abi'

function EventDecoder (abi) {
  abi = addSignatureDataToAbi(abi)

  const rawDecode = (types,data) =>{
    const decoded = Web3EthAbi.decodeParameters(types,data)
    delete decoded['__length__']
    const arrDecoded = Object.keys(decoded).map(key => decoded[key])
    return arrDecoded
   }

  const formatDecoded = (decoded) => {
    return add0x(Buffer.isBuffer(decoded) ? bufferToHex(decoded) : decoded.toString(16))
  }

  const getEventAbi = topics => {
    topics = [...topics]
    const sigHash = remove0x(topics.shift())
    let events = abi.filter(i => {
      let { indexed, signature } = getSignatureDataFromAbi(i)
      return signature === sigHash && indexed === topics.length
    })
    if (events.length > 1) throw new Error('Duplicate events in ABI')
    const eventABI = events[0]
    return { eventABI, topics }
  }

  const decodeElement = (data, types) => {
    let decoded = ethAbi.rawDecode(types, toBuffer(data))
    if (Array.isArray(decoded)) {
      decoded = decoded.map(d => formatDecoded(d))
      if (decoded.length === 1) decoded = decoded.join()
    } else {
      decoded = formatDecoded(decoded)
    }
      return decoded
  }

  const decodeData = (data, types) => {
    let decoded = ethAbi.rawDecode(types, toBuffer(data))
    return decoded.map(d => formatDecoded(d))
  }
  
  const decodeLog = log => {
    log = Object.assign({}, log)
    const { eventABI, topics } = getEventAbi(log.topics)
    const { address } = log
    if (!eventABI) return log
    const { name } = eventABI
    const { signature } = getSignatureDataFromAbi(eventABI)
    const { inputs } = eventABI
    const indexedInputs = inputs.filter(i => i.indexed === true)
    let decodedTopics = topics.map((topic, index) => decodeElement(topic, [indexedInputs[index].type]))
    const decodedData = decodeData(log.data, inputs.filter(i => i.indexed === false).map(i => i.type))
    const args = []
    for (let input of inputs) {
      args.push((input.indexed) ? decodedTopics.shift() : decodedData.shift())
    }
    return Object.assign(log, { event: name, address, args, abi: eventABI, signature })
  }
  return Object.freeze({ decodeLog, getEventAbi })
}

export default EventDecoder
