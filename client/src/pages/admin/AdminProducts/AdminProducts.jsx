import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  syncAdminProductImages,
} from "../../../api/adminApi";

import AdminPagination from "../AdminPagination/AdminPagination.jsx";
import ProductStats from "./ProductStats.jsx";
import ProductList from "./ProductList.jsx";
import ProductForm from "./ProductForm.jsx";

import { getCategoryKey } from "../../../utils/productCatalog";

import "./AdminProducts.css";

const PRODUCTS_PER_PAGE = 10;

const AdminProducts = () => {
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [tempImageUrl, setTempImageUrl] = useState("");
  const [tempSpecKey, setTempSpecKey] = useState("");
  const [tempSpecValue, setTempSpecValue] = useState("");
  const [tempVariantKey, setTempVariantKey] = useState("");
  const [tempVariantValue, setTempVariantValue] = useState("");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const initialAddForm = {
    name: "",
    category: "Smartphone",
    brand: "",
    price: 0,
    currency: "INR",
    stock: 0,
    images: [],
    shortDescription: "",
    features: [],
    specs: {},
    variants: {},
    status: "new",
  };

  const [addForm, setAddForm] = useState(initialAddForm);
  const [editForm, setEditForm] = useState(initialAddForm);

  const normalizeProduct = (product) => {
    const images = product.product_images || product.images || [];

    const normalizedImages = Array.isArray(images)
      ? images
          .map((image) =>
            typeof image === "string" ? image : image?.image_url || image?.url
          )
          .filter(Boolean)
      : [];

    return {
      ...product,
      images: normalizedImages,
      shortDescription:
        product.shortDescription ||
        product.short_description ||
        product.description ||
        "",
      specs: product.specs || product.specifications || {},
      features: Array.isArray(product.features) ? product.features : [],
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const productsData = await getAllProducts();

      setRawProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const allProducts = useMemo(() => {
    return (rawProducts || []).map(normalizeProduct);
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    const query = deferredSearchTerm.trim().toLowerCase();

    if (query) {
      list = list.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedCategory !== "all") {
      list = list.filter((product) => {
        return getCategoryKey(product.category) === selectedCategory;
      });
    }

    if (selectedStatus !== "all") {
      list = list.filter((product) => product.status === selectedStatus);
    }

    return list;
  }, [allProducts, deferredSearchTerm, selectedCategory, selectedStatus]);

  const totalFilteredProducts = filteredProducts.length;
  const totalProducts = allProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE)
  );

  const products = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const productSummary = useMemo(() => {
    const categoryMap = {};

    allProducts.forEach((product) => {
      const categoryName = product.category || "Uncategorized";
      const categoryId = getCategoryKey(categoryName);

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          id: categoryId,
          name: categoryName,
          count: 0,
        };
      }

      categoryMap[categoryId].count += 1;
    });

    return {
      total_products: totalProducts,
      total_stock: allProducts.reduce(
        (sum, product) => sum + Number(product.stock || 0),
        0
      ),
      total_value: allProducts.reduce((sum, product) => {
        return sum + Number(product.price || 0) * Number(product.stock || 0);
      }, 0),
      out_of_stock: allProducts.filter(
        (product) => Number(product.stock || 0) <= 0
      ).length,
      categories: Object.values(categoryMap),
    };
  }, [allProducts, totalProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEdit = (product) => {
    setEditingProduct(product);

    setEditForm({
      ...initialAddForm,
      ...product,
      images: product.images || [],
      shortDescription:
        product.shortDescription ?? product.short_description ?? "",
      specs: product.specs || product.specifications || {},
      features: Array.isArray(product.features) ? product.features : [],
      variants: product.variants || {},
    });

    setShowEditModal(true);
    toast.info(`Editing product: ${product.name}`);
  };

  const createSlug = (name) => {
    return `${name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now()}`;
  };

  const formatProductPayload = (form) => {
    return {
      name: form.name,
      slug: form.slug || createSlug(form.name),
      category: form.category,
      brand: form.brand,
      price: Number(form.price || 0),
      currency: form.currency || "INR",
      stock: Number(form.stock || 0),
      description: form.shortDescription || "",
      short_description: form.shortDescription || "",
      features: Array.isArray(form.features) ? form.features : [],
      specs: form.specs || {},
      variants: form.variants || {},
      status: form.status === "new" ? "active" : form.status,
    };
  };

  const syncProductImages = async (productId, images = []) => {
    if (!productId) return;

    await syncAdminProductImages(productId, images);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const formattedData = formatProductPayload({
        ...editForm,
        slug: editingProduct.slug,
      });

      const updatedProduct = await updateAdminProduct(
        editingProduct.id,
        formattedData
      );

      if (!updatedProduct?.id) {
        throw new Error("Product updated but product ID was not returned.");
      }

      await syncProductImages(editingProduct.id, editForm.images || []);

      toast.success("Product updated successfully!");

      setShowEditModal(false);
      setEditingProduct(null);
      setEditForm(initialAddForm);

      await fetchProducts();

      return updatedProduct;
    } catch (err) {
      toast.error(err.message || "Failed to update product. Check the form values.");
      console.error("Error updating product:", err);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await syncAdminProductImages(product.id, []);
      await deleteAdminProduct(product.id);

      toast.success(`Product "${product.name}" deleted successfully!`);

      await fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
      console.error("Error deleting product:", err);
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
    setAddForm(initialAddForm);
  };

  const handleSaveNewProduct = async () => {
    try {
      if (!addForm.name.trim()) {
        toast.error("Product name is required");
        return;
      }

      const productPayload = formatProductPayload(addForm);

      const createdProduct = await createAdminProduct(productPayload);

      if (!createdProduct?.id) {
        throw new Error("Product created but product ID was not returned.");
      }

      await syncProductImages(createdProduct.id, addForm.images || []);

      toast.success("Product added successfully!");

      setShowAddModal(false);
      setAddForm(initialAddForm);

      await fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to add product. Check the form values.");
      console.error("Error adding product:", err);
    }
  };

  const handleAddFeature = (formType, feature) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    if (feature.trim()) {
      setForm({
        ...form,
        features: [...(form.features || []), feature.trim()],
      });
    }
  };

  const handleRemoveFeature = (formType, index) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    setForm({
      ...form,
      features: (form.features || []).filter((_, i) => i !== index),
    });
  };

  const handleAddImage = (formType) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    if (tempImageUrl.trim()) {
      setForm({
        ...form,
        images: [...(form.images || []), tempImageUrl.trim()],
      });

      setTempImageUrl("");
    }
  };

  const handleRemoveImage = (formType, index) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    setForm({
      ...form,
      images: (form.images || []).filter((_, i) => i !== index),
    });
  };

  const handleAddSpec = (formType) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    if (tempSpecKey.trim() && tempSpecValue.trim()) {
      setForm({
        ...form,
        specs: {
          ...(form.specs || {}),
          [tempSpecKey.trim()]: tempSpecValue.trim(),
        },
      });

      setTempSpecKey("");
      setTempSpecValue("");
    }
  };

  const handleRemoveSpec = (formType, key) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    const newSpecs = {
      ...(form.specs || {}),
    };

    delete newSpecs[key];

    setForm({
      ...form,
      specs: newSpecs,
    });
  };

  const handleAddVariant = (formType, variantType) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    if (tempVariantValue.trim()) {
      const currentVariants = {
        ...(form.variants || {}),
      };

      if (!currentVariants[variantType]) {
        currentVariants[variantType] = [];
      }

      setForm({
        ...form,
        variants: {
          ...currentVariants,
          [variantType]: [
            ...currentVariants[variantType],
            tempVariantValue.trim(),
          ],
        },
      });

      setTempVariantKey("");
      setTempVariantValue("");
    }
  };

  const handleRemoveVariant = (formType, variantType, index) => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;

    const currentVariants = {
      ...(form.variants || {}),
    };

    if (currentVariants[variantType]) {
      currentVariants[variantType] = currentVariants[variantType].filter(
        (_, i) => i !== index
      );

      setForm({
        ...form,
        variants: currentVariants,
      });
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const categories = useMemo(() => {
    const availableCategories = Array.isArray(productSummary?.categories)
      ? productSummary.categories
      : [];

    const categoryKeys = availableCategories.map((category) =>
      getCategoryKey(category.id || category.name)
    );

    return ["all", ...new Set(categoryKeys)];
  }, [productSummary]);

  const statuses = [
    "all",
    "new",
    "active",
    "out-of-stock",
    "inactive",
    "coming-soon",
  ];

  const getFormProps = (type) => ({
    form: type === "edit" ? editForm : addForm,
    setForm: type === "edit" ? setEditForm : setAddForm,

    tempState: {
      imageUrl: tempImageUrl,
      specKey: tempSpecKey,
      specValue: tempSpecValue,
      variantKey: tempVariantKey,
      variantValue: tempVariantValue,
    },

    setTempState: {
      setImageUrl: setTempImageUrl,
      setSpecKey: setTempSpecKey,
      setSpecValue: setTempSpecValue,
      setVariantKey: setTempVariantKey,
      setVariantValue: setTempVariantValue,
    },

    handlers: {
      onAddFeature: (feature) => handleAddFeature(type, feature),
      onRemoveFeature: (index) => handleRemoveFeature(type, index),
      onAddImage: () => handleAddImage(type),
      onRemoveImage: (index) => handleRemoveImage(type, index),
      onAddSpec: () => handleAddSpec(type),
      onRemoveSpec: (key) => handleRemoveSpec(type, key),
      onAddVariant: (variantType) => handleAddVariant(type, variantType),
      onRemoveVariant: (variantType, index) =>
        handleRemoveVariant(type, variantType, index),
    },
  });

  if (loading && !products.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">Error loading products</div>

        <div className="text-red-600 text-sm mt-1">
          {error.message || error}
        </div>

        <button
          onClick={fetchProducts}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Products Management
        </h1>

        <p className="text-gray-600">
          Manage your product catalog ({totalProducts} products)
        </p>
      </div>

      <ProductStats
        products={allProducts}
        summary={productSummary}
        formatPrice={formatPrice}
      />

      <ProductList
        filteredProducts={filteredProducts}
        paginatedProducts={products}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        statuses={statuses}
        formatPrice={formatPrice}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleAddProduct={handleAddProduct}
        pagination={
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalFilteredProducts}
            itemsPerPage={PRODUCTS_PER_PAGE}
            itemLabel="products"
            onPageChange={setCurrentPage}
          />
        }
      />

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Product: {editingProduct.name}
                </h3>

                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setEditForm(initialAddForm);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <ProductForm {...getFormProps("edit")} />

              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setEditForm(initialAddForm);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Product
                </h3>

                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm(initialAddForm);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <ProductForm {...getFormProps("add")} />

              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm(initialAddForm);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveNewProduct}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;