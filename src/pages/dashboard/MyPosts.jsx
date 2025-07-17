/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import {
  FaTrash,
  FaComment,
  FaEdit,
  FaThumbsUp,
  FaThumbsDown,
  FaPlusCircle,
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../provider/AuthProvider";
import { Loader } from "../../components";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export const MyPosts = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [deletingId, setDeletingId] = useState(null);
  const toast = useRef(null);

  const {
    data: myPosts = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myPosts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-posts?email=${user.email}`);
      return res.data;
    },
  });

  const handleDeleteConfirm = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this post?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      position: "top-right",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await axiosSecure.delete(`/posts/${id}`);
      if (res.data.deletedCount > 0) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "Post deleted successfully",
          life: 3000,
        });
        refetch();
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete post",
        life: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
            <MdOutlinePostAdd className="text-white text-xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
            My Forum Posts
          </h2>
        </div>
        <Link
          to="/dashboard/add-post"
          className="flex items-center gap-2 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <FaPlusCircle />
          Create New Post
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
            <MdOutlinePostAdd className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't created any posts yet. Start a discussion to engage with
            the community!
          </p>
          <Link
            to="/dashboard/add-post"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FaPlusCircle />
            Create Your First Post
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {myPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link to={`/posts/${post._id}`} className="group">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#6D7CFF] transition-colors flex items-center gap-2">
                      {post.title}
                      <FiExternalLink className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaThumbsUp className="text-green-500" />
                      <span>{post.upVote || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaThumbsDown className="text-red-500" />
                      <span>{post.downVote || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaComment className="text-blue-500" />
                      <span>{post.commentCount || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/dashboard/edit-post/${post._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FaEdit />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteConfirm(post._id)}
                      disabled={deletingId === post._id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === post._id ? (
                        <svg
                          className="animate-spin h-4 w-4 text-red-600"
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
                        <FaTrash />
                      )}
                      {deletingId === post._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
