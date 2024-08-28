import { BroadcastChannel as BroadcastService } from 'broadcast-channel';
export interface BroadcastMessage {
    type: string;
    payload: any;
}
export declare class Broadcast {
    private bc;
    private channelId;
    constructor(channelId: string);
    get channel(): BroadcastService;
    addEventListener(handler: any): void;
    postMessage(message: BroadcastMessage): void;
}
