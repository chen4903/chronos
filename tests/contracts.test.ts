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

    it('getSOLBalance on Testnet', async () => {
        const contract = initializeContract('test');
        const publicKey = new PublicKey('FMzZ3PRuFPns7DmrU5aCFDeaSgSVmMtofVJGBJcFJCxr');
        const balance = await contract.getSOLBalance(publicKey);

        console.log(`My SOL balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        assert(balance >= 0, "Balance should be greater than or equal to 0");
    });


    it('transferSOL on Testnet', async () => {
        const contract = initializeContract('test');
        const toAddress = contract.wallet.publicKey; // Transfer to self
        const signature = await contract.transferSOL(toAddress, 100);

        console.log(`Transaction signature: ${signature}`);
    });
});
