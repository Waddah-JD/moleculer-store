import { ServiceBroker, Errors } from "moleculer";

import serviceMixin from "./index";
import MemoryAdapter from "../adapters/memory";

const { ValidationError } = Errors;

describe("Service Mixin", () => {
  const broker = new ServiceBroker({ logger: false });
  const adapter = new MemoryAdapter();
  const service = broker.createService({
    name: "numbers",
    mixins: [serviceMixin],
    adapter,
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  afterEach(() => jest.clearAllMocks());

  describe("GET", () => {
    it("should throw a validation error if no param is passed", async () => {
      try {
        await broker.call("numbers.get");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if params is an empty object", async () => {
      try {
        await broker.call("numbers.get", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no param 'key' is passed", async () => {
      try {
        await broker.call("numbers.get", { keyz: "no" });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should call the get method and return the found value", async () => {
      const mockedGetFn = jest.fn(async () => 5);
      service.get = mockedGetFn;

      const foundDoc = await broker.call("numbers.get", { key: "current_count" });
      expect(foundDoc).toBe(5);
      expect(mockedGetFn).toBeCalledTimes(1);
      expect(mockedGetFn).toHaveBeenCalled();
    });
  });

  describe("SET", () => {
    it("should throw a validation error if no param is passed is passed", async () => {
      try {
        await broker.call("numbers.set");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if params is an empty object", async () => {
      try {
        await broker.call("numbers.set", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no 'key' param is passed", async () => {
      try {
        await broker.call("numbers.set", { keyz: "no", value: 69 });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no 'value' param is passed", async () => {
      try {
        await broker.call("numbers.set", { key: "no", valu: 69 });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should call the set method and return the found value", async () => {
      const mockedSetFn = jest.fn(async () => 6);
      service.set = mockedSetFn;

      const setValue = await broker.call("numbers.set", { key: "current_count", value: 6 });
      expect(setValue).toBe(6);
      expect(mockedSetFn).toBeCalledTimes(1);
      expect(mockedSetFn).toHaveBeenCalled();
    });
  });

  describe("EXISTS", () => {
    it("should throw a validation error if no param is passed", async () => {
      try {
        await broker.call("numbers.exists");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if params is an empty object", async () => {
      try {
        await broker.call("numbers.exists", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no param 'key' is passed", async () => {
      try {
        await broker.call("numbers.exists", { keyz: "no" });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should call the exists method and return a boolean", async () => {
      const mockedExistsFn = jest.fn(async () => true);
      service.exists = mockedExistsFn;

      const existsResult = await broker.call("numbers.exists", { key: "current_count" });
      expect(existsResult).toBe(true);
      expect(mockedExistsFn).toBeCalledTimes(1);
      expect(mockedExistsFn).toHaveBeenCalled();
    });
  });

  describe("UPDATE", () => {
    it("should throw a validation error if no param is passed is passed", async () => {
      try {
        await broker.call("numbers.update");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if params is an empty object", async () => {
      try {
        await broker.call("numbers.update", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no 'key' param is passed", async () => {
      try {
        await broker.call("numbers.update", { keyz: "no", value: 69 });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no 'value' param is passed", async () => {
      try {
        await broker.call("numbers.update", { key: "no", valu: 69 });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should call the set method and return the found value", async () => {
      const mockedUpdateFn = jest.fn(async () => 7);
      service.update = mockedUpdateFn;

      const updatedValue = await broker.call("numbers.update", { key: "current_count", value: 7 });
      expect(updatedValue).toBe(7);
      expect(mockedUpdateFn).toBeCalledTimes(1);
      expect(mockedUpdateFn).toHaveBeenCalled();
    });
  });

  describe("DELETE", () => {
    it("should throw a validation error if no param is passed", async () => {
      try {
        await broker.call("numbers.delete");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if params is an empty object", async () => {
      try {
        await broker.call("numbers.delete", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should throw a validation error if no param 'key' is passed", async () => {
      try {
        await broker.call("numbers.delete", { keyz: "no" });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it("should call the delete method and return a boolean", async () => {
      const mockedDeleteFn = jest.fn(async () => true);
      service.delete = mockedDeleteFn;

      const existsResult = await broker.call("numbers.delete", { key: "current_count" });
      expect(existsResult).toBe(true);
      expect(mockedDeleteFn).toBeCalledTimes(1);
      expect(mockedDeleteFn).toHaveBeenCalled();
    });
  });

  describe("KEYS", () => {
    it("should call the keys method and return a list of existing keys", async () => {
      const mockedKeysFn = jest.fn(async () => ["key 1", "key 2"]);
      service.keys = mockedKeysFn;

      const existsResult = await broker.call("numbers.keys");
      expect(existsResult).toStrictEqual(["key 1", "key 2"]);
      expect(mockedKeysFn).toBeCalledTimes(1);
      expect(mockedKeysFn).toHaveBeenCalled();
    });
  });

  describe("VALUES", () => {
    it("should call the values method and return a list of existing values", async () => {
      const mockedValuesFn = jest.fn(async () => ["value 1", "value 2"]);
      service.values = mockedValuesFn;

      const existsResult = await broker.call("numbers.values");
      expect(existsResult).toStrictEqual(["value 1", "value 2"]);
      expect(mockedValuesFn).toBeCalledTimes(1);
      expect(mockedValuesFn).toHaveBeenCalled();
    });
  });

  describe("CLEAR", () => {
    it("should call the clear method", async () => {
      const mockedClearFn = jest.fn(async () => undefined);
      service.clear = mockedClearFn;

      await broker.call("numbers.clear");
      expect(mockedClearFn).toBeCalledTimes(1);
      expect(mockedClearFn).toHaveBeenCalled();
    });
  });
});
