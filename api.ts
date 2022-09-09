import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { API_BLOCKCHAIN_URL } from "./config";

export type Method = "post" | "get";

export interface Drop {
    DropAddress: string
    drop_mint: string
    drop_amount: number,
    whitelisted: number
    claimed: number
}

class Api {

    private host: string = `${API_BLOCKCHAIN_URL}/drops/`;

    constructor() {
    }

    async drops(wallet: PublicKey): Promise<Drop[]> {

        let result = await this.sendRequest("get", `drops/${wallet}`);

        return result.drops;
    }

    async whitelist(drop: PublicKey): Promise<string> {

        let result = await this.sendRequest("get", `whitelist/${drop}`);

        return result.value;
    }

    private async sendRequest(rm: Method, method: string, args?: any): Promise<any> {

        const url = this.host + method

        try {
            let response_result = await axios.request({
                method: rm,
                url: url,
                data: args,
            })

            if (response_result.data != null) {
                return response_result.data;
            } else {
                throw new Error("no response data were found");
            }
        } catch (e) {
            throw e;
        }
    }


}

export default Api;
