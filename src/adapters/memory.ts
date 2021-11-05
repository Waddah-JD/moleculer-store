import { Service } from "moleculer";

import BaseAdapter from "./base";
import { NonExistingKeyError } from "../errors";
import { createRegExpFromGlobPattern } from "../utils/regex";

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
    if (!(await this.exists(key))) throw new NonExistingKeyError(key);

    return this.set(key, value);
  }

  async delete(key: Key): Promise<boolean> {
    return this.store.delete(key);
  }

  async keys(pattern = "*"): Promise<Key[]> {
    const regExp = createRegExpFromGlobPattern(pattern);

    return Array.from(this.store.keys()).filter((k) => regExp.test(`${k}`));
  }

  async values(pattern = "*"): Promise<Value[]> {
    const matchedKeys = await this.keys(pattern);
    const values = [];
    for (const k of matchedKeys) {
      values.push(await this.get(k));
    }
    return values;
  }

  async clear(): Promise<void> {
    return this.store.clear();
  }

  async size(): Promise<number> {
    return this.store.size;
  }
}

export default MemoryAdapter;
