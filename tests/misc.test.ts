import { Misc } from "../src/misc/useful_tools";
import { assert } from 'console';

// npm test --file=tests/misc.test.ts
describe('Misc Class', () => {
    it('generateKeypair', () => {
        // Generate a new keypair
        const payer = Misc.generateKeypair();

        // Log the generated keypair's public key
        console.log(`Generated Keypair: ${payer.publicKey.toBase58()}`);

        // Assert that the public key is a valid Base58 string
        assert(payer.publicKey.toBase58().length > 0, "Generated public key should not be empty");
    });
});
