/* eslint-disable no-unused-vars */
import { Link, NavLink } from "react-router";
import { use, useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AuthContext } from "../../provider/AuthProvider";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export const Navbar = () => {
  const { user, logOutUser } = use(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Handle logout
  const handleLogOut = () => {
    logOutUser()
      .then(() => {
        toast.success("Signed out successfully!");
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`);
      });
  };

  const { data: countData } = useQuery({
    queryKey: ["announcementCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements/count");
      return res.data;
    },
  });
  const count = countData?.count || 0;

    const { data: userInfo = {}, refetch  } = useQuery({
      queryKey: ["userInfo", user?.email],
      enabled: !!user?.email,
      queryFn: async () => {
        const res = await axiosSecure.get(`/user?email=${user.email}`);
        return res.data;
      },
    });
    refetch()
  return (
    <div
      className={`shadow-sm top-0 sticky z-50 transition-all duration-300 ${
        isScrolled ? "bg-transparent backdrop-blur-sm" : "bg-white"
      }`}
    >
      <div className="">
        <div className="navbar container mx-auto">
          <div className="navbar-start hover:opacity-90">
            <div>
              <Link to={"/"} tabIndex={0} role="button" className="lg:hidden">
                <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
                  <span className="text-white font-bold text-md">FN</span>
                </div>
              </Link>
            </div>
            <div className="navbar-start hidden lg:flex">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
                  <span className="text-white font-bold text-lg">FN</span>
                </div>
                <span className="text-2xl font-bold">Forum Nexus Hub</span>
              </Link>
            </div>
          </div>
          <div className="navbar-center text-lg gap-3 mr-3 md:gap-6 md:mr-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-semibold bg-gradient-to-br from-[#6D7CFF] to-[#635BFF] bg-clip-text text-transparent border-b-2 border-[#6D7CFF]"
                  : "text-lg text-gray-500 font-semibold relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#6D7CFF] after:transition-all after:duration-300 hover:after:w-full"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/membership"
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-semibold bg-gradient-to-br from-[#6D7CFF] to-[#635BFF] bg-clip-text text-transparent border-b-2 border-[#6D7CFF]"
                  : "text-lg text-gray-500 font-semibold relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#6D7CFF] after:transition-all after:duration-300 hover:after:w-full"
              }
            >
              Membership
            </NavLink>
          </div>
          <div className="navbar-end">
            <div className="relative flex items-center justify-center mr-1 text-[#6D7CFF] hover:text-[#A167FF]">
              {user && (
                <button className="cursor-pointer">
                  <IoIosNotificationsOutline size={30} />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              )}
            </div>
            {!user ? (
              <div>
                <Link to={"/login"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="text-white font-bold md:text-lg px-3 md:px-4 py-2 cursor-pointer rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]"
                  >
                    Join Us
                  </motion.button>
                </Link>
              </div>
            ) : (
              <>
                <Tooltip
                  id="profile-tooltip"
                  place="bottom-end"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #6D7CFF, #A167FF)",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <div className="dropdown dropdown-end">
                  {/* Avatar Button */}
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar hover:bg-gray-100 transition-colors duration-200"
                    data-tooltip-id="profile-tooltip"
                    data-tooltip-content={userInfo?.name || "User Profile"}
                  >
                    <div className="w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                      <img
                        src={
                          userInfo?.photo ||
                          "https://via.placeholder.com/40"
                        }
                        alt="user photo"
                        referrerPolicy="no-referrer"
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-white rounded-lg z-50 mt-3 w-48 p-2 shadow-lg border border-gray-100"
                  >
                    {/* User Name */}
                    <div className="px-2 py-1 mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {userInfo?.name || "User"}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    <li>
                      <Link
                        to="/dashboard"
                        className="text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-150"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                        </svg>
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={handleLogOut}
                        className="text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 w-full text-left"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
