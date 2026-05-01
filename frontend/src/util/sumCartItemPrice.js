export const sumCartItemSellingPrice = (items) => {
  return (items || []).reduce((total, item) => {
    // Backend stores sellingPrice as unitPrice, multiply by quantity
    return total + (Number(item?.sellingPrice) || 0) * (Number(item?.quantity) || 1);
  }, 0);
};

export const sumCartItemMrpPrice = (items) => {
  return (items || []).reduce((total, item) => {
    // Backend stores mrpPrice as unitPrice, multiply by quantity
    return total + (Number(item?.mrpPrice) || 0) * (Number(item?.quantity) || 1);
  }, 0);
};