import { Service } from "moleculer";

import BaseAdapter from "./base";
import { NonExistingKeyError } from "../errors";

class MemoryAdapter extends BaseAdapter {
  service: Service;
  store: Map<Key, Value>;

  init(service: Service): void {
    this.service = service;
  }

  async connect(): Promise<void> {
    this.store = new Map();
  }

  async disconnect(): Promise<void> {
    this.store = null;
  }

  async exists(key: Key): Promise<boolean> {
    return this.store.has(key);
  }

  async get(key: Key): Promise<Value> {
    return this.store.get(key);
  }

  async set(key: Key, value: Value): Promise<Value> {
    this.store.set(key, value);
    return value;
  }

  async update(key: Key, value: Value): Promise<Value> {
    if (!this.exists(key)) throw new NonExistingKeyError(key);

    return this.set(key, value);
  }

  async delete(key: Key): Promise<boolean> {
    return this.store.delete(key);
  }

  async keys(): Promise<Key[]> {
    return Array.from(this.store.keys());
  }

  async values(): Promise<Value[]> {
    return Array.from(this.store.values());
  }

  async clear(): Promise<void> {
    return this.store.clear();
  }
}

export default MemoryAdapter;
