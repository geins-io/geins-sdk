import type { GeinsEventMessage } from '@geins/types';
import { BroadcastChannel } from 'broadcast-channel';
import EventEmitter from 'eventemitter3';
import { isServerContext } from '../utils';

export class EventService {
  private eventName: string = 'geins-event';
  private emitter = new EventEmitter();
  private broadcast: BroadcastChannel | undefined;
  private broadcastChannelId: string = 'geins-channel';

  constructor() {
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

  /**
   * Add a persistent event listener.
   */
  listenerAdd(handler: (data: any) => void, eventName: string = this.eventName): void {
    this.emitter.on(eventName, handler);
  }

  /**
   * Add a one-time event listener.
   */
  listenerOnce(handler: (data: any) => void, eventName: string = this.eventName): void {
    this.emitter.once(eventName, handler);
  }

  /**
   * Remove all listeners for an event.
   */
  listenerRemove(eventName: string = this.eventName): void {
    this.emitter.removeAllListeners(eventName);
  }

  /**
   * Get the number of listeners for an event.
   */
  listenerCount(eventName: string = this.eventName): number {
    return this.emitter.listenerCount(eventName);
  }

  /**
   * Get all listeners for an event.
   */
  listenersGet(eventName: string = this.eventName): any[] {
    return this.emitter.listeners(eventName);
  }

  /**
   * Emit an event and broadcast it to other tabs.
   */
  push(eventMessage: GeinsEventMessage, eventName: string = this.eventName): void {
    this.emitter.emit(eventName, eventMessage);
    if ((eventMessage.broadcast ?? true) && this.broadcast) {
      this.broadcast.postMessage({ eventMessage, eventName });
    }
  }
}
