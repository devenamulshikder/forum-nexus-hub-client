/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router";
import Lottie from "lottie-react";
import welcomeAnimation from "../../../../public/dashboardLotties/dashboard.json";

export const DashboardWelcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-6"
    >
      {/* Animated Welcome Sticker */}
      <div className="w-64 h-64 mb-2">
        <Lottie animationData={welcomeAnimation} loop={true} autoplay={true} />
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D7CFF] to-[#A167FF]">
          Command Center
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Everything you need to manage your forum experience is right here. Let's
        make something amazing together!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          {
            icon: "👤",
            title: "Build Your Profile",
            desc: "Showcase your expertise to the community",
            path: "profile",
          },
          {
            icon: "✍️",
            title: "Create Posts",
            desc: "Share your knowledge with others",
            path: "add-post",
          },
          {
            icon: "📚",
            title: "Manage Content",
            desc: "Organize and edit your contributions",
            path: "my-posts",
          },
        ].map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 mb-4">{item.desc}</p>
            <Link
              to={item.path}
              className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
