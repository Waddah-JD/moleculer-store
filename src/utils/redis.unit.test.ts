import { parseNumericRedisRespnseToBool } from "./redis";

describe("parseNumericRedisRespnseToBool", () => {
  describe("should parse numbers to boolean", () => {
    it("should return true for 1", () => {
      expect(parseNumericRedisRespnseToBool(1)).toBe(true);
    });

    it("should return true for 0", () => {
      expect(parseNumericRedisRespnseToBool(0)).toBe(false);
    });
  });

  describe("should parse numeric strings to boolean", () => {
    it("should return true for '1'", () => {
      expect(parseNumericRedisRespnseToBool("1")).toBe(true);
    });

    it("should return true for '0'", () => {
      expect(parseNumericRedisRespnseToBool("0")).toBe(false);
    });
  });
});
