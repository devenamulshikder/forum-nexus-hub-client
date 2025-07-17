/* eslint-disable no-unused-vars */
import { Link, NavLink } from "react-router";
import { use, useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AuthContext } from "../../provider/AuthProvider";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Navbar = () => {
  const { user, logOutUser } = use(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);

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
                  ? "text-xl font-semibold bg-gradient-to-br from-[#6D7CFF] to-[#635BFF] bg-clip-text text-transparent border-b-2 border-[#6D7CFF]"
                  : "text-xl text-gray-500 font-semibold relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#6D7CFF] after:transition-all after:duration-300 hover:after:w-full"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/membership"
              className={({ isActive }) =>
                isActive
                  ? "text-xl font-semibold bg-gradient-to-br from-[#6D7CFF] to-[#635BFF] bg-clip-text text-transparent border-b-2 border-[#6D7CFF]"
                  : "text-xl text-gray-500 font-semibold relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#6D7CFF] after:transition-all after:duration-300 hover:after:w-full"
              }
            >
              Membership
            </NavLink>
          </div>
          <div className="navbar-end">
            <div className="flex items-center justify-center mr-1 text-[#6D7CFF] hover:text-[#A167FF]">
              <button className="cursor-pointer">
                <IoIosNotificationsOutline size={30} />
              </button>
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
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                    data-tooltip-id="profile-tooltip"
                    data-tooltip-content={user?.displayName || "User Profile"}
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="user photo"
                        referrerPolicy="no-referrer"
                        src={user?.photoURL || "https://via.placeholder.com/40"}
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-40 p-2 shadow"
                  >
                    <p className="ml-2 text-gray-500">
                      {user?.displayName || "User"}
                    </p>
                    <li>
                      <Link to="/dashboard" className="text-[15px] font-medium">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        to="/dashboard"
                        className="text-[15px] font-medium"
                      >
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
