import React from "react";
import { Outlet } from "react-router";
import { Footer, Navbar } from "../components";

const Root = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
