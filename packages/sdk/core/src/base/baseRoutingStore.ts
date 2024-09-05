export abstract class BaseRoutingStore {
  store: any;
  constructor() {
    this.store = this.initStore();
  }
  abstract initStore(): any;

  abstract getKey(key: string): Promise<any>;

  abstract setKey(key: string, value: string): Promise<any>;

  protected abstract deleteKey(key: string): Promise<any>;

  protected abstract getKeys(): Promise<string[]>;
}
