export const calculateSubAmout = (
  oldSub: number,
  promoPercentage: number,
): number => {
  const subAmount = oldSub - oldSub * (promoPercentage / 100);
  return subAmount;
};
