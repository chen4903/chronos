import {
    Commitment,
    Connection,
    Keypair,
    PublicKey,
} from '@solana/web3.js';
import axios from 'axios';

class TGBot {
    public connection: Connection;
    public wallet: Keypair;
    public botToken: string;
    public chatId: string;

    constructor(rpcUrl: string, commitment: Commitment, wallet: Keypair, botToken: string, chatId: string) {
        this.connection = new Connection(rpcUrl, commitment);
        this.wallet = wallet
        this.botToken = botToken
        this.chatId = chatId
    }

    public async sendMessage(message: string) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    
        try {
            await axios.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            });
    
        } catch (error: any) {
            console.error('Error sending message:', error.message);
        }
    }

    public async onAccountChange(publicKey: PublicKey) {
        this.connection.onAccountChange(
            publicKey,
            async () => {
                const sig = await this.connection.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
                await this.sendMessage(`New trasaction!\n\nhttps://solscan.io/tx/${sig[0].signature}`)
            }
        );
    }
}

export default TGBot