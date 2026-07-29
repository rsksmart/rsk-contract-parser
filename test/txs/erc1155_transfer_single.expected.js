// IOVers NFTs (ERC-1155) mint on RSK mainnet, block 4942181: URI + TransferSingle.
// uint256 args decode to decimal strings (token ids and amounts feed balance
// reconstruction downstream).
import { result as tx } from './erc1155_transfer_single.json'

export default {
  tx,
  netId: 30,
  expect: {
    events: [
      {
        event: 'URI',
        address: '0x11b64191106b1cf66fcd2f8389077c596cdc5646',
        args: {
          value: 'https://iov-nft.infura-ipfs.io/ipfs/QmV67ggU23WfJWdzuGVs7qSrT1RFrvDWZeqirDS14HdpbJ',
          id: '57896044618658097711785492504343953926634992332820282019728792003956564820159'
        }
      },
      {
        event: 'TransferSingle',
        address: '0x11b64191106b1cf66fcd2f8389077c596cdc5646',
        args: {
          operator: '0xc0c9d82b59c4d9d77d749f331735e7ed01e2d0e1',
          from: '0x0000000000000000000000000000000000000000',
          to: '0xc0c9d82b59c4d9d77d749f331735e7ed01e2d0e1',
          id: '57896044618658097711785492504343953926634992332820282019728792003956564820159',
          value: '1'
        },
        _addresses: [
          '0xc0c9d82b59c4d9d77d749f331735e7ed01e2d0e1',
          '0x0000000000000000000000000000000000000000'
        ]
      }
    ]
  }
}
