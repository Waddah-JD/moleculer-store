export const parseNumericRedisRespnseToBool = (n: number | string): boolean => {
  if (typeof n === "number") return !!n;
  if (typeof n === "string") return !!parseInt(n);
};
