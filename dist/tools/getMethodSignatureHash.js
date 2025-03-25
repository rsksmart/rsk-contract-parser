"use strict";var _strings = require("@rsksmart/rsk-utils/dist/strings");
var _utils = require("../lib/utils");

function main() {
  if (typeof process.argv[2] !== 'string') {
    console.error('Usage: getMethodSignatureHash.js <"methodSignature">');
    console.error('Example: getMethodSignatureHash.js "transfer(address,uint256)"');
    process.exit(1);
  }

  const methodSignatureHash = (0, _utils.soliditySignature)(process.argv[2]);

  console.log({
    methodSignatureHash: (0, _strings.add0x)(methodSignatureHash),
    selector: (0, _strings.add0x)((0, _utils.soliditySelector)(methodSignatureHash))
  });
}

main();
//# sourceMappingURL=getMethodSignatureHash.js.map