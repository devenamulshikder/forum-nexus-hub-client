/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaBullhorn, FaRegClock, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
export const AnnouncementList = () => {
  const axiosSecure = useAxiosSecure();
  const [expandedId, setExpandedId] = useState(null);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  });
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  if (!announcements.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
          <FaBullhorn className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Announcements Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Check back later for important updates from the forum team
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
          <FaBullhorn className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
          Announcements
        </h2>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <motion.div
            key={announcement._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
              expandedId === announcement._id ? "ring-2 ring-[#6D7CFF]" : ""
            }`}
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() =>
                setExpandedId(
                  expandedId === announcement._id ? null : announcement._id
                )
              }
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col  justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          announcement.priority
                        )} flex items-center gap-1`}
                      >
                        {announcement.priority === "high" && (
                          <FaExclamationTriangle className="text-xs" />
                        )}
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Posted by {announcement.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                    <FaRegClock className="text-xs" />
                    {new Date(announcement.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {expandedId === announcement._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <p className="text-gray-700 whitespace-pre-line">
                    {announcement.description}
                  </p>
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[#6D7CFF] hover:underline font-medium"
                    >
                      Learn more →
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
