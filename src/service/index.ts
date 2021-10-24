"use strict";

import { Context } from "moleculer";

import { keySchema } from "./params";

export default {
  name: "",

  adapter: null,

  actions: {
    get: {
      params: { key: keySchema },
      rest: { method: "GET", path: "/" },
      async handler(ctx: Context<{ key: Key }>): Promise<Value> {
        return await this.get(ctx);
      },
    },

    set: {
      params: { key: keySchema },
      rest: { method: "POST", path: "/" },
      async handler(ctx: Context<{ key: Key; value: Value }>): Promise<Value> {
        return await this.set(ctx);
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

    async get(ctx: Context<{ key: Key }>): Promise<void> {
      const params = ctx.params;
      const { key } = params;
      return await this.adapter.get(key);
    },

    async set(ctx: Context<{ key: Key; value: Value }>): Promise<void> {
      const params = ctx.params;
      const { key, value } = params;
      return await this.adapter.set(key, value);
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
