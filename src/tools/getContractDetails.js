import { ContractParser } from '../lib/ContractParser'
import { createRskNodeProvider } from '../lib/nod3Connect'
async function main () {
  const contractAddress = process.argv[2]
  const block = process.argv[3]
  const network = process.argv[4]

  if (!contractAddress || !block || !network) {
    usage()
  }

  if (!['mainnet', 'testnet'].includes(network)) {
    usage()
  }

  const nod3 = createRskNodeProvider(network)

  const txBlockNumber = isNaN(parseInt(block)) ? block : parseInt(block)
  const contractParser = new ContractParser({ nod3, txBlockNumber })

  const contractDetails = await contractParser.getContractDetails(contractAddress, txBlockNumber)
  console.log(contractDetails)
}

function usage () {
  console.info('Usage: getContractDetails.js <contractAddress> <block (number|"latest")> <network (mainnet|testnet)>')
  console.info('Example (USDCe at block 7363973 on mainnet):')
  console.info('node dist/tools/getContractDetails.js 0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67 7363973 mainnet')
  process.exit(1)
}

main()
