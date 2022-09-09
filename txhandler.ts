import { SendTransactionOptions, WalletAdapter } from "@solana/wallet-adapter-base";
import { Connection, RpcResponseAndContext, Signer, SimulatedTransactionResponse, Transaction, TransactionBlockhashCtor, TransactionInstruction, TransactionSignature } from "@solana/web3.js";

class TxHandler {

    private connection: Connection;
    private wallet: WalletAdapter;

    constructor(c: Connection, w: WalletAdapter) {
        this.connection = c;
        this.wallet = w;
    }

    private async createTxObject(): Promise<Transaction> {

        const hash = await this.connection.getLatestBlockhash();

        const transactionObject = new Transaction({ 
            blockhash: hash.blockhash, 
            lastValidBlockHeight: hash.lastValidBlockHeight, 
            feePayer: this.wallet.publicKey 
        } as TransactionBlockhashCtor);

        return transactionObject;
    }

    async sendTransaction(instructions: TransactionInstruction[], signers?: Signer[]): Promise<TransactionSignature> {

        const tx = await this.createTxObject();

        for (var txIx of instructions) {
            tx.add(txIx);
        }

        console.log(tx.serializeMessage().toString("base64"));

        if (signers != null && signers.length > 0) {
            return this.wallet.sendTransaction(tx, this.connection, {
                signers: signers,
            } as SendTransactionOptions);
        } else {
            return this.wallet.sendTransaction(tx, this.connection);
        }
    }

    async simulate(instructions: TransactionInstruction[], signers?: Signer[]): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {

        const tx = await this.createTxObject();

        for (var txIx of instructions) {
            tx.add(txIx);
        }

        return this.connection.simulateTransaction(tx, signers);
    }

}


export {
    TxHandler
}