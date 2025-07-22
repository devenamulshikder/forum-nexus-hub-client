/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import {
  FaFacebook,
  FaTwitter,
  FaThumbsUp,
  FaThumbsDown,
  FaRegComment,
  FaBookmark,
} from "react-icons/fa";
import { use, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Loader } from "../../components";
import { AuthContext } from "../../provider/AuthProvider";

const PostDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = use(AuthContext);
  const [commentText, setCommentText] = useState("");

  // Fetch post data
  const { data: post = {}, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/post/${id}`);
      return res.data;
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (type) => axiosSecure.patch(`/post/vote/${id}`, { type }),
    onSuccess: () => queryClient.invalidateQueries(["post", id]),
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentText) =>
      axiosSecure.post("/comments", {
        postId: id,
        postTitle: post.title,
        email: user.email,
        name: user.displayName,
        comment: commentText,
        photo: user.photoURL,
      }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries(["post", id]);
    },
  });

  if (isLoading) return <Loader />;

  const {
    image,
    name,
    title,
    description,
    tags = [],
    createdAt,
    upVote = 0,
    downVote = 0,
    comments = [],
  } = post;

  const shareUrl = `${window.location.origin}/post/${id}`;
  const voteScore = upVote - downVote;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Post Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Author Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={image || "/default-avatar.png"}
              alt="Author"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#6D7CFF]/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="font-bold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-gray-700 whitespace-pre-line mb-6">
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#6D7CFF]/10 text-[#6D7CFF] text-sm rounded-full"
                >
                  {typeof tag === "object" ? tag.name : tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Bar */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-3">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => voteMutation.mutate("up")}
                className={`flex items-center gap-2 ${
                  voteMutation.variables === "up"
                    ? "text-green-500"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                <FaThumbsUp />
                <span>{upVote}</span>
              </motion.button>

              <div
                className={`text-sm font-medium ${
                  voteScore > 0
                    ? "text-green-500"
                    : voteScore < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {voteScore} points
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => voteMutation.mutate("down")}
                className={`flex items-center gap-2 ${
                  voteMutation.variables === "down"
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <FaThumbsDown />
                <span>{downVote}</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#6D7CFF]">
                <FaBookmark />
                <span className="hidden sm:inline">Save</span>
              </button>

              <FacebookShareButton url={shareUrl} quote={title}>
                <div className="flex items-center gap-2 text-gray-500 hover:text-[#4267B2]">
                  <FaFacebook />
                  <span className="hidden sm:inline">Share</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <div className="flex items-center gap-2 text-gray-500 hover:text-[#1DA1F2]">
                  <FaTwitter />
                  <span className="hidden sm:inline">Tweet</span>
                </div>
              </TwitterShareButton>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
              <FaRegComment className="text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
              Comments ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start gap-3">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#6D7CFF]/30"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]/50 resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => commentMutation.mutate(commentText)}
                      disabled={
                        !commentText.trim() || commentMutation.isLoading
                      }
                      className={`px-6 py-2 rounded-lg font-medium ${
                        !commentText.trim()
                          ? "bg-gray-300 text-gray-500"
                          : "bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white hover:opacity-90"
                      }`}
                    >
                      {commentMutation.isLoading
                        ? "Posting..."
                        : "Post Comment"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-4 border rounded-lg bg-gray-50 mb-6">
              <p className="text-gray-600">
                Please{" "}
                <a
                  href="/login"
                  className="text-[#6D7CFF] font-medium hover:underline"
                >
                  login
                </a>{" "}
                to comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <img
                    src={comment.photo}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#6D7CFF]/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {comment.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(
                          comment.createdAt || new Date()
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {comment.comment}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;
