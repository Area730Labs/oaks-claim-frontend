import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PlatformBumpsFields {
  escrow: number
  config: number
}

export interface PlatformBumpsJSON {
  escrow: number
  config: number
}

export class PlatformBumps {
  readonly escrow: number
  readonly config: number

  constructor(fields: PlatformBumpsFields) {
    this.escrow = fields.escrow
    this.config = fields.config
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("escrow"), borsh.u8("config")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PlatformBumps({
      escrow: obj.escrow,
      config: obj.config,
    })
  }

  static toEncodable(fields: PlatformBumpsFields) {
    return {
      escrow: fields.escrow,
      config: fields.config,
    }
  }

  toJSON(): PlatformBumpsJSON {
    return {
      escrow: this.escrow,
      config: this.config,
    }
  }

  static fromJSON(obj: PlatformBumpsJSON): PlatformBumps {
    return new PlatformBumps({
      escrow: obj.escrow,
      config: obj.config,
    })
  }

  toEncodable() {
    return PlatformBumps.toEncodable(this)
  }
}
