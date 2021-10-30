import { ServiceBroker } from "moleculer";

import serviceMixin from "./index";
import MemoryAdapter from "../adapters/memory";
import { NonExistingKeyError } from "../errors/memoryAdapter";

const adapter = new MemoryAdapter();

beforeAll(() => adapter.connect());
afterAll(() => adapter.disconnect());

describe("Service with a memory adapter", () => {
  describe("Direct action calls", () => {
    const broker = new ServiceBroker({ logger: false });
    broker.createService({
      name: "numbers",
      mixins: [serviceMixin],
      adapter: new MemoryAdapter(),
    });

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    it("should return false for non-existing key", async () => {
      const nonExistingValue = await broker.call("numbers.exists", { key: "nonExisting" });
      expect(nonExistingValue).toEqual(false);
    });

    it("should return undefined for a non-existing key", async () => {
      const notFoundValue = await broker.call("numbers.get", { key: "nonExisting" });
      expect(notFoundValue).toBeUndefined();
    });

    it("should return a new value after set", async () => {
      const newValue = await broker.call("numbers.set", { key: "currentCount", value: 5 });
      expect(newValue).toEqual(5);
    });

    it("should return true for an existing key", async () => {
      const existingValue = await broker.call("numbers.exists", { key: "currentCount" });
      expect(existingValue).toEqual(true);
    });

    it("should return found value for an existing key", async () => {
      const existingValue = await broker.call("numbers.get", { key: "currentCount" });
      expect(existingValue).toEqual(5);
    });

    it("should update an existing value and return updated value", async () => {
      const newValue = await broker.call("numbers.update", { key: "currentCount", value: 6 });
      expect(newValue).toEqual(6);
    });

    it("should throw a NonExistingKeyError while trying to update a value of a non-existing key", async () => {
      try {
        await broker.call("numbers.update", { key: "previousCount", value: 6 });
      } catch (error) {
        expect(error).toBeInstanceOf(NonExistingKeyError);
      }
    });
  });
});
