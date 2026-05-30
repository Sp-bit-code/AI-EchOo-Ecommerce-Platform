import React from "react";

import "./AdminPagination.css";

/*
  AdminPagination.jsx

  Purpose:
  - Reusable pagination component for admin pages
  - Used in AdminUsers, AdminProducts, AdminOrders
  - UI kept same as old file
*/

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    pages.push("left-ellipsis");
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    pages.push(page);
  }

  if (windowEnd < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);

  return pages;
};

const AdminPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  itemLabel = "items",
  onPageChange,
}) => {
  if (!totalItems) {
    return null;
  }

  const safeCurrentPage = Math.max(1, Number(currentPage || 1));
  const safeTotalPages = Math.max(1, Number(totalPages || 1));
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage || 10));

  const startItem = (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, totalItems);

  const pageItems = buildPageItems(safeCurrentPage, safeTotalPages);

  const handlePageChange = (page) => {
    if (!onPageChange) return;

    if (page < 1 || page > safeTotalPages) return;

    onPageChange(page);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-600">
          Showing {startItem}-{endItem} of {totalItems} {itemLabel}
        </p>

        {safeTotalPages > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {pageItems.map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePageChange(item)}
                  className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    safeCurrentPage === item
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span key={item} className="px-1 text-sm text-gray-400">
                  ...
                </span>
              )
            )}

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === safeTotalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPagination;