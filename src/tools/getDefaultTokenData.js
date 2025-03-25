import ContractParser from '../lib/ContractParser'
import { nod3Connect } from '../lib/nod3Connect'

async function main () {
  const contractAddress = process.argv[2]
  const network = process.argv[3]
  let blockNumber = process.argv[4]

  let nod3Url = ''
  if (!contractAddress || !network || !blockNumber) {
    console.error('Usage: node getDefaultTokenData.js <contractAddress: address> <network: testnet|mainnet> <blockNumber: number|blockTag>')
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
  const contract = parser.makeContract(contractAddress)

  // In case its not latest, ensure it's a valid block number
  if (blockNumber !== 'latest') {
    blockNumber = parseInt(blockNumber)
    if (isNaN(blockNumber)) {
      console.error(`Invalid block number: ${blockNumber}. Must be a number or 'latest'.`)
      process.exit(1)
    }
  }

  const tokenData = await parser.getDefaultTokenData(contract, blockNumber)
  console.log(tokenData)
}

main()

/*

curl -X POST \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_call",
    "params": [
      {
        "to": "0x74C9F2B00581F1b11Aa7Ff05aa9f608B7389de67",
        "data": "0x06fdde03"
      },
      "0x6b0909"
    ]
  }' \
  http://localhost:4446

*/
