import events from 'events';
import { BroadcastChannel } from 'broadcast-channel';
import { isServerContext } from '../utils';
import type { GeinsEventMessage } from '@geins/types';

export class EventService {
  private eventName: string = 'geins-event';
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

  private addBroadcastListener() {
    if (this.broadcast) {
      this.broadcast.onmessage = (data: any) => {
        this.emitter.emit(data.eventName, data.eventMessage);
      };
    }
  }

  listnerAdd(handler: any, eventName: string = this.eventName) {
    this.emitter.on(eventName, handler);
  }

  listnerOnce(handler: any, eventName: string = this.eventName) {
    this.emitter.once(eventName, handler);
  }

  listnerRemove(eventName: string = this.eventName) {
    this.emitter.removeAllListeners(eventName);
  }

  listnerRemoveAll(eventName: string = this.eventName) {
    this.emitter.removeAllListeners(eventName);
  }

  listnerCount(eventName: string = this.eventName) {
    return this.emitter.listenerCount(eventName);
  }

  listnersGet(eventName: string = this.eventName) {
    return this.emitter.listeners(eventName);
  }

  push(eventMessage?: GeinsEventMessage, eventName: string = this.eventName) {
    this.emitter.emit(eventName, eventMessage);
    if (this.broadcast) {
      this.broadcast?.postMessage({ eventMessage, eventName });
    }
  }
}
