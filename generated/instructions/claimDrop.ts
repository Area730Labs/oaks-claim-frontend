import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimDropArgs {
  ownerProof: Array<Array<number>>
  proofIndex: number
}

export interface ClaimDropAccounts {
  claimer: PublicKey
  platformConfig: PublicKey
  dropAddress: PublicKey
  dropMint: PublicKey
  escrow: PublicKey
  escrowObjectAccount: PublicKey
  claimerTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.vec(borsh.array(borsh.u8(), 32), "ownerProof"),
  borsh.u16("proofIndex"),
])

export function claimDrop(args: ClaimDropArgs, accounts: ClaimDropAccounts) {
  const keys = [
    { pubkey: accounts.claimer, isSigner: true, isWritable: true },
    { pubkey: accounts.platformConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.dropAddress, isSigner: false, isWritable: true },
    { pubkey: accounts.dropMint, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowObjectAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.claimerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([157, 29, 89, 14, 81, 203, 107, 58])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      ownerProof: args.ownerProof,
      proofIndex: args.proofIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
