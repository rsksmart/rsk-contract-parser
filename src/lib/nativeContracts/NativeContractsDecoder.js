import NativeContractsEvents from './NativeContractsEvents'
import EventDecoder from '../EventDecoder'
import { getBridgeAbiByBlockNumber } from './bridgeAbi'
import { addSignatureDataToAbi } from '../utils'

export default function NativeContractsEventDecoder ({ bitcoinNetwork, txBlockNumber }) {
  const nativeDecoder = NativeContractsEvents({ bitcoinNetwork })
  const ABI = addSignatureDataToAbi(getBridgeAbiByBlockNumber(txBlockNumber, bitcoinNetwork))
  const solidityDecoder = EventDecoder(ABI)

  const getEventDecoder = log => {
    const { eventABI } = solidityDecoder.getEventAbi([...log.topics])
    return (eventABI) ? solidityDecoder : nativeDecoder
  }
  return Object.freeze({ getEventDecoder })
}
