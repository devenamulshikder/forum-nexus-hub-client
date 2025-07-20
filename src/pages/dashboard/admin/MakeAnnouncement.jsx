/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { motion } from "framer-motion";
import { FaBullhorn, FaPaperclip } from "react-icons/fa";

export const MakeAnnouncement = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { mutate } = useMutation({
    mutationFn: (data) => axiosSecure.post("/announcements", data),
    onSuccess: () => {
      toast.success("Announcement posted successfully!");
      reset();
      queryClient.invalidateQueries(["announcements"]);
      queryClient.invalidateQueries(["announcementCount"]);
    },
    onError: () => toast.error("Failed to post announcement"),
  });

  const onSubmit = async (data) => {
    const announcement = {
      image: user.photoURL,
      name: user.displayName,
      title: data.title,
      description: data.description,
      priority: data.priority,
      createdAt: new Date().toISOString(),
    };
    mutate(announcement);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
          <FaBullhorn className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
          Create Announcement
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Author Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="Author"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-800">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-sm text-gray-500">Posting as administrator</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Important forum update..."
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Announcement Details <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={6}
              placeholder="Write your announcement details here..."
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold ${
                isSubmitting ? "opacity-70" : "hover:opacity-90"
              } transition-opacity`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaBullhorn />
                  Publish Announcement
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
