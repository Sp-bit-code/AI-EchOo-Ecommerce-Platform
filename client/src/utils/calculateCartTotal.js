export const FREE_SHIPPING_LIMIT = 50000;
export const DEFAULT_SHIPPING_CHARGE = 99;

export const getCartItemPrice = (item = {}) => {
  const product = item.products || item.product || {};

  return Number(
    item.product_price ||
      item.price ||
      product.discount_price ||
      product.price ||
      0
  );
};

export const getCartItemQuantity = (item = {}) => {
  return Number(item.quantity || 1);
};

export const calculateCartSubtotal = (items = []) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => {
    const price = getCartItemPrice(item);
    const quantity = getCartItemQuantity(item);

    return total + price * quantity;
  }, 0);
};

export const calculateShipping = (subtotal = 0) => {
  const safeSubtotal = Number(subtotal || 0);

  if (safeSubtotal <= 0) {
    return 0;
  }

  return safeSubtotal > FREE_SHIPPING_LIMIT ? 0 : DEFAULT_SHIPPING_CHARGE;
};

export const calculateCartTotal = (items = []) => {
  const subtotal = calculateCartSubtotal(items);
  const shipping = calculateShipping(subtotal);

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
};

export default calculateCartTotal;