import { Misc } from "../src/misc/useful_tools";

function testGenerateKeypair() {
    const payer = Misc.generateKeypair();
    console.log(`Generated Keypair: ${payer.publicKey.toBase58()}`);
}

function runTestCases() {
    testGenerateKeypair()
}

runTestCases()