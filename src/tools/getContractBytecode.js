import { nod3Connect } from '../lib/nod3Connect'
import { ContractParser } from '../lib/ContractParser'

async function main() {
  const contractAddress = process.argv[2]
  const network = process.argv[3]
  let nod3Url = ''
  if (!contractAddress || !network) {
    console.error('Usage: node getContractBytecode.js <contractAddress> <network: testnet|mainnet>')
    process.exit(1)
  }

  if (network !== 'testnet' && network !== 'mainnet') {
    console.error(`Invalid network: ${network}. Must be 'testnet' or 'mainnet'.`)
    process.exit(1)
  }

  if (network === 'testnet') {
    nod3Url = 'https://public-node.testnet.rsk.co'
  } else {
    nod3Url = 'https://public-node.rsk.co'
  }

  const nod3 = nod3Connect(nod3Url)
  const parser = new ContractParser({ nod3 })
  const contractBytecode = await parser.getContractCodeFromNode(contractAddress)

  console.log(contractBytecode)
}

main()
