import { Address } from 'viem';
import { RollupHandler } from '../src/handlers/rollup';
import { ClientHandler } from '../src/lib/client';
import { SequencerInboxHandler } from '../src/handlers/sequencerInbox';
import 'dotenv/config';

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

//   const rollupHandler = new RollupHandler(clientHandler, process.env.ROLLUP_ADDRESS as Address);

//   const { sequencerInbox } = await rollupHandler.getSystemContract(['sequencerInbox']);

//   const sequencerInboxHandler = new SequencerInboxHandler(clientHandler, sequencerInbox as Address);

//   const a = await sequencerInboxHandler.decodeEventFunc("0xf039ea4cd1f9c200803a871dc2b3d2a92f39444949aadc39590207ca9012841c")
//   console.log(a);

const t = await clientHandler.getTransactionReceipt("parent","0xf039ea4cd1f9c200803a871dc2b3d2a92f39444949aadc39590207ca9012841c")

console.log(t);

  
  
}

void main();
