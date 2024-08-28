import events from 'events';
import { BroadcastChannel } from 'broadcast-channel';
import { isServerContext } from '../utils';

interface EventData {
  type: string;
  payload: any;
}
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

  addBroadcastListener() {
    if (this.broadcast) {
      this.broadcast.onmessage = (data: any) => {
        this.emitter.emit(data.eventName, data.data);
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

  push(data?: any, eventName: string = this.eventName) {
    this.emitter.emit(eventName, data);
    if (this.broadcast) {
      this.broadcast?.postMessage({ data, eventName });
    }
  }
}
