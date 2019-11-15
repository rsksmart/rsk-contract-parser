import Nod3 from 'nod3'

export const nod3Connect = (url) => {
  url = url || 'http://localhost:4444'
  return new Nod3(
    new Nod3.providers.HttpProvider(url)
  )
}

export default nod3Connect()
