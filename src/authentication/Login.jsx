/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add your authentication logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white">
              <span className=" font-bold text-2xl">FN</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/90 mt-2">
            Join the conversation with developers worldwide
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: {
                  hasUpper: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                  hasLower: (value) =>
                    /[a-z]/.test(value) ||
                    "Must contain at least one lowercase letter",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
              placeholder="••••••••"
            />
            {errors.password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600 space-y-1"
              >
                {errors.password.message
                  .split("Must")
                  .filter(Boolean)
                  .map((msg, i) => (
                    <p key={i}>Must {msg}</p>
                  ))}
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 text-[#6D7CFF] focus:ring-[#6D7CFF] border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-[#6D7CFF] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </motion.button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#6D7CFF] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
