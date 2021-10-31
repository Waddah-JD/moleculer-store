import { parseNumberRespnseToBool } from "./redis";

describe("parseNumberRespnseToBool", () => {
  it("should return true for 1", () => {
    expect(parseNumberRespnseToBool(1)).toBe(true);
  });

  it("should return true for 0", () => {
    expect(parseNumberRespnseToBool(0)).toBe(false);
  });
});
