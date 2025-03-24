import { Address } from 'viem';
import { RollupHandler } from '../src/handlers/rollup';
import { ClientHandler } from '../src/lib/client';

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

  const rollupInitializedEvents = await rollupHandler.searchRollupInitializedEvent();

  if (!rollupInitializedEvents || rollupInitializedEvents.length <= 0) {
    throw new Error(`No RollupInitialized event found for rollup address ${rollupHandler.rollupAddress}`);
  }

  console.log(rollupInitializedEvents);
  
}

void main();
