import { Commitment, Connection, PublicKey, SystemProgram, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

export class Contracts {
    public connection: Connection;
    public wallet: Keypair

    constructor(rpcUrl: string, commitment: Commitment, wallet: Keypair) {
        this.connection = new Connection(rpcUrl, commitment);
        this.wallet = wallet
    }

    public async getSOLBalance(publicKey: PublicKey): Promise<number> {
        // human friendly: ${balance / LAMPORTS_PER_SOL} SOL
        return await this.connection.getBalance(publicKey);
    }

    public async transferSOL(toAddress: PublicKey, value: number): Promise<string> {
        const transaction = new Transaction();

        const instruction = SystemProgram.transfer({
            fromPubkey: this.wallet.publicKey,
            toPubkey: toAddress,
            lamports: value,
        });
        transaction.add(instruction);

        const signature = await sendAndConfirmTransaction(this.connection, transaction, [this.wallet]);

        return signature
    }
}