import { Service } from "moleculer";

import BaseAdapter from "./base";
import { NonExistingKeyError } from "../errors/memoryAdapter";

class MemoryAdapter extends BaseAdapter {
  service: Service;
  store: Map<Key, Value>;

  init(service: Service): void {
    this.service = service;
  }

  connect(): void {
    this.store = new Map();
  }

  disconnect(): void {
    this.store = null;
  }

  exists(key: Key): boolean {
    return this.store.has(key);
  }

  get(key: Key): Value {
    return this.store.get(key);
  }

  set(key: Key, value: Value): Value {
    this.store.set(key, value);
    return value;
  }

  update(key: Key, value: Value): Value {
    if (!this.exists(key)) throw new NonExistingKeyError(key);

    return this.set(key, value);
  }

  delete(key: Key): boolean {
    return this.store.delete(key);
  }

  keys(): Key[] {
    return Array.from(this.store.keys());
  }
}

export default MemoryAdapter;
