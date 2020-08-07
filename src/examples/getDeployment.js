import { BcSearch } from '../index'
import { nod3Connect } from '../lib/nod3Connect'
import { isAddress } from '@rsksmart/rsk-utils'

const url = process.env['URL'] || 'http://localhost:4444'
const address = process.argv[2]

if (!address) help()
if (!isAddress(address)) help(`Invalid address "${address}"`)

const nod3 = nod3Connect(url)
const search = BcSearch(nod3)

console.log(`Searching in node: ${url}`)

search.deploymentTx(address.toLowerCase())
  .then(res => console.log(res))
  .catch(err => {
    console.error(err)
    process.exit(9)
  })

function help (msg) {
  if (msg) console.log(`${msg}`)
  console.log('Usage:')
  console.log(`node ${process.argv[1]} [address]`)
  console.log()
  console.log(`Set environment variable URL to change node url`)
  console.log(`Example: export URL=http://localhost:4444`)
  process.exit(0)
}
