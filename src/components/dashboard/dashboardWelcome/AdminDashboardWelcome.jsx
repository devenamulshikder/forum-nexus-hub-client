/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router";
import Lottie from "lottie-react";
import welcomeAnimation from "../../../../public/dashboardLotties/dashboard.json";
import { FaUsersCog, FaFlag, FaBullhorn, FaUserShield } from "react-icons/fa";

export const AdminDashboardWelcome = () => {
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
        Welcome to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D7CFF] to-[#A167FF]">
          Admin Hub
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Manage the entire forum ecosystem from this powerful command center.
        Keep the community thriving!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          {
            icon: <FaUsersCog className="text-4xl text-[#6D7CFF]" />,
            title: "Manage Users",
            desc: "View, promote, or suspend community members",
            path: "manage-users",
          },
          {
            icon: <FaFlag className="text-4xl text-[#A167FF]" />,
            title: "Reported Content",
            desc: "Review and moderate flagged posts/comments",
            path: "reported-content",
          },
          {
            icon: <FaBullhorn className="text-4xl text-[#6D7CFF]" />,
            title: "Make Announcement",
            desc: "Post important updates to the entire community",
            path: "make-announcement",
          },
          {
            icon: <FaUserShield className="text-4xl text-[#A167FF]" />,
            title: "Admin Profile",
            desc: "View your admin statistics and site metrics",
            path: "profile",
          },
          {
            icon: (
              <svg
                className="w-10 h-10 text-[#6D7CFF]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 7H17M7 12H17M7 17H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 3V21H21V3H3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ),
            title: "Content Moderation",
            desc: "Manage all forum posts and discussions",
            path: "content-moderation",
          },
          {
            icon: (
              <svg
                className="w-10 h-10 text-[#A167FF]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8V12L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ),
            title: "Activity Logs",
            desc: "View detailed system and user activity",
            path: "activity-logs",
          },
        ].map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 mb-4">{item.desc}</p>
            <Link
              to={item.path}
              className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Access Now
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-[#6D7CFF]/10 rounded-lg max-w-2xl">
        <h3 className="text-lg font-semibold text-[#6D7CFF] mb-2">
          Quick Stats
        </h3>
        <p className="text-gray-600">
          You're managing a community of{" "}
          <span className="font-bold">1,240+ members</span> with{" "}
          <span className="font-bold">5,678 posts</span> this month.
        </p>
      </div>
    </motion.div>
  );
};
