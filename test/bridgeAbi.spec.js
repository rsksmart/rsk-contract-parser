import { expect } from 'chai'
import orchid from '../src/lib/nativeContracts/bridge-orchid.json'
import wasabi from '../src/lib/nativeContracts/bridge-wasabi.json'
import iris from '../src/lib/nativeContracts/bridge-iris.json'
import fingerroot from '../src/lib/nativeContracts/bridge-fingerroot.json'
import hop from '../src/lib/nativeContracts/bridge-hop.json'
import lovell from '../src/lib/nativeContracts/bridge-lovell.json'
import { getBridgeAbiByBlockNumber, RELEASES } from '../src/lib/nativeContracts/bridgeAbi'

/*
  mainnet: {
    0: orchid,
    1591000: wasabi,
    2392700: papyrus,
    3614800: iris,
    4598500: hop,
    5468000: fingerroot,
    7338024: lovell
  },
  testnet: {
    0: wasabi,
    863000: papyrus,
    2060500: iris,
    3103000: hop,
    4015800: fingerroot,
    6110487: lovell
  }
*/

describe('All abis must be in ascendant order', () => {
  const mainnetAbis = RELEASES.mainnet
  const testnetAbis = RELEASES.testnet

  for (let i = 1; i < mainnetAbis.length; i++) {
    it('Should current height be higher than the previous one', () => {
      expect(mainnetAbis[i].height).to.be.greaterThan(mainnetAbis[i - 1].height)
    })
  }

  for (let i = 1; i < testnetAbis.length; i++) {
    it('Should current height be higher than the previous one', () => {
      expect(testnetAbis[i].height).to.be.greaterThan(testnetAbis[i - 1].height)
    })
  }
})

describe('getBridgeAbi(txBlockNumber, bitcoinNetwork) should return the correct ABI for the bridge', () => {
  const mainnetTestExpectations = [
    { height: 0, abi: orchid, name: 'orchid' },
    { height: 1, abi: orchid, name: 'orchid' },
    { height: 3614801, abi: iris, name: 'iris' },
    { height: 5468005, abi: fingerroot, name: 'fingerroot' },
    { height: 7338024, abi: lovell, name: 'lovell' }
  ]
  const testnetTestExpectatins = [
    { height: 0, abi: wasabi, name: 'wasabi' },
    { height: 1, abi: wasabi, name: 'wasabi' },
    { height: 3103001, abi: hop, name: 'hop' },
    { height: 6110487, abi: lovell, name: 'lovell' }
  ]

  for (const { height, abi, name } of mainnetTestExpectations) {
    it(`Should return ${name} abi for height ${height} in mainnet`, () => {
      expect(getBridgeAbiByBlockNumber(height, 'mainnet')).to.be.deep.equal(abi)
    })
  }

  for (const { height, abi, name } of testnetTestExpectatins) {
    it(`Should return ${name} abi for height ${height} in testnet`, () => {
      expect(getBridgeAbiByBlockNumber(height, 'testnet')).to.be.deep.equal(abi)
    })
  }

  it('Should throw an error with a non existent bitcoin network', () => {
    expect(() => getBridgeAbiByBlockNumber(3003, 'wondernet')).to.throw()
  })

  it('Should return the latest bridge ABI for block tag "latest"', () => {
    expect(getBridgeAbiByBlockNumber('latest', 'mainnet')).to.deep.equal(mainnetTestExpectations[mainnetTestExpectations.length - 1].abi)
    expect(getBridgeAbiByBlockNumber('latest', 'testnet')).to.deep.equal(testnetTestExpectatins[testnetTestExpectatins.length - 1].abi)
  })

  it('Should throw an error when block number is not either a number or block tag "latest"', () => {
    expect(() => getBridgeAbiByBlockNumber('not a number', 'mainnet')).to.throw()
    expect(() => getBridgeAbiByBlockNumber([], 'mainnet')).to.throw()
    expect(() => getBridgeAbiByBlockNumber({}, 'mainnet')).to.throw()
    expect(() => getBridgeAbiByBlockNumber(true, 'mainnet')).to.throw()
  })
})
