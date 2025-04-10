import { expect } from 'chai'
import nod3 from '../../src/lib/nod3Connect'
import BcSearch from '../../src/lib/BcSearch'
import trace01 from './trace01.json'

const traces = [
  ['0x53ccd2ac4e923d8e74b66828070d6c3cc0c1861c', trace01, true]
]

const search = BcSearch(nod3)

describe('# BC search', function () {
  it('should be connected to RSK testnet', async function () {
    const net = await nod3.net.version()
    expect(net.id).to.be.equal('31')
  })

  describe('isItxDeployment()', function () {
    for (const [address, trace, expected] of traces) {
      it(`should be ${expected}`, () => {
        expect(search.isItxDeployment(address, trace)).to.be.equal(expected)
      })
    }
  })

  describe('deploymentBlock()', function () {
    this.timeout(90000)
    const tests = [['0x4f82e59517c29ed0c73f5351847eb075bf473465', 657077]]
    for (const [address, block] of tests) {
      it(`${address} should return ${block} `, async () => {
        const res = await search.deploymentBlock(address)
        expect(res).to.be.equal(block)
      })
    }
  })

  describe('deploymentTx()', function () {
    this.timeout(90000)

    const tx = {
      contractAddress: '0x4f82e59517c29ed0c73f5351847eb075bf473465',
      blockNumber: 657077,
      hash: '0xb07be69b3bd8c1713d2f1772a53d2b29c17d5485bfa1f899f8b81227191a5a7a'
    }

    it('should return the deployment tx for contract 0x4f82e59517c29ed0c73f5351847eb075bf473465', async () => {
      const res = await search.deploymentTx(tx.contractAddress)
      expect(res).to.be.an('object')
      expect(res).to.have.property('tx')
      expect(res.tx).to.have.property('hash')
      expect(res.tx).to.have.property('blockNumber')
      expect(res.tx.hash).to.be.equal(tx.hash)
      expect(res.tx.blockNumber).to.be.equal(tx.blockNumber)
    })

    const itx = {
      contractAddress: '0x53ccd2ac4e923d8e74b66828070d6c3cc0c1861c',
      blockNumber: 426919,
      transactionHash: '0x18bb48f7168476790d0e1293211b5e8f928e5ef69689518540008bedc282583c'
    }

    it('should return the deployment internal tx for contract 0x53ccd2ac4e923d8e74b66828070d6c3cc0c1861c', async () => {
      const res = await search.deploymentTx(itx.contractAddress)
      expect(res).to.be.an('object')
      expect(res).to.have.property('internalTx')
      expect(res.internalTx).to.have.property('transactionHash')
      expect(res.internalTx).to.have.property('blockNumber')
      expect(res.internalTx.transactionHash).to.be.equal(itx.transactionHash)
      expect(res.internalTx.blockNumber).to.be.equal(itx.blockNumber)
    })
  })
})
