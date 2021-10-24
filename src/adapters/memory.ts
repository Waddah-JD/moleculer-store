import { Service } from "moleculer";

import BaseAdapter from "./base";

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

  get(key: Key): Value {
    return this.store.get(key);
  }

  set(key: Key, value: Value): Value {
    this.store.set(key, value);
    return value;
  }
}

export default MemoryAdapter;
