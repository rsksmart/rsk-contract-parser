import NativeContractsEvents from './NativeContractsEvents'
import EventDecoder from '../EventDecoder'
import { getRskReleaseByBlockNumber } from './bridgeAbi'
import { addSignatureDataToAbi } from '../utils'

export default function NativeContractsEventDecoder ({ bitcoinNetwork, txBlockNumber }) {
  const nativeDecoder = NativeContractsEvents({ bitcoinNetwork })
  const rskRelease = getRskReleaseByBlockNumber(txBlockNumber, bitcoinNetwork)
  const ABI = addSignatureDataToAbi(rskRelease.abi)
  const solidityDecoder = EventDecoder(ABI)

  const getEventDecoder = log => {
    const { eventABI } = solidityDecoder.getEventAbi([...log.topics])
    return (eventABI) ? solidityDecoder : nativeDecoder
  }
  return Object.freeze({ getEventDecoder })
}
