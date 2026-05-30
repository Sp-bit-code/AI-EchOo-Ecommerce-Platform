import React from "react";

import { getCategoryName } from "../../../utils/productCatalog";

import "./ProductList.css";

const ProductList = ({
  filteredProducts = [],
  paginatedProducts = [],
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories = [],
  statuses = [],
  formatPrice,
  handleEdit,
  handleDelete,
  handleAddProduct,
  pagination,
}) => {
  const safeFormatPrice =
    formatPrice ||
    ((price, currency = "INR") =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(price || 0));

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' fill='%23e5e7eb'%3E%3Crect width='300' height='300' rx='8'/%3E%3C/svg%3E";

  const getProductImage = (product) => {
    const images = product.images || product.product_images || [];

    if (!Array.isArray(images) || images.length === 0) {
      return fallbackImage;
    }

    const firstImage = images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return firstImage?.image_url || firstImage?.url || fallbackImage;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      case "coming-soon":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockColor = (stock) => {
    const safeStock = Number(stock || 0);

    if (safeStock === 0) {
      return "bg-red-100 text-red-800";
    }

    if (safeStock < 10) {
      return "bg-yellow-100 text-yellow-800";
    }

    return "bg-green-100 text-green-800";
  };

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : getCategoryName(category)}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover border"
                              src={getProductImage(product)}
                              alt={product.name || "Product"}
                              onError={(event) => {
                                event.target.onerror = null;
                                event.target.src = fallbackImage;
                              }}
                            />
                          </div>

                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>

                            <div className="text-sm text-gray-500">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {safeFormatPrice(product.price, product.currency)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockColor(
                            product.stock
                          )}`}
                        >
                          {Number(product.stock || 0)} units
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status || "active"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>

            <p className="text-gray-600 mb-4">
              {searchTerm ||
              selectedCategory !== "all" ||
              selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "Add your first product to get started"}
            </p>

            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;