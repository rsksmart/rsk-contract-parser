import { expect } from 'chai'
import orchid from '../src/lib/nativeContracts/bridge-orchid.json'
import wasabi from '../src/lib/nativeContracts/bridge-wasabi.json'
import iris from '../src/lib/nativeContracts/bridge-iris.json'
import fingerroot from '../src/lib/nativeContracts/bridge-fingerroot.json'
import hop from '../src/lib/nativeContracts/bridge-hop.json'
import { getBridgeAbi } from '../src/lib/nativeContracts/bridgeAbi'

/*
  mainnet: {
    0: orchid,
    1591000: wasabi,
    2392700: papyrus,
    3614800: iris,
    4598500: hop,
    5468000: fingerroot
  },
  testnet: {
    0: wasabi,
    863000: papyrus,
    2060500: iris,
    3103000: hop,
    4015800: fingerroot
  }
*/

describe('getBridgeAbi(txBlockNumber, bitcoinNetwork) should return the correct ABI for the bridge', () => {
  it('Should return orchid for height 0 in mainnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 0, bitcoinNetwork: 'mainnet' })
    expect(abi).to.be.deep.equal(orchid)
  })

  it('Should return orchid for height 1 in mainnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 1, bitcoinNetwork: 'mainnet' })
    expect(abi).to.be.deep.equal(orchid)
  })

  it('Should return iris for height 3614801 in mainnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 3614801, bitcoinNetwork: 'mainnet' })
    expect(abi).to.be.deep.equal(iris)
  })

  it('Should return fingerroot for height 5468005 in mainnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 5468005, bitcoinNetwork: 'mainnet' })
    expect(abi).to.be.deep.equal(fingerroot)
  })

  it('Should return wasabi for height 0 in testnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 0, bitcoinNetwork: 'testnet' })
    expect(abi).to.be.deep.equal(wasabi)
  })

  it('Should return wasabi for height 1 in testnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 1, bitcoinNetwork: 'testnet' })
    expect(abi).to.be.deep.equal(wasabi)
  })

  it('Should return hop for height 3103001 in testnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 3103001, bitcoinNetwork: 'testnet' })
    expect(abi).to.be.deep.equal(hop)
  })

  it('Should return fingeroot for height 4015805 in testnet', () => {
    const abi = getBridgeAbi({ txBlockNumber: 4015805, bitcoinNetwork: 'testnet' })
    expect(abi).to.be.deep.equal(fingerroot)
  })

  it('Should throw an error with a non numerical block number', () => {
    const getAbi = () => getBridgeAbi({ txBlockNumber: 'notANumber', bitcoinNetwork: 'testnet' })
    expect(getAbi).to.throw()
  })

  it('Should throw an error with a negative block number', () => {
    const getAbi = () => getBridgeAbi({ txBlockNumber: -1, bitcoinNetwork: 'testnet' })
    expect(getAbi).to.throw()
  })

  it('Should throw an error with a non existent bitcoin network', () => {
    const getAbi = () => getBridgeAbi({ txBlockNumber: 3003, bitcoinNetwork: 'wondernet' })
    expect(getAbi).to.throw()
  })
})
