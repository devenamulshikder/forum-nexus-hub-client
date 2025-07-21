import React, { use } from "react";
import { Outlet } from "react-router";
import { Footer, Loader, Navbar } from "../components";
import { AuthContext } from "../provider/AuthProvider";

const Root = () => {
  const { loading } = use(AuthContext);
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Root;
