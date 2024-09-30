import { EventEmitter } from 'events';
import { BroadcastChannel } from 'broadcast-channel';
import { isServerContext } from '../utils';
import type { GeinsEventMessage } from '@geins/types';
import { logWrite } from './logService';

/**
 * Event service
 * Responsible for handling events and broadcasting them to other windows and tabs.
 *
 * @class
 * @name EventService
 *
 */
export class EventService {
  private eventName: string = 'geins-event';
  private emitter: any;
  private broadcast: BroadcastChannel | undefined;
  private broadcastChannelId: string = 'geins-channel';
  constructor() {
    this.emitter = new EventEmitter();
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
   * Adds a presistent event listener to the event emitter.
   * @param handler A callback function that handles the event data.
   * @param eventName (optional): The name of the event to listen for. If omitted, it defaults to 'geins-event'.
   */
  listnerAdd(handler: any, eventName: string = this.eventName): void {
    this.emitter.on(eventName, handler);
  }

  /**
   * Adds a one-time event listener for the specified event. This listener will be invoked only the first time the event is emitted and then automatically removed.
   * @param handler A callback function that handles the event data.
   * @param eventName (optional): The name of the event to listen for. If omitted, it defaults to 'geins-event'.
   */
  listnerOnce(handler: any, eventName: string = this.eventName): void {
    this.emitter.once(eventName, handler);
  }
  /**
   * Removes the specified event listener from the event emitter.   *
   * @param eventName (optional): The name of the event to listen for. If omitted, it defaults to 'geins-event'.
   */
  listnerRemove(eventName: string = this.eventName): void {
    this.emitter.removeAllListeners(eventName);
  }
  /**
   * Returns the number of listeners for the specified event.
   * @param eventName (optional): The name of the event to listen for. If omitted, it defaults to 'geins-event'.
   */
  listnerCount(eventName: string = this.eventName): number {
    return this.emitter.listenerCount(eventName);
  }
  /**
   * Lists the listeners for the specified event.
   * @param eventName
   * @returns An array of listeners for the specified event.
   */
  listnersGet(eventName: string = this.eventName): any[] {
    return this.emitter.listeners(eventName);
  }
  /**
   * Pushes an event message to the event emitter.
   * @param eventMessage - The event message to push.
   * @param eventName - The name of the event to push the message to. If omitted, it defaults to 'geins-event'.
   */
  push(
    eventMessage: GeinsEventMessage,
    eventName: string = this.eventName,
  ): void {
    this.emitter.emit(eventName, eventMessage);
    if ((eventMessage.broadcast ?? true) && this.broadcast) {
      this.broadcast?.postMessage({ eventMessage, eventName });
    }
  }
}
