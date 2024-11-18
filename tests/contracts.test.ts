import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Contracts } from '../src/contracts/contracts';
import { assert } from 'console';

describe('Contracts Class', () => {
    it('getSOLBalance', async () => {

        const contract = new Contracts("https://api.mainnet-beta.solana.com", 'finalized');

        // Create a mock public key
        const publicKey = new PublicKey('5er33fVk9MqEP3xzQnpcgdo5KWCT4jzP7sbuGPL4bPsN');

        // Call getUserInfo
        const balance = await contract.getSOLBalance(publicKey);

        console.log(`My SOL balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        assert(balance >= 0, "Balance should be greater than or equal to 0");
    });
});
