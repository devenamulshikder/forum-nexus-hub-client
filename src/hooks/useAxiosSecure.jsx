import axios from "axios";
import { use } from "react";
import { AuthContext } from "../provider/AuthProvider";

const axiosSecure = axios.create({
  baseURL: `https://forum-nexus-hub-server.vercel.app`,
});
const useAxiosSecure = () => {
  const {user} = use(AuthContext);
  axiosSecure.interceptors.request.use((config) => {
    const token = user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return axiosSecure;
};

export default useAxiosSecure;
