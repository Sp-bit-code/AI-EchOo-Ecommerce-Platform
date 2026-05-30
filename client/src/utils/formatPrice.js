export const formatPrice = (price = 0, currency = "INR") => {
  const safePrice = Number(price || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safePrice);
};

export const formatCompactPrice = (price = 0, currency = "INR") => {
  const safePrice = Number(price || 0);

  if (safePrice >= 100000) {
    return `${currency === "INR" ? "₹" : ""}${(safePrice / 100000).toFixed(
      1
    )}L`;
  }

  if (safePrice >= 1000) {
    return `${currency === "INR" ? "₹" : ""}${(safePrice / 1000).toFixed(1)}K`;
  }

  return formatPrice(safePrice, currency);
};

export const parsePrice = (value = 0) => {
  if (typeof value === "number") {
    return value;
  }

  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
};

export default formatPrice;