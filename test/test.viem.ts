import 'dotenv/config';
import { ClientHandler } from '../src/lib/client';
import { RollupHandler } from '../src/handlers/rollup';
import { Address, decodeEventLog, Hex } from 'viem';
import { SequencerInboxHandler } from '../src/handlers/sequencerInbox';
import {
  defineBatchPostingInfo,
  defineDaCertBatchPostingInfo,
  getBlockToSearchEventsFrom,
  getProgressPercentage,
  isDaCert,
  serializeDaCert,
} from '../src/lib/utils';

async function test() {
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

  const { batchCount } = await sequencerInboxHandler.callReadFunc(['batchCount']);
  console.log('batchCount: ' + batchCount);
  const delivered = [];

  let toBlock = await clientHandler.getBlockNumber('parent');
  while (delivered.length < Number(batchCount)) {
    const fromBlock = getBlockToSearchEventsFrom(toBlock);
    const result = await sequencerInboxHandler.getSequencerBatchDeliveredEvent(fromBlock, toBlock);
    delivered.push(...result);

    process.stdout.write(
      `\rProgress... ${getProgressPercentage(Number(batchCount), delivered.length).toFixed(2)}% | ${
        delivered.length
      }/${batchCount}`,
    );

    toBlock = fromBlock;
  }
  console.log(delivered[delivered.length]);


  return
  console.log();

  let daCount = 0;
  let rollupCount = 0;

  delivered.sort(
    (a, b) =>
      Number((a as any).args.batchSequenceNumber) - Number((b as any).args.batchSequenceNumber),
  );

  
  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const chunks = chunkArray(delivered, 100);
  const arr_tx = [];


  for (const chunk of chunks) {
    const txWithBlock = await Promise.all(
      chunk.map(async (e) => {
        const [tx, block] = await Promise.all([
          clientHandler.getTransaction('parent', e.transactionHash!),
          clientHandler.getBlockByHash('parent', e.blockHash!),
        ]);

        return { transactionHash:tx.hash,...tx, ...block };
      }),
    );

    arr_tx.push(...txWithBlock);
  }



  
  const jsons = [];
  for (let i = 1; i < arr_tx.length; i++) {
    const tx = arr_tx[i];
    if (!tx) {
      console.log('NO INPUT');

      continue;
    }
    const calldata = SequencerInboxHandler.decodeBatchPostingCalldata(tx.input);

    if (isDaCert(calldata.data)) {
      const cert = serializeDaCert(calldata.data);
      const json = defineDaCertBatchPostingInfo(
        tx.transactionHash,
        tx.blockNumber,
        tx.timestamp,
        tx.from,
        (delivered[i] as any).args,
        cert,
      );
      jsons.push(json);
      daCount++;
    } else {
      const json = defineBatchPostingInfo(
        tx.transactionHash,
        tx.blockNumber,
        tx.timestamp,
        tx.from,
        (delivered[i] as any).args,
      );
      jsons.push(json);

      rollupCount++;
    }
  }

//     console.log(
//     JSON.stringify(jsons, (_, value) =>
//       typeof value === 'bigint' ? Number(value) : value,
//       2
//     )
//   );
  console.log(`DA Count: ${daCount}`);
  console.log(`Rollup Count: ${rollupCount}`);
  console.timeEnd('Execution Time');
}

void test();
