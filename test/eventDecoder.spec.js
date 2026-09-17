import { expect } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import { soliditySignature } from '../src/lib/utils'
import { defaultAbiCoder } from '@ethersproject/abi'

const initConfig = {
  nativeContracts: {
    bridge: '0x0000000000000000000000000000000001000006',
    remasc: '0x0000000000000000000000000000000001000008'
  },
  net: { id: '31' }
}

const CONTRACT = '0x8859c08ed73bd06b2961ccc88160cb11a61d69f7'
const FROM = '0x2222222222222222222222222222222222222222'
const TO = '0x3333333333333333333333333333333333333333'
const OPERATOR = '0x1111111111111111111111111111111111111111'

const padAddress = a => '0x' + a.slice(2).padStart(64, '0')
const padUint = n => '0x' + n.toString(16).padStart(64, '0')
const topic0 = signature => '0x' + soliditySignature(signature)
const indexedFlags = event => event.abi.inputs.map(i => !!i.indexed)

const baseLog = () => ({
  address: CONTRACT,
  blockNumber: '0x100000',
  blockHash: '0x' + 'ab'.repeat(32),
  transactionHash: '0x' + 'cd'.repeat(32),
  transactionIndex: '0x1',
  logIndex: '0x0'
})

describe('# EventDecoder fragment selection by topic hash and indexed count', function () {
  const parser = new ContractParser({ initConfig, nod3: { offline: true } })
  const decode = log => parser.parseTxLogs([Object.assign(baseLog(), log)])[0]

  it('decodes an ERC-20 Transfer (2 indexed, value in data) with its own fragment', () => {
    const event = decode({
      topics: [topic0('Transfer(address,address,uint256)'), padAddress(FROM), padAddress(TO)],
      data: defaultAbiCoder.encode(['uint256'], [255])
    })
    expect(event.event).to.equal('Transfer')
    expect(event.args).to.deep.equal([FROM, TO, '0xff'])
    expect(indexedFlags(event)).to.deep.equal([true, true, false])
  })

  it('decodes an ERC-721 Transfer (3 indexed, empty data) to [from, to, tokenId]', () => {
    const event = decode({
      topics: [topic0('Transfer(address,address,uint256)'), padAddress(FROM), padAddress(TO), padUint(69)],
      data: '0x'
    })
    expect(event.event).to.equal('Transfer')
    expect(event.args).to.deep.equal([FROM, TO, '0x45'])
    expect(indexedFlags(event)).to.deep.equal([true, true, true])
  })

  it('decodes a non-indexed Transfer (0 indexed, all args in data) with its own fragment', () => {
    const event = decode({
      topics: [topic0('Transfer(address,address,uint256)')],
      data: defaultAbiCoder.encode(['address', 'address', 'uint256'], [FROM, TO, 7])
    })
    expect(event.event).to.equal('Transfer')
    expect(event.args).to.deep.equal([FROM, TO, '0x07'])
    expect(indexedFlags(event)).to.deep.equal([false, false, false])
  })

  it('decodes Transfer(address,address,uint256,bytes) with its own fragment', () => {
    const event = decode({
      topics: [topic0('Transfer(address,address,uint256,bytes)'), padAddress(FROM), padAddress(TO)],
      data: defaultAbiCoder.encode(['uint256', 'bytes'], [9, '0xdead'])
    })
    expect(event.event).to.equal('Transfer')
    expect(event.args).to.deep.equal([FROM, TO, '0x09', '0xdead'])
    expect(indexedFlags(event)).to.deep.equal([true, true, false, false])
  })

  it('keeps ERC-1155 TransferSingle decoding to decimal strings', () => {
    const event = decode({
      topics: [
        topic0('TransferSingle(address,address,address,uint256,uint256)'),
        padAddress(OPERATOR), padAddress(FROM), padAddress(TO)
      ],
      data: defaultAbiCoder.encode(['uint256', 'uint256'], [5, 3])
    })
    expect(event.event).to.equal('TransferSingle')
    expect(event.args).to.deep.equal([OPERATOR, FROM, TO, '5', '3'])
  })
})
