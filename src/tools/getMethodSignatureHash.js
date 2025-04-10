import { add0x } from '@rsksmart/rsk-utils/dist/strings'
import { soliditySignature, soliditySelector } from '../lib/utils'

function main () {
  if (typeof process.argv[2] !== 'string') {
    console.error('Usage: getMethodSignatureHash.js <"methodSignature">')
    console.error('Example: getMethodSignatureHash.js "transfer(address,uint256)"')
    process.exit(1)
  }

  const methodSignatureHash = soliditySignature(process.argv[2])

  console.log({
    methodSignatureHash: add0x(methodSignatureHash),
    selector: add0x(soliditySelector(methodSignatureHash))
  })
}

main()
