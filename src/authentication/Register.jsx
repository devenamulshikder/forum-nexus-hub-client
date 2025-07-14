/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { use } from "react"; // Replaced use with useContext
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, updateUser, loading, setUser, setLoading, googleLogin } =
    use(AuthContext); // Use useContext instead of use

  const onSubmit = (data) => {
    const { email, password, fullName, photoURL } = data; // Destructure form data
    createUser(email, password)
      .then((result) => {
        const user = result.user;
        return updateUser({ displayName: fullName, photoURL: photoURL || null }) // Use fullName and photoURL from form data
          .then(() => {
            setUser({
              ...user,
              displayName: fullName,
              photoURL: photoURL || null,
            });
            toast.success("Registration successful!");
            navigate(location?.state ? location.state : "/");
          });
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Google login successful!");
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Add your Facebook authentication logic here
    toast.info("Facebook login not implemented yet.");
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
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-white/90 mt-2">
            Join our community of developers and tech enthusiasts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.fullName.message}
              </motion.p>
            )}
          </div>

          <div>
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Photo URL (Optional)
            </label>
            <input
              id="photoURL"
              type="url"
              {...register("photoURL", {
                pattern: {
                  value: /^(https?:\/\/).+$/i,
                  message: "Please enter a valid URL",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.photoURL ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#6D7CFF]`}
              placeholder="https://example.com/photo.jpg"
            />
            {errors.photoURL && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.photoURL.message}
              </motion.p>
            )}
          </div>

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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-2"
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <FaSpinner className="animate-spin" />
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.24 10.5v2.25h5.76c-.24 1.31-1.92 3.75-5.76 3.75-3.47 0-6.29-2.81-6.29-6.25s2.82-6.25 6.29-6.25c1.57 0 2.96.58 4.03 1.53l3.04-3.04C17.56 1.29 15.03 0 12.24 0 6.54 0 2 4.54 2 10.25s4.54 10.25 10.24 10.25c5.89 0 10.24-4.14 10.24-10.25 0-.65-.07-1.29-.18-1.91h-10.06z" />
              </svg>
              <span>With Google</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleFacebookLogin}
              className="w-full bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 12.07C22 6.54 17.46 2 12 2S2 6.54 2 12.07c0 5.01 3.66 9.18 8.44 9.94v-7.03h-2.54v-2.91h2.54v-2.22c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34v7.03C18.34 21.25 22 17.08 22 12.07z" />
              </svg>
              <span>With Facebook</span>
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6D7CFF] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
