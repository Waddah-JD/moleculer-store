"use strict";

import { Context } from "moleculer";

import { keySchema, valueSchema, patternSchema } from "./params";

export default {
  name: "",

  adapter: null,

  actions: {
    exists: {
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key }>): Promise<boolean> {
        return await this.exists(ctx);
      },
    },

    get: {
      rest: "GET /:key",
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key }>): Promise<Value> {
        return await this.get(ctx);
      },
    },

    set: {
      rest: "POST /:key",
      params: { key: keySchema, value: valueSchema },
      async handler(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
        return await this.set(ctx);
      },
    },

    update: {
      rest: "PUT /:key",
      params: { key: keySchema, value: valueSchema },
      async handler(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
        return await this.update(ctx);
      },
    },

    delete: {
      rest: "DELETE /:key",
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key }>): Promise<boolean> {
        return await this.delete(ctx);
      },
    },

    keys: {
      params: { pattern: patternSchema },
      async handler(ctx: Context<{ pattern?: string }>): Promise<Key[]> {
        return await this.keys(ctx);
      },
    },

    values: {
      params: { pattern: patternSchema },
      async handler(ctx: Context<{ pattern?: string }>): Promise<Value[]> {
        return await this.values(ctx);
      },
    },

    clear: {
      rest: "DELETE /",
      async handler(): Promise<void> {
        return await this.clear();
      },
    },
  },

  methods: {
    async connect(): Promise<void> {
      return await this.adapter.connect();
    },

    async disconnect(): Promise<void> {
      return await this.adapter.disconnect();
    },

    async exists(ctx: Context<{ key: Key }>): Promise<boolean> {
      const params = ctx.params;
      const { key } = params;
      return await this.adapter.exists(key);
    },

    async get(ctx: Context<{ key: Key }>): Promise<Value> {
      const params = ctx.params;
      const { key } = params;
      return await this.adapter.get(key);
    },

    async set(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
      const params = ctx.params;
      const { key, value } = params;
      return await this.adapter.set(key, value);
    },

    async update(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
      const params = ctx.params;
      const { key, value } = params;
      return await this.adapter.update(key, value);
    },

    async delete(ctx: Context<{ key: Key }>): Promise<boolean> {
      const params = ctx.params;
      const { key } = params;
      return await this.adapter.delete(key);
    },

    async keys(ctx: Context<{ pattern?: string }>): Promise<Key[]> {
      const { params } = ctx;
      return await this.adapter.keys(params.pattern);
    },

    async values(ctx: Context<{ pattern?: string }>): Promise<Value[]> {
      const { params } = ctx;
      return await this.adapter.values(params.pattern);
    },

    async clear(): Promise<void> {
      return await this.adapter.clear();
    },
  },

  created(): void {
    this.adapter = this.schema.adapter;

    this.adapter.init(this);
  },

  started(): Promise<void> {
    if (this.adapter) {
      return new Promise((resolve) => {
        const connecting = () => {
          this.connect()
            .then(resolve)
            .catch((err) => {
              this.logger.error("Connection error!", err);
              setTimeout(() => {
                this.logger.warn("Reconnecting...");
                connecting();
              }, 1000);
            });
        };

        connecting();
      });
    }

    return Promise.reject(new Error("Please set the store adapter in schema!"));
  },

  stopped(): Promise<void> {
    if (this.adapter) return this.disconnect();
  },
};
