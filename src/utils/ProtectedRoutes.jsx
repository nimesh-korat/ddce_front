import { Navigate } from "react-router-dom";

// A simple utility to check for the token
const ProtectedRoute = ({ children }) => {
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("token_id="));
  console.log("Cookie:", document.cookie);
  
  if (!cookie) {
    localStorage.removeItem("token");
  }
  const token =
    localStorage.getItem("token") ||
    document.cookie.split(";").find((c) => c.trim().startsWith("token_id="));

  if (!token) {
    // If the user is not logged in, redirect them to the sign-in page
    return <Navigate to="/signin" />;
  }

  // If the user is logged in, render the requested protected route
  return children;
};

export default ProtectedRoute;
