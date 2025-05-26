import { expect } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import { createRskNodeProvider } from '../src/lib/nod3Connect'

const addresses = {
  '0xebea27d994371cd0cb9896ae4c926bc5221f6317': ['ERC20'],
  '0x0c52e0e76e13ba3e74c5b47f066e20cc152fd9ba': ['ERC20', 'ERC677'],
  '0x4626f072c42afed36d7aad7f2ab9fa9e16bdb72a': ['ERC165', 'ERC721', 'ERC721Enumerable', 'ERC721Metadata'],
  '0x1e6d0bad215c6407f552e4d1260e7bae90005ab2': ['ERC165', 'ERC721', 'ERC721Enumerable', 'ERC721Metadata'],
  '0xe59f2877a51e570fbf751a07d50899838e6b6cc7': ['ERC721'],
  '0x7974f2971e0b5d68f30513615fafec5c451da4d1': ['ERC20', 'ERC677']
}

const nod3 = createRskNodeProvider('testnet')
const parser = new ContractParser({ nod3 })

describe('# Interfaces detection', function () {
  it('should be connected to RSK testnet', async function () {
    const net = await nod3.net.version()
    expect(net.id).to.be.equal('31')
  })

  for (const address in addresses) {
    this.timeout(60000)
    it(`${address} should have the following interfaces: ${addresses[address]}`, async function () {
      const { interfaces } = await parser.getContractMethodsAndERCInterfaces(address)
      expect(interfaces).to.include.members(addresses[address])
    })
  }
})
