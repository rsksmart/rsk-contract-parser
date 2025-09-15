import { expect } from 'chai'
import orchid from '../src/lib/nativeContracts/bridge-orchid.json'
import wasabi from '../src/lib/nativeContracts/bridge-wasabi.json'
import iris from '../src/lib/nativeContracts/bridge-iris.json'
import fingerroot from '../src/lib/nativeContracts/bridge-fingerroot.json'
import hop from '../src/lib/nativeContracts/bridge-hop.json'
import lovell from '../src/lib/nativeContracts/bridge-lovell.json'
import reed from '../src/lib/nativeContracts/bridge-reed.json'
import { getRskReleaseByBlockNumber, RSK_RELEASES } from '../src/lib/nativeContracts/bridgeAbi'

describe('All abis must be in ascendant order', () => {
  const mainnetAbis = RSK_RELEASES.mainnet
  const testnetAbis = RSK_RELEASES.testnet

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
    { height: 7338024, abi: lovell, name: 'lovell' },
    { height: 8052200, abi: reed, name: 'reed' }
  ]
  const testnetTestExpectations = [
    { height: 0, abi: wasabi, name: 'wasabi' },
    { height: 1, abi: wasabi, name: 'wasabi' },
    { height: 3103001, abi: hop, name: 'hop' },
    { height: 6110487, abi: lovell, name: 'lovell' },
    { height: 6835700, abi: reed, name: 'reed' }
  ]

  for (const { height, abi, name } of mainnetTestExpectations) {
    it(`Should return ${name} abi for height ${height} in mainnet`, () => {
      const release = getRskReleaseByBlockNumber(height, 'mainnet')
      expect(release.abi).to.be.deep.equal(abi)
    })
  }

  for (const { height, abi, name } of testnetTestExpectations) {
    it(`Should return ${name} abi for height ${height} in testnet`, () => {
      const release = getRskReleaseByBlockNumber(height, 'testnet')
      expect(release.abi).to.be.deep.equal(abi)
    })
  }

  it('Should throw an error with a non existent bitcoin network', () => {
    expect(() => getRskReleaseByBlockNumber(3003, 'wondernet')).to.throw()
  })

  it('Should return the latest bridge ABI for block tag "latest"', () => {
    const release1 = getRskReleaseByBlockNumber('latest', 'mainnet')
    const release2 = getRskReleaseByBlockNumber('latest', 'testnet')
    expect(release1.abi).to.be.deep.equal(mainnetTestExpectations[mainnetTestExpectations.length - 1].abi)
    expect(release2.abi).to.be.deep.equal(testnetTestExpectations[testnetTestExpectations.length - 1].abi)
  })

  it('Should throw an error when block number is not either a number or block tag "latest"', () => {
    expect(() => getRskReleaseByBlockNumber('not a number', 'mainnet')).to.throw()
    expect(() => getRskReleaseByBlockNumber([], 'mainnet')).to.throw()
    expect(() => getRskReleaseByBlockNumber({}, 'mainnet')).to.throw()
    expect(() => getRskReleaseByBlockNumber(true, 'mainnet')).to.throw()
  })
})
