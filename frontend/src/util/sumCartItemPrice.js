export const sumCartItemSellingPrice = (items) => {
  if (!Array.isArray(items)) return 0; // पक्का करो कि यह एक Array ही है
  
  return items.reduce((total, item) => {
    const price = Number(item?.sellingPrice);
    const qty = Number(item?.quantity);
    
    // अगर नंबर वैलिड नहीं है तो 0 और 1 का बैकअप लें
    const validPrice = isNaN(price) ? 0 : price;
    const validQty = isNaN(qty) ? 1 : qty;

    return total + (validPrice * validQty);
  }, 0);
};

export const sumCartItemMrpPrice = (items) => {
  if (!Array.isArray(items)) return 0; // पक्का करो कि यह एक Array ही है
  
  return items.reduce((total, item) => {
    const price = Number(item?.mrpPrice);
    const qty = Number(item?.quantity);
    
    const validPrice = isNaN(price) ? 0 : price;
    const validQty = isNaN(qty) ? 1 : qty;

    return total + (validPrice * validQty);
  }, 0);
};