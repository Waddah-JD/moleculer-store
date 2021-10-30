export class NonExistingKeyError extends Error {
  constructor(key: Key) {
    super(`key '${key}' doesn't exist`);
    this.name = "NonExistingKeyError";
  }
}
