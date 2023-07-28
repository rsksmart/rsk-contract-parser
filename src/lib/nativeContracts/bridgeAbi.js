import orchid from './bridge-orchid.json'
import wasabi from './bridge-wasabi.json'
import papyrus from './bridge-papyrus.json'
import iris from './bridge-iris.json'
import fingerroot from './bridge-fingerroot.json'
import hop from './bridge-hop.json'

const RELEASES = {
  mainnet: {
    0: orchid,
    1591000: wasabi,
    2392700: papyrus,
    3614800: iris,
    4598500: hop,
    5468000: fingerroot
  },
  testnet: {
    0: wasabi,
    863000: papyrus,
    2060500: iris,
    3103000: hop,
    4015800: fingerroot
  }
}

export function getBridgeAbi ({ txBlockNumber, bitcoinNetwork }) {
  function findMatchingActivationHeight (txHeight, heights) {
    // Finds the highest release activation height that is lower than/equal to the tx's block number, in
    // order to find the ABI that corresponds to the bridge version used at the moment of the transaction.

    let matchingActivationHeight = -1
    for (let i = 0; i < heights.length; i++) {
      const currentHeight = heights[i]

      if (txHeight >= currentHeight && matchingActivationHeight < currentHeight) {
        matchingActivationHeight = currentHeight
      }
    }

    return matchingActivationHeight
  }
  if (isNaN(txBlockNumber) || txBlockNumber < 0) {
    throw new Error('Invalid tx block number')
  } else if (!['testnet', 'mainnet'].includes(bitcoinNetwork)) {
    throw new Error('Invalid bitcoin network')
  }

  const activationHeights = Object.keys(RELEASES[bitcoinNetwork])

  const matchingActivationHeight = findMatchingActivationHeight(txBlockNumber, activationHeights)

  return RELEASES[bitcoinNetwork][matchingActivationHeight]
}
