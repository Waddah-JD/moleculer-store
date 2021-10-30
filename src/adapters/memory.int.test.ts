import MemoryAdapter from "./memory";

const adapter = new MemoryAdapter();

beforeAll(() => adapter.connect());
afterAll(() => adapter.disconnect());

describe("Memory Adapter", () => {
  it("should return false for non-existing key", () => {
    expect(adapter.exists("non_existing_key")).toBe(false);
  });

  it("should return true for an existing key", () => {
    adapter.set("an_existing_key", "some_value");
    expect(adapter.exists("an_existing_key")).toBe(true);
  });

  it("should set a new value for an existing key and return set value", () => {
    expect(adapter.set("totally_new_key", "value_1")).toBe("value_1");
    expect(adapter.get("totally_new_key")).toBe("value_1");
  });

  it("should override the value for an existing key and return set value", () => {
    expect(adapter.set("an_existing_key", "value_2")).toBe("value_2");
    expect(adapter.get("an_existing_key")).toBe("value_2");
  });

  it("should return undefined for a non-existing key", () => {
    expect(adapter.get("non_existing_key")).toBe(undefined);
  });
});
