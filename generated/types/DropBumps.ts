import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DropBumpsFields {
  drop: number
  escrowTokenacc: number
}

export interface DropBumpsJSON {
  drop: number
  escrowTokenacc: number
}

export class DropBumps {
  readonly drop: number
  readonly escrowTokenacc: number

  constructor(fields: DropBumpsFields) {
    this.drop = fields.drop
    this.escrowTokenacc = fields.escrowTokenacc
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u8("drop"), borsh.u8("escrowTokenacc")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new DropBumps({
      drop: obj.drop,
      escrowTokenacc: obj.escrowTokenacc,
    })
  }

  static toEncodable(fields: DropBumpsFields) {
    return {
      drop: fields.drop,
      escrowTokenacc: fields.escrowTokenacc,
    }
  }

  toJSON(): DropBumpsJSON {
    return {
      drop: this.drop,
      escrowTokenacc: this.escrowTokenacc,
    }
  }

  static fromJSON(obj: DropBumpsJSON): DropBumps {
    return new DropBumps({
      drop: obj.drop,
      escrowTokenacc: obj.escrowTokenacc,
    })
  }

  toEncodable() {
    return DropBumps.toEncodable(this)
  }
}
