export abstract class BaseStore {
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

export interface IStore {
  setKey(key: string, value: string): Promise<void>;
  getKey(key: string): Promise<string | null>;
  getKeys(): Promise<string[]>;
}
