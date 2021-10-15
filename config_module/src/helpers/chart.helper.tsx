export const addZero = (i: number): string | number => {
  return i < 10 ? '0' + i : i;
};
