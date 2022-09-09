import { WalletAdapter } from "@solana/wallet-adapter-base";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { PROGRAM_ID } from "./generated/programId";
import BN from "bn.js"
import { initConfig, InitConfigAccounts, InitConfigArgs } from "./generated/instructions";

export function getProgramPDA(seed: string): [PublicKey, number] {
    const buffers = [Buffer.from(seed, 'utf8')];

    return PublicKey.findProgramAddressSync(
        buffers, new PublicKey(PROGRAM_ID)
    );
}

export function createPlatformConfig(wallet: WalletAdapter): TransactionInstruction {


    const walletKey: PublicKey = wallet.publicKey as PublicKey;

    const [configAccount, configBump] = getProgramPDA("config");
    const [escrowAccount, escrowBump] = getProgramPDA("escrow");

    const args : InitConfigArgs = {
        freeWithdrawFee: new BN(LAMPORTS_PER_SOL * 0.002),
        subscriptionPrice: new BN(LAMPORTS_PER_SOL * 1),
        infoBump:configBump,
        tokenaccEscrowBump:escrowBump,
    };

    const accs: InitConfigAccounts = {
        owner: walletKey,
        treasuryWallet: walletKey,
        platformConfig: configAccount,
        systemProgram: SystemProgram.programId,
        adminWallet: walletKey,
    };

    const platformConfigIx = initConfig(args,accs);

    return platformConfigIx;
}
