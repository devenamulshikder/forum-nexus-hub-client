import { use } from "react";
import { Navigate, useLocation } from "react-router";
import { Loader } from "../components/shared/Loader";
import { AuthContext } from "../provider/AuthProvider";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = use(AuthContext);
  if (loading) {
    return <Loader />;
  }
  if (!user) {
    return <Navigate state={location.pathname} to={"/login"} />;
  }
  return children;
};

export default PrivateRoute;
