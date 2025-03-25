import orchid from './bridge-orchid.json'
import wasabi from './bridge-wasabi.json'
import papyrus from './bridge-papyrus.json'
import iris from './bridge-iris.json'
import fingerroot from './bridge-fingerroot.json'
import hop from './bridge-hop.json'
import lovell from './bridge-lovell.json'

export const RELEASES = {
  mainnet: [
    { height: 0, abi: orchid },
    { height: 1591000, abi: wasabi },
    { height: 2392700, abi: papyrus },
    { height: 3614800, abi: iris },
    { height: 4598500, abi: hop },
    { height: 5468000, abi: fingerroot },
    { height: 7338024, abi: lovell }
  ],
  testnet: [
    { height: 0, abi: wasabi },
    { height: 863000, abi: papyrus },
    { height: 2060500, abi: iris },
    { height: 3103000, abi: hop },
    { height: 4015800, abi: fingerroot },
    { height: 6110487, abi: lovell }
  ]
}

function getMatchingBridgeAbi (blockNumber, abisWithHeight) {
  const lastIndex = abisWithHeight.length - 1

  if (blockNumber === 'latest') {
    return abisWithHeight[lastIndex].abi
  }

  if (blockNumber >= abisWithHeight[lastIndex].height) {
    return abisWithHeight[lastIndex].abi
  }

  for (let i = 1; i <= lastIndex; i++) {
    const previous = abisWithHeight[i - 1]
    if (blockNumber >= previous.height && blockNumber < abisWithHeight[i].height) {
      return previous.abi
    }
  }
}

/**
 * Get the bridge ABI for a given block number and network.
 * @param {number | string} blockNumber - The block number to get the ABI for. Default is 'latest'.
 * @param {string} network - The network to get the ABI for. Can be either "testnet" or "mainnet".
 * @returns {any[]} The ABI for the given block number and network.
 */
export function getBridgeAbiByBlockNumber (blockNumber = 'latest', network) {
  if (typeof blockNumber !== 'number' && blockNumber !== 'latest') {
    throw new Error('blockNumber must be a number or "latest"')
  }

  if (!['testnet', 'mainnet'].includes(network)) {
    throw new Error('network must be either "testnet" or "mainnet"')
  }

  return getMatchingBridgeAbi(blockNumber, RELEASES[network])
}
