import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";

export class Misc {
  
  // generate and save to a file
  static generateKeypair(): Keypair {
    const wallet = Keypair.generate();

    const secretKey = wallet.secretKey;

    const nextFileName = this.getNextWalletFileName();

    fs.writeFileSync(nextFileName, JSON.stringify(Array.from(secretKey)));
    console.log(`Wallet saved to ${nextFileName}`);

    return wallet;
  }

  private static getNextWalletFileName(): string {
    const baseDir = "archive";
    const baseName = "wallet_";
    const extension = ".json";

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const files = fs.readdirSync(baseDir).filter(file => file.startsWith(baseName) && file.endsWith(extension));

    const numbers = files.map(file => {
      const match = file.match(/wallet_(\d+)\.json/);
      return match ? parseInt(match[1], 10) : 0;
    });

    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

    return path.join(baseDir, `${baseName}${nextNumber}${extension}`);
  }
}