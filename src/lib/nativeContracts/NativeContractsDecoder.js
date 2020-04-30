import NativeContractsEvents from './NativeContractsEvents'
import EventDecoder from '../EventDecoder'
import bridgeAbi from './bridge.json'
import { addSignatureDataToAbi } from '../utils'

export const ABI = addSignatureDataToAbi(bridgeAbi)

export default function NativeContractsEventDecoder ({ bitcoinNetwork }) {
  const nativeDecoder = NativeContractsEvents({ bitcoinNetwork })
  const solidityDecoder = EventDecoder(ABI)

  const getEventDecoder = log => {
    const { eventABI } = solidityDecoder.getEventAbi([...log.topics])
    return (eventABI) ? solidityDecoder : nativeDecoder
  }
  return Object.freeze({ getEventDecoder })
}
