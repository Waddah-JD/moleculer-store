import { createRegExpFromGlobPattern } from "./regex";

describe("createRegExpFromGlobPattern", () => {
  it("should match everything even an empty string if pattern is *", () => {
    const regex = createRegExpFromGlobPattern("*");

    expect(regex.test("")).toBe(true);
    expect(regex.test("hello")).toBe(true);
    expect(regex.test("hallo")).toBe(true);
    expect(regex.test("hxllo")).toBe(true);
  });

  it("should match 'hello', 'hallo' and 'hxllo' but not 'hxxxllo' if pattern is 'h?llo'", () => {
    const regExp = createRegExpFromGlobPattern("h?llo");

    expect(regExp.test("hello")).toBe(true);
    expect(regExp.test("hallo")).toBe(true);
    expect(regExp.test("hxllo")).toBe(true);

    expect(regExp.test("hxxxllo")).toBe(false);
  });

  it("should match 'hllo', 'hello' and 'heeeello' if pattern is 'h*llo'", () => {
    const regExp = createRegExpFromGlobPattern("h*llo");

    expect(regExp.test("hllo")).toBe(true);
    expect(regExp.test("hello")).toBe(true);
    expect(regExp.test("heeeello")).toBe(true);
  });

  it("should match 'hello' and 'hallo', but not 'hillo' if pattern is 'h[ae]llo'", () => {
    const regExp = createRegExpFromGlobPattern("h[ae]llo");

    expect(regExp.test("hello")).toBe(true);
    expect(regExp.test("hallo")).toBe(true);
    expect(regExp.test("hillo")).toBe(false);
  });

  it("should match 'hallo', 'hbllo', ... but not 'hello' if pattern is 'h[^e]llo'", () => {
    const regExp = createRegExpFromGlobPattern("h[^e]llo");

    expect(regExp.test("hallo")).toBe(true);
    expect(regExp.test("hbllo")).toBe(true);
    expect(regExp.test("hello")).toBe(false);
  });

  it("should match 'hallo' and 'hbllo' if pattern is 'h[a-b]llo'", () => {
    const regExp = createRegExpFromGlobPattern("h[a-b]llo");

    expect(regExp.test("hallo")).toBe(true);
    expect(regExp.test("hbllo")).toBe(true);
  });

  it("should match 'Law', 'Laws', or 'Lawyer' but not 'GrokLaw', 'La', or 'aw' if pattern is 'Law*'", () => {
    const regExp = createRegExpFromGlobPattern("Law*");

    expect(regExp.test("Law")).toBe(true);
    expect(regExp.test("Laws")).toBe(true);
    expect(regExp.test("Lawyer")).toBe(true);

    expect(regExp.test("GrokLaw")).toBe(false);
    expect(regExp.test("La")).toBe(false);
    expect(regExp.test("aw")).toBe(false);
  });

  it("should match 'Law', 'GrokLaw', or 'Lawyer' but not 'La', or 'aw' if pattern is '*Law*'", () => {
    const regExp = createRegExpFromGlobPattern("*Law*");

    expect(regExp.test("Law")).toBe(true);
    expect(regExp.test("GrokLaw")).toBe(true);
    expect(regExp.test("Lawyer")).toBe(true);

    expect(regExp.test("La")).toBe(false);
    expect(regExp.test("aw")).toBe(false);
  });

  it("should match 'Cat', 'cat', 'Bat' or 'bat' but not 'at' if pattern is '?at'", () => {
    const regExp = createRegExpFromGlobPattern("?at");

    expect(regExp.test("Cat")).toBe(true);
    expect(regExp.test("cat")).toBe(true);
    expect(regExp.test("Bat")).toBe(true);
    expect(regExp.test("bat")).toBe(true);

    expect(regExp.test("at")).toBe(false);
  });

  it("should match 'Cat' or 'Bat' but not 'CBat' if pattern is '[CB]at'", () => {
    const regExp = createRegExpFromGlobPattern("[CB]at");

    expect(regExp.test("Cat")).toBe(true);
    expect(regExp.test("cat")).toBe(true);
    expect(regExp.test("Bat")).toBe(true);
    expect(regExp.test("bat")).toBe(true);

    expect(regExp.test("cbat")).toBe(false);
    expect(regExp.test("CBat")).toBe(false);
  });

  it("should match Letter0, Letter1, Letter2 up to Letter9 but not Letters, Letter or Letter10 if pattern is 'Letter[0-9]'", () => {
    const regExp = createRegExpFromGlobPattern("Letter[0-9]");

    expect(regExp.test("letter0")).toBe(true);
    expect(regExp.test("Letter0")).toBe(true);
    expect(regExp.test("Letter5")).toBe(true);
    expect(regExp.test("Letter9")).toBe(true);

    expect(regExp.test("Letter")).toBe(false);
    expect(regExp.test("Letters")).toBe(false);
    expect(regExp.test("Letter10")).toBe(false);
  });
});
