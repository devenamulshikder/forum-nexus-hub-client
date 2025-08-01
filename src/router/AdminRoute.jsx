import { use } from "react";
import { Navigate, useLocation } from "react-router";
import { Loader } from "../components";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const AdminRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const { data: userInfo, isLoading: userInfoLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?email=${user.email}`);
      return res.data;
    },
  });
  if (loading || userInfoLoading) {
    return <Loader />;
  }
  if (!user || userInfo?.role !== "admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};
export default AdminRoute;
