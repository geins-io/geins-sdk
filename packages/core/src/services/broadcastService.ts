// https://github.com/pubkey/broadcast-channel
import { BroadcastChannel as BroadcastService } from 'broadcast-channel';
export interface BroadcastMessage {
    type: string;
    payload: any;
}

export class Broadcast {
   private bc: BroadcastService<BroadcastMessage> | undefined;
   private channelId: string | undefined;
   constructor(channelId: string) {
        this.channelId = channelId;
        try {
            this.bc = new BroadcastService(channelId);
        } catch (error) {
            console.error('Broadcast Channel initialization failed', error);
        }
    }

    get channel(): BroadcastService {
        if (!this.bc) {
            throw new Error('Broadcast Channel not initialized');
        }
        return this.bc;
    }

    addEventListener(handler: any) {
        this.channel.removeEventListener('message', handler);
        this.channel.addEventListener('message', (message) => {
            handler(message);
        });
    }

    postMessage(message: BroadcastMessage) {
        this.channel.postMessage(message);
    }

}

