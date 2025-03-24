import { Address, Hex } from "viem"

export type SequencerL2BatchFromOrigiParameters = {
    sequenceNumber:BigInt,
    data:Hex,
    afterDelayedMessagesRead:BigInt,
    gasRefunder:Address,
    prevMessageCount:BigInt,
    newMessageCount:BigInt
}