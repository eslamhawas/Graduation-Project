export const calculateFullAmout = (subAmount: number): number => {
  const totalAmount = subAmount + subAmount * (20 / 100);
  return totalAmount;
};
