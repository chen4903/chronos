import { Commitment, Connection, PublicKey, SystemProgram, Transaction, Keypair, sendAndConfirmTransaction, RpcResponseAndContext, TokenAmount, BlockhashWithExpiryBlockHeight, AccountInfo, ParsedTransactionWithMeta, ConfirmedSignatureInfo, GetProgramAccountsResponse, ComputeBudgetProgram, TransactionInstruction, TransactionMessage, VersionedTransaction, AddressLookupTableProgram } from '@solana/web3.js';
import BN from 'bn.js';

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
            // By default, the number of CU = 200000 * instructions number
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

    public async sendV0Transaction(instructions: TransactionInstruction[]): Promise<string> {
        const { blockhash } = await this.connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: this.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([this.wallet]);

        const signature = await this.connection.sendTransaction(transaction);

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

    public async getParsedDataFromRawData(address: PublicKey, offset: number, size: number): Promise<string> {
        const accountInfo = await this.connection.getAccountInfo(address);
        const dataBuffer = accountInfo?.data;
        if (!dataBuffer) {
            throw new Error("Account data not found");
        }

        // PS: In Solana, each 8 bits represent one unit of length,
        // and the discriminator is 8 bytes
        const newBuffer = dataBuffer.subarray(offset, offset + size);
        const target = new BN(newBuffer, 'le')

        return target.toString()
    }

    /////////////////////////////////////// describe ///////////////////////////////////////////////////////////

    public async describeAccountChange(account: PublicKey, callbackFunc: (param: any) => any) {
        this.connection.onAccountChange(account, callbackFunc);
    }

    public async describeLogsEmit(account: PublicKey, callbackFunc: (param: any) => any) {
        this.connection.onLogs(account, callbackFunc);
    }

    /////////////////////////////////////// ALT ///////////////////////////////////////////////////////////

    public async createALT(): Promise<string> {
        const slot = await this.connection.getSlot("confirmed");

        const [lookupTableInstruction, lookupTableAddress] =
            AddressLookupTableProgram.createLookupTable({
                authority: this.wallet.publicKey,
                payer: this.wallet.publicKey,
                recentSlot: slot,
            });

        const { blockhash } = await this.connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: this.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: [lookupTableInstruction],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([this.wallet]);

        const signature = await this.connection.sendTransaction(transaction);
        console.log("Create ALT successfully! Signature: ", signature)

        return lookupTableAddress.toBase58()
    }

    public async addAccountToALT(lookupTableAddress: PublicKey, addresses: PublicKey[]): Promise<string> {

        const extendInstruction = AddressLookupTableProgram.extendLookupTable({
            lookupTable: lookupTableAddress,
            payer: this.wallet.publicKey,
            authority: this.wallet.publicKey,
            addresses: addresses,
        });

        const { blockhash } = await this.connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: this.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: [extendInstruction],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([this.wallet]);

        const signature = await this.connection.sendTransaction(transaction);

        return signature
    }

    public async sendV0TransactionWithALT(instructions: TransactionInstruction[], lookupTableAddress: PublicKey): Promise<string> {
        const ALT = await this.connection.getAddressLookupTable(lookupTableAddress);
        if (!ALT.value) {
            throw new Error("lookupTableAccount does not exist");
        }

        const lookupTableAccount = ALT.value;

        const { blockhash } = await this.connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: this.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message([lookupTableAccount]);

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([this.wallet]);

        const signature = await this.connection.sendTransaction(transaction);

        return signature
    }
}

export default Contracts