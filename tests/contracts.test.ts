import { PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { Contracts } from '../src/contracts/contracts';
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
        return new Contracts(endpoint, 'finalized', wallet);
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

    it('getFTSupply on Mainnet', async () => {
        const contract = initializeContract('main');

        const usdc = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
        const usdcSupply = await contract.getFTSupply(usdc);

        console.log(`usdcSupply: ${JSON.stringify(usdcSupply.value.amount)}}`);
    });
});
