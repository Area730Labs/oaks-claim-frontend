import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateDropArgs {
  infoBump: number
  tokenaccEscrowBump: number
  whitelist: Array<number>
  whitelistSize: number
  dropAmount: BN
  dropType: number
}

export interface CreateDropAccounts {
  owner: PublicKey
  platformConfig: PublicKey
  dropUid: PublicKey
  dropAddress: PublicKey
  dropMint: PublicKey
  escrow: PublicKey
  escrowObjectAccount: PublicKey
  ownerTokenAccount: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("infoBump"),
  borsh.u8("tokenaccEscrowBump"),
  borsh.array(borsh.u8(), 32, "whitelist"),
  borsh.u16("whitelistSize"),
  borsh.u64("dropAmount"),
  borsh.u8("dropType"),
])

export function createDrop(args: CreateDropArgs, accounts: CreateDropAccounts) {
  const keys = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.platformConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.dropUid, isSigner: false, isWritable: false },
    { pubkey: accounts.dropAddress, isSigner: false, isWritable: true },
    { pubkey: accounts.dropMint, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowObjectAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([157, 142, 145, 247, 92, 73, 59, 48])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      infoBump: args.infoBump,
      tokenaccEscrowBump: args.tokenaccEscrowBump,
      whitelist: args.whitelist,
      whitelistSize: args.whitelistSize,
      dropAmount: args.dropAmount,
      dropType: args.dropType,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
