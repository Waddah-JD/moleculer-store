import RedisAdapter from "./redis";
import { NonExistingKeyError } from "../errors";

describe("Redis Adapter", () => {
  const adapter = new RedisAdapter();
  beforeAll(() => adapter.connect());
  afterAll(() => adapter.disconnect());

  it("should return false for non-existing key", async () => {
    const valueExists = await adapter.exists("non_existing_key");
    expect(valueExists).toBe(false);
  });

  it("should set a string value", async () => {
    const str = await adapter.set("strKey", "I'm a string");
    expect(str).toEqual("I'm a string");

    const strExists = await adapter.exists("strKey");
    expect(strExists).toBe(true);

    const retrievedStr = await adapter.get("strKey");
    expect(retrievedStr).toBe("I'm a string");
  });

  it("should set a numeric value", async () => {
    const num = await adapter.set("numKey", 5);
    expect(num).toEqual(5);

    const numExists = await adapter.exists("numKey");
    expect(numExists).toBe(true);

    const retrievedNum = await adapter.get("numKey");
    expect(retrievedNum).toBe(5);
  });

  it("should set a boolean value", async () => {
    const bool = await adapter.set("boolKey", false);
    expect(bool).toEqual(false);
  });

  it("should set a object value", async () => {
    const o = { str: "string", bool: true, num: 3, nested: { OK: "yes" } };
    const obj = await adapter.set("objKey", o);
    expect(obj).toStrictEqual(o);
  });

  it("should override the value for an existing key", async () => {
    const overridenStr = await adapter.set("strKey", "I'm the new string");
    expect(overridenStr).toEqual("I'm the new string");
  });

  it("should return undefined for a non-existing key", async () => {
    const valExists = await adapter.exists("non_existing_key");
    expect(valExists).toBe(false);

    const retrievedNonExistingval = await adapter.get("non_existing_key");
    expect(retrievedNonExistingval).toBeUndefined();
  });

  it("should throw an error while trying to update a key that doesn't exist", async () => {
    try {
      await adapter.update("i_am_not_here", "value");
    } catch (error) {
      expect(error).toBeInstanceOf(NonExistingKeyError);
      expect(error.message).toBe("key 'i_am_not_here' doesn't exist");
    }
  });

  it("should update a value of a key that exists", async () => {
    const updatedNum = await adapter.update("numKey", 51);
    expect(updatedNum).toBe(51);

    const retrievedNum = await adapter.get("numKey");
    expect(retrievedNum).toBe(51);
  });

  it("should try to delete an entry and return true if key exists", async () => {
    const deleteSucceeded = await adapter.delete("numKey");
    expect(deleteSucceeded).toBe(true);
  });

  it("should try to delete an entry and return false if key doesn't exist", async () => {
    const deleteSucceeded = await adapter.delete("numKey");
    expect(deleteSucceeded).toBe(false);
  });

  it("should return all keys if no pattern is passed", async () => {
    const keys = await adapter.keys();
    expect(keys.length).toBe(3);
    expect(keys).toEqual(expect.arrayContaining(["strKey", "objKey", "boolKey"]));
  });

  it("should return all keys  matching passed pattern", async () => {
    await adapter.set("strThing", "just for test"); // adding a new key that starts with 'str'
    const keys = await adapter.keys("str*");
    expect(keys.length).toBe(2);
    expect(keys).toEqual(expect.arrayContaining(["strKey", "strThing"]));
  });

  it("should return all values if no pattern is passed", async () => {
    const values = await adapter.values();
    expect(values.length).toBe(4);
    expect(values).toEqual(
      expect.arrayContaining([
        "I'm the new string",
        { bool: true, nested: { OK: "yes" }, num: 3, str: "string" },
        false,
        "just for test",
      ])
    );
  });

  it("should retun only values whose key mathc the passed pattern", async () => {
    const keys = await adapter.values("str*");
    expect(keys.length).toBe(2);
    expect(keys).toEqual(expect.arrayContaining(["I'm the new string", "just for test"]));
  });

  it("should return size of store", async () => {
    const size = await adapter.size();
    expect(size).toEqual(4);
  });

  it("should delete all keys on calling 'clear'", async () => {
    const clearReturn = await adapter.clear();
    expect(clearReturn).toBeUndefined();

    const keys = await adapter.keys();
    expect(keys).toStrictEqual([]);

    const vals = await adapter.values();
    expect(vals).toStrictEqual([]);

    const size = await adapter.size();
    expect(size).toEqual(0);
  });
});
