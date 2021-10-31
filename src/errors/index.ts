import { Errors } from "moleculer";

const { MoleculerError } = Errors;

export class NonExistingKeyError extends MoleculerError {
  constructor(key: Key) {
    super(`key '${key}' doesn't exist`);
    this.name = "NonExistingKeyError";
    this.code = 204;
  }
}

export class InvalidValueType extends Error {
  constructor(value: Value) {
    super(`value '${value}' is of an invalid type '${typeof value}'`);
    this.name = "InvalidValueType";
  }
}
