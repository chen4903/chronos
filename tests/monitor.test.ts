import { Keypair, PublicKey } from '@solana/web3.js';
import TGBot from '../src/monitor/tg_bot';
import fs from "fs";
import dotenv from 'dotenv';

async function run() {
    dotenv.config();

    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!botToken || !chatId) {
        throw new Error("Environment variables TG_BOT_TOKEN and TG_CHAT_ID are required");
    }

    const loadWallet = () => {
        const secretKeyPath = "/Users/levi/.config/solana/id.json";
        const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(secretKeyPath, "utf-8")));
        return Keypair.fromSecretKey(secretKey);
    };

    const wallet = loadWallet();

    const bot = new TGBot("https://api.mainnet-beta.solana.com", "confirmed", wallet, botToken, chatId);

    const publicKey = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
    await bot.onAccountChange(publicKey)
}

run()