import { BroadcastChannel } from 'broadcast-channel';

import { isServerContext } from '../utils';
import events from 'events';

export class EventService {
  private emitter: any;
  private broadcast: BroadcastChannel | undefined;
  private broadcastChannelId: string = 'geins-channel';
  constructor() {
    this.emitter = new events.EventEmitter();
    if (!isServerContext()) {
      this.broadcast = new BroadcastChannel(this.broadcastChannelId);
      this.addBroadcastListener();
    }
  }

  addBroadcastListener() {
    if (this.broadcast) {
      this.broadcast.onmessage = (event: any) => {
        console.log('3. broadcast message', event);
        //const data = event.data.payload;
        this.emitter.emit(event.data.type, event.data.payload);
      };
    }
  }

  listnerAdd(eventName: string, handler: any) {
    this.emitter.on(eventName, handler);
  }

  listnerOnce(eventName: string, handler: any) {
    this.emitter.once(eventName, handler);
  }

  listnerRemove(eventName: string, handler: any) {
    this.emitter.removeAllListeners(eventName);
  }

  listnerRemoveAll(eventName: string) {
    this.emitter.removeAllListeners(eventName);
  }

  listnerCount(eventName: string) {
    return this.emitter.listenerCount(eventName);
  }

  listnersGet(eventName: string) {
    return this.emitter.listeners(eventName);
  }

  push(eventName: string, data?: any) {
    console.log('1. push', eventName, data);
    this.emitter.emit(eventName, data);
    if (this.broadcast) {
      console.log('2. broadcast push', eventName, data);
      this.broadcast?.postMessage({ type: eventName, payload: data });
    }
  }
}
