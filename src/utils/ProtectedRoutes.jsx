import { Navigate } from "react-router-dom";

// A simple utility to check for the token
// This routes will be for logged in users
const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("user") ||
    localStorage.getItem("session");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === 1) {
    return <Navigate to="/admin" />;
  }

  if (!token || user.role !== 0) {
    // If the user is not logged in, redirect them to the sign-in page
    return <Navigate to="/signin" />;
  }

  // If the user is logged in, render the requested protected route
  return children;
};

export default ProtectedRoute;
