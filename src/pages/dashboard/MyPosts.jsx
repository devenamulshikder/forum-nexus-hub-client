/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, use } from "react";
import {
  FaTrash,
  FaComment,
  FaEdit,
  FaThumbsUp,
  FaPlusCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router";
import { Loader } from "../../components";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../provider/AuthProvider";

export const MyPosts = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const toast = useRef(null);

  const {
    data: myPosts = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myPosts", user?.email, currentPage],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-posts?email=${user.email}&page=${currentPage}&limit=${postsPerPage}`
      );
      return res.data;
    },
  });

  const { data: postCount = 0 } = useQuery({
    queryKey: ["postCount", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-posts/count?email=${user.email}`);
      return res.data.count;
    },
  });

  const totalPages = Math.ceil(postCount / postsPerPage);

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
        // If we're on the last page and it's now empty, go back one page
        if (myPosts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#6D7CFF] to-[#A167FF]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Post Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myPosts.map((post) => (
                    <motion.tr
                      key={post._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/post/${post._id}`}
                          className="group flex items-center"
                        >
                          <span className="text-sm font-medium text-gray-900 group-hover:text-[#6D7CFF]">
                            {post.title}
                          </span>
                          <FiExternalLink className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-green-500">
                            <FaThumbsUp className="text-sm" />
                            <span className="text-sm">{post.upVote || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/edit-post/${post._id}`}
                            className="text-[#6D7CFF] hover:text-[#5A6BFF] p-2 rounded-lg hover:bg-[#6D7CFF]/10"
                          >
                            <FaEdit />
                          </Link>
                          <Link
                            to={`/comment/${post._id}`}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-500/10"
                          >
                            <FaComment />
                          </Link>
                          <button
                            onClick={() => handleDeleteConfirm(post._id)}
                            disabled={deletingId === post._id}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {deletingId === post._id ? (
                              <svg
                                className="animate-spin h-4 w-4 text-red-500"
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
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#6D7CFF]/10 text-[#6D7CFF] hover:bg-[#6D7CFF]/20"
                }`}
              >
                <FaChevronLeft />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentPage === totalPages
                        ? "bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#6D7CFF]/10 text-[#6D7CFF] hover:bg-[#6D7CFF]/20"
                }`}
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
