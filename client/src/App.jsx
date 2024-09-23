import React, { useState, useContext, useEffect } from "react";
import "./app.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cookies from "js-cookie";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Leftbar from "./components/leftbar/Leftbar";
import Rightbar from "./components/rightbar/Rightbar";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

import { AuthContext } from "./context/AuthContext";
import { ActivitiesContextProvider } from "./context/ActivitiesContext.jsx";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { io } from "socket.io-client";


export const socket = io.connect("http://localhost:8800");

function App() {
  const { currentUser } = useContext(AuthContext);
  const cookie = Cookies.get("accessToken");
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <ActivitiesContextProvider>
          <div>
            <Navbar />
            <div style={{ display: "flex" }}>
              <Leftbar />
              <div style={{ flex: 6 }}>
                <Outlet />
              </div>
              <Rightbar />
            </div>
          </div>
        </ActivitiesContextProvider>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser || !cookie) {
      return <Navigate to="/login" />;
    }
    socket.emit("addUser", currentUser.id);
    return children;
  };

  socket.on("serverError", (error) => {
    console.error("Server error:", error.message);
    socket.emit("addUser", currentUser.id);
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
