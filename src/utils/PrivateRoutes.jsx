import { Navigate } from "react-router-dom";

// A simple utility to check for the token
const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    document.cookie.split(";").find((c) => c.trim().startsWith("token_id="));

  if (token) {
    // If the user is logged in, redirect to the home/dashboard page
    return <Navigate to="/" />;
  }

  // If not logged in, render the requested route (signin/signup)
  return children;
};

export default PrivateRoute;
