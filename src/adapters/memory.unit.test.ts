import MemoryAdapter from "./memory";

describe("Memory Adapter", () => {
  it("should be created with required 'public' methods", () => {
    const adapter = new MemoryAdapter();

    expect(adapter).toBeDefined();
    expect(adapter).toBeInstanceOf(MemoryAdapter);
    expect(adapter.init).toBeInstanceOf(Function);
    expect(adapter.connect).toBeInstanceOf(Function);
    expect(adapter.disconnect).toBeInstanceOf(Function);
    expect(adapter.exists).toBeInstanceOf(Function);
    expect(adapter.get).toBeInstanceOf(Function);
    expect(adapter.set).toBeInstanceOf(Function);
    expect(adapter.delete).toBeInstanceOf(Function);
  });
});
