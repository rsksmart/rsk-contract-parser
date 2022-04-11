import { assert } from 'chai'
import { ContractParser } from '../src/lib/ContractParser'
import nod3 from '../src/lib/nod3Connect'

const contracts = [
  '0xebea27d994371cd0cb9896ae4c926bc5221f6317']

const proxyContract = "0xc7bC8A9523e04CD82cb19f5D95E38d0258EEf810";
const masterProxyContract = "0x2a37eedf9724f1c748b5cf88594bd1d29612b7f9";

const parser = new ContractParser({ nod3 })

describe('# Network', function () {
  it('should be connected to RSK testnet', async function () {
    let net = await nod3.net.version()
    console.log(net)
    assert.equal(net.id, '31')
  })
})

describe('Contract parser', function () {

  for (let address of contracts) {
    it('should return the token data', async () => {
      let contract = parser.makeContract(address)
      const info = await parser.getTokenData(contract)
      console.log({ info })
    })
  }

  it('should return the master of proxy contract',async ()=>{
    const code = await nod3.eth.getCode(proxyContract)
    //let info = await parser.getContractInfo(code, contract)
    const masterCopy = parser.getMasterCopy(code);
    assert.equal(masterCopy,masterProxyContract);
    //assert.includeMembers(interfaces, addresses[address])
  });
})
