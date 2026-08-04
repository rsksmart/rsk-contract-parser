import { expect } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import interfacesIds from '../src/lib/interfacesIds'
import { soliditySignature } from '../src/lib/utils'
import { defaultAbiCoder } from '@ethersproject/abi'

// ERC-1155 decoding contract: uint256 token ids and amounts are decimal
// strings, uint256[] args keep their arity (a one-element batch stays an
// array). Downstream balance reconstruction consumes args positionally.

const initConfig = {
  nativeContracts: {
    bridge: '0x0000000000000000000000000000000001000006',
    remasc: '0x0000000000000000000000000000000001000008'
  },
  net: { id: '31' }
}

const CONTRACT = '0x8859c08ed73bd06b2961ccc88160cb11a61d69f7'
const OPERATOR = '0x1111111111111111111111111111111111111111'
const FROM = '0x2222222222222222222222222222222222222222'
const TO = '0x3333333333333333333333333333333333333333'
const ZERO = '0x0000000000000000000000000000000000000000'
const UINT256_MAX_ISH = '57896044618658097711785492504343953926634992332820282019728792003956564820159'

const padAddress = a => '0x' + a.slice(2).padStart(64, '0')
const topic0 = signature => '0x' + soliditySignature(signature)

const baseLog = logIndex => ({
  address: CONTRACT,
  blockNumber: '0x100000',
  blockHash: '0x' + 'ab'.repeat(32),
  transactionHash: '0x' + 'cd'.repeat(32),
  transactionIndex: '0x1',
  logIndex: '0x' + logIndex.toString(16)
})

describe('# ERC1155 event decoding', function () {
  // log decoding never touches the node
  const parser = new ContractParser({ initConfig, nod3: { offline: true } })

  it('TransferSingle decodes id and value as decimal strings', () => {
    const log = Object.assign(baseLog(0), {
      topics: [
        topic0('TransferSingle(address,address,address,uint256,uint256)'),
        padAddress(OPERATOR), padAddress(ZERO), padAddress(TO)
      ],
      data: defaultAbiCoder.encode(['uint256', 'uint256'], [UINT256_MAX_ISH, 3])
    })
    const [event] = parser.parseTxLogs([log])
    expect(event.event).to.equal('TransferSingle')
    expect(event.args).to.deep.equal([OPERATOR, ZERO, TO, UINT256_MAX_ISH, '3'])
    expect(event._addresses).to.have.members([OPERATOR, ZERO, TO])
  })

  it('TransferBatch decodes ids and values as arrays of decimal strings', () => {
    const log = Object.assign(baseLog(1), {
      topics: [
        topic0('TransferBatch(address,address,address,uint256[],uint256[])'),
        padAddress(OPERATOR), padAddress(FROM), padAddress(TO)
      ],
      data: defaultAbiCoder.encode(['uint256[]', 'uint256[]'], [[1, 2], [10, 20]])
    })
    const [event] = parser.parseTxLogs([log])
    expect(event.event).to.equal('TransferBatch')
    expect(event.args).to.deep.equal([OPERATOR, FROM, TO, ['1', '2'], ['10', '20']])
  })

  it('TransferBatch with a single id keeps array arity', () => {
    const log = Object.assign(baseLog(2), {
      topics: [
        topic0('TransferBatch(address,address,address,uint256[],uint256[])'),
        padAddress(OPERATOR), padAddress(FROM), padAddress(TO)
      ],
      data: defaultAbiCoder.encode(['uint256[]', 'uint256[]'], [[42], [5]])
    })
    const [event] = parser.parseTxLogs([log])
    expect(event.event).to.equal('TransferBatch')
    expect(event.args[3]).to.deep.equal(['42'])
    expect(event.args[4]).to.deep.equal(['5'])
  })

  it('URI decodes the value string untouched and the id as a decimal string', () => {
    const log = Object.assign(baseLog(3), {
      topics: [
        topic0('URI(string,uint256)'),
        '0x' + (7).toString(16).padStart(64, '0')
      ],
      data: defaultAbiCoder.encode(['string'], ['ipfs://QmHash/{id}.json'])
    })
    const [event] = parser.parseTxLogs([log])
    expect(event.event).to.equal('URI')
    expect(event.args).to.deep.equal(['ipfs://QmHash/{id}.json', '7'])
  })

  it('non-1155 events keep hex-string uint formatting', () => {
    const log = Object.assign(baseLog(4), {
      topics: [
        topic0('Transfer(address,address,uint256)'),
        padAddress(FROM), padAddress(TO)
      ],
      data: defaultAbiCoder.encode(['uint256'], [255])
    })
    const [event] = parser.parseTxLogs([log])
    expect(event.event).to.equal('Transfer')
    expect(event.args[2]).to.equal('0xff')
  })
})

describe('# ERC1155 interface ids', function () {
  it('ERC1155 entry computes the spec ERC-165 id 0xd9b67a26', () => {
    expect(interfacesIds.ERC1155.id).to.equal('0xd9b67a26')
    expect(interfacesIds.ERC1155.erc165).to.equal(true)
  })

  it('ERC1155MetadataURI entry computes the spec ERC-165 id 0x0e89341c', () => {
    expect(interfacesIds.ERC1155MetadataURI.id).to.equal('0x0e89341c')
    expect(interfacesIds.ERC1155MetadataURI.erc165).to.equal(true)
  })
})
