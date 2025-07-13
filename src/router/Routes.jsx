import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import { ErrorPage, Home } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);
