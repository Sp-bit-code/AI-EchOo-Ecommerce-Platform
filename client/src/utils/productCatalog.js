export const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

const CATEGORY_ALIASES = {
  smartphone: [
    "smartphone",
    "smartphones",
    "phone",
    "phones",
    "mobile",
    "mobiles",
    "iphone",
    "iphones",
  ],

  laptop: [
    "laptop",
    "laptops",
    "macbook",
    "macbooks",
    "notebook",
    "notebooks",
    "computer",
    "computers",
  ],

  audio: [
    "audio",
    "earbud",
    "earbuds",
    "airpod",
    "airpods",
    "headphone",
    "headphones",
    "speaker",
    "speakers",
  ],

  accessory: [
    "accessory",
    "accessories",
    "accesssoires",
    "accessorieskit",
    "case",
    "cases",
    "charger",
    "chargers",
    "cable",
    "cables",
    "adapter",
    "adapters",
    "gadget",
    "gadgets",
  ],

  tablet: [
    "tablet",
    "tablets",
    "ipad",
    "ipads",
  ],

  watch: [
    "watch",
    "watches",
    "smartwatch",
    "smartwatches",
    "wearable",
    "wearables",
  ],

  gaming: [
    "gaming",
    "gaminglaptop",
    "console",
    "consoles",
  ],

  camera: [
    "camera",
    "cameras",
  ],

  smartHome: [
    "smarthome",
    "smart_home",
    "smart home",
    "home",
  ],
};

const CATEGORY_NAMES = {
  smartphone: "Smartphone",
  laptop: "Laptop",
  audio: "Audio",
  accessory: "Accessory",
  tablet: "Tablet",
  watch: "Watch",
  gaming: "Gaming",
  camera: "Camera",
  smartHome: "Smart Home",
};

export const getCategoryKey = (value) => {
  const normalized = normalizeText(value);

  for (const [key, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalizeText(alias) === normalized)) {
      return key;
    }
  }

  return normalized || "all";
};

export const getCategoryName = (value) => {
  const key = getCategoryKey(value);

  return CATEGORY_NAMES[key] || value || "All";
};

export const isCategoryMatch = (productCategory, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "all") {
    return true;
  }

  return getCategoryKey(productCategory) === getCategoryKey(selectedCategory);
};

export const isBrandMatch = (productBrand, selectedBrand) => {
  return normalizeText(productBrand) === normalizeText(selectedBrand);
};

export const getProductsFromResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export const normalizeProductImages = (product) => {
  const images = product?.product_images || product?.images || [];

  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image) => {
      if (typeof image === "string") {
        return image;
      }

      return image?.image_url || image?.url || "";
    })
    .filter(Boolean);
};

export const getPrimaryProductImage = (product, fallback = "/no-image.png") => {
  const images = normalizeProductImages(product);

  return images[0] || fallback;
};