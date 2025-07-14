import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/Routes";
import AuthProvider from "./provider/AuthProvider";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </AuthProvider>
);
