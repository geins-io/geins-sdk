import NodeCache from '@cacheable/node-cache';
import { BaseStore } from '../base';

const ttlSeconds = 60 * 60 * 24; // 24 hours

export class ChannelStore extends BaseStore {
  override store: NodeCache;

  constructor() {
    super();
    this.store = this.initStore();
  }

  initStore() {
    return new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  async getKey(from: string): Promise<any> {
    return this.store.get(from);
  }
  async setKey(from: string, to: string) {
    return this.store.set(from, to);
  }
  async deleteKey(from: string) {
    return this.store.del(from);
  }
  async getKeys() {
    return this.store.keys();
  }
}
