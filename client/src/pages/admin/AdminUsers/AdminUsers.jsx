import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { getAllUsers, updateUser, deleteUserProfile } from "../../../api/adminApi";
import { useAuth } from "../../../context/AuthContext.jsx";
import AdminPagination from "../AdminPagination/AdminPagination.jsx";

import "./AdminUsers.css";

const USERS_PER_PAGE = 10;

const AdminUsers = () => {
  const { user: currentUser, profile: currentProfile } = useAuth();

  const [rawUsers, setRawUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    role: "",
    status: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const listParams = useMemo(
    () => ({
      limit: USERS_PER_PAGE,
      offset: (currentPage - 1) * USERS_PER_PAGE,
    }),
    [currentPage]
  );

  const normalizeUser = (user) => {
    return {
      ...user,
      name: user.name || user.full_name || user.email || "User",
      full_name: user.full_name || user.name || "",
      email: user.email || "",
      role: user.role || "User",
      status: user.status || "Active",
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const usersData = await getAllUsers();

      setRawUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const allUsers = useMemo(() => {
    return (rawUsers || []).map(normalizeUser);
  }, [rawUsers]);

  const totalUsers = allUsers.length;

  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE));

  const users = useMemo(() => {
    const start = listParams.offset;
    const end = start + listParams.limit;

    return allUsers.slice(start, end);
  }, [allUsers, listParams]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      role: user.role || "User",
      status: user.status || "Active",
    });

    setShowEditModal(true);
    toast.info(`Editing user: ${user.name}`);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, editForm);

      toast.success("User updated successfully!");

      setShowEditModal(false);
      setEditingUser(null);

      await fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (user) => {
    const currentUserId = currentUser?.id || currentProfile?.id;

    if (currentUserId && user.id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await deleteUserProfile(user.id);

      toast.success(`User ${user.name} deleted successfully!`);

      await fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">Error loading users</div>

        <div className="text-red-600 text-sm mt-1">{error}</div>

        <button
          onClick={fetchUsers}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit User: {editingUser.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>

                  <select
                    value={editForm.role}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        role: event.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>

                  <select
                    value={editForm.status}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        status: event.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
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
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Users Management
          </h1>

          <p className="text-gray-600">
            Manage user roles and permissions ({totalUsers} users)
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
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
              {users.length > 0 ? (
                users.map((user) => {
                  const currentUserId = currentUser?.id || currentProfile?.id;
                  const isCurrentUser = currentUserId && user.id === currentUserId;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>

                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}

                              {isCurrentUser && (
                                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  You
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-500">
                              ID: {String(user.id).slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 rounded hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={Boolean(isCurrentUser)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={USERS_PER_PAGE}
          itemLabel="users"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminUsers;