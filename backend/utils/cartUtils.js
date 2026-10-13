export const calculateCartTotals = (items) => {
  let totalItems = 0;
  let subtotal = 0;

  items.forEach((item) => {
    totalItems += item.quantity;
    subtotal += item.quantity * item.price;
  });

  return {
    totalItems,
    subtotal,
  };
};

export const calculateShipping = (subtotal) => {
  if (subtotal <= 0) {
    return 0;
  }

  return subtotal > 999 ? 0 : 100;
};

export const calculateCartSummary = (items) => {
  const { totalItems, subtotal } = calculateCartTotals(items);

  const shipping = calculateShipping(subtotal);

  // We will implement coupons/promotions later
  const discount = 0;

  // We will implement proper tax calculation later
  const tax = 0;

  const total = subtotal - discount + shipping + tax;

  return {
    totalItems,
    subtotal,
    discount,
    tax,
    shipping,
    total,
  };
};
