// client/src/routes/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login"; // Will create this later
import Register from "../pages/Auth/Register"; // Will create this later

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      // Add other public routes here (e.g., /models)
    ],
  },
  // Add a separate layout for the dashboard/private area later
]);

export default router;