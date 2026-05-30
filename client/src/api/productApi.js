import { supabase } from "./supabaseClient";

/*
  productApi.js

  Important:
  - Product listing uses direct Supabase REST fetch because supabase-js is hanging in browser.
  - Auth/Admin/Storage can still use supabase client.
  - Store, Apple, Laptop, Accessories will load fast with images.
*/

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

if (!SUPABASE_KEY) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY");
}

/* -------------------------------------------------------------------------- */
/* REST Helper                                                                 */
/* -------------------------------------------------------------------------- */

const restFetch = async (path) => {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("REST API error:", response.status, text);
    throw new Error(text || "Supabase REST request failed");
  }

  return text ? JSON.parse(text) : [];
};

const encodeSelect = (select) => {
  return encodeURIComponent(select.replace(/\s+/g, ""));
};

/* -------------------------------------------------------------------------- */
/* Product Columns                                                             */
/* -------------------------------------------------------------------------- */

const PRODUCT_LIST_SELECT = `
  id,
  name,
  slug,
  brand,
  category,
  description,
  short_description,
  price,
  discount_price,
  stock,
  rating,
  is_featured,
  variants,
  features,
  specs,
  created_at,
  updated_at
`;

const PRODUCT_DETAIL_SELECT = `
  id,
  name,
  slug,
  brand,
  category,
  description,
  short_description,
  price,
  discount_price,
  stock,
  rating,
  is_featured,
  variants,
  features,
  specs,
  created_at,
  updated_at,
  product_images(
    id,
    product_id,
    image_url,
    is_primary,
    sort_order
  )
`;

/* -------------------------------------------------------------------------- */
/* Error Handler                                                               */
/* -------------------------------------------------------------------------- */

