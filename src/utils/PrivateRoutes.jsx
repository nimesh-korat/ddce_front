import { Navigate } from "react-router-dom";

// A simple utility to check for the token
// This routes will be for non-logged in users
const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("user") ||
    localStorage.getItem("session");

  if (token) {
    // If the user is logged in, redirect to the home/dashboard page
    return <Navigate to="/" />;
  }

  // If not logged in, render the requested route (signin/signup)
  return children;
};

export default PrivateRoute;
