import { promisify } from "util";
import { Service } from "moleculer";
import redis from "redis";

import BaseAdapter from "./base";
import { InvalidValueType, NonExistingKeyError } from "../errors";
import { isNumber, isBoolean, isStringifiedJSON } from "../utils/isType";
import { parseNumberRespnseToBool } from "../utils/redis";

interface PromisifiedRedisClient extends redis.RedisClient {
  existsAsync?: (k: string) => Promise<number>;
  getAsync?: (k: string) => Promise<string>;
  setAsync?: (k: string, v: string) => Promise<string>;
}

class RedisAdapter extends BaseAdapter {
  service: Service;
  store: PromisifiedRedisClient;

  serialize(value: Value): string {
    switch (typeof value) {
      case "number":
        return value.toString();
      case "string":
        return value;
      case "boolean":
        return value ? "true" : "false";
      case "object":
        return JSON.stringify(value);
      default:
        throw new InvalidValueType(value);
    }
  }

  deserialize(value: string): Value {
    if (isNumber(value)) return +value;
    if (isBoolean(value)) return value === "true";
    if (isStringifiedJSON(value)) return JSON.parse(value);
    return value;
  }

  init(service: Service): void {
    this.service = service;
  }

  async connect(): Promise<void> {
    this.store = redis.createClient(6379, "127.0.0.1");
    this.store.existsAsync = promisify(this.store.exists).bind(this.store);
    this.store.getAsync = promisify(this.store.get).bind(this.store);
    this.store.setAsync = promisify(this.store.set).bind(this.store);
  }

  async disconnect(): Promise<void> {
    this.store.end(true);
  }

  async exists(k: Key): Promise<boolean> {
    const key = this.serialize(k);
    const keyExists = await this.store.existsAsync(key);
    return parseNumberRespnseToBool(keyExists);
  }

  async get(k: Key): Promise<Value> {
    const key = this.serialize(k);
    const v = await this.store.getAsync(key);
    return v ? this.deserialize(v) : undefined;
  }

  async set(k: Key, v: Value): Promise<Value> {
    const key = this.serialize(k);
    const value = this.serialize(v);
    await this.store.setAsync(key, value);
    return v;
  }

  async update(key: Key, value: Value): Promise<Value> {
    if (!(await this.exists(key))) throw new NonExistingKeyError(key);
    return this.set(key, value);
  }

  async delete(key: Key): Promise<boolean> {
    // TODO implement me
  }

  async keys(): Promise<Key[]> {
    // TODO implement me
  }

  async values(): Promise<Value[]> {
    // TODO implement me
  }

  async clear(): Promise<void> {
    // TODO implement me
  }
}

export default RedisAdapter;
