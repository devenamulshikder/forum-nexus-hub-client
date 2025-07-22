/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router";
import { use } from "react";
import { FaPlusCircle, FaLock, FaCrown } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../provider/AuthProvider";
import { Loader } from "../../components";
import { toast } from "sonner";

export const AddPost = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: myPosts = [], isLoading } = useQuery({
    queryKey: ["myPosts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const mutation = useMutation({
    mutationFn: (newPost) => axiosSecure.post("/posts", newPost),
    onSuccess: () => {
      toast.success("Your post published!");
      queryClient.invalidateQueries(["myPosts"]);
      reset();
      navigate("/dashboard/my-posts");
    },
  });

  const onSubmit = async (data) => {
    const post = {
      image: user.photoURL,
      name: user.displayName,
      email: user.email,
      title: data.title,
      description: data.description,
      tags: data.tags.map((tag) => tag.value),
      createdAt: new Date().toISOString(),
    };
    await mutation.mutateAsync(post);
  };

  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tags");
      return res.data;
    },
  });

  const tagOptions = allTags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  }));

  if (isLoading) {
    return <Loader />;
  }
  if (myPosts.length >= 5 && !user?.premiumMember) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50">
          <FaLock className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Post Limit Reached
        </h3>
        <p className="text-gray-600 mb-6">
          Free members can only create 5 posts. Upgrade to premium for unlimited
          posts.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/membership")}
          className="w-full cursor-pointer bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <FaCrown className="text-yellow-300" />
          Upgrade to Premium
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
          <FaPlusCircle className="text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
          Create New Post
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Author Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              defaultValue={user.displayName}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              defaultValue={user.email}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-500">
                (Your profile image)
              </span>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 10,
                message: "Title must be at least 10 characters",
              },
            })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]/50`}
            placeholder="Enter a descriptive title"
          />
          {errors.title && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.title.message}
            </motion.p>
          )}
        </div>

        {/* Post Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Content <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", {
              required: "Content is required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
            rows={6}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]/50`}
            placeholder="Write your post content here..."
          />
          {errors.description && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.description.message}
            </motion.p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-red-500">*</span>
          </label>
          <Controller
            name="tags"
            control={control}
            rules={{ required: "At least one tag is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={tagOptions}
                className={`react-select-container ${
                  errors.tags ? "react-select-error" : ""
                }`}
                classNamePrefix="react-select"
                placeholder="Select tags (up to 3)"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.tags ? "#ef4444" : "#d1d5db",
                    minHeight: "44px",
                    "&:hover": {
                      borderColor: errors.tags ? "#ef4444" : "#9ca3af",
                    },
                  }),
                }}
              />
            )}
          />
          {errors.tags && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.tags.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold cursor-pointer ${
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
              "Publish Post"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
