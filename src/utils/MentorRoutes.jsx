import { Navigate } from "react-router-dom";

// A simple utility to check for the token
const MentorRoutes = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("mentor") ||
    localStorage.getItem("session");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.Role !== 2) {
    // If the user is not logged in, redirect them to the sign-in page
    return <Navigate to="/signin" />;
  }
  // If the user is logged in, render the requested protected route
  return children;
};

export default MentorRoutes;
