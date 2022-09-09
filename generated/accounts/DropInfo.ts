import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DropInfoFields {
  owner: PublicKey
  version: number
  dropType: number
  inactive: boolean
  bumps: types.DropBumpsFields
  whitelist: Array<number>
  whitelistSize: number
  whitelistClaimed: number
  whitelistUsageBitmap: Array<number>
  dropAmountPerUser: BN
  dropTokenMint: PublicKey
  claimDeadline: BN
}

export interface DropInfoJSON {
  owner: string
  version: number
  dropType: number
  inactive: boolean
  bumps: types.DropBumpsJSON
  whitelist: Array<number>
  whitelistSize: number
  whitelistClaimed: number
  whitelistUsageBitmap: Array<number>
  dropAmountPerUser: string
  dropTokenMint: string
  claimDeadline: string
}

export class DropInfo {
  readonly owner: PublicKey
  readonly version: number
  readonly dropType: number
  readonly inactive: boolean
  readonly bumps: types.DropBumps
  readonly whitelist: Array<number>
  readonly whitelistSize: number
  readonly whitelistClaimed: number
  readonly whitelistUsageBitmap: Array<number>
  readonly dropAmountPerUser: BN
  readonly dropTokenMint: PublicKey
  readonly claimDeadline: BN

  static readonly discriminator = Buffer.from([
    17, 107, 163, 74, 194, 96, 59, 210,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("owner"),
    borsh.u8("version"),
    borsh.u8("dropType"),
    borsh.bool("inactive"),
    types.DropBumps.layout("bumps"),
    borsh.array(borsh.u8(), 32, "whitelist"),
    borsh.u16("whitelistSize"),
    borsh.u16("whitelistClaimed"),
    borsh.vecU8("whitelistUsageBitmap"),
    borsh.u64("dropAmountPerUser"),
    borsh.publicKey("dropTokenMint"),
    borsh.u64("claimDeadline"),
  ])

  constructor(fields: DropInfoFields) {
    this.owner = fields.owner
    this.version = fields.version
    this.dropType = fields.dropType
    this.inactive = fields.inactive
    this.bumps = new types.DropBumps({ ...fields.bumps })
    this.whitelist = fields.whitelist
    this.whitelistSize = fields.whitelistSize
    this.whitelistClaimed = fields.whitelistClaimed
    this.whitelistUsageBitmap = fields.whitelistUsageBitmap
    this.dropAmountPerUser = fields.dropAmountPerUser
    this.dropTokenMint = fields.dropTokenMint
    this.claimDeadline = fields.claimDeadline
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<DropInfo | null> {
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
  ): Promise<Array<DropInfo | null>> {
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

  static decode(data: Buffer): DropInfo {
    if (!data.slice(0, 8).equals(DropInfo.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = DropInfo.layout.decode(data.slice(8))

    return new DropInfo({
      owner: dec.owner,
      version: dec.version,
      dropType: dec.dropType,
      inactive: dec.inactive,
      bumps: types.DropBumps.fromDecoded(dec.bumps),
      whitelist: dec.whitelist,
      whitelistSize: dec.whitelistSize,
      whitelistClaimed: dec.whitelistClaimed,
      whitelistUsageBitmap: Array.from(dec.whitelistUsageBitmap),
      dropAmountPerUser: dec.dropAmountPerUser,
      dropTokenMint: dec.dropTokenMint,
      claimDeadline: dec.claimDeadline,
    })
  }

  toJSON(): DropInfoJSON {
    return {
      owner: this.owner.toString(),
      version: this.version,
      dropType: this.dropType,
      inactive: this.inactive,
      bumps: this.bumps.toJSON(),
      whitelist: this.whitelist,
      whitelistSize: this.whitelistSize,
      whitelistClaimed: this.whitelistClaimed,
      whitelistUsageBitmap: this.whitelistUsageBitmap,
      dropAmountPerUser: this.dropAmountPerUser.toString(),
      dropTokenMint: this.dropTokenMint.toString(),
      claimDeadline: this.claimDeadline.toString(),
    }
  }

  static fromJSON(obj: DropInfoJSON): DropInfo {
    return new DropInfo({
      owner: new PublicKey(obj.owner),
      version: obj.version,
      dropType: obj.dropType,
      inactive: obj.inactive,
      bumps: types.DropBumps.fromJSON(obj.bumps),
      whitelist: obj.whitelist,
      whitelistSize: obj.whitelistSize,
      whitelistClaimed: obj.whitelistClaimed,
      whitelistUsageBitmap: obj.whitelistUsageBitmap,
      dropAmountPerUser: new BN(obj.dropAmountPerUser),
      dropTokenMint: new PublicKey(obj.dropTokenMint),
      claimDeadline: new BN(obj.claimDeadline),
    })
  }
}
