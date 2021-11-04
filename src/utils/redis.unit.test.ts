import { parseNumericRedisRespnseToBool } from "./redis";

describe("parseNumericRedisRespnseToBool", () => {
  it("should return true for 1", () => {
    expect(parseNumericRedisRespnseToBool(1)).toBe(true);
  });

  it("should return true for 0", () => {
    expect(parseNumericRedisRespnseToBool(0)).toBe(false);
  });
});