const throwIfError = (error, message = "Supabase product API error") => {
  if (error) {
    console.error(message, error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* Generate Slug                                                               */
/* -------------------------------------------------------------------------- */

export const generateSlug = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* -------------------------------------------------------------------------- */
/* Normalize Product                                                           */
/* -------------------------------------------------------------------------- */

export const normalizeProduct = (product = {}) => {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : Array.isArray(product.images)
      ? product.images
      : [];

  const sortedImages = [...images].sort((a, b) => {
    if (a?.is_primary && !b?.is_primary) return -1;
    if (!a?.is_primary && b?.is_primary) return 1;
    return Number(a?.sort_order || 0) - Number(b?.sort_order || 0);
  });

  return {
    ...product,
    product_images: sortedImages,
    images: sortedImages,
    variants: product.variants || {},
    features: Array.isArray(product.features) ? product.features : [],
    specs: product.specs || {},
    price: Number(product.price || 0),
    discount_price: product.discount_price
      ? Number(product.discount_price)
      : null,
    stock: Number(product.stock || 0),
    rating: Number(product.rating || 0),
    is_featured: Boolean(product.is_featured),
  };
};

/* -------------------------------------------------------------------------- */
/* Fetch Images Separately                                                     */
/* -------------------------------------------------------------------------- */

const fetchProductImages = async (productIds = []) => {
  if (!productIds.length) {
    return new Map();
  }

  const ids = productIds.map((id) => `"${id}"`).join(",");
  const select = "id,product_id,image_url,is_primary,sort_order";

  try {
    const images = await restFetch(
      `product_images?select=${select}&product_id=in.(${ids})&order=sort_order.asc`
    );

    const imageMap = new Map();

    (images || []).forEach((image) => {
      if (!imageMap.has(image.product_id)) {
        imageMap.set(image.product_id, []);
      }

      imageMap.get(image.product_id).push(image);
    });

    return imageMap;
  } catch (error) {
    console.warn("Images skipped:", error);
    return new Map();
  }
};

const attachImages = async (products = []) => {
  const productIds = products.map((product) => product.id).filter(Boolean);
  const imageMap = await fetchProductImages(productIds);

  return products.map((product) =>
    normalizeProduct({
      ...product,
      product_images: imageMap.get(product.id) || [],
    })
  );
};

/* -------------------------------------------------------------------------- */
/* Format Product Data                                                         */
/* -------------------------------------------------------------------------- */

const formatProductData = (productData = {}) => {
  return {
    name: productData.name || "",
    slug: productData.slug || generateSlug(productData.name),
    brand: productData.brand || "",
    category: productData.category || "",
    description: productData.description || "",
    short_description:
      productData.short_description || productData.shortDescription || "",
    price: Number(productData.price || 0),
    discount_price: productData.discount_price
      ? Number(productData.discount_price)
      : null,
    stock: Number(productData.stock || 0),
    rating: Number(productData.rating || 0),
    is_featured: Boolean(productData.is_featured),
    variants: productData.variants || {},
    features: productData.features || [],
    specs: productData.specs || {},
  };
};

/* -------------------------------------------------------------------------- */
/* Get All Products - REST FAST                                                */
/* -------------------------------------------------------------------------- */

export const getProducts = async (params = {}) => {
  const queryParts = [];

  queryParts.push(`select=${encodeSelect(PRODUCT_LIST_SELECT)}`);
  queryParts.push("order=created_at.desc");

  if (params.category) {
    queryParts.push(`category=ilike.${encodeURIComponent(params.category)}`);
  }

  if (params.brand) {
    queryParts.push(`brand=ilike.${encodeURIComponent(params.brand)}`);
  }

  if (params.featured !== undefined) {
    queryParts.push(`is_featured=eq.${Boolean(params.featured)}`);
  }

  if (params.minPrice) {
    queryParts.push(`price=gte.${Number(params.minPrice)}`);
  }

  if (params.maxPrice) {
    queryParts.push(`price=lte.${Number(params.maxPrice)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  const products = await restFetch(`products?${queryParts.join("&")}`);

  let filteredProducts = products || [];

  if (params.search) {
    const search = params.search.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.short_description?.toLowerCase().includes(search)
      );
    });
  }

  return attachImages(filteredProducts);
};

/* -------------------------------------------------------------------------- */
/* Get Product By Slug - WITH IMAGES                                           */
/* -------------------------------------------------------------------------- */

export const getProductBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Product slug is required");
  }

  const select = encodeSelect(PRODUCT_DETAIL_SELECT);
  const data = await restFetch(
    `products?select=${select}&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );

  if (!data?.[0]) {
    throw new Error("Product not found");
  }

  return normalizeProduct(data[0]);
};

/* -------------------------------------------------------------------------- */
/* Get Product By ID - WITH IMAGES                                             */
/* -------------------------------------------------------------------------- */

export const getProductById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const select = encodeSelect(PRODUCT_DETAIL_SELECT);
  const data = await restFetch(
    `products?select=${select}&id=eq.${encodeURIComponent(id)}&limit=1`
  );

  if (!data?.[0]) {
    throw new Error("Product not found");
  }

  return normalizeProduct(data[0]);
};

/* -------------------------------------------------------------------------- */
/* Featured Products                                                           */
/* -------------------------------------------------------------------------- */

export const getFeaturedProducts = async (limit = 8) => {
  return getProducts({
    featured: true,
    limit,
  });
};

/* -------------------------------------------------------------------------- */
/* Category Products                                                           */
/* -------------------------------------------------------------------------- */

export const getProductsByCategory = async (category, limit = 50) => {
  if (!category) {
    return [];
  }

  return getProducts({
    category,
    limit,
  });
};

/* -------------------------------------------------------------------------- */
/* Brand Products                                                              */
/* -------------------------------------------------------------------------- */

export const getProductsByBrand = async (brand, limit = 50) => {
  if (!brand) {
    return [];
  }

  return getProducts({
    brand,
    limit,
  });
};

/* -------------------------------------------------------------------------- */
/* Page Specific Products                                                      */
/* -------------------------------------------------------------------------- */

export const getAppleProducts = async (limit = 50) => {
  return getProducts({
    brand: "Apple",
    limit,
  });
};

export const getLaptopProducts = async (limit = 50) => {
  return getProducts({
    category: "Laptop",
    limit,
  });
};

export const getAccessoryProducts = async (limit = 50) => {
  return getProducts({
    category: "Accessory",
    limit,
  });
};

/* -------------------------------------------------------------------------- */
/* Search Products                                                             */
/* -------------------------------------------------------------------------- */

export const searchProducts = async (searchText) => {
  if (!searchText?.trim()) {
    return [];
  }

  return getProducts({
    search: searchText,
  });
};

/* -------------------------------------------------------------------------- */
/* Get Categories                                                              */
/* -------------------------------------------------------------------------- */

export const getProductCategories = async () => {
  const data = await restFetch("products?select=category");

  const categories = [...new Set((data || []).map((item) => item.category))];

  return categories.filter(Boolean);
};

/* -------------------------------------------------------------------------- */
/* Create Product - Admin                                                      */
/* -------------------------------------------------------------------------- */

export const createProduct = async (productData) => {
  if (!productData?.name) {
    throw new Error("Product name is required");
  }

  if (!productData?.price) {
    throw new Error("Product price is required");
  }

  const formattedData = formatProductData(productData);

  const { data, error } = await supabase
    .from("products")
    .insert([formattedData])
    .select(PRODUCT_DETAIL_SELECT)
    .single();

  throwIfError(error, "Failed to create product");

  return normalizeProduct(data);
};

/* -------------------------------------------------------------------------- */
/* Update Product - Admin                                                      */
/* -------------------------------------------------------------------------- */

export const updateProduct = async (slug, productData) => {
  if (!slug) {
    throw new Error("Product slug is required");
  }

  const formattedData = formatProductData(productData);

  const { data, error } = await supabase
    .from("products")
    .update({
      ...formattedData,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select(PRODUCT_DETAIL_SELECT)
    .single();

  throwIfError(error, "Failed to update product");

  return normalizeProduct(data);
};

/* -------------------------------------------------------------------------- */
/* Patch Product - Admin                                                       */
/* -------------------------------------------------------------------------- */

export const patchProduct = async (slug, updateData) => {
  if (!slug) {
    throw new Error("Product slug is required");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select(PRODUCT_DETAIL_SELECT)
    .single();

  throwIfError(error, "Failed to patch product");

  return normalizeProduct(data);
};

/* -------------------------------------------------------------------------- */
/* Delete Product - Admin                                                      */
/* -------------------------------------------------------------------------- */

export const deleteProduct = async (slug) => {
  if (!slug) {
    throw new Error("Product slug is required");
  }

  const { error } = await supabase.from("products").delete().eq("slug", slug);

  throwIfError(error, "Failed to delete product");

  return true;
};

/* -------------------------------------------------------------------------- */
/* Upload Product Image                                                        */
/* -------------------------------------------------------------------------- */

export const uploadProductImage = async (file, productId) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${productId}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  throwIfError(uploadError, "Failed to upload product image");

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

/* -------------------------------------------------------------------------- */
/* Add Product Image                                                           */
/* -------------------------------------------------------------------------- */

export const addProductImage = async ({
  productId,
  imageUrl,
  isPrimary = false,
  sortOrder = 0,
}) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert([
      {
        product_id: productId,
        image_url: imageUrl,
        is_primary: isPrimary,
        sort_order: Number(sortOrder || 0),
      },
    ])
    .select()
    .single();

  throwIfError(error, "Failed to add product image");

  return data;
};

/* -------------------------------------------------------------------------- */
/* Upload And Save Product Image                                               */
/* -------------------------------------------------------------------------- */

export const uploadAndSaveProductImage = async ({
  file,
  productId,
  isPrimary = false,
  sortOrder = 0,
}) => {
  const imageUrl = await uploadProductImage(file, productId);

  const savedImage = await addProductImage({
    productId,
    imageUrl,
    isPrimary,
    sortOrder,
  });

  return savedImage;
};

/* -------------------------------------------------------------------------- */
/* Delete Product Image                                                        */
/* -------------------------------------------------------------------------- */

export const deleteProductImage = async (imageId) => {
  if (!imageId) {
    throw new Error("Image ID is required");
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  throwIfError(error, "Failed to delete product image");

  return true;
};

/* -------------------------------------------------------------------------- */
/* Update Stock                                                                */
/* -------------------------------------------------------------------------- */

export const updateProductStock = async (productId, stock) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      stock: Number(stock),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select(PRODUCT_DETAIL_SELECT)
    .single();

  throwIfError(error, "Failed to update product stock");

  return normalizeProduct(data);
};

/* -------------------------------------------------------------------------- */
/* Related Products                                                            */
/* -------------------------------------------------------------------------- */

export const getRelatedProducts = async ({
  category,
  currentProductId,
  limit = 4,
}) => {
  if (!category) {
    return [];
  }

  const products = await getProducts({
    category,
    limit: limit + 1,
  });

  return products
    .filter((product) => product.id !== currentProductId)
    .slice(0, limit);
};

/* -------------------------------------------------------------------------- */
/* Old Name Compatibility                                                      */
/* -------------------------------------------------------------------------- */

export const getAllProducts = getProducts;
export const getProduct = getProductBySlug;
export const getProductsByBrandName = getProductsByBrand;