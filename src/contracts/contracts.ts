import { Commitment, Connection, PublicKey} from '@solana/web3.js';

export class Contracts {
    public connection: Connection;

    constructor(rpcUrl: string, commitment: Commitment) {
        this.connection = new Connection(rpcUrl, commitment);
    }

    public async getSOLBalance(publicKey: PublicKey): Promise<number> {
        // human friendly: ${balance / LAMPORTS_PER_SOL} SOL
        return await this.connection.getBalance(publicKey);
    }
}
