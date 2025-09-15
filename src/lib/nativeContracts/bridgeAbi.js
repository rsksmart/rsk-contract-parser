import orchid from './bridge-orchid.json'
import wasabi from './bridge-wasabi.json'
import papyrus from './bridge-papyrus.json'
import iris from './bridge-iris.json'
import fingerroot from './bridge-fingerroot.json'
import hop from './bridge-hop.json'
import lovell from './bridge-lovell.json'
import reed from './bridge-reed.json'

export const RSK_RELEASES = {
  mainnet: [
    {
      name: 'orchid',
      height: 0,
      abi: orchid
    },
    {
      name: 'wasabi',
      height: 1591000,
      abi: wasabi
    },
    {
      name: 'papyrus',
      height: 2392700,
      abi: papyrus
    },
    {
      name: 'iris',
      height: 3614800,
      abi: iris
    },
    {
      name: 'hop',
      height: 4598500,
      abi: hop
    },
    {
      name: 'fingerroot',
      height: 5468000,
      abi: fingerroot
    },
    {
      name: 'lovell',
      height: 7338024,
      abi: lovell
    },
    {
      name: 'reed',
      height: 8052200,
      abi: reed
    }
  ],
  testnet: [
    {
      name: 'wasabi',
      height: 0,
      abi: wasabi
    },
    {
      name: 'papyrus',
      height: 863000,
      abi: papyrus
    },
    {
      name: 'iris',
      height: 2060500,
      abi: iris
    },
    {
      name: 'hop',
      height: 3103000,
      abi: hop
    },
    {
      name: 'fingerroot',
      height: 4015800,
      abi: fingerroot
    },
    {
      name: 'lovell',
      height: 6110487,
      abi: lovell
    },
    {
      name: 'reed',
      height: 6835700,
      abi: reed
    }
  ]
}

/**
 * Get the RSK release for a given block number and network.
 * @param {number | string} blockNumber - The block number to get the release for. Default is 'latest'.
 * @param {string} network - The network to get the release for. Can be either "testnet" or "mainnet".
 * @returns {Object} The release for the given block number and network.
 * @example
 * const mainnetRelease = getRskReleaseByBlockNumber(6200000, 'mainnet')
 * console.log(mainnetRelease)
 *
 * // result
 * {
 *   name: 'fingerroot',
 *   height: 5468000,
 *   abi
 * }
 *
 *  const testnetRelease = getRskReleaseByBlockNumber(6200000, 'testnet')
 *  console.log(testnetRelease)
 *
 *  // result
 *  {
 *    name: 'lovell',
 *    height: 6110487,
 *    abi
 *  }
 */
export function getRskReleaseByBlockNumber (blockNumber = 'latest', network) {
  if (typeof blockNumber !== 'number' && blockNumber !== 'latest') {
    throw new Error('blockNumber must be a number or "latest"')
  }

  if (!['testnet', 'mainnet'].includes(network)) {
    throw new Error('network must be either "testnet" or "mainnet"')
  }

  const releases = RSK_RELEASES[network]
  const lastIndex = releases.length - 1

  if (blockNumber === 'latest' || blockNumber >= releases[lastIndex].height) {
    return releases[lastIndex]
  }

  for (let i = 1; i <= lastIndex; i++) {
    const previousRelease = releases[i - 1]
    if (blockNumber >= previousRelease.height && blockNumber < releases[i].height) {
      return previousRelease
    }
  }
}
