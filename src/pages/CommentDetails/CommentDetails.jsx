// CommentDetails.jsx
import { use, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaFlag } from "react-icons/fa";
import { toast } from "sonner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../provider/AuthProvider";
import CommentModal from "./CommentModal";

export const CommentDetails = () => {
  const { user } = use(AuthContext);
  const { postId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [activeComment, setActiveComment] = useState(null);

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${postId}`);
      return res.data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: ({ commentId, feedback }) =>
      axiosSecure.post("/reports", {
        commentId,
        feedback,
        reporterName: user?.displayName || "Anonymous",
        reporterEmail: user?.email || "Anonymous",
        reporterPhoto: user?.photoURL || "https://via.placeholder.com/150",
      }),
    onSuccess: () => {
      toast.success("Comment reported successfully");
      refetch();
    },
  });

  const feedbackOptions = [
    "This is spam",
    "Hate speech or symbols",
    "Bullying or harassment",
  ];

  const handleReport = (commentId) => {
    if (selectedFeedback[commentId]) {
      reportMutation.mutate({
        commentId,
        feedback: selectedFeedback[commentId],
      });
      setSelectedFeedback((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
        Comments for Post #{postId}
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Commenter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={comment.photo}
                      alt={comment.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{comment.name}</p>
                      <p className="text-xs text-gray-500">{comment.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {comment.comment.length > 20 ? (
                      <>
                        {comment.comment.substring(0, 20)}...
                        <button
                          className="text-[#6D7CFF] text-sm ml-1 hover:underline"
                          onClick={() => setActiveComment(comment)}
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      comment.comment
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={selectedFeedback[comment._id] || ""}
                    onChange={(e) =>
                      setSelectedFeedback((prev) => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#6D7CFF] focus:border-[#6D7CFF] sm:text-sm rounded-md"
                  >
                    <option value="">Select feedback</option>
                    {feedbackOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleReport(comment._id)}
                    disabled={!selectedFeedback[comment._id]}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                      selectedFeedback[comment._id]
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaFlag className="text-xs" />
                    Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeComment && (
        <CommentModal
          comment={activeComment}
          onClose={() => setActiveComment(null)}
        />
      )}
    </div>
  );
};
