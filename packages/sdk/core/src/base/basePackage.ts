import { GeinsCore } from '../geinsCore';
import type { GeinsEventMessage } from '@geins/types';
import { GeinsEventType } from '@geins/types';
export abstract class BasePackage {
  constructor(protected core: GeinsCore) {
    if (!core) {
      throw new Error('Core is required');
    }
    if (!core.client) {
      throw new Error('Merchant API Client is not set');
    }
    if (!core.credentials) {
      throw new Error('Credentials are required');
    }
  }

  protected pushEvent(
    eventMessage: GeinsEventMessage,
    eventName?: GeinsEventType,
  ) {
    const eventNameStr = eventName ? GeinsEventType[eventName] : undefined;
    if (eventNameStr && eventNameStr.includes('_')) {
      const parentEvent = eventNameStr.split('_')[0];
      this.core.events.push(eventMessage, parentEvent);
    }
    this.core.events.push(eventMessage, eventNameStr);
  }
}
