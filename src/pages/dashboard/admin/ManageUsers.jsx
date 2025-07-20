/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "sonner";
import { FaSearch, FaUserShield, FaCrown, FaUser, FaBan } from "react-icons/fa";
import { motion } from "framer-motion";
import { Loader } from "../../../components";

export const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  // Fetch users with search
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}`);
      return res.data;
    },
  });
  // Role update mutations
  const updateRole = async (id, newRole) => {
    setActionLoading(id);
    try {
      await axiosSecure.patch(`/users/admin/${id}`, { role: newRole });
      toast.success(
        `User ${newRole === "admin" ? "promoted to admin" : "demoted to user"}!`
      );
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      toast.error(`Failed to update role: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };
  //   role update
  const updateRoleUser = async (id, newRole) => {
    setActionLoading(id);
    try {
      await axiosSecure.patch(`/users/demote/${id}`, { role: newRole });
      toast.success(
        `User ${
          newRole === "admin" ? "promoted to admin" : "demoted to admin"
        }!`
      );
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      toast.error(`Failed to update role: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };
  // Ban user mutation
  const toggleBan = async (id, isBanned) => {
    setActionLoading(id);
    try {
      await axiosSecure.patch(`/users/ban/${id}`, { banned: !isBanned });
      toast.success(`User ${isBanned ? "unbanned" : "banned"} successfully!`);
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      toast.error(`Failed to ${isBanned ? "unban" : "ban"} user`);
    } finally {
      setActionLoading(null);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
            <FaUserShield className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
            User Management
          </h2>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D7CFF] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  whileHover={{ backgroundColor: "rgba(109, 124, 255, 0.05)" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.photo || "/default-avatar.png"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.banned ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Banned
                      </span>
                    ) : user.role === "admin" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.subscription === "member" ? (
                      <span className="flex items-center text-yellow-600">
                        <FaCrown className="mr-1" /> Premium
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <FaUser className="mr-1" /> Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {user.role !== "admin" ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateRole(user._id, "admin")}
                          disabled={actionLoading === user._id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-[#6D7CFF] hover:bg-[#5A6BFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D7CFF] disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <FaUserShield className="-ml-0.5 mr-1.5 h-3 w-3" />
                          )}
                          Make Admin
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateRoleUser(user._id, "user")}
                          disabled={actionLoading === user._id}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D7CFF] disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-700"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <FaUser className="-ml-0.5 mr-1.5 h-3 w-3" />
                          )}
                          Demote
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleBan(user._id, user.banned)}
                        disabled={actionLoading === user._id}
                        className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D7CFF] disabled:opacity-50 ${
                          user.banned
                            ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                            : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                        }`}
                      >
                        {actionLoading === user._id ? (
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <FaBan className="-ml-0.5 mr-1.5 h-3 w-3" />
                        )}
                        {user.banned ? "Unban" : "Ban"}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your search</p>
        </div>
      )}
    </motion.div>
  );
};
