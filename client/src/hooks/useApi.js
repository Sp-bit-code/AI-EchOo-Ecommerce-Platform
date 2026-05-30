import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateUser,
  deleteUserProfile,
  updateOrderStatus,
} from "../api/adminApi";

const resourceMap = {
  products: {
    list: getAllProducts,
    create: createAdminProduct,
    patch: updateAdminProduct,
    remove: deleteAdminProduct,
  },

  users: {
    list: getAllUsers,
    patch: updateUser,
    remove: deleteUserProfile,
  },

  orders: {
    list: getAllOrders,
    patch: updateOrderStatus,
  },
};

const normalizeError = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (typeof error?.error_description === "string") {
    return error.error_description;
  }

  if (typeof error?.details === "string") {
    return error.details;
  }

  if (typeof error?.hint === "string") {
    return error.hint;
  }

  return "Request failed";
};

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  if (Array.isArray(response?.orders)) {
    return response.orders;
  }

  if (Array.isArray(response?.users)) {
    return response.users;
  }

  return response || [];
};

const applyClientFilters = (items = [], params = {}) => {
  if (!Array.isArray(items)) {
    return items;
  }

  let list = [...items];

  const query = String(params?.q || "").trim().toLowerCase();

  if (query) {
    list = list.filter((item) => {
      const values = [
        item.id,
        item.name,
        item.full_name,
        item.email,
        item.brand,
        item.category,
        item.status,
        item.order_status,
        item.userName,
        item.userEmail,
      ];

      return values.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }

  if (params?.category && params.category !== "all") {
    list = list.filter(
      (item) =>
        String(item.category || "").toLowerCase() ===
        String(params.category).toLowerCase()
    );
  }

  if (params?.status && params.status !== "all") {
    list = list.filter(
      (item) =>
        String(item.status || item.order_status || "").toLowerCase() ===
        String(params.status).toLowerCase()
    );
  }

  if (params?.payment_method && params.payment_method !== "all") {
    list = list.filter(
      (item) =>
        String(item.payment_method || item.paymentMethod || "").toLowerCase() ===
        String(params.payment_method).toLowerCase()
    );
  }

  if (params?.sort === "newest") {
    list.sort(
      (a, b) =>
        new Date(b.created_at || b.createdAt || 0) -
        new Date(a.created_at || a.createdAt || 0)
    );
  }

  if (params?.sort === "oldest") {
    list.sort(
      (a, b) =>
        new Date(a.created_at || a.createdAt || 0) -
        new Date(b.created_at || b.createdAt || 0)
    );
  }

  if (params?.sort === "amount-high" || params?.sort === "total-high") {
    list.sort(
      (a, b) =>
        Number(b.total || b.total_amount || b.price || 0) -
        Number(a.total || a.total_amount || a.price || 0)
    );
  }

  if (params?.sort === "amount-low" || params?.sort === "total-low") {
    list.sort(
      (a, b) =>
        Number(a.total || a.total_amount || a.price || 0) -
        Number(b.total || b.total_amount || b.price || 0)
    );
  }

  const total = list.length;

  if (params?.offset !== undefined || params?.limit !== undefined) {
    const offset = Number(params.offset || 0);
    const limit = Number(params.limit || list.length);

    list = list.slice(offset, offset + limit);
  }

  return {
    results: list,
    total,
  };
};

export default function useApi(resource, options = {}) {
  const config = resourceMap[resource];

  const listParams = useMemo(() => {
    return options.listParams || {};
  }, [options.listParams]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(config?.list));
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (paramsOverride) => {
      if (!config?.list) {
        setError(`Unsupported resource: ${resource}`);
        setLoading(false);
        return [];
      }

      const params = paramsOverride ?? listParams;

      try {
        setLoading(true);
        setError(null);

        const response = await config.list(params);
        const normalizedData = normalizeListResponse(response);
        const filteredData = applyClientFilters(normalizedData, params);

        setData(filteredData);

        return filteredData;
      } catch (err) {
        const message = normalizeError(err);
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [config, listParams, resource]
  );

  const createData = useCallback(
    async (payload) => {
      if (!config?.create) {
        throw new Error(`Create not supported for ${resource}`);
      }

      try {
        setLoading(true);
        setError(null);

        const response = await config.create(payload);

        await fetchData();

        return response?.data || response;
      } catch (err) {
        const message = normalizeError(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, fetchData, resource]
  );

  const patchData = useCallback(
    async (id, payload) => {
      if (!config?.patch) {
        throw new Error(`Patch not supported for ${resource}`);
      }

      try {
        setLoading(true);
        setError(null);

        let response;

        if (resource === "orders") {
          response = await config.patch(id, payload?.status || payload);
        } else {
          response = await config.patch(id, payload);
        }

        await fetchData();

        return response?.data || response;
      } catch (err) {
        const message = normalizeError(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, fetchData, resource]
  );

  const deleteData = useCallback(
    async (id) => {
      if (!config?.remove) {
        throw new Error(`Delete not supported for ${resource}`);
      }

      try {
        setLoading(true);
        setError(null);

        await config.remove(id);
        await fetchData();

        return true;
      } catch (err) {
        const message = normalizeError(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, fetchData, resource]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    createData,
    patchData,
    deleteData,
  };
}