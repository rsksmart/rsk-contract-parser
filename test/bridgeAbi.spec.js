import { expect } from 'chai'
import { Interface } from '@ethersproject/abi'
import { bridge as upstreamBridge } from '@rsksmart/rsk-precompiled-abis'
import orchid from '../src/lib/nativeContracts/bridge-orchid.json'
import wasabi from '../src/lib/nativeContracts/bridge-wasabi.json'
import iris from '../src/lib/nativeContracts/bridge-iris.json'
import fingerroot from '../src/lib/nativeContracts/bridge-fingerroot.json'
import hop from '../src/lib/nativeContracts/bridge-hop.json'
import lovell from '../src/lib/nativeContracts/bridge-lovell.json'
import reed from '../src/lib/nativeContracts/bridge-reed.json'
import vetiver from '../src/lib/nativeContracts/bridge-vetiver.json'
import { getRskReleaseByBlockNumber, RSK_RELEASES } from '../src/lib/nativeContracts/bridgeAbi'
import { getBridgeAddress, getRemascAddress } from '../src/lib/utils'

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
    { height: 8052200, abi: reed, name: 'reed' },
    { height: 8804200, abi: vetiver, name: 'vetiver' }
  ]
  const testnetTestExpectations = [
    { height: 0, abi: wasabi, name: 'wasabi' },
    { height: 1, abi: wasabi, name: 'wasabi' },
    { height: 3103001, abi: hop, name: 'hop' },
    { height: 6110487, abi: lovell, name: 'lovell' },
    { height: 6835700, abi: reed, name: 'reed' },
    { height: 7604200, abi: vetiver, name: 'vetiver' }
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

describe('Bridge ABI peg-out fee methods', () => {
  const pegOutWeis = '1000000000000000000' // 1e18

  it('decodes getEstimatedFeesForPegOutAmount(uint256 pegOutAmountInWeis) from latest (vetiver) ABI', () => {
    const iface = new Interface(vetiver.filter(i => i.type === 'function'))
    const data = iface.encodeFunctionData('getEstimatedFeesForPegOutAmount', [pegOutWeis])
    const parsed = iface.parseTransaction({ data })
    expect(parsed.name).to.equal('getEstimatedFeesForPegOutAmount')
    expect(parsed.args.pegOutAmountInWeis.toString()).to.equal(pegOutWeis)
  })

  it('decodes getEstimatedFeesForNextPegOutEvent() from latest (vetiver) ABI', () => {
    const iface = new Interface(vetiver.filter(i => i.type === 'function'))
    const data = iface.encodeFunctionData('getEstimatedFeesForNextPegOutEvent', [])
    const parsed = iface.parseTransaction({ data })
    expect(parsed.name).to.equal('getEstimatedFeesForNextPegOutEvent')
  })

  it('upstream @rsksmart/rsk-precompiled-abis exposes the peg-out fee methods with the expected wire-format selectors', () => {
    const iface = new Interface(upstreamBridge.abi.filter(i => i.type === 'function'))
    expect(iface.getSighash('getEstimatedFeesForPegOutAmount(uint256)')).to.equal('0xd2b712f4')
    expect(iface.getSighash('getEstimatedFeesForNextPegOutEvent()')).to.equal('0x7817d854')
  })
})

describe('Native contract address helpers', () => {
  it('getBridgeAddress returns the RSK Bridge precompile address', () => {
    expect(getBridgeAddress()).to.equal('0x0000000000000000000000000000000001000006')
  })

  it('getRemascAddress returns the RSK REMASC precompile address', () => {
    expect(getRemascAddress()).to.equal('0x0000000000000000000000000000000001000008')
  })
})
