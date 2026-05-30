import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../../api/productApi";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  getProductsFromResponse,
  getPrimaryProductImage,
} from "../../../utils/productCatalog";

import "./SearchDropDown.css";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' fill='%23e5e7eb'%3E%3Crect width='50' height='50' rx='4'/%3E%3C/svg%3E";

const PopoverBodyLock = ({ open }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return null;
};

const normalizeProduct = (product = {}) => {
  return {
    ...product,
    image: getPrimaryProductImage(product, fallbackImage),
    brand: product.brand || "",
    category: product.category || "",
    price: Number(product.price || 0),
    slug: product.slug || product.id,
  };
};

const SearchDropdown = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [quickLinks] = useState([
    {
      name: "Find a store",
      path: "/store",
    },
    {
      name: "Accessories",
      path: "/accessories",
    },
    {
      name: "Laptop",
      path: "/laptop",
    },
    {
      name: "Apple store",
      path: "/apple",
    },
    {
      name: "Support",
      path: "/support",
    },
  ]);

  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length <= 1) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    let ignore = false;

    const searchProducts = async () => {
      try {
        setSearchLoading(true);
        setSearchError("");

        const response = await getProducts({
          q: debouncedSearchQuery.trim(),
          limit: 5,
        });

        if (ignore) return;

        const products = getProductsFromResponse(response?.data || response)
          .map(normalizeProduct)
          .slice(0, 5);

        setSearchResults(products);
      } catch (error) {
        if (!ignore) {
          console.error("Product search error:", error);
          setSearchError("Unable to load products.");
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setSearchLoading(false);
        }
      }
    };

    searchProducts();

    return () => {
      ignore = true;
    };
  }, [debouncedSearchQuery]);

  const handleProductClick = (productSlug, close) => {
    close();

    setTimeout(() => {
      navigate(`/product/${productSlug}`);
      setSearchQuery("");
      setSearchResults([]);
    }, 100);
  };

  const handleQuickLinkClick = (path, close) => {
    close();

    setTimeout(() => {
      navigate(path);
      setSearchQuery("");
      setSearchResults([]);
    }, 100);
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverBodyLock open={open} />

          <Popover.Button className="flex items-center py-2 text-gray-700 hover:text-gray-900">
            <MagnifyingGlassIcon className="size-5 stroke-gray-900" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[18rem] sm:max-w-[24rem] lg:left-auto lg:translate-x-0 lg:right-8 lg:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="font-dm-sans">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search echoo.com"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="flex-1 bg-transparent font-bold outline-none text-lg"
                    autoFocus
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setSearchError("");
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                      aria-label="Clear search"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {searchQuery ? (
                    <div className="p-2">
                      {searchLoading && (
                        <div className="px-3 py-8 text-center text-sm text-gray-500">
                          Loading products...
                        </div>
                      )}

                      {!searchLoading && searchError && (
                        <div className="px-3 py-8 text-center text-sm text-red-500">
                          {searchError}
                        </div>
                      )}

                      {!searchLoading &&
                        !searchError &&
                        searchResults.length > 0 &&
                        searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() =>
                              handleProductClick(product.slug, close)
                            }
                            className="w-full p-3 flex gap-3 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-contain"
                              onError={(event) => {
                                event.target.onerror = null;
                                event.target.src = fallbackImage;
                              }}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {product.name}
                              </div>

                              <div className="text-sm text-gray-500 truncate">
                                {product.brand} • {product.category}
                              </div>
                            </div>

                            <div className="font-semibold whitespace-nowrap">
                              Rs. {Number(product.price || 0).toLocaleString()}
                            </div>
                          </button>
                        ))}

                      {!searchLoading &&
                        !searchError &&
                        searchResults.length === 0 &&
                        debouncedSearchQuery.trim().length > 1 && (
                          <div className="px-3 py-8 text-center text-sm text-gray-500">
                            No products found.
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-500 mb-2">
                        Quick Links
                      </div>

                      {quickLinks.map((link) => (
                        <button
                          key={link.name}
                          type="button"
                          onClick={() => handleQuickLinkClick(link.path, close)}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          {link.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default SearchDropdown;