import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from "../api/productApi";

import {
  getCategoryKey,
  getProductsFromResponse,
  normalizeProductImages,
} from "../utils/productCatalog";

const normalizeProduct = (product = {}) => {
  const images = normalizeProductImages(product);

  return {
    ...product,
    images,
    shortDescription:
      product.shortDescription ||
      product.short_description ||
      product.description ||
      "",
    specs: product.specs || product.specifications || {},
    features: product.features || [],
    variants: product.variants || {
      colors: product.colors || [],
      storage: product.storage_options || [],
      ram: product.ram_options || [],
    },
    status:
      product.status ||
      (Number(product.stock || 0) <= 0 ? "out-of-stock" : "active"),
  };
};

const useProducts = (options = {}) => {
  const {
    autoFetch = true,
    initialParams = {},
    category = "all",
    search = "",
    status = "all",
  } = options;

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(autoFetch);
  const [productsError, setProductsError] = useState("");

  const fetchProducts = useCallback(
    async (params = initialParams) => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await getProducts(params);
        const list = getProductsFromResponse(response?.data || response);

        const normalizedProducts = list.map(normalizeProduct);

        setProducts(normalizedProducts);

        return normalizedProducts;
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProductsError(error.message || "Failed to fetch products");
        setProducts([]);
        return [];
      } finally {
        setProductsLoading(false);
      }
    },
    [initialParams]
  );

  const fetchProductBySlug = useCallback(async (slug) => {
    if (!slug) {
      throw new Error("Product slug is required.");
    }

    const response = await getProductBySlug(slug);
    const product = response?.data || response;

    return normalizeProduct(product);
  }, []);

  const addProduct = useCallback(async (payload) => {
    const response = await createProduct(payload);
    const product = response?.data || response;

    await fetchProducts();

    return normalizeProduct(product);
  }, [fetchProducts]);

  const editProduct = useCallback(async (slugOrId, payload) => {
    const response = await updateProduct(slugOrId, payload);
    const product = response?.data || response;

    await fetchProducts();

    return normalizeProduct(product);
  }, [fetchProducts]);

  const patchProductData = useCallback(async (slugOrId, payload) => {
    const response = await patchProduct(slugOrId, payload);
    const product = response?.data || response;

    await fetchProducts();

    return normalizeProduct(product);
  }, [fetchProducts]);

  const removeProduct = useCallback(async (slugOrId) => {
    await deleteProduct(slugOrId);
    await fetchProducts();

    return true;
  }, [fetchProducts]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    const query = String(search || "").trim().toLowerCase();

    if (query) {
      list = list.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        );
      });
    }

    if (category && category !== "all") {
      list = list.filter((product) => {
        return getCategoryKey(product.category) === getCategoryKey(category);
      });
    }

    if (status && status !== "all") {
      list = list.filter((product) => product.status === status);
    }

    return list;
  }, [products, search, category, status]);

  return {
    products,
    filteredProducts,
    productsLoading,
    productsError,
    fetchProducts,
    fetchProductBySlug,
    addProduct,
    editProduct,
    patchProductData,
    removeProduct,
    setProducts,
  };
};

export default useProducts;
export { useProducts };