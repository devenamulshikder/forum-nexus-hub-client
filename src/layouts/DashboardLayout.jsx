import { use, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { FaUser, FaPlusCircle, FaList, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { DashboardWelcome } from "../components/dashboard/dashboardWelcome/DashboardWelcome";
import { toast } from "sonner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logOutUser } = use(AuthContext);
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
  const navItems = [
    {
      path: "profile",
      name: "My Profile",
      icon: <FaUser className="text-lg" />,
    },
    {
      path: "add-post",
      name: "Add Post",
      icon: <FaPlusCircle className="text-lg" />,
    },
    {
      path: "my-posts",
      name: "My Posts",
      icon: <FaList className="text-lg" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-300">
          {sidebarOpen ? (
            <Link to={"/"}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
                  <span className="text-white font-bold text-md">FN</span>
                </div>
                <span className="text-xl font-bold">Forum Nexus</span>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] mx-auto">
              <span className="text-white font-bold text-md">FN</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-[#6D7CFF]"
          >
            {sidebarOpen ? (
              <MdOutlineKeyboardDoubleArrowLeft size={25} />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight size={25} />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname.includes(item.path)
                  ? "bg-gradient-to-r from-[#6D7CFF]/10 to-[#A167FF]/10 text-[#6D7CFF] border-l-4 border-[#6D7CFF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-[#6D7CFF]">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full p-3 text-gray-600 hover:text-red-500 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find((item) => location.pathname.includes(item.path))
              ?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {/* <span className="text-gray-600">JD</span> */}
              <img
                className="rounded-full"
                referrerPolicy="no-referrer"
                src={user && user.photoURL}
                alt=""
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {location.pathname === "/dashboard" ? (
            <DashboardWelcome />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
