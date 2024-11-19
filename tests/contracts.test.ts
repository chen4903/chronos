import { PublicKey, LAMPORTS_PER_SOL, Keypair, SystemProgram, Transaction, AddressLookupTableProgram } from '@solana/web3.js';
import Contracts from '../src/contracts/contracts';
import { assert } from 'console';
import fs from "fs";

describe('Contracts Class', () => {
    const loadWallet = () => {
        const secretKeyPath = "/Users/levi/.config/solana/id.json";
        const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(secretKeyPath, "utf-8")));
        return Keypair.fromSecretKey(secretKey);
    };

    const initializeContract = (network: 'test' | 'main') => {
        const wallet = loadWallet();
        const endpoint = network === 'test' 
            ? "https://api.devnet.solana.com"  // Test network
            : "https://api.mainnet-beta.solana.com"; // Main network
        return new Contracts(endpoint, 'confirmed', wallet);
    };

    // it('getSOLBalance on Testnet', async () => {
    //     const contract = initializeContract('test');
    //     const publicKey = new PublicKey('FMzZ3PRuFPns7DmrU5aCFDeaSgSVmMtofVJGBJcFJCxr');
    //     const balance = await contract.getSOLBalance(publicKey);

    //     console.log(`My SOL balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    //     assert(balance >= 0, "Balance should be greater than or equal to 0");
    // });


    // it('transferSOL on Testnet', async () => {
    //     const contract = initializeContract('test');
    //     const toAddress = contract.wallet.publicKey; // Transfer to self
    //     const signature = await contract.transferSOL(toAddress, 100);

    //     console.log(`Transaction signature: ${signature}`);
    // });

    // it('getFTBalance on Mainnet', async () => {
    //     const contract = initializeContract('main');
    //     // web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2's USDC balance
    //     const address = new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT");
    //     const balance = await contract.getFTBalance(address);

    //     console.log(`balance: ${JSON.stringify(balance)}}`);
    // });

    // it('getParsedAccountInfo on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const address = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
    //     const accountInfo = await contract.getAccountInfo(address);

    //     console.log(`balance: ${JSON.stringify(accountInfo)}}`);
    // });

    // it('getParsedTransaction on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const signature = "3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC";
    //     const transactionInfo = await contract.getTransactionInfo(signature);

    //     console.log(`transactionInfo: ${JSON.stringify(transactionInfo)}}`);
    // });

    // it('getAddressRecentTransaction on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const address = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
    //     const recentTransactions = await contract.getAddressRecentTransaction(address, 3);

    //     console.log(`recentTransactions: ${JSON.stringify(recentTransactions)}}`);
    // });

    // it('getTokenAccountsByOwner on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const ownerAccount = new PublicKey('web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2');
    //     const mintAccount = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    //     const tokenAccountsByOwner = await contract.getTokenAccountsByOwner(ownerAccount, mintAccount);

    //     console.log(`tokenAccountsByOwner: ${JSON.stringify(tokenAccountsByOwner)}}`);
    // });

    // it('getFTSupply on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const usdc = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
    //     const usdcSupply = await contract.getFTSupply(usdc);

    //     console.log(`usdcSupply: ${JSON.stringify(usdcSupply.value.amount)}}`);
    // });

    // it('onAccountChange on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const account = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
    //     await contract.onAccountChange(account);
    // });

    // it('onLogsEmit on Mainnet', async () => {
    //     const contract = initializeContract('main');

    //     const account = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
    //     await contract.describeLogsEmit(account);
    // });

    // it('sendAndConfirmTransaction on test', async () => {
    //     const contract = initializeContract('test');

    //     const transaction = new Transaction();

    //     const instruction = SystemProgram.transfer({
    //         fromPubkey: contract.wallet.publicKey,
    //         toPubkey: contract.wallet.publicKey,
    //         lamports: 100,
    //     });
    //     transaction.add(instruction);
        
    //     const signature = await contract.sendAndConfirmTransaction(transaction);
    //     console.log("signature: ", signature)
    // });

    // it('sendRawTransaction on test', async () => {
    //     const contract = initializeContract('test');

    //     const transaction = new Transaction();

    //     const instruction = SystemProgram.transfer({
    //         fromPubkey: contract.wallet.publicKey,
    //         toPubkey: contract.wallet.publicKey,
    //         lamports: 1000,
    //     });
    //     transaction.add(instruction);

    //     const { blockhash } = await contract.getLatestBlockhash();
    //     transaction.recentBlockhash = blockhash;
    //     transaction.feePayer = contract.wallet.publicKey;
    //     transaction.sign(contract.wallet);
    //     const rawTransaction = transaction.serialize();
        
    //     const signature = await contract.sendRawTransaction(rawTransaction);
    //     console.log("signature: ", signature)
    // });

    // it('sendEncodedTransaction on test', async () => {
    //     const contract = initializeContract('test');

    //     const transaction = new Transaction();

    //     const instruction = SystemProgram.transfer({
    //         fromPubkey: contract.wallet.publicKey,
    //         toPubkey: contract.wallet.publicKey,
    //         lamports: 1000,
    //     });
    //     transaction.add(instruction);

    //     const { blockhash } = await contract.getLatestBlockhash();
    //     transaction.recentBlockhash = blockhash;
    //     transaction.feePayer = contract.wallet.publicKey;
    //     transaction.sign(contract.wallet);
    //     const rawTransaction = transaction.serialize();
        
    //     const base64Transaction = rawTransaction.toString('base64');

    //     const signature = await contract.sendEncodedTransaction(base64Transaction);
    //     console.log("signature: ", signature)
    // });

    // it('sendAndConfirmPriorityTransaction on test', async () => {
    //     const contract = initializeContract('test');

    //     const transaction = new Transaction();

    //     const instruction = SystemProgram.transfer({
    //         fromPubkey: contract.wallet.publicKey,
    //         toPubkey: contract.wallet.publicKey,
    //         lamports: 1000,
    //     });
    //     transaction.add(instruction);

    //     const signature = await contract.sendAndConfirmPriorityTransaction(transaction, 4000, 500);
    //     // https://solscan.io/tx/5gQPNB1LxyJwzkXpBdpr3v9FheLFHaQZhhgQwp4EzzQ58hv92Ye5ov3WmDb8iFxrQnJqasj1UPSKfzquSVM5QbBb?cluster=devnet
    //     // Priority Fee = 0.000000002 SOL

    //     // The unit in solana:
    //     // - 1 SOL = 10^9 Lamports = 10^15 MicroLamports

    //     // Let me show you how to calculate the priority fee:
    //     //   We have: Priority Fee = CU limit * CU price; price is in microLamports;
    //     //   Then: PriorityFee
    //     //     = 4000microLamports/unit × 500units
    //     //     = 2000000microLamports
    //     //     = 0.002Lamports
    //     //     = 0.000000002SOL
    //     console.log("signature: ", signature)
    // });


    // it('use ALT on test', async () => {
    //     const contract = initializeContract('test');

    //     const ALTAddress = await contract.createALT()
    //     console.log("ALT address: ", ALTAddress)

    //     await sleep(2000)

    //     const lookupTableAddress = new PublicKey(ALTAddress)

    //     const signature1 = await contract.addAccountToALT(lookupTableAddress, [
    //         contract.wallet.publicKey,
    //         SystemProgram.programId,
    //     ])
    //     console.log("signature1: ", signature1) 
        
    //     const instruction = SystemProgram.transfer({
    //         fromPubkey: contract.wallet.publicKey,
    //         toPubkey: contract.wallet.publicKey,
    //         lamports: 1000,
    //     });
    //     const signature2 = await contract.sendV0TransactionWithALT([instruction], lookupTableAddress)
    //     console.log("signature2: ", signature2) 
    // });

    it('getParsedDataFromRawData on Mainnet', async () => {
        const contract = initializeContract('main');

        const poolAccountPublicKey = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
        const sqrtPriceX64Value = await contract.getParsedDataFromRawData(poolAccountPublicKey, 253, 16)
        console.log("sqrtPriceX64Value: ", sqrtPriceX64Value)

        const sqrtPriceX64BigInt = BigInt(sqrtPriceX64Value.toString());
        const sqrtPriceX64Float = Number(sqrtPriceX64BigInt) / (2 ** 64);
        const price = sqrtPriceX64Float ** 2 * 1e9 / 1e6;
        console.log(`WSOL price:`,  price.toString())
    });

});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
