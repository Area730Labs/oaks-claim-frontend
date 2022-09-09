import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PlatformConfigFields {
  bumps: types.PlatformBumpsFields
  freeStakingWithdrawFee: BN
  subscriptionPrice: BN
  treasuryWallet: PublicKey
  admin: PublicKey
}

export interface PlatformConfigJSON {
  bumps: types.PlatformBumpsJSON
  freeStakingWithdrawFee: string
  subscriptionPrice: string
  treasuryWallet: string
  admin: string
}

export class PlatformConfig {
  readonly bumps: types.PlatformBumps
  readonly freeStakingWithdrawFee: BN
  readonly subscriptionPrice: BN
  readonly treasuryWallet: PublicKey
  readonly admin: PublicKey

  static readonly discriminator = Buffer.from([
    160, 78, 128, 0, 248, 83, 230, 160,
  ])

  static readonly layout = borsh.struct([
    types.PlatformBumps.layout("bumps"),
    borsh.u64("freeStakingWithdrawFee"),
    borsh.u64("subscriptionPrice"),
    borsh.publicKey("treasuryWallet"),
    borsh.publicKey("admin"),
  ])

  constructor(fields: PlatformConfigFields) {
    this.bumps = new types.PlatformBumps({ ...fields.bumps })
    this.freeStakingWithdrawFee = fields.freeStakingWithdrawFee
    this.subscriptionPrice = fields.subscriptionPrice
    this.treasuryWallet = fields.treasuryWallet
    this.admin = fields.admin
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<PlatformConfig | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<PlatformConfig | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): PlatformConfig {
    if (!data.slice(0, 8).equals(PlatformConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PlatformConfig.layout.decode(data.slice(8))

    return new PlatformConfig({
      bumps: types.PlatformBumps.fromDecoded(dec.bumps),
      freeStakingWithdrawFee: dec.freeStakingWithdrawFee,
      subscriptionPrice: dec.subscriptionPrice,
      treasuryWallet: dec.treasuryWallet,
      admin: dec.admin,
    })
  }

  toJSON(): PlatformConfigJSON {
    return {
      bumps: this.bumps.toJSON(),
      freeStakingWithdrawFee: this.freeStakingWithdrawFee.toString(),
      subscriptionPrice: this.subscriptionPrice.toString(),
      treasuryWallet: this.treasuryWallet.toString(),
      admin: this.admin.toString(),
    }
  }

  static fromJSON(obj: PlatformConfigJSON): PlatformConfig {
    return new PlatformConfig({
      bumps: types.PlatformBumps.fromJSON(obj.bumps),
      freeStakingWithdrawFee: new BN(obj.freeStakingWithdrawFee),
      subscriptionPrice: new BN(obj.subscriptionPrice),
      treasuryWallet: new PublicKey(obj.treasuryWallet),
      admin: new PublicKey(obj.admin),
    })
  }
}
