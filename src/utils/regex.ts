export const createRegExpFromGlobPattern = (str = "*"): RegExp => {
  if (typeof str !== "string") throw new TypeError("'str' paramter must be of type string");

  const pattern = str.split("").map(mapGlobToRegExp).join("");

  return new RegExp(`^${pattern}$`, "im");
};

const mapGlobToRegExp = (c: string): string => {
  switch (c) {
    case "*":
      return ".*";
    case "?":
      return ".";
    case ".":
    case "!":
    case "$":
    case "+":
    case "/":
    case "=":
    case "|":
    case "(":
    case ")":
      return "\\" + c;
    default:
      return c;
  }
};
