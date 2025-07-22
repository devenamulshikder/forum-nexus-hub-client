import { Outlet } from "react-router";
import { Footer, Loader, Navbar } from "../components";
import { AuthContext } from "../provider/AuthProvider";

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
