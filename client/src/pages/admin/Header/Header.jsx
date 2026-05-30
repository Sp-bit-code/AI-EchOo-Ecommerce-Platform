import { LogOutIcon, SearchIcon, ShieldUserIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllOrders, getAllUsers } from "../../../api/adminApi";
import { getProducts } from "../../../api/productApi";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  getProductsFromResponse,
  normalizeText,
} from "../../../utils/productCatalog";

import "./Header.css";

const Header = ({ setSidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState({
    users: [],
    products: [],
    orders: [],
  });

  const [searchData, setSearchData] = useState({
    users: [],
    products: [],
    orders: [],
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { user, profile, logout } = useAuth();

  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const adminName =
    profile?.full_name ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Administrator";

  const adminAvatar =
    profile?.avatar_url || profile?.avatar || user?.user_metadata?.avatar_url;

  const userInitials =
    adminName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  const normalizeProduct = (product) => {
    const images = product.product_images || product.images || [];

    return {
      ...product,
      images,
    };
  };

  const normalizeOrder = (order) => {
    const orderUser = order.profiles || order.profile || {};

    return {
      ...order,
      userName:
        order.userName ||
        orderUser.full_name ||
        orderUser.name ||
        orderUser.email ||
        "User",
      userEmail: order.userEmail || orderUser.email || "",
      status: order.status || order.order_status || "placed",
      total: order.total || order.total_amount || 0,
    };
  };

  const normalizeUser = (item) => {
    return {
      ...item,
      name: item.name || item.full_name || item.email || "User",
      email: item.email || "",
    };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      !searchOpen ||
      searchData.users.length ||
      searchData.products.length ||
      searchData.orders.length
    ) {
      return;
    }

    let ignore = false;

    const loadSearchData = async () => {
      setLoading(true);

      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          getAllUsers(),
          getProducts(),
          getAllOrders(),
        ]);

        if (ignore) return;

        const users = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];

        const products = Array.isArray(productsRes)
          ? productsRes
          : getProductsFromResponse(productsRes?.data || productsRes);

        const orders = Array.isArray(ordersRes)
          ? ordersRes
          : ordersRes?.data || [];

        setSearchData({
          users: users.map(normalizeUser),
          products: products.map(normalizeProduct),
          orders: orders.map(normalizeOrder),
        });
      } catch (error) {
        if (!ignore) {
          console.error("Search error:", error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadSearchData();

    return () => {
      ignore = true;
    };
  }, [
    searchData.orders.length,
    searchData.products.length,
    searchData.users.length,
    searchOpen,
  ]);

  useEffect(() => {
    const query = normalizeText(debouncedSearchQuery);

    if (!query) {
      setSearchResults({
        users: [],
        products: [],
        orders: [],
      });
      return;
    }

    const users = searchData.users
      .filter((item) => {
        return (
          normalizeText(item.name).includes(query) ||
          normalizeText(item.full_name).includes(query) ||
          normalizeText(item.email).includes(query)
        );
      })
      .slice(0, 5);

    const products = searchData.products
      .filter((item) => {
        return (
          normalizeText(item.name).includes(query) ||
          normalizeText(item.category).includes(query) ||
          normalizeText(item.brand).includes(query)
        );
      })
      .slice(0, 5);

    const orders = searchData.orders
      .filter((item) => {
        return (
          normalizeText(item.id).includes(query) ||
          normalizeText(item.userName).includes(query) ||
          normalizeText(item.userEmail).includes(query) ||
          normalizeText(item.status).includes(query) ||
          normalizeText(item.order_status).includes(query)
        );
      })
      .slice(0, 5);

    setSearchResults({
      users,
      products,
      orders,
    });
  }, [debouncedSearchQuery, searchData]);

  const handleLogout = async () => {
    await logout();
    navigate("/sign_in");
  };

  const handleResultClick = (type) => {
    const routes = {
      user: "/admin/users",
      product: "/admin/products",
      order: "/admin/orders",
    };

    navigate(routes[type]);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-20"
          onClick={() => setSearchOpen(false)}
        />
      )}

      <header className="bg-transparent border-b border-gray-200/50 z-30 sticky top-0">
        <div className="flex items-center justify-end h-16 px-4 md:px-6">
          <div className="flex items-center space-x-3">
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div
                  className="
                    fixed top-20 left-4 right-4 w-auto
                    md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:w-96
                    bg-white/80 backdrop-blur-xl rounded-2xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 z-50
                  "
                >
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center">
                      <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                          setSearchQuery(event.target.value)
                        }
                        placeholder="Search users, products, orders..."
                        className="flex-1 border-0 focus:ring-0 focus:outline-none text-sm bg-transparent"
                        autoFocus
                      />

                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {loading &&
                    !searchData.users.length &&
                    !searchData.products.length &&
                    !searchData.orders.length ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500 text-sm">
                          Searching...
                        </p>
                      </div>
                    ) : (
                      <div>
                        {searchResults.users.length > 0 && (
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Users ({searchResults.users.length})
                            </h3>

                            <div className="space-y-2">
                              {searchResults.users.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleResultClick("user")}
                                  className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center space-x-3"
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-800">
                                      {(item.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {item.email}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.products.length > 0 && (
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Products ({searchResults.products.length})
                            </h3>

                            <div className="space-y-2">
                              {searchResults.products.map((item) => {
                                const image =
                                  item.images?.[0]?.image_url ||
                                  item.images?.[0] ||
                                  "";

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => handleResultClick("product")}
                                    className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                      {image ? (
                                        <img
                                          src={image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                          <div className="text-xs text-gray-400">
                                            {(item.name || "P").charAt(0)}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.name}
                                      </p>

                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs text-gray-500">
                                          {item.category}
                                        </span>
                                        <span className="text-xs font-medium">
                                          Rs.{" "}
                                          {Number(
                                            item.price || 0
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {searchResults.orders.length > 0 && (
                          <div className="p-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Orders ({searchResults.orders.length})
                            </h3>

                            <div className="space-y-2">
                              {searchResults.orders.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleResultClick("order")}
                                  className="w-full text-left p-2 rounded hover:bg-gray-50"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        #{String(item.id).slice(0, 8)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.userName}
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-sm font-semibold">
                                        Rs.{" "}
                                        {Number(
                                          item.total || 0
                                        ).toLocaleString()}
                                      </p>

                                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                        {item.status}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {!loading &&
                          searchQuery &&
                          searchResults.users.length === 0 &&
                          searchResults.products.length === 0 &&
                          searchResults.orders.length === 0 && (
                            <div className="p-8 text-center">
                              <SearchIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">
                                No results found for "{searchQuery}"
                              </p>
                            </div>
                          )}

                        {!searchQuery && (
                          <div className="p-8 text-center">
                            <SearchIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">
                              Type to search users, products, or orders
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-11 max-w-[11rem] items-center gap-2 rounded-full border border-white/70 bg-white/65 px-2.5 shadow-sm backdrop-blur-md transition-colors hover:bg-white/80 sm:max-w-[14rem]"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center shrink-0">
                  {adminAvatar ? (
                    <img
                      src={adminAvatar}
                      alt={adminName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold tracking-wide">
                      {userInitials}
                    </span>
                  )}
                </div>

                <div className="hidden min-w-0 flex-1 text-left sm:block">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {adminName}
                  </p>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 shrink-0">
                  <ShieldUserIcon className="w-3.5 h-3.5" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center shrink-0">
                        {adminAvatar ? (
                          <img
                            src={adminAvatar}
                            alt={adminName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold tracking-wide">
                            {userInitials}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {adminName}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-white/50 transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;