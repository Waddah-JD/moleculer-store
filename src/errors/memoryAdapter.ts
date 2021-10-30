import { Errors } from "moleculer";

const { MoleculerError } = Errors;

export class NonExistingKeyError extends MoleculerError {
  constructor(key: Key) {
    super(`key '${key}' doesn't exist`);
    this.name = "NonExistingKeyError";
    this.code = 204;
  }
}
