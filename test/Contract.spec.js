import { expect } from 'chai'
import Contract from '../src/lib/Contract'
import defaultABI from '../src/lib/Abi'

const ADDR = '0x1111111111111111111111111111111111111111'
const ID = '42'
const WORD_1 = `0x${'0'.repeat(63)}1`

describe('# Contract overloaded-method resolution', function () {
  const contract = new Contract(defaultABI)

  it('resolves a bare overloaded name by arity to the single-argument signature', () => {
    expect(contract.encodeCall('balanceOf', [ADDR]))
      .to.equal(contract.encodeCall('balanceOf(address)', [ADDR]))
  })

  it('resolves a bare overloaded name by arity to the two-argument signature', () => {
    expect(contract.encodeCall('balanceOf', [ADDR, ID]))
      .to.equal(contract.encodeCall('balanceOf(address,uint256)', [ADDR, ID]))
  })

  it('throws naming both signatures when arity cannot disambiguate', () => {
    expect(() => contract.decodeCall('balanceOf', '0x'))
      .to.throw('Ambiguous method "balanceOf" — pass the signature: balanceOf(address) | balanceOf(address,uint256)')
  })

  it('keeps the first definition of a signature the default ABI defines twice with different outputs', async () => {
    const nod3 = { eth: { call: () => Promise.resolve(WORD_1) } }
    const callable = new Contract(defaultABI, { address: ADDR, nod3 })
    expect(await callable.call('mint', [ADDR, ID])).to.equal(undefined)
  })

  it('leaves a non-overloaded bare name unchanged', () => {
    expect(contract.encodeCall('decimals')).to.equal(contract.encodeCall('decimals()'))
  })
})

describe('# Contract interface', function () {
  it('builds from the default ABI without duplicate-definition warnings', () => {
    const consoleLog = console.log
    const warnings = []
    console.log = (...args) => { if (String(args[0]).includes('duplicate definition')) warnings.push(args[0]) }
    try {
      new Contract(defaultABI).setAbi(defaultABI)
    } finally {
      console.log = consoleLog
    }
    expect(warnings).to.deep.equal([])
  })

  it('leaves console.log untouched when the package entry point is imported', () => {
    const consoleLog = console.log
    delete require.cache[require.resolve('../src/index')]
    try {
      require('../src/index')
      expect(console.log).to.equal(consoleLog)
    } finally {
      console.log = consoleLog
    }
  })
})
