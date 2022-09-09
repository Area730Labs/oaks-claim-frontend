import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitConfigArgs {
  freeWithdrawFee: BN
  subscriptionPrice: BN
  infoBump: number
  tokenaccEscrowBump: number
}

export interface InitConfigAccounts {
  owner: PublicKey
  treasuryWallet: PublicKey
  platformConfig: PublicKey
  adminWallet: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("freeWithdrawFee"),
  borsh.u64("subscriptionPrice"),
  borsh.u8("infoBump"),
  borsh.u8("tokenaccEscrowBump"),
])

export function initConfig(args: InitConfigArgs, accounts: InitConfigAccounts) {
  const keys = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.treasuryWallet, isSigner: false, isWritable: false },
    { pubkey: accounts.platformConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.adminWallet, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([23, 235, 115, 232, 168, 96, 1, 231])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      freeWithdrawFee: args.freeWithdrawFee,
      subscriptionPrice: args.subscriptionPrice,
      infoBump: args.infoBump,
      tokenaccEscrowBump: args.tokenaccEscrowBump,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
