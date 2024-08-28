export declare class EventService {
    private eventName;
    private emitter;
    private broadcast;
    private broadcastChannelId;
    constructor();
    addBroadcastListener(): void;
    listnerAdd(handler: any, eventName?: string): void;
    listnerOnce(handler: any, eventName?: string): void;
    listnerRemove(eventName?: string): void;
    listnerRemoveAll(eventName?: string): void;
    listnerCount(eventName?: string): any;
    listnersGet(eventName?: string): any;
    push(data?: any, eventName?: string): void;
}
