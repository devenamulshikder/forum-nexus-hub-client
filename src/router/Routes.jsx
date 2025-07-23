import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import {
  AddPost,
  AdminProfile,
  CommentDetails,
  ErrorPage,
  Home,
  MakeAnnouncement,
  ManageUsers,
  MembershipPage,
  MyPosts,
  MyProfile,
  PostDetails,
  ReportedComments,
} from "../pages";
import { Login, Register } from "../authentication";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminRoute from "./AdminRoute";

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
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/post/:id",
        element: <PostDetails />,
      },
      {
        path: "/membership",
        element: (
          <PrivateRoute>
            <MembershipPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/comment/:postId",
        element: <CommentDetails />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        Component: MyProfile,
      },
      {
        path: "add-post",
        Component: AddPost,
      },
      {
        path: "my-posts",
        Component: MyPosts,
      },
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "make-announcement",
        element: (
          <AdminRoute>
            <MakeAnnouncement />
          </AdminRoute>
        ),
      },
      {
        path: "reported-content",
        element: (
          <AdminRoute>
            <ReportedComments />
          </AdminRoute>
        ),
      },
    ],
  },
]);
