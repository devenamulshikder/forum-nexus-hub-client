/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FaMedal, FaEdit, FaUserShield, FaHistory } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router";
import { use } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Loader } from "../../components";

export const MyProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Get user info
  const { data: userInfo = {}, isLoading: userLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?email=${user.email}`);
      return res.data;
    },
  });

  const { data: recentPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["recentPosts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/recent?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (userLoading || postsLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <motion.div whileHover={{ scale: 1.03 }} className="relative">
            <img
              src={userInfo?.photo || "/default-avatar.png"}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <Link
              // to="/dashboard/edit-profile"
              className="absolute bottom-0 right-0 bg-[#6D7CFF] text-white p-2 rounded-full shadow-sm hover:bg-[#5A6BFF] transition-colors"
            >
              <FaEdit size={14} />
            </Link>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {userInfo?.name || "Anonymous User"}
              </h2>
              {userInfo?.role === "admin" && (
                <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                  <FaUserShield /> Admin
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{userInfo?.email}</p>
            <div className="flex flex-wrap gap-2">
              {/* Gold Badge (conditional) */}
              {userInfo?.isMember ? (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-1 bg-gradient-to-br from-yellow-500 to-yellow-600 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-sm"
                >
                  <FaMedal className="text-orange-600" />
                  Premium Member
                </motion.div>
              ) : (
                <>
                  {/* Bronze Badge */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-400 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-sm"
                  >
                    <FaMedal className="text-white" />
                    Bronze Member
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Recent Posts
          </h3>
          <p className="text-3xl font-bold text-[#6D7CFF]">
            {/* {userInfo?.postCount || 0} */}
            {recentPosts.length}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">Upvotes</h3>
          <p className="text-3xl font-bold text-green-500">
            {userInfo?.upvotes || 0}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Member Since
          </h3>
          <p className="text-xl font-semibold text-gray-700">
            {new Date(userInfo?.createdAt).toLocaleDateString() || "N/A"}
          </p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
              <FaHistory className="text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
              Recent Activity
            </h3>
          </div>
          <Link
            to="/dashboard/my-posts"
            className="text-sm text-[#6D7CFF] hover:underline"
          >
            View All
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring" }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <Link to={`/post/${post._id}`} className="group flex-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-[#6D7CFF] transition-colors flex items-center gap-1">
                      {post.title}
                      <FiExternalLink className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                  </Link>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity found</p>
            <Link
              to="/dashboard/add-post"
              className="inline-block mt-4 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};
