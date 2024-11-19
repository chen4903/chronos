import { Commitment, Connection, PublicKey, SystemProgram, Transaction, Keypair, sendAndConfirmTransaction, RpcResponseAndContext, TokenAmount, BlockhashWithExpiryBlockHeight, AccountInfo, ParsedTransactionWithMeta, ConfirmedSignatureInfo, GetProgramAccountsResponse, ComputeBudgetProgram } from '@solana/web3.js';

class Contracts {
    public connection: Connection;
    public wallet: Keypair

    constructor(rpcUrl: string, commitment: Commitment, wallet: Keypair) {
        this.connection = new Connection(rpcUrl, commitment);
        this.wallet = wallet
    }

    /////////////////////////////////////// send transaction ///////////////////////////////////////////////////////////
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

    public async sendAndConfirmTransaction(transaction: Transaction): Promise<string> {
        const signature = await sendAndConfirmTransaction(this.connection, transaction, [this.wallet], {
            skipPreflight: false
        });

        return signature
    }

    public async sendRawTransaction(rawTransaction: Buffer | Uint8Array | Array<number>): Promise<string> {
        const signature = await this.connection.sendRawTransaction(rawTransaction, {
            skipPreflight: false
        })

        return signature
    }

    public async sendEncodedTransaction(base64Transaction: string): Promise<string> {
        const signature = await this.connection.sendEncodedTransaction(base64Transaction, {
            skipPreflight: false
        })

        return signature
    }

    public async sendAndConfirmPriorityTransaction(
        transaction: Transaction,
        computeUnitPriceInMicroLamports: number,
        computeUnitLimitsUnits: number
    ): Promise<string> {
        // Priority fee is an additional fee paid on top of the basic transaction fee(5000 Lamports)
        // CU: Compute Units
        // Priority fee = CU limit * CU price    <--- Price is in microLamports
        // If the priority fee is less than 1 Lamports, then priority fee is set to 1 Lamports

        const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
            // By default, the number of CU = 200000 * instructions number,
            // and Compute Budget program instruction would NOT be considerate into the number of instructions number
            microLamports: computeUnitPriceInMicroLamports
        });
        transaction.add(computeUnitPriceInstruction);

        const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
            // default: 200_000 CU
            // normal transfer: 150 CU
            // max: 1_400_000 CU
            units: computeUnitLimitsUnits,
        });
        transaction.add(computeUnitLimitInstruction);

        const signature = await sendAndConfirmTransaction(this.connection, transaction, [this.wallet], {
            skipPreflight: false
        });

        return signature
    }

    /////////////////////////////////////// getter ///////////////////////////////////////////////////////////
    public async getSOLBalance(publicKey: PublicKey): Promise<number> {
        // human friendly: ${balance / LAMPORTS_PER_SOL} SOL
        return await this.connection.getBalance(publicKey);
    }

    public async getFTBalance(tokenAccount: PublicKey): Promise<RpcResponseAndContext<TokenAmount>> {
        return await this.connection.getTokenAccountBalance(tokenAccount);
    }

    public async getCurrentSlot(): Promise<number> {
        return await this.connection.getSlot();
    }

    public async getFirstAvailableBlock(): Promise<number> {
        return await this.connection.getFirstAvailableBlock();
    }

    public async getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
        return await this.connection.getLatestBlockhash();
    }

    public async getAccountInfo(account: PublicKey): Promise<AccountInfo<Buffer> | null> {
        return await this.connection.getAccountInfo(account, this.connection.commitment);
    }

    public async getTransactionInfo(signature: string): Promise<ParsedTransactionWithMeta | null> {
        return await this.connection.getParsedTransaction(signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });
    }

    public async getAddressRecentTransaction(account: PublicKey, num: number): Promise<Array<ConfirmedSignatureInfo>> {
        return await this.connection.getSignaturesForAddress(account, {
            limit: num,
        });
    }

    public async getTokenAccountsByOwner(ownerAccount: PublicKey, mintAccount: PublicKey): Promise<RpcResponseAndContext<GetProgramAccountsResponse>> {
        return await this.connection.getTokenAccountsByOwner(ownerAccount, {
            mint: mintAccount,
        }, "confirmed");
    }

    public async getFTSupply(tokenAccount: PublicKey): Promise<RpcResponseAndContext<TokenAmount>> {
        return await this.connection.getTokenSupply(tokenAccount);
    }

    /////////////////////////////////////// describe ///////////////////////////////////////////////////////////

    public async describeAccountChange(account: PublicKey) {
        this.connection.onAccountChange(account, (accountInfo) => {
            console.log(`account state changes: ${JSON.stringify(accountInfo)}\n`);
        });
    }

    public async describeLogsEmit(account: PublicKey) {
        this.connection.onLogs(account, (logs) => {
            console.log(`logs: ${JSON.stringify(logs)}\n`);
        });
    }
}

export default Contracts