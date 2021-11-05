/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Service } from "moleculer";

class BaseAdapter {
  init(service: Service) {
    throw new Error("'init' method must be overriden by adapter");
  }

  async connect() {
    throw new Error("'connect' method must be overriden by adapter");
  }

  async disconnect() {
    throw new Error("'disconnect' method must be overriden by adapter");
  }

  async exists(key: Key): Promise<boolean> {
    throw new Error("'exists' method must be overriden by adapter");
  }

  async get(key: Key): Promise<Value> {
    throw new Error("'get' method must be overriden by adapter");
  }

  async set(key: Key, value: Value): Promise<Value> {
    throw new Error("'get' method must be overriden by adapter");
  }

  async update(key: Key, value: Value): Promise<Value> {
    throw new Error("'update' method must be overriden by adapter");
  }

  async delete(key: Key): Promise<boolean> {
    throw new Error("'delete' method must be overriden by adapter");
  }

  async keys(pattern = "*"): Promise<Key[]> {
    throw new Error("'keys' method must be overriden by adapter");
  }

  async values(pattern = "*"): Promise<Value[]> {
    throw new Error("'values' method must be overriden by adapter");
  }

  async clear(): Promise<void> {
    throw new Error("'clear' method must be overriden by adapter");
  }
}

export default BaseAdapter;
