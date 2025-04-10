import { nod3Connect } from '../lib/nod3Connect'

async function main () {
  const contractAddress = process.argv[2]
  let blockNumber = process.argv[3]
  const network = process.argv[4]
  let nod3Url = ''
  if (!contractAddress || !network || !blockNumber) {
    console.error('Usage: node getContractBytecode.js <contractAddress: address> <blockNumber: number|blockTag> <network: testnet|mainnet>')
    console.log('')
    console.info('Example with USDCe - mainnet - Block 7014665:')
    console.info('node dist/tools/getContractBytecode.js 0x74c9f2b00581f1b11aa7ff05aa9f608b7389de67 7014665 mainnet')
    console.log('')
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

  // In case its not latest, ensure it's a valid block number
  if (blockNumber !== 'latest') {
    blockNumber = parseInt(blockNumber)
    if (isNaN(blockNumber)) {
      console.error(`Invalid block number: ${blockNumber}. Must be a number or 'latest'.`)
      process.exit(1)
    }

    // nod3.eth.getContractCodeAt does not convert to hex automatically yet.
    blockNumber = `0x${blockNumber.toString(16)}`
  }

  const bytecode = await nod3.eth.getContractCodeAt(contractAddress, blockNumber)

  console.log(bytecode)
}

main()
