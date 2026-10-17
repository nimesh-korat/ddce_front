import React from "react";
import { Navigate } from "react-router-dom";
import { useFeesLock } from "./FeesLockContext";

const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("user") ||
    localStorage.getItem("session");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.Role === 1) {
    return <Navigate to="/admin" />;
  }

  if (!token || user?.Role !== 0) {
    return <Navigate to="/signin" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoading, locked } = useFeesLock();

  if (isLoading) return null; // blank screen while checking — no page flash
  if (locked) return null; // locked — overlay from FeesLockProvider covers it

  return children;
};

export default ProtectedRoute;
