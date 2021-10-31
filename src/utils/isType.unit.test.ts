import { isNumber, isStringifiedJSON } from "./isType";

describe("isNumber", () => {
  it("should return false for non numeric values", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(isNumber()).toBe(false);
    expect(isNumber("")).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber("null")).toBe(false);
    expect(isNumber("e")).toBe(false);
    expect(isNumber("e.2")).toBe(false);
    expect(isNumber("e^2")).toBe(false);
  });

  it("should return true for numeric strings", () => {
    expect(isNumber("0")).toBe(true);
    expect(isNumber("69")).toBe(true);
    expect(isNumber("1e2")).toBe(true);
    expect(isNumber("52.6")).toBe(true);
  });
});

describe("isJson", () => {
  it("should return false for NON JSON strings", () => {
    expect(isStringifiedJSON("xx")).toBe(false);
    expect(isStringifiedJSON("10")).toBe(false);
  });

  it("should return true for JSON strings", () => {
    expect(isStringifiedJSON("{}")).toBe(true);
    expect(isStringifiedJSON("[]")).toBe(true);
    expect(isStringifiedJSON('{"val":null}')).toBe(true);
    expect(isStringifiedJSON('{"x":"1","y":1,"z":true}')).toBe(true);
    expect(isStringifiedJSON('{"x":"1","y":1,"z":true,"first":{"second":{"third":"enough"}}}')).toBe(true);
  });
});
