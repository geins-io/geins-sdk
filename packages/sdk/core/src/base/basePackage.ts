import type { GeinsEventMessage, GeinsSettings } from '@geins/types';
import { GeinsEventType } from '@geins/types';
import type { MerchantApiClient } from '../api-client/merchantApiClient';
import type { ApiClientGetter } from '../base/baseApiService';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';
import { GeinsCore } from '../geinsCore';
/**
 * Abstract base class for domain packages (CRM, CMS, OMS).
 * Provides access to the shared API client, settings, and event bus from {@link GeinsCore}.
 */
export abstract class BasePackage {
  protected _geinsSettings: GeinsSettings;
  protected _apiClient: ApiClientGetter;

  constructor(protected core: GeinsCore) {
    if (!core) {
      throw new GeinsError('Core is required', GeinsErrorCode.NOT_INITIALIZED);
    }
    if (!core.client) {
      throw new GeinsError('Merchant API Client is not set', GeinsErrorCode.NOT_INITIALIZED);
    }
    if (!core.geinsSettings) {
      throw new GeinsError('Settings are required', GeinsErrorCode.NOT_INITIALIZED);
    }
    const { geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => core.client;
  }

  /** Emit an event through the core event bus. Automatically dispatches to the parent event category. */
  protected pushEvent(eventMessage: GeinsEventMessage, eventName?: GeinsEventType) {
    const eventNameStr = eventName ? GeinsEventType[eventName] : undefined;
    if (eventNameStr && eventNameStr.includes('_')) {
      const parentEvent = eventNameStr.split('_')[0];
      this.core.events.push(eventMessage, parentEvent);
    }
    this.core.events.push(eventMessage, eventNameStr);
  }

  /** Returns the {@link GeinsCore} instance this package was created with. */
  public getCore() {
    return this.core;
  }
}
