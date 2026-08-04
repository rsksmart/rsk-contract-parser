// ERC-1155 20-id batch mint on RSK mainnet, block 6158530 (contract 0xf63a3a88…):
// TransferBatch + 20 URI events. uint256 ids/values decode to decimal strings
// and uint256[] args keep array arity.
import { result as tx } from './erc1155_transfer_batch.json'

export default {
  tx,
  netId: 30,
  expect: {
    events: [
      {
        event: 'TransferBatch',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          operator: '0xc26d220178ce7a50533d89bc9964e7d2aea386ed',
          from: '0x0000000000000000000000000000000000000000',
          to: '0xc26d220178ce7a50533d89bc9964e7d2aea386ed',
          ids: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20'
          ],
          values: [
            '208',
            '2439',
            '127',
            '11',
            '9',
            '16',
            '23',
            '7',
            '11',
            '4',
            '14',
            '8',
            '13',
            '10',
            '18',
            '130',
            '13',
            '6',
            '9',
            '1'
          ]
        },
        _addresses: [
          '0xc26d220178ce7a50533d89bc9964e7d2aea386ed',
          '0x0000000000000000000000000000000000000000'
        ]
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmUgBNR2s1iUaTxNmZwRx8Q49XeCTraQM8YzjBf9cfxwvm',
          id: '1'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmQKF4wwcVtoSBygPLs5gJDXWFY3MxDFPLfyTizyrqzNxf',
          id: '2'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmajLi41FYH5D6Mq2TDYAy46sGvFHjbjRSKCkh1Wku6YNZ',
          id: '3'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmXqKcq5oUYnawE5Tpm1fPyM1TNc2ZT67mQ54iXcRTpPnL',
          id: '4'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmXu3mAY3tLUii3RmfQVA2xcEUcdY6A85FRhLPHPDH3MxU',
          id: '5'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmapaABnstF1Jx9aihHecPLmUXqQszyqjtowauRdgVHHc4',
          id: '6'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmTAGdKpeE4qVbVEE3ADcER3rKmpxcEbMV3LZceuRUS7od',
          id: '7'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmP5LUUAzxRdUFGReRRUc5c67drBj29ZUvoW8btZN5mhri',
          id: '8'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmQok8M9gDTA34AJ5VBatirMzJ1xkzNwZuDM2JuExpXAQP',
          id: '9'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/Qmawh9U69WjS37gfCVmohNd2boRPkiAmE66RxaTtEQc6nZ',
          id: '10'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmWtzq7Kg9MtnTV8Rq5VXEZF9sfDRes2ytoY1JPhHYNaEq',
          id: '11'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmR2gJvZMhhgXeiU9ffrN9ZrTLujpu4p1McxioUTtegrpm',
          id: '12'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmZbj7EsTgK4AQTjSBeWBvGQchs7zyDRYubNNMo7R3uTC8',
          id: '13'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmWaEp4KyGHYTDi6RbrVvKzakmLU7TuZpLreDz3NdudtKt',
          id: '14'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmYrJPZo1bn7NojduHnudmJUxGpqGuhvihFBDMCSRnQL4y',
          id: '15'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmU3PyuoSzZtdD2KxigCTBHvD8Fng1uK4Tkf6D6FGGLMx1',
          id: '16'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmePHbt17SZ8pPMDqJQ3L54edt3mxh8SqnAkwvX3uLbf7b',
          id: '17'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmRVtvBpHrYNAZNNY7UvVvLjXxVH2gS3ELdG4U48YHsLkq',
          id: '18'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmfVknnxrfnqCN9mWbqqw7FYk9nvi1eo6KKD6KzT8NRDcC',
          id: '19'
        }
      },
      {
        event: 'URI',
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a',
        args: {
          value: 'https://ipfs.filebase.io/ipfs/QmNxfvJ5dopxAZb8vK8xwJX9yA2XU8JwpduKe8NCAVMwpu',
          id: '20'
        }
      },
      {
        event: null,
        address: '0xf63a3a885f4d59f16d0efe8c02301cc323fdd91a'
      }
    ]
  }
}
