import MemoryAdapter from "./memory";
import { NonExistingKeyError } from "../errors/";

describe("Memory Adapter", () => {
  const adapter = new MemoryAdapter();

  beforeAll(() => adapter.connect());
  afterAll(() => adapter.disconnect());

  it("should return false for non-existing key", async () => {
    const valueExists = await adapter.exists("non_existing_key");
    expect(valueExists).toBe(false);
  });

  it("should return true for an existing key", async () => {
    await adapter.set("an_existing_key", "some_value");
    const valueExists = await adapter.exists("an_existing_key");
    expect(valueExists).toBe(true);
  });

  it("should set a new value for an existing key and return set value", async () => {
    const totallyNew = await adapter.set("a_totally_new_key", "value_1");
    expect(totallyNew).toBe("value_1");

    const retrievedTotallyNew = await adapter.get("a_totally_new_key");
    expect(retrievedTotallyNew).toBe("value_1");
  });

  it("should override the value for an existing key and return set value", async () => {
    const overridenVal = await adapter.set("an_existing_key", "value_2");
    expect(overridenVal).toBe("value_2");

    const retrievedOverridenVal = await adapter.get("an_existing_key");
    expect(retrievedOverridenVal).toBe("value_2");
  });

  it("should return undefined for a non-existing key", async () => {
    const nonExisting = await adapter.get("non_existing_key");
    expect(nonExisting).toBe(undefined);
  });

  it("should throw an error while trying to update a key that doesn't exist", async () => {
    try {
      await adapter.update("non_existing_key", "value");
    } catch (error) {
      expect(error).toBeInstanceOf(NonExistingKeyError);
      expect(error.message).toBe("key 'non_existing_key' doesn't exist");
    }
  });

  it("should update a value of a key that exists", async () => {
    const updatedVal = await adapter.update("an_existing_key", "value_3");
    expect(updatedVal).toBe("value_3");

    const retrievedVal = await adapter.get("an_existing_key");
    expect(retrievedVal).toBe("value_3");
  });

  it("should delete a value of a key that exists and return true", async () => {
    const deleteWasSuccessfull = await adapter.delete("an_existing_key");
    expect(deleteWasSuccessfull).toBe(true);

    const retrievedVal = await adapter.get("an_existing_key");
    expect(retrievedVal).toBeUndefined();
  });

  it("should return false while after trying to delte a key that doesn't exist", async () => {
    const deleteWasSuccessfull = await adapter.delete("whatever");
    expect(deleteWasSuccessfull).toBe(false);
  });

  it("should show all existing keys if no pattern is passed", async () => {
    await adapter.set("another_key", "another value");
    await adapter.set("another one", "bites the dust");
    const keys = await adapter.keys();
    expect(keys.length).toEqual(3);
    expect(keys).toEqual(expect.arrayContaining(["another_key", "another one", "a_totally_new_key"]));
  });

  it("should return only keys that match passed pattern", async () => {
    const keys = await adapter.keys("a*key");
    expect(keys.length).toEqual(2);
    expect(keys).toEqual(expect.arrayContaining(["another_key", "a_totally_new_key"]));
  });

  it("should show all existing values if no pattern is passed", async () => {
    const vals = await adapter.values();
    expect(vals.length).toEqual(3);
    expect(vals).toEqual(expect.arrayContaining(["another value", "value_1", "bites the dust"]));
  });

  it("should return only values which keys match passed pattern", async () => {
    const keys = await adapter.values("a*key");
    expect(keys.length).toEqual(2);
    expect(keys).toEqual(expect.arrayContaining(["another value", "value_1"]));
  });

  it("should return size of store", async () => {
    const size = await adapter.size();
    expect(size).toEqual(3);
  });

  it("should clear store deleting all keys and values", async () => {
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
