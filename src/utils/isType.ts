export const isNumber = (str: string): boolean => {
  return !isNaN(parseFloat(str));
};

export const isBoolean = (str: string): boolean => {
  return str === "true" || str === "false";
};

export const isStringifiedJSON = (str: string): boolean => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object";
  } catch (e) {
    return false;
  }
};
