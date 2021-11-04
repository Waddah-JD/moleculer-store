import { promisify } from "util";
import { Service } from "moleculer";
import redis from "redis";

import BaseAdapter from "./base";
import { InvalidValueType, NonExistingKeyError } from "../errors";
import { isNumber, isBoolean, isStringifiedJSON } from "../utils/isType";
import { parseNumericRedisRespnseToBool } from "../utils/redis";

interface PromisifiedRedisClient extends redis.RedisClient {
  existsAsync?: (k: string) => Promise<number | string>;
  getAsync?: (k: string) => Promise<string>;
  setAsync?: (k: string, v: string) => Promise<string>;
  deleteAsync?: (k: string) => Promise<number | string>;
  keysAsync?: (k: string) => Promise<string[]>;
  clearAsync?: () => Promise<boolean>;
}

class RedisAdapter extends BaseAdapter {
  service: Service;
  store: PromisifiedRedisClient;
  opts?: redis.ClientOpts;

  constructor(opts?: redis.ClientOpts) {
    super();
    this.opts = opts;
  }

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
    this.store = redis.createClient(this.opts);
    this.store.existsAsync = promisify(this.store.exists).bind(this.store);
    this.store.getAsync = promisify(this.store.get).bind(this.store);
    this.store.setAsync = promisify(this.store.set).bind(this.store);
    this.store.deleteAsync = promisify(this.store.del).bind(this.store);
    this.store.keysAsync = promisify(this.store.keys).bind(this.store);
    this.store.clearAsync = promisify(this.store.flushdb).bind(this.store);
  }

  async disconnect(): Promise<void> {
    this.store.end(true);
  }

  async exists(k: Key): Promise<boolean> {
    const key = this.serialize(k);
    const keyExists = await this.store.existsAsync(key);
    return parseNumericRedisRespnseToBool(keyExists);
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

  async update(k: Key, v: Value): Promise<Value> {
    if (!(await this.exists(k))) throw new NonExistingKeyError(k);
    return this.set(k, v);
  }

  async delete(k: Key): Promise<boolean> {
    const key = this.serialize(k);
    const deleteSucceeded = await this.store.deleteAsync(key);
    return parseNumericRedisRespnseToBool(deleteSucceeded);
  }

  async keys(): Promise<Key[]> {
    return await this.store.keysAsync("*");
  }

  async values(): Promise<Value[]> {
    const keys = await this.keys();
    const values = [];
    for (const k of keys) {
      values.push(await this.get(k));
    }
    return values;
  }

  async clear(): Promise<void> {
    await this.store.clearAsync();
  }
}

export default RedisAdapter;
