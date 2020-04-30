import ethAbi from 'ethereumjs-abi'
import { addSignatureDataToAbi, getSignatureDataFromAbi } from './utils'
import { remove0x, toBuffer, add0x } from 'rsk-utils'
import { Buffer } from 'buffer'

function EventDecoder (abi) {
  abi = addSignatureDataToAbi(abi)

  const formatDecoded = decoded => {
    let encoding = (Buffer.isBuffer(decoded)) ? 'hex' : 16
    return add0x(decoded.toString(encoding))
  }

  const getEventAbi = topics => {
    const sigHash = remove0x(topics.shift())
    let events = abi.filter(i => {
      let { indexed, signature } = getSignatureDataFromAbi(i)
      return signature === sigHash && indexed === topics.length
    })
    if (events.length > 1) throw new Error('Duplicate events in ABI')
    const eventABI = events[0]
    return { eventABI, topics }
  }

  const decodeElement = (data, types) => formatDecoded(ethAbi.rawDecode(types, toBuffer(data)))

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
    let args = topics.map((topic, index) => decodeElement(topic, [eventABI.inputs[index].type]))
    const dataDecoded = decodeData(log.data, eventABI.inputs.filter(i => i.indexed === false).map(i => i.type))
    args = args.concat(dataDecoded)
    return Object.assign(log, { event: name, address, args, abi: eventABI, signature })
  }
  return Object.freeze({ decodeLog, getEventAbi })
}

export default EventDecoder
