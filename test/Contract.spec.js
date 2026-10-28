import { expect } from 'chai'
import Contract from '../src/lib/Contract'
import defaultABI from '../src/lib/Abi'

const ADDR = '0x1111111111111111111111111111111111111111'
const ID = '42'
const WORD_1 = `0x${'0'.repeat(63)}1`
const WORD_5 = `0x${'0'.repeat(63)}5`
const OTHER_ADDR = '0x2222222222222222222222222222222222222222'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const topicOf = address => `0x${'0'.repeat(24)}${address.slice(2)}`

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

  it('throws naming both signatures when arity cannot disambiguate an encode', () => {
    expect(() => contract.encodeCall('balanceOf', []))
      .to.throw('Ambiguous method "balanceOf" — pass the signature: balanceOf(address) | balanceOf(address,uint256)')
  })

  it('decodes a bare overloaded name whose overloads return the same types', () => {
    expect(contract.decodeCall('balanceOf', WORD_5).toString()).to.equal('5')
  })

  it('throws naming every overload when a bare name\'s overloads return different types', () => {
    expect(() => contract.decodeCall('transfer', WORD_1))
      .to.throw('Ambiguous method "transfer" — its overloads return different types, pass the signature or the params: transfer(address,address,uint256) | transfer(address,uint256) | transfer()')
  })

  it('resolves overloads returning different types by the arity of params', () => {
    expect(contract.decodeCall('transfer', WORD_1, [ADDR, ID])).to.equal(true)
  })

  it('names the outputs of the overload matching the arity of params when the overloads return the same types', () => {
    const reader = new Contract([
      { type: 'function', name: 'read', inputs: [], outputs: [{ name: 'count', type: 'uint256' }, { name: 'total', type: 'uint256' }], stateMutability: 'view' },
      { type: 'function', name: 'read', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ name: 'id', type: 'uint256' }, { name: 'amount', type: 'uint256' }], stateMutability: 'view' }
    ])
    const decoded = reader.decodeCall('read', `${WORD_1}${WORD_5.slice(2)}`, [ID])
    expect([decoded.id.toString(), decoded.amount.toString()]).to.deep.equal(['1', '5'])
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

  it('keeps the first Transfer event of the default ABI', () => {
    expect(new Contract(defaultABI).contractInterface.getEvent('Transfer(address,address,uint256)').format('full'))
      .to.equal('event Transfer(address indexed from, address indexed to, uint256 value)')
  })

  it('decodes a Transfer log with the default ABI', () => {
    const log = { topics: [TRANSFER_TOPIC, topicOf(ADDR), topicOf(OTHER_ADDR)], data: WORD_5 }
    const { name, args } = new Contract(defaultABI).contractInterface.parseLog(log)
    expect([name, args.from, args.to, args.value.toString()]).to.deep.equal(['Transfer', ADDR, OTHER_ADDR, '5'])
  })

  it('keeps the first constructor of the default ABI', () => {
    expect(new Contract(defaultABI).contractInterface.deploy.format('full'))
      .to.equal('constructor(string name, string symbol, uint8 decimals)')
  })

  it('keeps one error per signature without duplicate-definition warnings', () => {
    const unauthorized = { type: 'error', name: 'Unauthorized', inputs: [{ name: 'account', type: 'address' }] }
    const consoleLog = console.log
    const warnings = []
    console.log = (...args) => { if (String(args[0]).includes('duplicate definition')) warnings.push(args[0]) }
    let errors
    try {
      errors = Object.keys(new Contract([unauthorized, unauthorized]).contractInterface.errors)
    } finally {
      console.log = consoleLog
    }
    expect({ errors, warnings }).to.deep.equal({ errors: ['Unauthorized(address)'], warnings: [] })
  })

  it('keeps a function, an event and an error that share a signature, and skips fallback and receive', () => {
    const inputs = [{ name: 'a', type: 'uint256' }]
    const abi = [
      { type: 'fallback', stateMutability: 'payable' },
      { type: 'receive', stateMutability: 'payable' },
      { type: 'function', name: 'foo', inputs, outputs: [], stateMutability: 'view' },
      { type: 'event', name: 'foo', inputs: [{ ...inputs[0], indexed: false }], anonymous: false },
      { type: 'error', name: 'foo', inputs }
    ]
    const { functions, events, errors } = new Contract(abi).contractInterface
    expect([functions, events, errors].map(Object.keys)).to.deep.equal([['foo(uint256)'], ['foo(uint256)'], ['foo(uint256)']])
  })
})
