import { expect } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import { contractsInterfaces, PROXY_TYPES } from '../src/lib/types'

describe('# Contract parser detection against a mocked node', function () {
  describe('isERC1167Proxy()', function () {
    const implementation = '0x1234567890123456789012345678901234567890'

    it('should return ERC1167 proxy details for the 44-byte minimal proxy variant', async () => {
      const mockNod3 = {
        eth: {
          getContractCodeAt: function () { return Promise.resolve(`0x3d3d3d3d363d3d37363d73${implementation.slice(2)}5af43d3d93803e602a57fd5bf3`) }
        }
      }

      const parser = new ContractParser({ nod3: mockNod3 })
      const proxyDetails = await parser.isERC1167Proxy('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(proxyDetails.isProxy).to.equal(true)
      expect(proxyDetails.proxyType).to.equal(PROXY_TYPES.ERC1167)
      expect(proxyDetails.implementationAddress).to.equal(implementation)
    })
  })

  describe('isKeyImplementationSlotProxy()', function () {
    this.timeout(60000)

    const keyImplementationSlot = '0x950d7e977b74051843ed988c77d53a700cd967d2ac5480d98dd4c1edaf0b4dc8'
    const implementation = '0x1234567890123456789012345678901234567890'
    const erc20Code = `0x${['06fdde03', '95d89b41', '313ce567', '18160ddd', '70a08231', 'dd62ed3e', 'a9059cbb', '095ea7b3', '23b872dd'].map(selector => `63${selector}`).join('')}`
    const erc721Code = `0x${['01ffc9a7', '70a08231', '6352211e', '095ea7b3', '081812fc', 'a22cb465', 'e985e9c5', '23b872dd', '42842e0e', 'b88d4fde'].map(selector => `63${selector}`).join('')}`
    const slotNod3 = (slots, { proxyCode = '0x6080604052', implementationCode = erc20Code, supported = [], rejectedSlot } = {}) => ({
      eth: {
        requestedSlots: [],
        getStorageAt (address, slot) {
          this.requestedSlots.push(slot)
          if (slot === rejectedSlot) return Promise.reject(new Error('ECONNRESET'))
          return Promise.resolve(slots[slot] ?? `0x${'0'.repeat(64)}`)
        },
        getContractCodeAt (address) { return Promise.resolve(address === implementation ? implementationCode : proxyCode) },
        call (tx) { return Promise.resolve(`0x${'0'.repeat(63)}${supported.includes(tx.data.slice(10, 18)) ? 1 : 0}`) }
      }
    })

    it('should read the keccak256("key.implementation") slot and return its implementation', async () => {
      const nod3 = slotNod3({ [keyImplementationSlot]: `0x${'0'.repeat(24)}${implementation.slice(2)}` })
      const parser = new ContractParser({ nod3 })
      const proxyDetails = await parser.isKeyImplementationSlotProxy('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(nod3.eth.requestedSlots).to.deep.equal([keyImplementationSlot])
      expect(proxyDetails.isProxy).to.equal(true)
      expect(proxyDetails.proxyType).to.equal(PROXY_TYPES.KeyImplementationSlot)
      expect(proxyDetails.implementationAddress).to.equal(implementation)
    })

    it('getContractDetails() should report a key.implementation proxy that no other proxy check matches', async () => {
      const nod3 = slotNod3({ [keyImplementationSlot]: `0x${'0'.repeat(24)}${implementation.slice(2)}` })
      const parser = new ContractParser({ nod3 })
      const contractDetails = await parser.getContractDetails('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(contractDetails.isProxy).to.equal(true)
      expect(contractDetails.proxyType).to.equal(PROXY_TYPES.KeyImplementationSlot)
      expect(contractDetails.implementationAddress).to.equal(implementation)
      expect(contractDetails.interfaces).to.include(contractsInterfaces.ERC20)
      expect(contractDetails.methods).to.include('transfer(address,uint256)')
    })

    it('getContractDetails() should resolve a selector-less proxy whose implementation answers ERC-165 through it', async () => {
      const nod3 = slotNod3({ [keyImplementationSlot]: `0x${'0'.repeat(24)}${implementation.slice(2)}` }, { implementationCode: erc721Code, supported: ['01ffc9a7', '80ac58cd'] })
      const contractDetails = await new ContractParser({ nod3 }).getContractDetails('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(contractDetails.isProxy).to.equal(true)
      expect(contractDetails.proxyType).to.equal(PROXY_TYPES.KeyImplementationSlot)
      expect(contractDetails.implementationAddress).to.equal(implementation)
      expect(contractDetails.interfaces).to.include.members([contractsInterfaces.ERC165, contractsInterfaces.ERC721])
      expect(contractDetails.methods).to.include('ownerOf(uint256)')
    })

    it('getContractDetails() should not read the slot of a contract its own bytecode already classifies', async () => {
      const nod3 = slotNod3({ [keyImplementationSlot]: `0x${'0'.repeat(24)}${implementation.slice(2)}` }, { proxyCode: erc20Code })
      const contractDetails = await new ContractParser({ nod3 }).getContractDetails('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(nod3.eth.requestedSlots).to.not.include(keyImplementationSlot)
      expect(contractDetails.isProxy).to.equal(false)
      expect(contractDetails.interfaces).to.include(contractsInterfaces.ERC20)
    })

    it('getContractDetails() should read the slot of code whose selectors match no interface', async () => {
      const nod3 = slotNod3({ [keyImplementationSlot]: `0x${'0'.repeat(24)}${implementation.slice(2)}` }, { proxyCode: '0x63a9059cbb' })
      const contractDetails = await new ContractParser({ nod3 }).getContractDetails('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(contractDetails.isProxy).to.equal(true)
      expect(contractDetails.implementationAddress).to.equal(implementation)
      expect(contractDetails.interfaces).to.include(contractsInterfaces.ERC20)
    })

    it('getContractDetails() should reject when the slot read of an unclassified contract fails', async () => {
      const nod3 = slotNod3({}, { rejectedSlot: keyImplementationSlot })
      const outcome = await new ContractParser({ nod3, log: { error () {}, warn () {} } })
        .getContractDetails('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
        .then(() => 'resolved', error => error.message)

      expect(outcome).to.equal('ECONNRESET')
    })

    it('should return empty proxy details when the slot is zero', async () => {
      const parser = new ContractParser({ nod3: slotNod3({}) })
      const proxyDetails = await parser.isKeyImplementationSlotProxy('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

      expect(proxyDetails.isProxy).to.equal(false)
      expect(proxyDetails.implementationAddress).to.equal(null)
    })
  })

  describe('ERC-165 probe', function () {
    const probeNod3 = (code, supported = ['01ffc9a7', '80ac58cd']) => ({
      eth: {
        calls: [],
        getContractCodeAt () { return Promise.resolve(code) },
        getStorageAt () { return Promise.resolve(`0x${'0'.repeat(64)}`) },
        call (tx) {
          this.calls.push(tx.data)
          const interfaceId = tx.data.slice(10, 18)
          return Promise.resolve(`0x${'0'.repeat(63)}${supported.includes(interfaceId) ? 1 : 0}`)
        }
      }
    })
    const address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'

    it('confirms ERC721 through supportsInterface on code with no known selector', async () => {
      const nod3 = probeNod3('0x6080604052')
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(interfaces).to.include(contractsInterfaces.ERC721)
      expect(interfaces).to.not.include(contractsInterfaces.ERC1155)
      expect(nod3.eth.calls.map(data => data.slice(10, 18))).to.deep.equal(['01ffc9a7', 'ffffffff', '80ac58cd', 'd9b67a26', '0e89341c'])
    })

    it('makes no call for code whose selectors do not include supportsInterface', async () => {
      const nod3 = probeNod3('0x63a9059cbb')
      await new ContractParser({ nod3 }).getContractDetails(address)

      expect(nod3.eth.calls).to.deep.equal([])
    })

    it('ignores a contract that answers true to every interface id, 0xffffffff included', async () => {
      const nod3 = probeNod3('0x6080604052', ['01ffc9a7', 'ffffffff', '80ac58cd', 'd9b67a26', '0e89341c'])
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(interfaces).to.deep.equal([])
    })

    it('asks for ERC721 when the scan found supportsInterface and an ERC-721 extension but not ERC721', async () => {
      const nod3 = probeNod3('0x6301ffc9a76306fdde036395d89b4163c87b56dd')
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(interfaces).to.include.members(['ERC721Metadata', contractsInterfaces.ERC721])
    })

    it('asks for ERC721 when the scan found supportsInterface and only the enumerable extension', async () => {
      const nod3 = probeNod3('0x6301ffc9a76318160ddd632f745c59634f6ccce7')
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(interfaces).to.include.members(['ERC721Enumerable', contractsInterfaces.ERC721])
    })

    it('does not ask for ERC721 when the scan found supportsInterface and no ERC-721 extension', async () => {
      const nod3 = probeNod3('0x6301ffc9a7')
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(nod3.eth.calls.map(data => data.slice(10, 18))).to.not.include('80ac58cd')
      expect(interfaces).to.not.include(contractsInterfaces.ERC721)
    })

    it('ignores an always-true contract when the node fails on the 0xffffffff call', async () => {
      const nod3 = probeNod3('0x6080604052', ['01ffc9a7', '80ac58cd', 'd9b67a26', '0e89341c'])
      const answer = nod3.eth.call.bind(nod3.eth)
      nod3.eth.call = tx => tx.data.slice(10, 18) === 'ffffffff' ? Promise.reject(new Error('ECONNRESET')) : answer(tx)
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(address)

      expect(interfaces).to.deep.equal([])
    })
  })

  describe('ERC-165 probe through a proxy', function () {
    const proxy = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    const implementation = '0x1234567890123456789012345678901234567890'
    const metadataOnlyCode = '0x6301ffc9a76306fdde036395d89b4163c87b56dd'
    const zeroSlot = `0x${'0'.repeat(64)}`
    const addressSlot = `0x${'0'.repeat(24)}${implementation.slice(2)}`
    const proxyNod3 = ({ proxyCode, implementationCode = metadataOnlyCode, slots = {}, proxySupports = [], implementationSupports = [] }) => ({
      eth: {
        callTargets: [],
        getContractCodeAt (address) { return Promise.resolve(address === implementation ? implementationCode : proxyCode) },
        getStorageAt (address, slot) { return Promise.resolve(address === proxy ? slots[slot] ?? zeroSlot : zeroSlot) },
        call (tx) {
          this.callTargets.push(tx.to)
          const supported = tx.to === proxy ? proxySupports : implementationSupports
          return Promise.resolve(`0x${'0'.repeat(63)}${supported.includes(tx.data.slice(10, 18)) ? 1 : 0}`)
        }
      }
    })
    const clone44 = `0x3d3d3d3d363d3d37363d73${implementation.slice(2)}5af43d3d93803e602a57fd5bf3`
    const clone45 = `0x363d3d373d3d3d363d73${implementation.slice(2)}5af43d82803e903d91602b57fd5bf3`

    it('confirms ERC721 when the clone answers true and its implementation answers false', async () => {
      const nod3 = proxyNod3({ proxyCode: clone44, proxySupports: ['01ffc9a7', '80ac58cd'], implementationSupports: ['01ffc9a7'] })
      const contractDetails = await new ContractParser({ nod3 }).getContractDetails(proxy)

      expect(contractDetails.implementationAddress).to.equal(implementation)
      expect(contractDetails.interfaces).to.include.members([contractsInterfaces.ERC1167, 'ERC721Metadata', contractsInterfaces.ERC721])
      expect(nod3.eth.callTargets).to.not.include(implementation)
    })

    it('does not confirm ERC721 when only the implementation answers true', async () => {
      const nod3 = proxyNod3({ proxyCode: clone44, proxySupports: ['01ffc9a7'], implementationSupports: ['01ffc9a7', '80ac58cd'] })
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(proxy)

      expect(interfaces).to.not.include(contractsInterfaces.ERC721)
    })

    it('confirms ERC1155 when the clone answers true and its implementation answers false', async () => {
      const nod3 = proxyNod3({ proxyCode: clone45, implementationCode: '0x6301ffc9a7', proxySupports: ['01ffc9a7', 'd9b67a26'], implementationSupports: ['01ffc9a7'] })
      const { interfaces } = await new ContractParser({ nod3 }).getContractDetails(proxy)

      expect(interfaces).to.include.members([contractsInterfaces.ERC1167, contractsInterfaces.ERC1155])
      expect(nod3.eth.callTargets).to.not.include(implementation)
    })

    const slotProxies = [
      { name: 'an ERC-1822', slot: '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7', proxyType: PROXY_TYPES.ERC1822 },
      { name: 'an ERC-1967', slot: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc', proxyType: PROXY_TYPES.ERC1967.Normal },
      { name: 'an OZ unstructured storage', slot: '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3', proxyType: PROXY_TYPES.OZUnstructuredStorage },
      { name: 'a key.implementation', slot: '0x950d7e977b74051843ed988c77d53a700cd967d2ac5480d98dd4c1edaf0b4dc8', proxyType: PROXY_TYPES.KeyImplementationSlot }
    ]

    for (const { name, slot, proxyType } of slotProxies) {
      it(`asks ${name} proxy, not its implementation`, async () => {
        const nod3 = proxyNod3({ proxyCode: '0x6080604052', slots: { [slot]: addressSlot }, proxySupports: ['01ffc9a7', '80ac58cd'], implementationSupports: ['01ffc9a7'] })
        const contractDetails = await new ContractParser({ nod3 }).getContractDetails(proxy)

        expect(contractDetails.proxyType).to.equal(proxyType)
        expect(contractDetails.interfaces).to.include(contractsInterfaces.ERC721)
        expect(nod3.eth.callTargets).to.not.include(implementation)
      })
    }
  })
})
