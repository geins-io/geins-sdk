import type { GeinsEventMessage } from '@geins/types';
import { BroadcastChannel } from 'broadcast-channel';
import EventEmitter from 'eventemitter3';
import { isServerContext } from '../utils';

/** In-process event bus with BroadcastChannel support for cross-tab communication. */
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
      this.broadcast.onmessage = (data: unknown) => {
        const msg = data as { eventName: string; eventMessage: GeinsEventMessage };
        this.emitter.emit(msg.eventName, msg.eventMessage);
      };
    }
  }

  /** Subscribe to events. Fires on every matching event until removed. */
  listenerAdd(handler: (data: GeinsEventMessage) => void, eventName: string = this.eventName): void {
    this.emitter.on(eventName, handler);
  }

  /** Subscribe to a single occurrence of an event, then auto-remove. */
  listenerOnce(handler: (data: GeinsEventMessage) => void, eventName: string = this.eventName): void {
    this.emitter.once(eventName, handler);
  }

  /** Remove all listeners for the given event name. */
  listenerRemove(eventName: string = this.eventName): void {
    this.emitter.removeAllListeners(eventName);
  }

  /** Get the number of listeners for an event. */
  listenerCount(eventName: string = this.eventName): number {
    return this.emitter.listenerCount(eventName);
  }

  /** Get all listeners for an event. */
  listenersGet(eventName: string = this.eventName): ((...args: unknown[]) => void)[] {
    return this.emitter.listeners(eventName);
  }

  /** Emit an event locally and broadcast it to other browser tabs via BroadcastChannel. */
  push(eventMessage: GeinsEventMessage, eventName: string = this.eventName): void {
    this.emitter.emit(eventName, eventMessage);
    if ((eventMessage.broadcast ?? true) && this.broadcast) {
      this.broadcast.postMessage({ eventMessage, eventName });
    }
  }
}
