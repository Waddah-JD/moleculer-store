"use strict";

import { Context } from "moleculer";

import { keySchema } from "./params";

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
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key }>): Promise<Value> {
        return await this.get(ctx);
      },
    },

    set: {
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
        return await this.set(ctx);
      },
    },

    update: {
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
        return await this.update(ctx);
      },
    },

    delete: {
      params: { key: keySchema },
      async handler(ctx: Context<{ key: Key }>): Promise<boolean> {
        return await this.delete(ctx);
      },
    },

    keys: {
      async handler(): Promise<Key[]> {
        return await this.keys();
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

    async keys(): Promise<Key[]> {
      return await this.adapter.keys();
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
