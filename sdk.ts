import { WalletAdapter } from "@solana/wallet-adapter-base";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SolanaJSONRPCError, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { PROGRAM_ID } from "./generated/programId";
import BN from "bn.js"
import { claimDrop, ClaimDropAccounts, ClaimDropArgs, createDrop, CreateDropAccounts, CreateDropArgs, initConfig, InitConfigAccounts, InitConfigArgs } from "./generated/instructions";
import { DroplistItem, getMerkleTree } from "./merkletree";
import {
    TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { DropInfo, DropInfoJSON } from "./generated/accounts";

export function getProgramPDA(seed: string): [PublicKey, number] {
    const buffers = [Buffer.from(seed, 'utf8')];

    return PublicKey.findProgramAddressSync(
        buffers, new PublicKey(PROGRAM_ID)
    );
}

export function calcAddressWithTwoSeeds(seed: string, seed2: Buffer, address: PublicKey): [PublicKey, number] {
    const buffers = [Buffer.from(seed, 'utf8'), seed2, address.toBuffer()];

    return PublicKey.findProgramAddressSync(
        buffers, new PublicKey(PROGRAM_ID)
    );
}

export function calcAddressWithSeed(seed: string, address: PublicKey): [PublicKey, number] {
    const buffers = [Buffer.from(seed, 'utf8'), address.toBuffer()];

    return PublicKey.findProgramAddressSync(
        buffers, new PublicKey(PROGRAM_ID)
    );
}

export function createPlatformConfig(wallet: WalletAdapter): TransactionInstruction {


    const walletKey: PublicKey = wallet.publicKey as PublicKey;

    const [configAccount, configBump] = getProgramPDA("config");
    const [escrowAccount, escrowBump] = getProgramPDA("escrow");

    const args: InitConfigArgs = {
        freeWithdrawFee: new BN(LAMPORTS_PER_SOL * 0.002),
        subscriptionPrice: new BN(LAMPORTS_PER_SOL * 1),
        infoBump: configBump,
        tokenaccEscrowBump: escrowBump,
    };

    const accs: InitConfigAccounts = {
        owner: walletKey,
        treasuryWallet: walletKey,
        platformConfig: configAccount,
        systemProgram: SystemProgram.programId,
        adminWallet: walletKey,
    };

    const platformConfigIx = initConfig(args, accs);

    return platformConfigIx;
}

export function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];
}

export function createDropIx(totalAmount: number, mint: PublicKey, list: DroplistItem[], wallet: WalletAdapter): TransactionInstruction {

    const walletKey: PublicKey = wallet.publicKey as PublicKey;

    const merkleTree = getMerkleTree(list);

    const [configAccount, configBump] = getProgramPDA("config");
    const [escrowAccount, escrowBump] = getProgramPDA("escrow");
    const [escrowDepositAcc, depositBump] = calcAddressWithSeed('drop_escrow_deposit', mint)

    const pkrand = new Keypair();
    const [drop, dropBump] = calcAddressWithSeed("drop", pkrand.publicKey);

    const creatortokenacc = findAssociatedTokenAddress(walletKey, mint);


    const args: CreateDropArgs = {
        infoBump: dropBump,
        tokenaccEscrowBump: depositBump,
        whitelist: merkleTree.getRootArray(),
        whitelistSize: list.length,
        dropAmount: new BN(totalAmount),
        dropType: 0 // amount provided by for each wallet separately
    };

    const accs: CreateDropAccounts = {
        owner: walletKey,
        platformConfig: configAccount,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        dropUid: pkrand.publicKey,
        dropAddress: drop,
        dropMint: mint,
        escrow: escrowAccount,
        escrowObjectAccount: escrowDepositAcc,
        ownerTokenAccount: creatortokenacc
    };

    const platformConfigIx = createDrop(args, accs);

    return platformConfigIx;
}

export function claimDropIx(dropaddr : PublicKey,dropinfo: DropInfo, amount: number, list: DroplistItem[], wallet: WalletAdapter): TransactionInstruction {

    const walletKey: PublicKey = wallet.publicKey as PublicKey;
    const mint = dropinfo.dropTokenMint;

    const merkleTree = getMerkleTree(list);

    let whitelistAmount = 0;
    const indexWhitelist = list.findIndex(
        (e) => {
            if (e.wallet === walletKey) {
                whitelistAmount = e.amount;
                return true
            } else {
                return 
            }
        }
    );

    if (indexWhitelist === -1) {
        throw new Error("not in a whitelist")
    }

    if (whitelistAmount != amount) {
        throw new Error("amount provided is not correct");
    }

    const proof = merkleTree.getProofArray(indexWhitelist);

    const [configAccount, configBump] = getProgramPDA("config");
    const [escrowAccount, escrowBump] = getProgramPDA("escrow");
    const [escrowDepositAcc, depositBump] = calcAddressWithSeed('drop_escrow_deposit', mint)

    const creatortokenacc = findAssociatedTokenAddress(walletKey, mint);


    const args: ClaimDropArgs = {
        ownerProof: proof,
        proofIndex: indexWhitelist,
        proofAmount: new BN(whitelistAmount)
    };

    const accs: ClaimDropAccounts = {
        claimer: walletKey,
        platformConfig: configAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        dropAddress: dropaddr,
        dropMint: mint,
        escrow: escrowAccount,
        escrowObjectAccount: escrowDepositAcc,
        claimerTokenAccount: creatortokenacc
    };

    const platformConfigIx = claimDrop(args, accs);

    return platformConfigIx;
}

