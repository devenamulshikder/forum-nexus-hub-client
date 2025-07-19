/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaUserShield, FaPlusCircle, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "../../../components";

const COLORS = ["#6D7CFF", "#A167FF", "#4FD1C5", "#FF6B6B"];

export const AdminProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("stats");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch admin info and stats
  const { data: adminData = {}, isLoading } = useQuery({
    queryKey: ["adminData", user?.email],
    queryFn: async () => {
      const [infoRes, statsRes] = await Promise.all([
        axiosSecure.get(`/admin/profile?email=${user.email}`),
        axiosSecure.get("/admin/stats"),
      ]);
      return {
        profile: infoRes.data,
        stats: statsRes.data,
      };
    },
    enabled: !!user?.email,
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tags");
      return res.data;
    },
  });

  // Add tag mutation
  const { mutate: addTag } = useMutation({
    mutationFn: (newTag) => axiosSecure.post("/tags", newTag),
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      toast.success("Tag added successfully!");
      reset();
    },
    onError: () => toast.error("Failed to add tag"),
  });

  // Delete tag mutation
  const { mutate: deleteTag } = useMutation({
    mutationFn: (tagId) => axiosSecure.delete(`/tags/${tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      toast.success("Tag deleted successfully!");
    },
  });

  const onSubmit = (data) => {
    addTag(data);
  };

  const pieData = [
    { name: "Posts", value: adminData.stats?.totalPosts || 0 },
    { name: "Comments", value: adminData.stats?.totalComments || 0 },
    { name: "Users", value: adminData.stats?.totalUsers || 0 },
    { name: "Active", value: adminData.stats?.activeUsers || 0 },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="flex-shrink-0">
          <img
            src={adminData.profile?.photo || "/default-avatar.png"}
            referrerPolicy="no-referrer"
            alt="Admin"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">
              {adminData.profile?.displayName}
            </h2>
            <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              <FaUserShield /> Admin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#6D7CFF]/10 to-[#A167FF]/10 p-4 rounded-lg">
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{adminData.profile?.email}</p>
            </div>
            <div className="bg-gradient-to-br from-[#6D7CFF]/10 to-[#A167FF]/10 p-4 rounded-lg">
              <p className="text-gray-600">Your Posts</p>
              <p className="font-medium">{adminData.profile?.postCount || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-[#6D7CFF]/10 to-[#A167FF]/10 p-4 rounded-lg">
              <p className="text-gray-600">Your Comments</p>
              <p className="font-medium">
                {adminData.profile?.commentCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-medium ${
            activeTab === "stats"
              ? "text-[#6D7CFF] border-b-2 border-[#6D7CFF]"
              : "text-gray-500"
          }`}
        >
          Site Statistics
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`px-4 py-2 font-medium ${
            activeTab === "tags"
              ? "text-[#6D7CFF] border-b-2 border-[#6D7CFF]"
              : "text-gray-500"
          }`}
        >
          Tag Management
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
            Community Overview
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold">
                {adminData.stats?.totalPosts || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Total Comments</p>
              <p className="text-2xl font-bold">
                {adminData.stats?.totalComments || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">
                {adminData.stats?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">
                {adminData.stats?.activeUsers || 0}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tags Tab */}
      {activeTab === "tags" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
            Tag Management
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
            <div className="flex gap-2">
              <input
                {...register("name", { required: "Tag name is required" })}
                type="text"
                placeholder="Enter new tag name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white px-4 py-2 rounded-lg font-medium"
              >
                <FaPlusCircle className="inline mr-2" />
                Add Tag
              </motion.button>
            </div>
            {errors.name && (
              <p className="mt-1 text-red-500">{errors.name.message}</p>
            )}
          </form>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium">
              <div className="col-span-8">Tag Name</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>

            {tags.length > 0 ? (
              tags.map((tag) => (
                <motion.div
                  key={tag._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-12 items-center p-3 border-b hover:bg-gray-50"
                >
                  <div className="col-span-8 font-medium">{tag.name}</div>
                  <div className="col-span-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTag(tag._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No tags found</div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
