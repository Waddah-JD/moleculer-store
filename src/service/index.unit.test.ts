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

      const foundDoc = await broker.call("numbers.set", { key: "current_count", value: 6 });
      expect(foundDoc).toBe(6);
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

      const foundDoc = await broker.call("numbers.exists", { key: "current_count" });
      expect(foundDoc).toBe(true);
      expect(mockedExistsFn).toBeCalledTimes(1);
      expect(mockedExistsFn).toHaveBeenCalled();
    });
  });
});
