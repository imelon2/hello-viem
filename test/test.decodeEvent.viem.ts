import { Address, decodeAbiParameters, decodeFunctionData, parseAbiParameters } from 'viem';
import { RollupHandler } from '../src/handlers/rollup';
import { ClientHandler } from '../src/lib/client';
import { SequencerInboxHandler } from '../src/handlers/sequencerInbox';
import 'dotenv/config';
import { serializeDaCert } from '../src/lib/utils';

async function main() {
  console.time('Execution Time');

  if (!process.env.PARENT_CHAIN_ID || !process.env.PARENT_CHAIN_RPC) {
    throw new Error(
      `The following environmental variables are required: PARENT_CHAIN_ID, PARENT_CHAIN_RPC`,
    );
  }
  if (!process.env.ORBIT_CHAIN_ID || !process.env.ORBIT_CHAIN_RPC) {
    throw new Error(
      `The following environmental variables are required: ORBIT_CHAIN_ID, ORBIT_CHAIN_RPC`,
    );
  }
  if (!process.env.ROLLUP_ADDRESS) {
    throw new Error(`The following environmental variables are required: ROLLUP_ADDRESS`);
  }

  // Get the orbit handler
  const clientHandler = new ClientHandler(
    Number(process.env.PARENT_CHAIN_ID),
    Number(process.env.ORBIT_CHAIN_ID),
    String(process.env.PARENT_CHAIN_RPC),
    String(process.env.ORBIT_CHAIN_RPC),
  );

  const rollupHandler = new RollupHandler(clientHandler, process.env.ROLLUP_ADDRESS as Address);

  const { sequencerInbox } = await rollupHandler.getSystemContract(['sequencerInbox']);

  const sequencerInboxHandler = new SequencerInboxHandler(clientHandler, sequencerInbox as Address);

//   const a = await sequencerInboxHandler.parseEventLogs("0x20ba25f78c918e1662dddef7b04e8b8f0c4695c9e8ba0f529da1bcdc901a1a41")
//   const a = await sequencerInboxHandler.decodeFunctionData("0x9ecb2f83d6f0369bbdd699bd3fb961bd7ada9e302a299db85ac7654e85e327bb")
//   console.log(a);


// const abi = {
//     "abi": [
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "_gelato",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "sponsor",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "target",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "feeToken",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "oneBalanceChainId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "nativeToFeeTokenXRateNumerator",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "nativeToFeeTokenXRateDenominator",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "bytes32",
//           "name": "correlationId",
//           "type": "bytes32"
//         }
//       ],
//       "name": "LogUseGelato1Balance",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "DOMAIN_SEPARATOR",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "SPONSORED_CALL_ERC2771_TYPEHASH",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "gelato",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "chainId",
//               "type": "uint256"
//             },
//             {
//               "internalType": "address",
//               "name": "target",
//               "type": "address"
//             },
//             {
//               "internalType": "bytes",
//               "name": "data",
//               "type": "bytes"
//             },
//             {
//               "internalType": "address",
//               "name": "user",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "userNonce",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "userDeadline",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct CallWithERC2771",
//           "name": "_call",
//           "type": "tuple"
//         },
//         {
//           "internalType": "address",
//           "name": "_sponsor",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "_feeToken",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_oneBalanceChainId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes",
//           "name": "_userSignature",
//           "type": "bytes"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_nativeToFeeTokenXRateNumerator",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_nativeToFeeTokenXRateDenominator",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "_correlationId",
//           "type": "bytes32"
//         }
//       ],
//       "name": "sponsoredCallERC2771",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "userNonce",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "version",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ]
// }
  
const abi = {
    "abi":[
        {
          "inputs": [],
          "name": "AttestFailed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidBatchNumber",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoRewardsToClaim",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NodeRewardsNotSet",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyOracle",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "_l2StateRoot",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            }
          ],
          "name": "LogAttest",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "_finalL2StateRoot",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_nrOfSuccessfulAttestations",
              "type": "uint256"
            }
          ],
          "name": "LogFinalized",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_attestPeriod",
              "type": "uint256"
            }
          ],
          "name": "LogSetAttestPeriod",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_nodeKey",
              "type": "address"
            }
          ],
          "name": "LogSetNodeKey",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_nodeRewards",
              "type": "address"
            }
          ],
          "name": "LogSetNodeRewards",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_oracle",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "_isOracle",
              "type": "bool"
            }
          ],
          "name": "LogSetOracle",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "ATTEST_PERIOD",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "_attestPeriod",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "_l2StateRoot",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            }
          ],
          "name": "attest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "_l2StateRoot",
              "type": "bytes32"
            },
            {
              "internalType": "uint256[]",
              "name": "_nodeKeyIds",
              "type": "uint256[]"
            }
          ],
          "name": "batchAttest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_nodeKeyIds",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256",
              "name": "_batchesCount",
              "type": "uint256"
            }
          ],
          "name": "batchClaimReward",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_batchesCount",
              "type": "uint256"
            }
          ],
          "name": "claimReward",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_l1NodeConfirmedTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "_finalL2StateRoot",
              "type": "bytes32"
            }
          ],
          "name": "finalize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            }
          ],
          "name": "getAttestation",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            }
          ],
          "name": "getAttestedBatchNumbers",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            }
          ],
          "name": "getBatchInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "prevBatchNumber",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "l1NodeConfirmedTimestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "nrOfSuccessfulAttestations",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes32",
                  "name": "finalL2StateRoot",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct IReferee.BatchInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_nodeKeyId",
              "type": "uint256"
            }
          ],
          "name": "getIndexOfUnclaimedBatch",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_batchNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "_nodeKeyIds",
              "type": "uint256[]"
            }
          ],
          "name": "getUnattestedNodeKeyIds",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nodeKey",
          "outputs": [
            {
              "internalType": "contract INodeKey",
              "name": "_nodeKey",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "nodeRewards",
          "outputs": [
            {
              "internalType": "contract INodeRewards",
              "name": "_nodeRewards",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
}

const re = decodeFunctionData({
    abi: abi.abi,
    data:"0x86bb8f3700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000032"
})

console.log(re);

//   const ss = serializeDaCert("0x880785f8f647e985ef4de833db174cc2519a2edd79081f868eb8ae161daf416cd85866bcff18d254cff3dad0ec9fe9e262064ae1d4c3bcf1f770fe9773dc5acea90000000067f5df950100000000000000350b235e3da0c318f3a8ceee695e25e3961f1bf3088e6149a1ac1a04fecf5aa5ddc3ca050eb9ffcc3842323c0f73fb5be6012a2d0494e7dda9a63d0a1470f510e6e97ee2cd883322be4270768d27cb839171767209463d921687dc2a012b2b3bfa")
//   console.log(ss);
  

// const t = await clientHandler.getTransactionReceipt("parent","0xf039ea4cd1f9c200803a871dc2b3d2a92f39444949aadc39590207ca9012841c")

// console.log(t);

  
  
}

void main();
