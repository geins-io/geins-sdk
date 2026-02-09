import { NodeCache } from '@cacheable/node-cache';
import { IStore } from '../base';

const TTL_SECONDS = 60 * 60 * 24; // 24 hours

export class ChannelStore implements IStore {
  private store: NodeCache | undefined;

  constructor() {
    this.initStore();
  }

  initStore() {
    this.store = new NodeCache({
      stdTTL: TTL_SECONDS,
      checkperiod: TTL_SECONDS * 0.2,
      useClones: false,
    });
  }

  async setKey(from: string, to: string): Promise<void> {
    if (this.store !== undefined) {
      this.store.set(from, to);
    }
  }

  async getKey(from: string): Promise<string | null> {
    if (this.store !== undefined) {
      return this.store.get(from);
    }
    return null;
  }

  async getKeys(): Promise<string[]> {
    if (this.store === undefined) {
      return [];
    }
    return this.store.keys();
  }

  async deleteKey(key: string): Promise<void> {
    if (this.store !== undefined) {
      await this.store.del(key);
    }
  }

  async hasKey(from: string): Promise<boolean> {
    if (this.store === undefined) {
      return false;
    }
    return this.store.has(from);
  }

  async clearStore(): Promise<void> {
    if (this.store !== undefined) {
      this.store.flushAll();
      this.store.close();
    }
  }

  async destroy(): Promise<void> {
    await this.clearStore();
    this.store = undefined;
  }
}
