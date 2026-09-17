import { expect } from 'chai'
import Contract from '../src/lib/Contract'
import defaultABI from '../src/lib/Abi'

const ADDR = '0x1111111111111111111111111111111111111111'
const ID = '42'

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

  it('leaves a non-overloaded bare name unchanged', () => {
    expect(contract.encodeCall('decimals')).to.equal(contract.encodeCall('decimals()'))
  })
})
