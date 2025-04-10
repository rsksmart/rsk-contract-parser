import Nod3 from '@rsksmart/nod3'

export const nod3Connect = (url) => {
  url = url || process.env.RSK_NODE_URL || 'http://localhost:4444'
  return new Nod3(
    new Nod3.providers.HttpProvider(url)
  )
}

// Default network URLs
export const publicRskNodeUrls = {
  mainnet: {
    url: 'https://public-node.rsk.co',
    id: '30'
  },
  testnet: {
    url: 'https://public-node.testnet.rsk.co',
    id: '31'
  }
}

export const createRskNodeProvider = (network, customUrl) => {
  if (!['mainnet', 'testnet'].includes(network)) {
    throw new Error("Network must be either 'mainnet' or 'testnet'")
  }

  // Use custom URL if provided, otherwise use default
  const url = customUrl || publicRskNodeUrls[network].url
  const provider = new Nod3.providers.HttpProvider(url)
  return new Nod3(provider)
}

export default nod3Connect()
