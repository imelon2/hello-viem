import {
  Address,
  BlockNumber,
  BlockTag,
  decodeEventLog,
  decodeFunctionData,
  getAbiItem,
  Hex,
  parseAbi,
  parseEventLogs,
} from 'viem';
import { ClientHandler } from '../lib/client';
import { SequencerInbox__factory } from '@arbitrum/sdk/dist/lib/abi/factories/SequencerInbox__factory';
import { SequencerL2BatchFromOrigiParameters } from '../lib/type';

export class SequencerInboxHandler {
  clientHandler: ClientHandler;
  sequencerInboxAddress: Address;

  constructor(clientHandler: ClientHandler, rollupAddress: Address) {
    this.clientHandler = clientHandler;
    this.sequencerInboxAddress = rollupAddress;
  }

  static decodeBatchPostingCalldata(input: Hex): SequencerL2BatchFromOrigiParameters {
    const { args } = decodeFunctionData({
      abi: SequencerInbox__factory.abi.filter(
        (abiItem) => abiItem.type == 'function' && abiItem.name == 'addSequencerL2BatchFromOrigin',
      ),
      data: input,
    });

    if (args == undefined) {
      throw new Error(`Not func addSequencerL2BatchFromOrigin() calldata`);
    }

    return {
      sequenceNumber: args[0] as BigInt,
      data: args[1] as Hex,
      afterDelayedMessagesRead: args[2] as BigInt,
      gasRefunder: args[3] as Address,
      prevMessageCount: args[4] as BigInt,
      newMessageCount: args[5] as BigInt,
    };
  }

  async callReadFunc<T extends 'batchCount'[]>(
    contracts: T,
    args?: any[][],
  ): Promise<{ [K in T[number]]: string }> {
    const address = await Promise.all(
      contracts.map(async (functionName, i) => {
        return await this.clientHandler.readContract(
          'parent',
          this.sequencerInboxAddress,
          [...SequencerInbox__factory.abi],
          functionName,
          args ? args[i] : undefined,
        );
      }),
    );

    const result: any = {};
    contracts.forEach((key, i) => {
      result[key] = address[i];
    });
    return result;
  }

  async getSequencerBatchDeliveredEvent(
    fromBlock: BlockNumber | BlockTag = 'earliest',
    toBlock: BlockNumber | BlockTag = 'latest',
  ) {
    return await this.clientHandler.getLogs(
      'parent',
      this.sequencerInboxAddress,
      // parseAbi(SequencerInbox__factory.abi)    ,
      SequencerInbox__factory.abi.filter(
        (abiItem) => abiItem.type == 'event' && abiItem.name == 'SequencerBatchDelivered',
      )[0],
      undefined,
      fromBlock,
      toBlock,
    );
  }

  async decodeEventFunc(txHash: `0x${string}`) {
    const txReceipt = await this.clientHandler.getTransactionReceipt('parent', txHash);
    if (!txReceipt) {
      throw new Error(`Not func addSequencerL2BatchFromOrigin() calldata`);
    }

    return parseEventLogs({
      abi: SequencerInbox__factory.abi,
      logs: txReceipt.logs,
    });
  }
}
